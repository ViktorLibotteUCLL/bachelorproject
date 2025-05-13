from ultralytics import YOLO

model = YOLO("yolov8n.pt")

results = model.train(data="data/data.yaml", epochs=3, device="cpu")

val_results = model.val()

exported_model = model.export(format="onnx")
