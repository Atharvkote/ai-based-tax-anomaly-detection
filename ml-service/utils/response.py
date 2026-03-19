from typing import Any, Optional


def success_response(data: Any, message: str = "OK") -> dict:
    return {"success": True, "data": data, "message": message}


def error_response(message: str, data: Optional[Any] = None) -> dict:
    return {"success": False, "data": data or {}, "message": message}
