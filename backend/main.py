import io
from typing import Union
from fastapi import FastAPI, File, Request, HTTPException, UploadFile
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
from PIL import Image

load_dotenv()

app = FastAPI()


from ultralytics import YOLO

model = YOLO(
    "C://Users//viktorLibotte//Desktop//bachelorproject//backend//runs//detect//train_1605//best.pt"
)


def coord_y(i):
    return i[2]


def coord_x(i):
    return i[1]


def get_instances(image):
    results = model(image)
    # print(type(results[0]))
    result = results[0]
    class_names = model.names
    output = []
    for b in result.boxes:
        # print(b)
        class_id = int(b.cls[0])
        label = class_names[class_id]
        # print(label)
        xyxy = b.xyxy[0][:2].tolist()
        data = [label, round(xyxy[0] / 50), round(xyxy[1] / 50)]
        output.append(data)

        output.sort(reverse=False, key=coord_y)
        output.sort(reverse=False, key=coord_x)

        # print(label)
    result.show()
    result.save(filename="result.jpg")
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
    print(prediction)
    return {"response": prediction}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
