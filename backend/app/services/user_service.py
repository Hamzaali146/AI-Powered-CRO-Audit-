from datetime import datetime
from app.core.exceptions import NotFoundException
from app.core.monitoring.decorators import monitor_transaction
from app.models.domain import UserCreate, UserUpdate
from app.repositories import UserRepository


class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    @monitor_transaction(op="user.get_user", tags={"service": "user->get_user"})
    async def get_user(self, user_id: int) -> dict:
        user = await self.user_repository.get_by_id(user_id=user_id)

        if not user:
            raise NotFoundException(message="User not found")

        return user.dict()

    @monitor_transaction(op="user.create_user", tags={"service": "user->create_user"})
    async def create_user(self, user_create: UserCreate) -> dict:
        user = await self.user_repository.create(user_create=user_create)
        return user.dict()

    @monitor_transaction(op="user.update_user", tags={"service": "user->update_user"})
    async def update_user(self, user_id: int, user_data: UserUpdate) -> dict:
        user = await self.user_repository.get_by_id(user_id=user_id)

        if not user:
            raise NotFoundException(message="User not found")

        updated_user = await self.user_repository.update(user_id=user_id, user_data=user_data)
        return updated_user.dict()

    async def get_by_token_creation_at(
        self, user_id: int, token_creation_at: datetime
    ) -> dict | None:
        user = await self.user_repository.get_by_token_creation_at(user_id = user_id, token_creation_at = token_creation_at)
        if not user:
            return None
        return user.dict()