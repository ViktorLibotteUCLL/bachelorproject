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

export default function historyScreen() {
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
                <Text style={styles.title}>History</Text>
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