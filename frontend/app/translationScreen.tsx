import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { router, useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";

const TranslationScreen = () => {
  const params = useLocalSearchParams();
  const [translations, setTranslations] = useState(params["response"]);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(translations);
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.headingContainer}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Image
            source={require("../assets/images/returnArrow.png")}
            accessibilityLabel="Return to the camera"
            style={styles.image}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={copyToClipboard}>
          <Image
            source={require("../assets/images/copy.png")}
            style={styles.icons}
            accessibilityLabel="Copy translation"
          />
        </TouchableOpacity>
      </View>
      <View
        style={styles.textContainer}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={`Translation: ${translations}`}
      >
        <Text style={styles.text} accessible={false}>
          {translations}
        </Text>
      </View>
    </ScrollView>
  );
};

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
  textContainer: {
    alignSelf: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    marginBottom: 20,
    width: "90%",
    height: "80%",
    borderColor: "#ce2f4b",
    borderWidth: 2,
  },
  text: {
    fontSize: 19,
    fontWeight: "bold",
  },
});

export default TranslationScreen;
