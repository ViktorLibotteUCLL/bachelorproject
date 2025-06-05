import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import App from "../app/index";

test("renders shutter button", () => {
  const { getByTestId } = render(<App />);
  expect(getByTestId("shutterButton")).toBeTruthy();
});

test("loading screen is displayed when shutter is tapped", () => {
  const { getByTestId } = render(<App />);
  const shutterButton = getByTestId("shutterButton");

  fireEvent.press(shutterButton);

  expect(getByTestId("loadingScreen")).toBeTruthy();
});
