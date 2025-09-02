from fastapi import APIRouter, status

from app.controllers import AuthController
from app.schemas import ResetPasswordResponse, TokenResponse, VerificationTokenResponse
from app.services import AuthService


class AuthRouter:
    def __init__(self, auth_service: AuthService):
        self.controller = AuthController(auth_service)
        self.router = APIRouter()
        self.setup_routes()

    def setup_routes(self) -> None:
        self.router.add_api_route(
            "/jwt/register",
            self.controller.register,
            methods=["POST"],
            response_model=TokenResponse,
            status_code=status.HTTP_201_CREATED,
        )
        self.router.add_api_route(
            "/jwt/login",
            self.controller.login,
            methods=["POST"],
            response_model=TokenResponse,
        )
        self.router.add_api_route(
            "/refresh",
            self.controller.refresh_token,
            methods=["POST"],
            response_model=TokenResponse,
        )

        self.router.add_api_route(
            "/reset-password/otp",
            self.controller.get_reset_password_otp,
            methods=["POST"],
            response_model=ResetPasswordResponse,
        )

        self.router.add_api_route(
            "/reset-password/validate-otp",
            self.controller.validate_reset_password_otp,
            methods=["POST"],
            response_model=ResetPasswordResponse,
        )

        self.router.add_api_route(
            "/reset-password",
            self.controller.reset_password,
            methods=["PATCH"],
            response_model=ResetPasswordResponse,
        )
