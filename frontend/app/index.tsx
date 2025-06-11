import {
  Pressable,
  StyleSheet,
  View,
  Button,
  Text,
  GestureResponderEvent,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import { useCallback, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { LoadingScreen } from "@/components/LoadingScreen";
import { router } from "expo-router";
import Header from "@/components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Camera,
  CameraProps,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from "react-native-vision-camera";
import Reanimated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useSharedValue,
} from "react-native-reanimated";
import {
  Gesture,
  GestureHandlerRootView,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { useIsForeground } from "@/hooks/useIsForeground";
import uploadImage from "@/utils/uploadImage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function App() {
  const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
  Reanimated.addWhitelistedNativeProps({
    zoom: true,
  });

  const device = useCameraDevice("back", {
    physicalDevices: [
      "ultra-wide-angle-camera",
      "wide-angle-camera",
      "telephoto-camera",
    ],
  });
  const { hasPermission, requestPermission } = useCameraPermission();
  const camera = useRef<Camera>(null);
  const [isLoading, setIsLoading] = useState(false);
  const zoom = useSharedValue(1);
  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocused && isForeground;
  const [flash, setFlash] = useState<"off" | "on" | "auto">("off");
  const insets = useSafeAreaInsets();

  const SCALE_FULL_ZOOM = 3;
  const MAX_ZOOM_FACTOR = 10;

  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

  const ref = useRef<Reanimated.View>(null);

  const cameraAnimatedProps = useAnimatedProps<CameraProps>(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
    return {
      zoom: z,
    };
  }, [maxZoom, minZoom, zoom]);

  const SCREEN_WIDTH = Dimensions.get("window").width;
  const SCREEN_HEIGHT = Platform.select<number>({
    android: Dimensions.get("screen").height,
    ios: Dimensions.get("window").height,
  }) as number;

  const [cameraHeight, setCameraHeight] = useState<number | null>(null);

  const screenAspectRatio = cameraHeight ? cameraHeight / SCREEN_WIDTH : 0;
  const format = useCameraFormat(device, [
    { photoAspectRatio: screenAspectRatio },
    { photoResolution: "max" },
  ]);

  const onPinchGesture = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    { startZoom?: number }
  >({
    onStart: (_, context) => {
      context.startZoom = zoom.value;
    },
    onActive: (event, context) => {
      console.log("Pinch gesture active", event.scale, zoom.value);
      // we're trying to map the scale gesture to a linear zoom here
      const startZoom = context.startZoom ?? 0;
      const scale = interpolate(
        event.scale,
        [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM],
        [-1, 0, 1],
        Extrapolate.CLAMP
      );
      zoom.value = interpolate(
        scale,
        [-1, 0, 1],
        [minZoom, startZoom, maxZoom],
        Extrapolate.CLAMP
      );
    },
  });

  const onFocusTap = useCallback(
    ({ nativeEvent: event }: GestureResponderEvent) => {
      if (!device?.supportsFocus) return;
      console.log("Focus tap at", event.locationX, event.locationY);
      camera.current?.focus({
        x: event.locationX,
        y: event.locationY,
      });
    },
    [device?.supportsFocus]
  );

  const takePicture = async () => {
    const photo = await camera.current?.takePhoto({
      flash: flash,
      enableShutterSound: false,
    });
    setIsLoading(true);
    const response = await uploadImage(photo);
    if (!response || response["response"] === "") {
      setIsLoading(false);
      return Alert.alert("No braille detected. Please try again.");
    }
    setIsLoading(false);
    router.push({
      pathname: "/translationScreen",
      params: response,
    });
  };

  if (!hasPermission) {
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
    isActive &&
    device != null && (
      <GestureHandlerRootView style={styles.root}>
        <View style={styles.container}>
          <Header />

          <View
            style={styles.cameraWrapper}
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              setCameraHeight(height);
            }}
            testID="camera"
          >
            <PinchGestureHandler
              onGestureEvent={onPinchGesture}
              enabled={isActive}
            >
              <Reanimated.View
                style={styles.cameraTouchArea}
                onTouchEnd={onFocusTap}
              >
                <ReanimatedCamera
                  style={styles.camera}
                  device={device}
                  isActive={true}
                  ref={camera}
                  enableZoomGesture={false}
                  outputOrientation="preview"
                  exposure={0}
                  photoQualityBalance="quality"
                  format={format}
                  animatedProps={cameraAnimatedProps}
                  photo={true}
                />
              </Reanimated.View>
            </PinchGestureHandler>
          </View>

          <View
            style={[
              styles.shutterContainer,
              { paddingBottom: Math.max(30, insets.bottom + 10) },
            ]}
          >
            <Pressable
              onPress={takePicture}
              accessibilityLabel="Shutter button, double tap to take a picture."
              testID="shutterButton"
            >
              {({ pressed }) => (
                <View
                  style={[styles.shutterBtn, { opacity: pressed ? 0.5 : 1 }]}
                >
                  <View
                    style={[
                      styles.shutterBtnInner,
                      { backgroundColor: "white" },
                    ]}
                  />
                </View>
              )}
            </Pressable>
          </View>

          {isLoading && (
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
              testID="loadingScreen"
            >
              <LoadingScreen />
            </View>
          )}
        </View>
      </GestureHandlerRootView>
    )
  );
}

const styles = StyleSheet.create({
  cameraWrapper: {
    flex: 1, // take up all available vertical space between header and shutter
    width: "100%",
    // aspectRatio: 9 / 16, // or 9 / 16 for classic portrait
    // backgroundColor: "black",
    // alignSelf: "center",
  },

  cameraTouchArea: {
    flex: 1,
    width: "100%",
  },

  camera: {
    flex: 1,
    width: "100%",
  },
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  shutterContainer: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 30,
    backgroundColor: "black",
    height: 150,
    paddingTop: 15,
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
