// import { Pressable, StyleSheet, View, Button, Text } from "react-native";
// import { useEffect, useRef, useState } from "react";
// import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
// import { useIsFocused } from "@react-navigation/native";
// import { LoadingScreen } from "@/components/LoadingScreen";
// import { Link, router } from "expo-router";
// import Header from "@/components/Header";
// import { SafeAreaView } from "react-native-safe-area-context";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function App() {
//   const [facing, setFacing] = useState<CameraType>("back");
//   const [permission, requestPermission] = useCameraPermissions();
//   const ref = useRef<CameraView>(null);
//   const isFocused = useIsFocused();
//   const [isLoading, setIsLoading] = useState(false);

//   if (!permission) {
//     // Camera permissions are still loading.
//     return <View />;
//   }

//   if (!permission.granted) {
//     // Camera permissions are not granted yet.
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>
//           We need your permission to show the camera
//         </Text>
//         <Button onPress={requestPermission} title="grant permission" />
//       </View>
//     );
//   }

//   const uploadImage = async (photo: any) => {
//     const formData = new FormData();

//     formData.append("image", {
//       uri: photo.uri,
//       name: "photo.jpg",
//       type: "image/jpeg",
//     } as any);

//     try {
//       const response = await fetch("https://api.braillo.tech/upload", {
//         method: "POST",
//         body: formData,
//         headers: {
//           "api-token": process.env.EXPO_PUBLIC_API_TOKEN as string,
//         },
//       });
//       const data = await response.json();
//       console.log("Upload success", data);
//       if (data["response"]) {
//         console.log("hello");
//         const jsonHistory = await AsyncStorage.getItem("history");
//         console.log(jsonHistory);
//         let history: any[] = jsonHistory != null ? JSON.parse(jsonHistory) : [];
//         // history[data["timestamp"]] = data["response"];
//         history.push(data);
//         console.log(history);
//         await AsyncStorage.setItem("history", JSON.stringify(history));
//       }

//       return data;
//     } catch (error) {
//       console.error("Upload failed", error);
//     }
//   };

//   const takePicture = async () => {
//     setIsLoading(true);
//     const photo = await ref.current?.takePictureAsync({ shutterSound: false });
//     console.log("Photo taken", photo);
//     const response = await uploadImage(photo);
//     if (!response || response["response"] === "") {
//       setIsLoading(false);
//       return alert("No braille detected. Please try again.");
//     }
//     setIsLoading(false);
//     router.push({
//       pathname: "/translationScreen",
//       params: response,
//     });
//   };

//   return (
//     isFocused && (
//       <View style={styles.container}>
//         <Header />
//         <CameraView
//           style={styles.camera}
//           facing={facing}
//           ref={ref}
//           flash={"auto"}
//           animateShutter={false}
//         >
//           <View style={styles.shutterContainer}>
//             <Pressable onPress={takePicture}>
//               {({ pressed }) => (
//                 <View
//                   style={[
//                     styles.shutterBtn,
//                     {
//                       opacity: pressed ? 0.5 : 1,
//                     },
//                   ]}
//                 >
//                   <View
//                     style={[
//                       styles.shutterBtnInner,
//                       {
//                         backgroundColor: "white",
//                       },
//                     ]}
//                   />
//                 </View>
//               )}
//             </Pressable>
//           </View>
//         </CameraView>
//         {isLoading && (
//           <View
//             style={{
//               ...StyleSheet.absoluteFillObject,
//               alignItems: "center",
//               justifyContent: "center",
//               zIndex: 10,
//             }}
//           >
//             <LoadingScreen />
//           </View>
//         )}
//       </View>
//     )
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "black",
//     alignItems: "center",
//     justifyContent: "center",
//     width: "100%",
//   },
//   message: {
//     textAlign: "center",
//     paddingBottom: 10,
//   },
//   camera: {
//     flex: 1,
//     width: "100%",
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "white",
//   },
//   shutterContainer: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     width: "100%",
//     alignItems: "center",
//     flexDirection: "row",
//     justifyContent: "center",
//     paddingHorizontal: 30,
//     backgroundColor: "black",
//     height: 140,
//     paddingBottom: 30,
//   },
//   shutterBtn: {
//     backgroundColor: "transparent",
//     borderWidth: 5,
//     borderColor: "white",
//     width: 85,
//     height: 85,
//     borderRadius: 45,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   shutterBtnInner: {
//     width: 70,
//     height: 70,
//     borderRadius: 50,
//   },
//   // loadingOverlay: {
//   //   ...StyleSheet.absoluteFillObject,
//   //   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   // alignItems: "center",
//   // justifyContent: "center",
//   // zIndex: 10,
//   // },
// });
// import { Pressable, StyleSheet, View, Button, Text } from "react-native";
// import { useEffect, useRef, useState } from "react";
// import { useIsFocused } from "@react-navigation/native";
// import { LoadingScreen } from "@/components/LoadingScreen";
// import { Link, router } from "expo-router";
// import Header from "@/components/Header";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   Camera,
//   useCameraDevice,
//   useCameraPermission,
// } from "react-native-vision-camera";

