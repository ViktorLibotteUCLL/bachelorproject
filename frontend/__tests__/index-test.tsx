import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import App from "../app/index";

jest.mock("react-native-vision-camera", () => ({
  Camera: () => null,
  useCameraDevice: () => ({ minZoom: 1, maxZoom: 10 }),
  useCameraPermission: () => ({
    hasPermission: true,
    requestPermission: jest.fn(),
  }),
}));

jest.mock("@react-navigation/native", () => ({
  useIsFocused: () => true,
}));

test("renders shutter button", () => {
  const { getByTestId } = render(<App />);
  expect(getByTestId("shutterButton")).toBeTruthy();
});
