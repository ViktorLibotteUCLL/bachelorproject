import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import App from "../app/index";
import { Alert } from "react-native";
import uploadImage from "@/utils/uploadImage";

jest.mock("@/utils/uploadImage", () => ({
  __esModule: true,
  default: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, "alert").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders shutter button", () => {
  const { getByTestId } = render(<App />);
  expect(getByTestId("shutterButton")).toBeTruthy();
});

test("loading screen is displayed when shutter is tapped", async () => {
  const { getByTestId, getByText } = render(<App />);
  const shutterButton = getByTestId("shutterButton");

  (uploadImage as jest.Mock).mockImplementation(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ response: "", timestamp: "2025-05-12T14:30:00Z" });
      }, 500);
    });
  });

  fireEvent.press(shutterButton);

  await waitFor(() => {
    expect(getByText("Loading, please wait...")).toBeTruthy();
  });
});

test("shows alert when no braille is detected", async () => {
  (uploadImage as jest.Mock).mockResolvedValue({ response: "" });

  (uploadImage as jest.Mock).mockImplementation(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ response: "hello", timestamp: "2025-05-12T14:30:00Z" });
      }, 500);
    });
  });

  const { getByTestId, getByText } = render(<App />);
  fireEvent.press(getByTestId("shutterButton"));

  await waitFor(() => {
    expect(getByText("Loading, please wait...")).toBeTruthy();
  });

  await waitFor(() => {
    expect(Alert.alert).toHaveBeenCalledWith(
      "No braille detected. Please try again."
    );
  });
});

test("text is displayed when braille was detected", async () => {
  const { getByTestId, getByText } = render(<App />);
  const shutterButton = getByTestId("shutterButton");

  (uploadImage as jest.Mock).mockImplementation(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ response: "hello", timestamp: "2025-05-12T14:30:00Z" });
      }, 500);
    });
  });

  fireEvent.press(shutterButton);

  await waitFor(() => {
    expect(getByText("Loading, please wait...")).toBeTruthy();
  });

  await waitFor(
    () => {
      expect(getByText("hello")).toBeTruthy();
    },
    { timeout: 2000 }
  );
});
