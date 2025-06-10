import datetime
import io
from typing import Union
from fastapi import FastAPI, File, Request, UploadFile
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
from PIL import Image, ExifTags
import math

load_dotenv()

app = FastAPI()


from ultralytics import YOLO

model = YOLO(
    # "C://Users//viktorLibotte//Desktop//bachelorproject//backend//runs//detect//train_3005//best.pt"
    "./runs/detect/cleaned_noflip4/weights/best.pt"
    # "C:/Users/basti/Documents/School/3de_jaar/Bachelorproef/bachelorproject/backend/runs/detect/train2705/best.pt"
)


def get_instances(image):
    results = model(image)[0]
    results.show()
    results.save(filename="result.jpg")
    class_names = model.names
    output = []
    if len(results.boxes.data.tolist()) != 0:
        avg_width = sum((r[2] - r[0]) for r in results.boxes.data.tolist()) / len(
            results.boxes.data.tolist()
        )
        avg_height = sum((r[3] - r[1]) for r in results.boxes.data.tolist()) / len(
            results.boxes.data.tolist()
        )
    # midpoints = []
    sorted_list = sorted(
        results.boxes.data.tolist(),
        key=lambda result: (math.floor(result[1] / (avg_height / 2)), result[0]),
    )
    for result in sorted_list:
        x1, y1, x2, y2, score, class_id = result
        label = class_names[class_id]
        output.append([label, x1, y1])
    print("sorted list:", output)
    # midpoints.append([label, x1 + x2 / 2, y1 + y2 / 2])
    if len(sorted_list) != 0:
        output_spaces = [output[0]]
        # avg_width = sum((r[2] - r[0]) for r in sorted_list) / len(sorted_list)
        # print("avg width:", avg_width)
        for index in range(1, len(sorted_list)):
            if abs(output[index][1] - output[index - 1][1]) > (2 * avg_width):
                output_spaces.append(" ")
            output_spaces.append(output[index])

    # print(output_spaces)
    # print([str(t[0]) for t in output_spaces])
    print("output:", output_spaces)
    return output_spaces


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


special_characters = {
    "space": " ",
    "colon": ":",
    "comma": ",",
    "semicolon": ";",
    "exclamation": "!",
    "question": "?",
    "dash": "-",
    "period": ".",
    "apostrophe": "'",
    "parenthesis": "()",  # i dont know how they work so for now ill just put them as ()
    "dot_4": ".4",  # IDK
    "dot_5": ".5",  # IDK
}


def format_output_string(output):
    print(output)
    shift = False
    caps_lock = False
    number = False
    formatted_output = ""
    for char in output:
        char = char[0]
        print(char)
        if char == "capital":
            if shift is True:
                caps_lock = True
                shift = False
                continue
            shift = True
            continue
        if char == " ":
            formatted_output += " "
            shift = False
            caps_lock = False
            number = False
            continue
        if char == "number":
            number = True
            continue
        if char in special_characters.keys():
            formatted_output += special_characters[char]
            number = False
            continue
        if number is True:
            char_to_number = char
            formatted_output += char_to_number
            continue
        if shift is True or caps_lock is True:
            formatted_output += char.upper()
            shift = False
            continue
        formatted_output += char.lower()
    print(formatted_output)
    return formatted_output


@app.post("/upload")
async def upload_image(image: UploadFile = File(...)):
    image = await image.read()
    pil_image = Image.open(io.BytesIO(image)).convert("RGB")
    pil_image = correct_image_orientation(pil_image)
    response = get_instances(pil_image)
    response = format_output_string(response)
    return {"response": response, "timestamp": datetime.datetime.now().isoformat()}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
