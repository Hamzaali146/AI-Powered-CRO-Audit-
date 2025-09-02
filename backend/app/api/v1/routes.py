from fastapi import APIRouter, Depends

from app.api.v1.endpoints import UserRouter, AuthRouter, CROAuditRouter
from app.core.db import postgres_db
from app.core.security.dependencies import protected_auth
from app.repositories import UserRepository, ProfileRepository, ResetPasswordRepository
from app.services import UserService, AuthService


def create_api_router() -> APIRouter:
    api_router = APIRouter()
    user_repository = UserRepository(postgres_db.client)
    profile_repository = ProfileRepository(postgres_db.client)
    reset_password_repository = ResetPasswordRepository(postgres_db.client)

    auth_service = AuthService(user_repository, profile_repository, reset_password_repository)
    user_service = UserService(user_repository)

    auth_router = AuthRouter(auth_service)
    user_router = UserRouter(user_service)
    cro_audit_router = CROAuditRouter()

    api_router.include_router(auth_router.router, prefix="/auth", tags=["Authentication"])
    api_router.include_router(
        user_router.router,
        prefix="/user",
        tags=["User"],
        dependencies=[Depends(protected_auth)],
    )
    api_router.include_router(cro_audit_router.router, prefix="/cro-audit", tags=["CRO Audit"])

    return api_router
