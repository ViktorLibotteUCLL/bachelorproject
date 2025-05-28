import { Pressable, StyleSheet, View, Button, Text } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Link, router } from "expo-router";
import Header from "@/components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";

export default function App() {
  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();
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

  return (
    isFocused && (
      <View style={styles.container}>
        <Header />
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
        ></Camera>
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
