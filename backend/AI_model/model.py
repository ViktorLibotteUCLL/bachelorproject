from ultralytics import YOLO


def main():
    model = YOLO("yolo11n.pt")

    results = model.train(data="datasets/data.yaml", epochs=15, imgsz=320)

    val_results = model.val()

    exported_model = model.export(format="onnx")


if __name__ == "__main__":
    main()
