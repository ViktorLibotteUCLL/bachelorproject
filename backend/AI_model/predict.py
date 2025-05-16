from ultralytics import YOLO

imagefile = "C://Users//Marthe//Downloads//image6.jpg"
model = YOLO(
    "C://Users//Marthe//Documents//school//bp//bachelorproject//backend//runs//detect//train14//weights//best.pt"
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


print(get_instances(imagefile))
