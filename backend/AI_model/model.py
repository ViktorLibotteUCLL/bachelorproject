from ultralytics import YOLO


def main():
    model = YOLO("yolo11n.pt")

    results = model.train(
        data="datasets/data.yaml", epochs=200, patience=50, name="half_cleaned"
    )
    print(results)
    val_results = model.val()
    print(val_results)


if __name__ == "__main__":
    main()
