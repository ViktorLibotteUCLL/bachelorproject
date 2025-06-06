import { Pressable, StyleSheet, View, Button, Text } from "react-native";
import { useEffect, useRef, useState } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Link, router } from "expo-router";
import Header from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);

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

  const uploadImage = async (photo: any) => {
    const formData = new FormData();

    formData.append("image", {
      uri: photo.uri,
      name: "photo.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const response = await fetch("https://api.braillo.tech/upload", {
        method: "POST",
        body: formData,
        headers: {
          "api-token": process.env.EXPO_PUBLIC_API_TOKEN as string,
        },
      });
      const data = await response.json();
      console.log("Upload success", data);
      if (data["response"]) {
        console.log("hello");
        const jsonHistory = await AsyncStorage.getItem("history");
        console.log(jsonHistory);
        let history: any[] = jsonHistory != null ? JSON.parse(jsonHistory) : [];
        // history[data["timestamp"]] = data["response"];
        history.push(data);
        console.log(history);
        await AsyncStorage.setItem("history", JSON.stringify(history));
      }

      return data;
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const takePicture = async () => {
    setIsLoading(true);
    const photo = await ref.current?.takePictureAsync({ shutterSound: false });
    console.log("Photo taken", photo);
    const response = await uploadImage(photo);
    if (!response || response["response"] === "") {
      setIsLoading(false);
      return alert("No braille detected. Please try again.");
    }
    setIsLoading(false);
    router.push({
      pathname: "/translationScreen",
      params: response,
    });
  };

  return (
    isFocused && (
      <View style={styles.container}>
        <Header />
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={ref}
          flash={"auto"}
          animateShutter={false}
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
        {isLoading && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <LoadingScreen />
          </View>
        )}
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
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
    bottom: 0,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 30,
    backgroundColor: "black",
    height: 140,
    paddingBottom: 30,
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
  // loadingOverlay: {
  //   ...StyleSheet.absoluteFillObject,
  //   backgroundColor: "rgba(0, 0, 0, 0.5)",
  // alignItems: "center",
  // justifyContent: "center",
  // zIndex: 10,
  // },
});
