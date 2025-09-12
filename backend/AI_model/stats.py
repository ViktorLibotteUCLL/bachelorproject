from ultralytics import YOLO


def main():
    model = YOLO(
        "C:/Users/Marthe/Documents/school/bp/bachelorproject/backend/runs/detect/train14/weights/best.pt"
    )

    metrics = model.val(
        data="C:/Users/Marthe/Documents/school/bp/bachelorproject/backend/datasets/data.yaml",
        split="test",
    )

    print("mean recall:", metrics.box.mr)
    print("mean precision:", metrics.box.mp)
    print("MaP: ", metrics.box.map)


if __name__ == "__main__":
    main()
