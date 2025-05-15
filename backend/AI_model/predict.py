from ultralytics import YOLO

imagefile = "C://Users//Marthe//Downloads//image4.jpg"
model = YOLO(
    "C://Users//Marthe//Documents//school//bp//bachelorproject//backend//runs//detect//train14//weights//best.pt"
)


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
        data = [label, round(xyxy[0] / 100), round(xyxy[1] / 100)]
        output.append(data)
        # print(label)

    return output


print(get_instances(imagefile))
