from ultralytics import YOLO
import math

imagefile = "C:/Users/Marthe/Downloads/image6.jpg"
model = YOLO(
    "C:/Users/Marthe/Documents/school/bp/bachelorproject/backend/runs/detect/train14/weights/best.pt"
)


def get_instances(image):
    results = model(image)[0]
    results.show()
    results.save(filename="result.jpg")
    class_names = model.names
    output = []
    # midpoints = []
    sorted_list = sorted(
        results.boxes.data.tolist(),
        key=lambda result: (math.floor(result[1] / 500), result[0]),
    )
    for result in sorted_list:
        x1, y1, x2, y2, score, class_id = result
        label = class_names[class_id]
        output.append([label, x1, y1])
        # midpoints.append([label, x1 + x2 / 2, y1 + y2 / 2])
    if len(sorted_list) != 0:
        output_spaces = [output[0]]
        avg_width = sum((r[2] - r[0]) for r in sorted_list) / len(sorted_list)
        print("avg width:", avg_width)
        for index in range(1, len(sorted_list)):
            if (output[index][1] - output[index - 1][1]) > (2 * avg_width):
                output_spaces.append(" ")
            output_spaces.append(output[index])

    print(output_spaces)
    print([str(t[0]) for t in output_spaces])
    return output_spaces


get_instances(imagefile)
