import { Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";

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
    <ScrollView style={{ backgroundColor: "#FFFF" }}>
      <View style={{ backgroundColor: "#f8f8f8", padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", padding: 20 }}>
          Translations
        </Text>
      </View>
    </ScrollView>
  );
};

export default TranslationScreen;
