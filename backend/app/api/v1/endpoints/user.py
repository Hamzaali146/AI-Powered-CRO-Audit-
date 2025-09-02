from fastapi import APIRouter

from app.controllers import UserController
from app.schemas import BaseResponse
from app.services import UserService


class UserRouter:
    def __init__(self, user_service: UserService):
        self.controller = UserController(user_service)
        self.router = APIRouter()
        self.setup_routes()

    def setup_routes(self) -> None:
        self.router.add_api_route(
            "",
            self.controller.get_user,
            methods=["GET"],
            response_model=BaseResponse,
        )

        self.router.add_api_route(
            "",
            self.controller.update_user,
            methods=["PATCH"],
            response_model=BaseResponse,
        )
