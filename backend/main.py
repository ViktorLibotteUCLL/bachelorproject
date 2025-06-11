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

    if len(results.boxes.data.tolist()) == 0:
        return []

    boxes = results.boxes.data.tolist()
    if len(boxes) == 0:
        return []

    avg_width = sum((r[2] - r[0]) for r in boxes) / len(boxes)
    avg_height = sum((r[3] - r[1]) for r in boxes) / len(boxes)

    # Step 1: Group boxes into rows based on vertical overlap
    rows = []
    for box in boxes:
        x1, y1, x2, y2, score, class_id = box
        center_y = (y1 + y2) / 2

        # Find which row this box belongs to
        placed = False
        for row in rows:
            # Check if this box vertically overlaps with any box in the row
            for existing_box in row:
                existing_center_y = (existing_box[1] + existing_box[3]) / 2
                if abs(center_y - existing_center_y) < avg_height * 0.6:
                    row.append(box)
                    placed = True
                    break
            if placed:
                break

        if not placed:
            rows.append([box])

    # Step 2: Sort rows by their vertical position (top to bottom)
    rows.sort(key=lambda row: min((box[1] + box[3]) / 2 for box in row))

    # Step 3: Sort boxes within each row by horizontal position (left to right)
    for row in rows:
        row.sort(key=lambda box: box[0])

    # Step 4: Build the final output with proper spacing
    output_spaces = []

    for row_index, row in enumerate(rows):
        if row_index > 0:
            # Add line break between rows
            output_spaces.append(" ")

        for box_index, box in enumerate(row):
            x1, y1, x2, y2, score, class_id = box
            label = class_names[class_id]

            if box_index > 0:
                # Check if we need a space between words in the same row
                prev_box = row[box_index - 1]
                horizontal_gap = (
                    x1 - prev_box[2]
                )  # Gap between end of previous box and start of current box

                if horizontal_gap > avg_width * 0.8:  # Adjust threshold as needed
                    output_spaces.append(" ")

            output_spaces.append([label, x1, y1])

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
    "dot_4": ".4",  # IDK
    "dot_5": ".5",  # IDK
}

letters_to_numbers = [
    "j",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
]


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
            continue
        if number is True and char in letters_to_numbers:
            formatted_output += letters_to_numbers.index(char)
            continue
        if number is True and char.isdigit():
            formatted_output += char
            continue
        if char.isdigit():
            char = letters_to_numbers[int(char)]
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