// export default function App() {
//   const device = useCameraDevice("back", {
//     physicalDevices: [
//       "ultra-wide-angle-camera",
//       "wide-angle-camera",
//       "telephoto-camera",
//     ],
//   });
//   const { hasPermission, requestPermission } = useCameraPermission();
//   const ref = useRef<CameraView>(null);
//   const isFocused = useIsFocused();
//   const [isLoading, setIsLoading] = useState(false);

//   if (!hasPermission) {
//     // Camera permissions are not granted yet.
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>
//           We need your permission to show the camera
//         </Text>
//         <Button onPress={requestPermission} title="grant permission" />
//       </View>
//     );
//   }

//   return (
//     isFocused && (
//       <View style={styles.container}>
//         <Header />
//         <Camera
//           style={StyleSheet.absoluteFill}
//           device={device}
//           isActive={true}
//           enableZoomGesture
//         ></Camera>
//         {isLoading && (
//           <View
//             style={{
//               ...StyleSheet.absoluteFillObject,
//               alignItems: "center",
//               justifyContent: "center",
//               zIndex: 10,
//             }}
//           >
//             <LoadingScreen />
//           </View>
//         )}
//       </View>
//     )
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "black",
//     alignItems: "center",
//     justifyContent: "center",
//     width: "100%",
//   },
//   message: {
//     textAlign: "center",
//     paddingBottom: 10,
//   },
//   camera: {
//     flex: 1,
//     width: "100%",
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "white",
//   },
//   shutterContainer: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     width: "100%",
//     alignItems: "center",
//     flexDirection: "row",
//     justifyContent: "center",
//     paddingHorizontal: 30,
//     backgroundColor: "black",
//     height: 140,
//     paddingBottom: 30,
//   },
//   shutterBtn: {
//     backgroundColor: "transparent",
//     borderWidth: 5,
//     borderColor: "white",
//     width: 85,
//     height: 85,
//     borderRadius: 45,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   shutterBtnInner: {
//     width: 70,
//     height: 70,
//     borderRadius: 50,
//   },
//   // loadingOverlay: {
//   //   ...StyleSheet.absoluteFillObject,
//   //   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   // alignItems: "center",
//   // justifyContent: "center",
//   // zIndex: 10,
//   // },
// });

import React, { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
} from "react-native-reanimated";
import {
  Camera as CameraVision,
  CameraPermissionRequestResult,
  CameraProps,
  PhotoFile,
  useCameraDevices,
} from "react-native-vision-camera";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import PhotoPreview from "PhotoPreview";

