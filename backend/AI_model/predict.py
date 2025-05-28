from ultralytics import YOLO
import math

imagefile = "C:/Users/basti/Downloads/image2.jpg"
model = YOLO(
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
    
    
            
    


get_instances(imagefile)
