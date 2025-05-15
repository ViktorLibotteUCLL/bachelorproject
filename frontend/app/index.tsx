import { Pressable, StyleSheet, View, Button, Text } from "react-native";
import { useEffect, useRef, useState } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // simulate loading
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const uploadImage = async (photo: any) => {
    const formData = new FormData();

    formData.append("image", {
      uri: photo.uri,
      name: "photo.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const response = await fetch("https://your-backend.com/upload", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();
      console.log("Upload success", data);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    uploadImage(photo);
  };

  return (
    (isLoading && <LoadingScreen />) ||
    (isFocused && (
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={ref}
          flash={"auto"}
          responsiveOrientationWhenOrientationLocked
        >
          <View style={styles.shutterContainer}>
            <Pressable onPress={takePicture}>
              {({ pressed }) => (
                <View
                  style={[
                    styles.shutterBtn,
                    {
                      opacity: pressed ? 0.5 : 1,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.shutterBtnInner,
                      {
                        backgroundColor: "white",
                      },
                    ]}
                  />
                </View>
              )}
            </Pressable>
          </View>
        </CameraView>
      </View>
    ))
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
});
