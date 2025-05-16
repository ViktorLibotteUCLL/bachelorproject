from typing import Union

from fastapi import FastAPI

app = FastAPI()


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
