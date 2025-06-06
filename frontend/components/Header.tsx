import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Link, router } from "expo-router";

const Header = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("/historyScreen")}>
        <Image
          source={require("../assets/images/history.png")}
          style={styles.icons}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/conversionScreen")}>
        <Image
          source={require("../assets/images/conversie.png")}
          style={styles.icons}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "black",
  },
  icons: {
    width: 40,
    height: 40,
    marginTop: 10,
  },
});

export default Header;
