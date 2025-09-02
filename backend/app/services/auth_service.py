from datetime import datetime
from typing import Tuple

import sentry_sdk

from app.core.exceptions import ConflictException, ErrorDetail, UnauthorizedException
from app.core.monitoring.decorators import monitor_transaction
from app.core.security.security import (
    create_access_token,
    create_otp,
    create_refresh_token,
    create_verification_token,
    get_password_hash,
    verify_password,
    verify_token,
)
from app.models.domain import (
    SignupRequest,
    UserCreate,
    ProfileCreate,
    User
)
from app.repositories import ProfileRepository, ResetPasswordRepository, UserRepository
from app.schemas.reset_password import ResetPasswordRequest, ResetPasswordVerifyRequest
from app.utilities.email_utility import EmailService


class AuthService:
    def __init__(
        self,
        user_repository: UserRepository,
        profile_repository: ProfileRepository,
        reset_password_repository: ResetPasswordRepository,
    ):
        self.user_repository = user_repository
        self.profile_repository = profile_repository
        self.reset_password_repository = reset_password_repository

    @monitor_transaction(op="auth.signup", tags={"service": "auth->signup"})
    async def signup(self, signup_data: SignupRequest):
        try:
            existing_user = await self.user_repository.get_by_email(email=signup_data.email)
            if existing_user:
                raise ConflictException(
                    message="Email already registered",
                    details=[ErrorDetail(field="email", message="Email already registered")],
                )

            hashed_password = get_password_hash(signup_data.password)

            user = UserCreate(
                full_name=signup_data.full_name,
                email=signup_data.email,
                password=hashed_password,
            )

            created_user = await self.user_repository.create(user_create=user)


            refresh_token, token_created_at = create_refresh_token(data={"sub": str(created_user.id)})

            access_token, _ = create_access_token(
                data={"sub": str(created_user.id)}, created_at=token_created_at
            )

            await self.user_repository.update_token_creation_at(
                user_id=created_user.id, token_creation_at=token_created_at
            )

            # Combine user and profile data for response
            response_data = {**created_user.dict()}

            sentry_sdk.add_breadcrumb(
                category="auth",
                message="User created successfully",
                level="info",
                data={"user_id": str(created_user.id)},
            )

            return User(**response_data), access_token, refresh_token

        except Exception as e:
            import traceback

            traceback.print_exc()
            raise e

    @monitor_transaction(op="auth.refresh_token", tags={"service": "auth->refresh_token"})
    async def refresh_token(self, refresh_data: dict) -> str:
        access_token, token_create_at = create_access_token(
            {"sub": refresh_data["sub"]},
            created_at=refresh_data["iat"],
        )
        await self.user_repository.update_token_creation_at(user_id=int(refresh_data["sub"]), token_creation_at=token_create_at)
        return access_token

    @monitor_transaction(op="auth.login", tags={"service": "auth->login"})
    async def login(self, email: str, password: str) -> Tuple[str, str]:
        """Login user and return tokens"""

        user = await self.user_repository.get_by_email(email=email)
        if not user:
            raise UnauthorizedException(
                message="Invalid credentials",
                details=[ErrorDetail(field="email", message="Invalid email or password")],
            )

        if not verify_password(password, user.password):
            raise UnauthorizedException(
                message="Invalid credentials",
                details=[ErrorDetail(field="password", message="Invalid email or password")],
            )

        await self.user_repository.update_last_login(user_id=user.id)

        refresh_token, token_created_at = create_refresh_token({"sub": str(user.id)})

        access_token, token_created_at = create_access_token(
            {"sub": str(user.id)}, created_at=token_created_at
        )
        await self.user_repository.update_token_creation_at(user_id=user.id, token_creation_at=token_created_at)

        sentry_sdk.add_breadcrumb(
            category="auth",
            message="User logged in successfully",
            level="info",
            data={"user_id": str(user.id)},
        )

        return access_token, refresh_token

    @monitor_transaction(op="auth.logout", tags={"service": "auth->logout"})
    async def reset_password(self, reset_password_data: ResetPasswordRequest) -> None:
        """Reset user password"""

        user = await self.user_repository.get_by_email(reset_password_data.email)
        if not user:
            raise UnauthorizedException("Invalid email")

        hashed_password = get_password_hash(reset_password_data.password)

        await self.user_repository.update(user_id=user.id, user_data={"password": hashed_password})

        sentry_sdk.add_breadcrumb(
            category="auth",
            message="Password reset successfully",
            level="info",
            data={"user_id": str(user.id)},
        )

    @monitor_transaction(
        op="auth.get_reset_password_otp",
        tags={"service": "auth->get_reset_password_otp"},
    )
    async def get_reset_password_otp(
        self, email: str, email_service: EmailService = EmailService()
    ) -> str:
        """Send OTP for password reset"""

        user = await self.user_repository.get_by_email(email)
        if not user:
            raise UnauthorizedException("Invalid email")

        otp_data = create_otp()

        reset_password = ResetPasswordInDB(
            email=email,
            OTP=otp_data["otp"],
            created_at=datetime.utcnow(),
            expires=otp_data["expires_at"],
        )

        await self.reset_password_repository.create(reset_password)

        await email_service.send_reset_otp_email(otp=otp_data["otp"], email=email)

        sentry_sdk.add_breadcrumb(
            category="auth",
            message="Reset password OTP sent successfully",
            level="info",
            data={"user_id": str(user.id)},
        )

        return reset_password.OTP

    @monitor_transaction(
        op="auth.validate_reset_password_otp",
        tags={"service": "auth->validate_reset_password_otp"},
    )
    async def validate_reset_password_otp(
        self, reset_password_data: ResetPasswordVerifyRequest
    ) -> bool:
        reset_password = await self.reset_password_repository.get_by_email(
            reset_password_data.email
        )
        if not reset_password:
            raise UnauthorizedException("Invalid email")

        if reset_password["OTP"] != reset_password_data.OTP:
            raise UnauthorizedException("Invalid OTP")
        if reset_password["expire_at"] > datetime.utcnow():

            raise UnauthorizedException("OTP expired")

        return True
