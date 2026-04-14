import asyncio
from typing import List
from fastapi import Request
from sse_starlette.sse import EventSourceResponse

class SSEManager:
    def __init__(self):
        self.queues: List[asyncio.Queue] = []

    async def subscribe(self, request: Request):
        queue = asyncio.Queue()
        self.queues.append(queue)
        try:
            while True:
                if await request.is_disconnected():
                    break
                data = await queue.get()
                yield {"data": data}
        finally:
            self.queues.remove(queue)

    async def broadcast(self, message: str):
        for queue in self.queues:
            await queue.put(message)

manager = SSEManager()
