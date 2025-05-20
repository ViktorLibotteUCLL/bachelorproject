import { Text, View, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { router } from "expo-router";

const TranslationScreen = () => {
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch("https://api.braillo.tech/upload");
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error("Error fetching translations:", error);
      } finally {
        setTimeout(() => setLoading(false), 2000);
      }
    };

    fetchTranslations();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.headingContainer}>
            <TouchableOpacity onPress={() => router.push("/")}>
                <Image source={require("../assets/images/returnButton.png")} style={styles.image}/>
            </TouchableOpacity>
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.text}>
            Translations
            </Text>
        </View>
      {/* {translations.map((translation) => (
            <View key={translation.id} style={{ padding: 20 }}>
            <Image source={{ uri: translation.image }} style={{ width: '100%', height: 200 }} />
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{translation.title}</Text>
            <Text>{translation.description}</Text>
            <TouchableOpacity onPress={() => console.log('Translation clicked!')}>
                <Text style={{ color: 'blue' }}>View Translation</Text>
            </TouchableOpacity>
            </View>
        ))} */}
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
        alignSelf: "flex-start",
    },
    image: {
        width: 60,
        height: 40,
        borderRadius: 10,
        marginBottom: 20,
    },
    textContainer: {
        alignSelf: "center",
        padding: 20,
        backgroundColor: "#f8f8f8",
        borderRadius: 10,
        marginBottom: 20,
        width: "90%",
        borderColor: "#ce2f4b",
        borderWidth: 2,
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        padding: 20
    }
});

export default TranslationScreen;
