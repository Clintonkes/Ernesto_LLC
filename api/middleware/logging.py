import time
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("api.activity")

class ActivityLoggerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Process request
        response = await call_next(request)
        
        process_time = (time.time() - start_time) * 1000
        formatted_process_time = "{0:.2f}ms".format(process_time)
        
        logger.info(
            f"ACTIVITY: {request.method} {request.url.path} - "
            f"Status: {response.status_code} - "
            f"Time: {formatted_process_time}"
        )
        
        return response
