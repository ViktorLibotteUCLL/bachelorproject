from ultralytics import YOLO


def main():
    model = YOLO("yolo11n.pt")

    results = model.train(
        data="datasets/data.yaml",
        epochs=200,
        patience=10,
        name="cleaned_noflip",
        fliplr=0.0,
        flipud=0.0,
    )
    print(results)
    val_results = model.val()
    return val_results


if __name__ == "__main__":
    results = main()
    print(results)
