import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import HistoryScreen from "../app/historyScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Alert } from "react-native";
import formatTimestamp from "../utils/formatTimestamp";

jest.mock("@react-native-async-storage/async-storage");
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));
jest.spyOn(Alert, "alert");

const mockHistory = [
  {
    timestamp: "2025-05-12T14:30:00Z",
    response: "Grip",
  },
];

describe("History Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders screen correctly", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockHistory)
    );
    const { getByTestId, getByText } = render(<HistoryScreen />);

    await waitFor(() => {
      expect(getByTestId("historyScreen")).toBeTruthy();
      expect(getByText("History")).toBeTruthy();
      expect(getByText("Grip")).toBeTruthy();
      expect(
        getByText(formatTimestamp(mockHistory[0]["timestamp"]))
      ).toBeTruthy();
    });
  });

  test("navigates back when return button is pressed", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("[]");
    const { getByTestId } = render(<HistoryScreen />);

    const returnBtn = getByTestId("return");
    fireEvent.press(returnBtn);

    expect(router.push).toHaveBeenCalledWith("/");
  });

  test("shows alert when clearing history", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("[]");
    const { getByTestId } = render(<HistoryScreen />);

    fireEvent.press(getByTestId("clearHistory"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Clear history",
      "Are you sure you want to clear the history?",
      expect.any(Array)
    );
  });

  test("clears history on alert OK press", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockHistory)
    );

    const { getByTestId } = render(<HistoryScreen />);

    fireEvent.press(getByTestId("clearHistory"));

    const okPress = Alert.alert.mock.calls[0][2][1].onPress;
    await okPress();

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("history");
  });
});
