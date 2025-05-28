from ultralytics import YOLO
import math

imagefile = "C:/Users/basti/Downloads/image2.jpg"
model = YOLO(
    "C:/Users/basti/Documents/School/3de_jaar/Bachelorproef/bachelorproject/backend/runs/detect/train2705/best.pt"
)


# def get_instances(image):
#     results = model(image)
#     # print(type(results[0]))
#     result = results[0]
#     class_names = model.names
#     output = []
#     for b in result.boxes:
#         # print(b)
#         class_id = int(b.cls[0])
#         label = class_names[class_id]
#         # print(label)
#         xyxy = b.xyxy[0][:2].tolist()
#         data = [label, round(xyxy[0] / 50), round(xyxy[1] / 50)]
#         output.append(data)

#         output.sort(reverse=False, key=coord_y)
#         output.sort(reverse=False, key=coord_x)

#         # print(label)
#     result.show()
#     result.save(filename="result.jpg")
#     return output


def get_instances(image):
    results = model(image)[0]
    results.show()
    class_names = model.names
    output = []
    a = results.boxes.data.tolist()
    i = sorted(a, key=lambda result: (math.floor(result[1]/500), result[0]))
    
    for result in i:
        x1, y1, x2, y2, score, class_id = result
        label = class_names[class_id]
        output.append(label)
        print(x1, math.floor(y1/500), label)
    
    
            
    


get_instances(imagefile)
