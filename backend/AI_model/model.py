from ultralytics import YOLO


def main():
    model = YOLO("yolov8n.pt")
    results = model.train(data="datasets/data.yaml", epochs=30, imgsz=640)
    val_results = model.val()
    exported_model = model.export(format="onnx")


if __name__ == "__main__":
    main()
