from ultralytics import YOLO

model = YOLO("yolov8n.pt")

results = model.train(data="data/data.yaml", epochs=100, device="cuda", imgsz=640)

val_results = model.val()

exported_model = model.export(format="onnx")
