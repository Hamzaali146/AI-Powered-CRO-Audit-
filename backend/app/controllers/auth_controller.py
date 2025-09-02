from http import HTTPStatus
from typing import Optional

from fastapi import BackgroundTasks, Depends, Response

from app.core.config import settings
from app.core.monitoring.decorators import monitor_transaction
from app.core.security.dependencies import refresh_auth
from app.models.domain import SignupRequest
from app.schemas import (
    MagicLinkRequest,
    ResetPasswordRequest,
    ResetPasswordResponse,
    ResetPasswordVerifyRequest,
    TokenResponse,
    UserLogin,
    VerificationTokenResponse,
)
from app.services import AuthService


class AuthController:
    def __init__(self, auth_service: AuthService):
        self.auth_service = auth_service

    def set_auth_cookies(
        self,
        response: Response,
        access_token: Optional[str] = None,
        refresh_token: Optional[str] = None,
    ) -> None:
        if access_token:
            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=settings.security.COOKIE_SECURE,
                samesite="lax",
                max_age=settings.security.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
                path="/",
            )
        if refresh_token:
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=settings.security.COOKIE_SECURE,
                samesite="lax",
                max_age=settings.security.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
                path="/",
            )

    def clear_auth_cookies(self, response: Response) -> None:
        """Clear authentication cookies"""
        response.delete_cookie(key="access_token", path="/")
        response.delete_cookie(key="refresh_token", path="/api/v1/auth/refresh")

    # async def get_current_user(self, token: str):
    #     """Dependency to get current authenticated user"""
    #     try:
    #         payload = decode_access_token(token)

    #         user = await self.auth_service.get_user_by_id(payload.get("sub"))

    #         return user
    #     except Exception as e:
    #         print(e)

    @monitor_transaction(op="api.auth.jwt.register", tags={"endpoint": "auth->jwt->register"})
    async def register(self, user_data: SignupRequest, response: Response) -> TokenResponse:
        _, access_token, refresh_token = await self.auth_service.signup(user_data)
        self.set_auth_cookies(response, access_token, refresh_token)
        return TokenResponse(
            message="User registered successfully",
            status_code=HTTPStatus.CREATED,
            data={},
        )

    @monitor_transaction(op="api.auth.jwt.login", tags={"endpoint": "auth->jwt->login"})
    async def login(self, credentials: UserLogin, response: Response) -> TokenResponse:
        access_token, refresh_token = await self.auth_service.login(
            credentials.email, credentials.password
        )
        self.set_auth_cookies(response, access_token, refresh_token)
        return TokenResponse(
            message="User login successful",
            status_code=HTTPStatus.OK,
            data={},
        )

    # TODO: Remove the Any type of token_info
    @monitor_transaction(op="api.auth.refresh", tags={"endpoint": "auth->refresh"})
    async def refresh_token(
        self, response: Response, token_payload: dict = Depends(refresh_auth)
    ) -> TokenResponse:
        access_token = await self.auth_service.refresh_token(token_payload)
        self.set_auth_cookies(response=response, access_token=access_token)
        return TokenResponse(
            message="Token refreshed successfully",
            status_code=HTTPStatus.OK,
            data={},
        )

    @monitor_transaction(
        op="api.auth.magic_link.login", tags={"endpoint": "auth->magic_link->login"}
    )
    async def magic_link(
        self,
        magic_link_request: MagicLinkRequest,
        response: Response,
        background_tasks: BackgroundTasks,
    ) -> VerificationTokenResponse:
        background_tasks.add_task(
            self.auth_service.magic_link_login, email=magic_link_request.email
        )
        self.set_auth_cookies(response, "", "")
        return VerificationTokenResponse(
            message="""Link Sent Successfully. If you don't receive the email,"""
            """ please check your spam folder or retry in 30 seconds.""",
        )

    @monitor_transaction(
        op="api.auth.magic_link.verify", tags={"endpoint": "auth->magic_link->verify"}
    )
    async def verify_magic_link(self, verification_token: str, response: Response) -> TokenResponse:
        access_token, refresh_token = await self.auth_service.verify_magic_link(verification_token)
        self.set_auth_cookies(response, access_token, refresh_token)
        return TokenResponse(
            message="Magic link verified successfully",
            status_code=HTTPStatus.OK,
            data={},
        )

    @monitor_transaction(
        op="api.auth.reset_password.otp",
        tags={"endpoint": "auth->reset_password->otp"},
    )
    async def get_reset_password_otp(
        self, email: str, response: Response, background_tasks: BackgroundTasks
    ) -> ResetPasswordResponse:
        background_tasks.add_task(self.auth_service.get_reset_password_otp, email=email)
        self.set_auth_cookies(response, "", "")
        return ResetPasswordResponse(
            message="""Reset password code sent successfully. If you don't receive the email,"""
            """please check your spam folder or retry in 30 seconds.""",
            status_code=HTTPStatus.OK,
            data={},
        )

    @monitor_transaction(
        op="api.auth.reset_password.validate_otp",
        tags={"endpoint": "auth->reset_password->validate_otp"},
    )
    async def validate_reset_password_otp(
        self, reset_password_data: ResetPasswordVerifyRequest, response: Response
    ) -> ResetPasswordResponse:
        await self.auth_service.validate_reset_password_otp(reset_password_data)
        return ResetPasswordResponse(
            message="Reset password OTP validated successfully",
            status_code=HTTPStatus.OK,
            data={},
        )

    @monitor_transaction(
        op="api.auth.reset_password",
        tags={"endpoint": "auth->reset_password"},
    )
    async def reset_password(
        self, reset_password_data: ResetPasswordRequest, response: Response
    ) -> ResetPasswordResponse:
        await self.auth_service.reset_password(reset_password_data)
        return ResetPasswordResponse(
            message="Password reset successfully", status_code=HTTPStatus.OK, data=None
        )
