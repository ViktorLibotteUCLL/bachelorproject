import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

jest.mock("expo-router", () => {
  return {
    router: {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
    },
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
    }),
    useLocalSearchParams: () => ({}),
    useGlobalSearchParams: () => ({}),
    useSegments: () => [],
    useNavigation: () => ({}),
    useNavigationContainerRef: () => ({}),
  };
});

jest.mock("react-native-vision-camera", () => ({
  Camera: (props) => <>{props.children}</>, // Just render children or a View
  useCameraDevice: () => ({ minZoom: 1, maxZoom: 10 }),
  useCameraFormat: jest.fn(() => ({
    photoResolution: "max",
    photoAspectRatio: 1.5,
  })),
  useCameraPermission: () => ({
    hasPermission: true,
    requestPermission: jest.fn(),
  }),
}));

jest.mock("react-native-gesture-handler", () => {
  const View = require("react-native").View;
  return {
    GestureHandlerRootView: View,
    PinchGestureHandler: View,
  };
});

jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.View = require("react-native").View;
  return Reanimated;
});

jest.mock("@react-navigation/native", () => ({
  useIsFocused: () => true,
}));
