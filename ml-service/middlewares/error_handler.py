from fastapi import Request
from fastapi.responses import JSONResponse

from utils.response import error_response


async def unhandled_exception_handler(_: Request, exc: Exception):
    return JSONResponse(status_code=500, content=error_response(str(exc)))
