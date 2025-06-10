import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ConversionScreen from "../app/conversionScreen";

test("renders conversion screen", () => {
  const { getByTestId, getByText } = render(<ConversionScreen />);
  expect(getByTestId("return")).toBeTruthy();
  expect(getByText("Conversion Screen")).toBeTruthy();
  expect(getByTestId("lettersTitle")).toBeTruthy();
  expect(getByTestId("lettersImage")).toBeTruthy();
  expect(getByTestId("numbersTitle")).toBeTruthy();
  expect(getByTestId("numbersImage")).toBeTruthy();
  expect(getByTestId("specialCharactersTitle")).toBeTruthy();
  expect(getByTestId("specialCharactersImage")).toBeTruthy();
});
