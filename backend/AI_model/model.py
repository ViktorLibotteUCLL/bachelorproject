from ultralytics import YOLO
import matplotlib as plt
import cv2

model = YOLO("yolov8n.pt")

results = model.train(data="AI_model/dataset.yaml", epochs=3, device="gpu")

val_results = model.val()

exported_model = model.export(format="onnx")

best_model = YOLO("runs/detect/train/weights/best.pt")

results = best_model(
    "data\test\images\490775039_452217027953182_3808939374218132174_n_jpg.rf.a31c2a59681d4a07818d6a5844733efd.jpg"
)

# Plot and log the results
fig, ax = plt.subplots(figsize=(12, 8))
ax.imshow(cv2.cvtColor(results[0].plot(), cv2.COLOR_BGR2RGB))
ax.axis("off")
plt.show()
