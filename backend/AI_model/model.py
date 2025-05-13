from ultralytics import YOLO

model = YOLO("yolo11n.yaml")

results = model.train(data="../data/data.yaml")
results = model.val()
