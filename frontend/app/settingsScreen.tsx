import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import CustomDropdown from "@/components/Dropdown";
import { router } from "expo-router";

export default function SettingsScreen() {
  const languages = [
    { label: "English", value: "english" },
    { label: "Dutch", value: "dutch" },
    { label: "French", value: "french" },
    { label: "Spanish", value: "spanish" },
  ];

  const themes = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "System", value: "system" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.headingContainer}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Image
            source={require("../assets/images/returnArrow.png")}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Language</Text>
        <CustomDropdown
          data={languages}
          labelField="label"
          valueField="value"
          placeholder="Select language"
          value={null}
          onChange={(item: { label: string; value: string }) => {
            console.log(item);
          }}
        />
        <Text style={styles.title}>Theme</Text>
        <CustomDropdown
          data={themes}
          labelField="label"
          valueField="value"
          placeholder="Select theme"
          value={null}
          onChange={(item: { label: string; value: string }) => {
            console.log(item);
          }}
        />
      </View>
    </ScrollView>
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
  },
  image: {
    width: 60,
    height: 40,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#ce2f4b",
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
});
