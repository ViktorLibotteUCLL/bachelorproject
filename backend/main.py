import datetime
import io
from typing import Union
from fastapi import FastAPI, File, Request, UploadFile
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
from PIL import Image, ExifTags

load_dotenv()

app = FastAPI()


from ultralytics import YOLO

model = YOLO(
    # "C://Users//viktorLibotte//Desktop//bachelorproject//backend//runs//detect//train_1605//best.pt"
    "C://Users//viktorLibotte//Desktop//bachelorproject//backend//runs//detect//train_3005//best.pt"
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


# import torch
# import torchvision.ops as ops


# def apply_nms(boxes, scores, iou_threshold=0.5):
#     return ops.nms(boxes, scores.to(boxes.device), iou_threshold)


# def get_instances(image):
#     results = model(image)
#     result = results[0]
#     class_names = model.names
#     output = []

#     boxes = []
#     scores = []
#     labels = []

#     for b in result.boxes:
#         class_id = int(b.cls[0])
#         label = class_names[class_id]
#         xyxy = b.xyxy[0]
#         score = b.conf[0]

#         boxes.append(xyxy)
#         scores.append(score)
#         labels.append(label)

#     boxes = torch.stack(boxes)
#     scores = torch.tensor(scores)

#     keep = apply_nms(boxes, scores, iou_threshold=0.5)

#     for i in keep:
#         xyxy = boxes[i][:2].tolist()
#         x = round(xyxy[0])
#         y = round(xyxy[1])
#         output.append((labels[i], x, y))

#     # Sort in reading order
#     def reading_order_key(item):
#         label, x, y = item
#         return (round(y / 50), x)

#     output.sort(key=reading_order_key)

#     result.show()
#     result.save(filename="result.jpg")
#     return output


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


EXIF_ORIENTATION_TAG = next(k for k, v in ExifTags.TAGS.items() if v == "Orientation")


def correct_image_orientation(image: Image.Image) -> Image.Image:
    exif = image.getexif()
    if not exif:
        return image

    orientation = exif.get(EXIF_ORIENTATION_TAG)
    if orientation == 3:
        image = image.rotate(180, expand=True)
    elif orientation == 6:
        image = image.rotate(270, expand=True)
    elif orientation == 8:
        image = image.rotate(90, expand=True)
    return image


@app.post("/upload")
async def upload_image(image: UploadFile = File(...)):
    image = await image.read()
    pil_image = Image.open(io.BytesIO(image)).convert("RGB")
    pil_image = correct_image_orientation(pil_image)
    response = get_instances(pil_image)
    prediction = "".join([char[0] for char in response])
    return {"response": prediction, "timestamp": datetime.datetime.now().isoformat()}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
