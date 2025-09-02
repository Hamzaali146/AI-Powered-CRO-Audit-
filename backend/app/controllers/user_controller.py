from http import HTTPStatus

from fastapi import Request

from app.core.monitoring.decorators import monitor_transaction
from app.models.domain import UserUpdate
from app.schemas import BaseResponse
from app.services import UserService


class UserController:
    def __init__(self, user_service: UserService):
        self.user_service = user_service

    @monitor_transaction(
        op="api.user.get_users",
        tags={"endpoint": "user->get_users"},
    )
    async def get_user(self, request: Request) -> BaseResponse:
        return BaseResponse(
            message="User fetched successfully",
            status_code=HTTPStatus.OK,
            data=request.state.user,
        )

    @monitor_transaction(
        op="api.user.update_user",
        tags={"endpoint": "user->update_user"},
    )
    async def update_user(self, request: Request, user_data: UserUpdate) -> BaseResponse:
        updated_user = await self.user_service.update_user(
            user_id=request.state.user["id"], user_data=user_data
        )
        return BaseResponse(
            message="User updated successfully",
            status_code=HTTPStatus.OK,
            data=updated_user,
        )
