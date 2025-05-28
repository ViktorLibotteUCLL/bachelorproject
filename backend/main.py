import datetime
import io
from typing import Union
from fastapi import FastAPI, File, Request, UploadFile
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
from PIL import Image
import math

load_dotenv()

app = FastAPI()


from ultralytics import YOLO

model = YOLO(
    # "C://Users//viktorLibotte//Desktop//bachelorproject//backend//runs//detect//train_1605//best.pt"
    "C:/Users/basti/Documents/School/3de_jaar/Bachelorproef/bachelorproject/backend/runs/detect/train2705/best.pt"
)


def get_instances(image):
    results = model(image)[0]
    results.show()
    results.save(filename="result.jpg")
    class_names = model.names
    output = []
    i = sorted(results.boxes.data.tolist(), key=lambda result: (math.floor(result[1]/500), result[0]))
    for result in i:
        x1, y1, x2, y2, score, class_id = result
        label = class_names[class_id]
        output.append([label, x1, y1])
    #print(output)
    return output


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
async def upload_image(image: UploadFile = File(...)):
    image = await image.read()
    pil_image = Image.open(io.BytesIO(image)).convert("RGB")
    response = get_instances(pil_image)
    prediction = "".join([char[0] for char in response])
    return {"response": prediction, "timestamp": datetime.datetime.now().isoformat()}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
