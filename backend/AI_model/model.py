from ultralytics import YOLO

model = YOLO("yolov8n.pt")

results = model.train(data="datasets/data.yaml", epochs=30, device="cpu", imgsz=640)

val_results = model.val()

exported_model = model.export(format="onnx")
