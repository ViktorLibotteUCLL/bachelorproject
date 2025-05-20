import { Text, View, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { router, useLocalSearchParams } from "expo-router";

const TranslationScreen = () => {
    const params = useLocalSearchParams();
    const [translations, setTranslations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.data){
            try {
                // const response = await fetch("https://devapi.braillo.tech/upload");
                // const data = await response.json();
                const data = JSON.parse(params.data as string);
                // setTranslations(Array.isArray(parsed) ? parsed : [parsed]);
                setTranslations(data["response"]);
                console.log("Translations fetched successfully:", data);
            } catch (error) {
                console.error("Error fetching translations:", error);
            } finally {
                setTimeout(() => setLoading(false), 2000);
            }
        };

        setTimeout(() => setLoading(false), 2000);
    }, [params.data]);

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
            <Text style={styles.text}> Translations
            {translations}
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
        marginTop: 10,
        marginBottom: 30,
    },
    image: {
        width: 60,
        height: 40,
        borderRadius: 10,
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
    }
});

export default TranslationScreen;
