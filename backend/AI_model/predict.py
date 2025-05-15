from ultralytics import YOLO

imagefile = "C://Users//Marthe//Downloads//image4.jpg"
model = YOLO(
    "C://Users//Marthe//Documents//school//bp//bachelorproject//backend//runs//detect//train14//weights//best.pt"
)


def get_instances(image):
    results = model(image)
    result = results[0]
    class_names = model.names
    output = {}
    for b in result.boxes:
        class_id = int(b.cls[0])
        label = class_names[class_id]
        xyxy = b.xyxy[0].tolist()
        output[label] = xyxy
        print(label)
    return output


print(get_instances(imagefile))
