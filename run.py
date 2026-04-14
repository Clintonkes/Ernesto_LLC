import socket
import uvicorn
import os
import sys
import logging
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))

    if is_port_in_use(port):
        logger.error(
            f"Port {port} is already in use. "
            f"Kill the process using it (run: lsof -ti:{port} | xargs kill) then try again."
        )
        sys.exit(1)

    logger.info(f"Starting RA Ernesto API on port {port}")
    uvicorn.run("api.main:app", host="0.0.0.0", port=port, reload=True)
