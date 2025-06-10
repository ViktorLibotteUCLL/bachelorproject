import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export function LoadingScreen() {
  return (
    <View style={styles.container} testID="loadingScreen">
      <ActivityIndicator size="large" color="#ce2f4b" />
      <Text style={styles.text}>Loading, please wait...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
  },
  text: {
    marginTop: 16,
    fontSize: 16,
  },
});
