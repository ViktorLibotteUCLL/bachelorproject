from ultralytics import YOLO

# Load a model
model = YOLO("C:\\Users\\basti\\Documents\\School\\3de_jaar\\Bachelorproef\\bachelorproject\\backend\\runs\\detect\\best.pt")  # pretrained YOLOv8n model

# Run batched inference on a list of images
results = model("C:\\Users\\basti\\Downloads\\image.jpg")  # return a list of Results objects

# Process results list
for result in results:
    boxes = result.boxes  # Boxes object for bounding box outputs

    class_ids = boxes.cls.cpu().tolist()
    xyxys = boxes.xyxy.cpu().tolist()
    names = result.names
    labeled_boxes = [
        (names[int(cls_id)], xyxy[0])  # (label, x1)
        for cls_id, xyxy in zip(class_ids, xyxys)
    ]
    labeled_boxes.sort(key=lambda x: x[1])

    result.show()  # display to screen
    result.save(filename="result.jpg")  # save to disk
    print(labeled_boxes)