import * as S from "./styles";
import ImageViewer from "ImageViewer";
import {
  HandlerStateChangeEvent,
  TapGestureHandler,
  TapGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import CircleFocus from "CircleFocus";

const ReanimatedCamera = Animated.createAnimatedComponent(CameraVision);
Animated.addWhitelistedNativeProps({
  zoom: true,
});

function Camera() {
  const camera = useRef<CameraVision>(null);

  const [torchActive, setTorchActive] = useState(false);
  const [frontCamera, setFrontCamera] = useState(false);
  const [permissionResult, setPermissionResult] =
    useState<CameraPermissionRequestResult>("denied");
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [focusCoords, setFocusCoords] = useState({ x: 0, y: 0 });
  /* Here we use hook provided by library to take available devices (lenses) */
  const availableDevices = useCameraDevices();

  /* useCameraDevices hook returns an object with front/back properties,
     that you can use to switch between back and front camera */
  const currentDevice =
    frontCamera && availableDevices?.front
      ? availableDevices.front
      : availableDevices?.back;

  const zoom = useSharedValue(0);

  const takePhoto = async () => {
    try {
      const result = await camera.current?.takePhoto();

      if (result) {
        setPhotos((prevPhotos) => [...prevPhotos, result]);
      }
    } catch (e) {
      Alert.alert(`Error: ${e}`);
    }
  };

  const flipCamera = () => setFrontCamera((prevState) => !prevState);
  const toggleTorch = () => setTorchActive((prevState) => !prevState);
  const handleOpenImageViewer = () => {
    if (photos.length > 0) {
      setShowImageViewer(true);
    }
  };

  useEffect(() => {
    async function getPermission() {
      try {
        const cameraPermission = await CameraVision.requestCameraPermission();

        setPermissionResult(cameraPermission);
      } catch (error) {
        Alert.alert(
          "permissão da câmera",
          "Não foi possível recuperar permissão da câmera."
        );
      }
    }

    getPermission();
  }, []);

  const animatedProps = useAnimatedProps<Partial<CameraProps>>(
    () => ({ zoom: zoom.value }),
    [zoom]
  );

  const gestureTapToFocus = (
    event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>
  ) => {
    setFocusCoords({
      x: event.nativeEvent.x,
      y: event.nativeEvent.y,
    });

    camera.current?.focus({
      x: Math.floor(event.nativeEvent.x),
      y: Math.floor(event.nativeEvent.y),
    });
  };

  /* There is an additional check to prevent errors.
     Camera component needs a valid device prop,
     we need to stop rendering if the device is falsy value. */
  if (!currentDevice) {
    return null;
  }

  if (permissionResult === "denied") {
    return null;
  }

  return (
    <S.Container>
      <TapGestureHandler onHandlerStateChange={gestureTapToFocus}>
        <ReanimatedCamera
          ref={camera}
          // style={StyleSheet.absoluteFill}
          style={{ flex: 1 }}
          device={currentDevice}
          isActive={true}
          photo={true}
          torch={torchActive ? "on" : "off"}
          enableZoomGesture
          animatedProps={animatedProps}
        />
      </TapGestureHandler>

      <S.Buttons>
        <S.Button onPress={handleOpenImageViewer}>
          {photos.length > 0 ? (
            <S.WrapperImage>
              <PhotoPreview
                photo={`file://${photos[photos.length - 1].path}`}
              />
            </S.WrapperImage>
          ) : (
            <MaterialIcons name="image-not-supported" size={24} color="black" />
          )}
        </S.Button>
        <S.Button onPress={takePhoto}>
          <MaterialIcons name="camera-alt" size={24} color="black" />
        </S.Button>
        <S.Button onPress={flipCamera}>
          {frontCamera ? (
            <MaterialIcons name="camera-rear" size={24} color="black" />
          ) : (
            <MaterialIcons name="camera-front" size={24} color="black" />
          )}
        </S.Button>
      </S.Buttons>

      <S.ButtonsFloatings>
        <S.ButtonFloating onPress={toggleTorch}>
          {torchActive ? (
            <MaterialIcons name="flash-on" size={24} color="black" />
          ) : (
            <MaterialIcons name="flash-off" size={24} color="black" />
          )}
        </S.ButtonFloating>
      </S.ButtonsFloatings>

      <CircleFocus x={focusCoords.x} y={focusCoords.y} />

      <ImageViewer
        images={photos.map((p) => ({ uri: `file://${p.path}` }))}
        isVisible={showImageViewer}
        handleClose={() => setShowImageViewer(false)}
        imageIndex={photos.length - 1}
      />
    </S.Container>
  );
}

export default Camera;
