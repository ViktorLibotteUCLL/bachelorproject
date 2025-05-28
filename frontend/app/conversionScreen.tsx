import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";

const ConversionScreen = () => {
  return (
    <View style={styles.contentContainer}>
      <View style={styles.headingContainer}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Image
            source={require("../assets/images/returnArrow.png")}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Conversion Screen</Text>
        <Text style={[styles.text, { borderBottomWidth: 1,
              borderColor: "#ce2f4b" }]}>Letters</Text>
        <Image
          source={require("../assets/images/letters.png")}
          style={[
            styles.conversions,
            {
              borderBottomWidth: 1,
              borderColor: "#ce2f4b",
            },
          ]}
        />
        <Text style={[styles.text, { marginBottom: 20, borderBottomWidth: 1,
              borderColor: "#ce2f4b" }]}>Numbers</Text>
        <Image
          source={require("../assets/images/numbers.png")}
          style={[
            styles.conversions,
            {
              borderBottomWidth: 1,
              borderColor: "#ce2f4b",
            },
          ]}
        />
        <Text style={[styles.text, { marginTop: 20, marginBottom: 30, borderBottomWidth: 1,
              borderColor: "#ce2f4b", }]}>
          Punctuation Marks
        </Text>
        <Image
          source={require("../assets/images/punctuationMarks.png")}
          style={[
            styles.conversions,
            {
              borderBottomWidth: 1,
              borderColor: "#ce2f4b",
              height: 450,
              marginBottom: 50,
            },
          ]}
        />
      </ScrollView>
    </View>
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
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    width: 60,
    height: 40,
    borderRadius: 10,
  },
  conversions: {
    width: 300,
    height: 420,
    alignSelf: "center",
    marginBottom: 20,
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
    fontSize: 21,
    paddingBottom: 10,
    alignSelf: "center",
    fontWeight: "bold",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#ce2f4b",
    marginVertical: 20,
  },
});

export default ConversionScreen;
