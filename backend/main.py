from typing import Union
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()


@app.middleware("http")
async def verify_cf_access_token(request: Request, call_next):
    token = request.headers.get("api-token")

    if not token:
        return JSONResponse(status_code=401, content={"detail": "Unauthorized"})
    if token != os.getenv("TOKEN"):
        return JSONResponse(status_code=403, content={"detail": "Forbidden"})
    return await call_next(request)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/upload")
def upload_image():
    print("uploading image")
    return {"filename": "uploaded_image.jpg"}


@app.post("/upload")
def upload_image():
    print("uploading image")
    return {"filename": "uploaded_image.jpg"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
