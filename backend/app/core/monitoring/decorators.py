import inspect
from functools import wraps
from app.core.db import postgres_db 
from typing import Any, Awaitable, Callable, Protocol, TypeVar, TypeVarTuple, overload

import sentry_sdk

ReturnType = TypeVar("ReturnType", covariant=True)
Ts = TypeVarTuple("Ts")


class AsyncCallable(Protocol[ReturnType]):
    def __call__(self, *args: Any, **kwargs: Any) -> Awaitable[ReturnType]: ...


class SyncCallable(Protocol[ReturnType]):
    def __call__(self, *args: Any, **kwargs: Any) -> ReturnType: ...


@overload
def monitor_transaction(  # type: ignore[misc]
    name: str | None = None,
    op: str | None = None,
    tags: dict[str, Any] | None = None,
) -> Callable[[AsyncCallable[ReturnType]], AsyncCallable[ReturnType]]: ...


@overload
def monitor_transaction(  # type: ignore[misc]
    name: str | None = None,
    op: str | None = None,
    tags: dict[str, Any] | None = None,
) -> Callable[[SyncCallable[ReturnType]], SyncCallable[ReturnType]]: ...


def monitor_transaction(
    name: str | None = None,
    op: str | None = None,
    tags: dict[str, Any] | None = None,
) -> Callable[..., Any]:
    """
    A decorator that monitors function execution with Sentry transactions.

    Args:
        name: Custom name for the transaction. Defaults to function name.
        op: Operation type for the transaction. Defaults to "function".
        tags: Additional tags for the transaction.
    """

    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        func_params = inspect.signature(func).parameters
        needs_session = "session" in func_params
        @wraps(func)
        async def async_wrapper(*args: Any, **kwargs: Any) -> Any:
            transaction_name = name or f"{func.__module__}.{func.__name__}"
            with sentry_sdk.start_transaction(
                name=transaction_name, op=op or "function"
            ) as transaction:
                if tags:
                    for key, value in tags.items():
                        transaction.set_tag(key, value)
                if needs_session and "session" not in kwargs:
                    async with postgres_db.get_session() as session:
                        try:
                            result = await func(
                                *args, session=session, **kwargs
                            )
                            await session.commit()
                            return result
                        except Exception as e:
                            await session.rollback()
                            sentry_sdk.capture_exception(e)
                            raise
                else:
                    return await func(*args, **kwargs)

        @wraps(func)
        def sync_wrapper(*args: Any, **kwargs: Any) -> Any:
            transaction_name = name or f"{func.__module__}.{func.__name__}"
            with sentry_sdk.start_transaction(
                name=transaction_name, op=op or "function"
            ) as transaction:
                if tags:
                    for key, value in tags.items():
                        transaction.set_tag(key, value)
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    print(e)
                    sentry_sdk.capture_exception(e)
                    raise

        return async_wrapper if inspect.iscoroutinefunction(func) else sync_wrapper

    return decorator
