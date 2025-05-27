import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import CustomDropdown from "@/components/Dropdown";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

function formatTimestamp(isoString: string) {
  const date = new Date(isoString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" }); // "Dec"
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0"); // "13"
  const minutes = String(date.getMinutes()).padStart(2, "0"); // "05"

  return `${day} ${month} ${year} ${hours}:${minutes}`;
}

export default function historyScreen() {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    const fetchHistory = async () => {
      const jsonHistory = await AsyncStorage.getItem("history");
      // console.log("hist", jsonHistory);
      setHistory(jsonHistory !== null ? JSON.parse(jsonHistory) : []);
      console.log(history);
    };
    fetchHistory();
  }, []);

  const clearHistory = () => {
    return Alert.alert("Alert Title", "My Alert Msg", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          await AsyncStorage.removeItem("history");
          setHistory([]);
        },
      },
    ]);
  };

  return (
    <View style={styles.contentContainer}>
      <View style={styles.headingContainer}>
        <TouchableOpacity
          onPress={() => router.push("/")}
          accessibilityLabel="Return to the camera"
        >
          <Image
            source={require("../assets/images/returnArrow.png")}
            style={styles.image}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => clearHistory()}
          accessibilityLabel="Clear the history of previous requests"
        >
          <Image
            source={require("../assets/images/delete.png")}
            style={styles.icons}
          />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>History</Text>
        {history.map((element) => (
          <>
            <Text
              key={element["timestamp"]}
              style={[styles.text, { paddingTop: 10 }]}
            >
              {formatTimestamp(element["timestamp"])}
            </Text>
            <Text
              key={element["response"]}
              style={[
                styles.text,
                {
                  borderBottomWidth: 1,
                  borderColor: "#ce2f4b",
                  marginBottom: 30,
                },
              ]}
            >
              {element["response"]}
            </Text>
          </>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  headingContainer: {
    marginTop: 10,
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    width: 60,
    height: 40,
    borderRadius: 10,
  },
  icons: {
    width: 40,
    height: 40,
  },
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#ce2f4b",
  },
  text: {
    color: "#000",
    fontSize: 16,
    paddingBottom: 10,
    alignSelf: "center",
    width: "100%",
  },
});
