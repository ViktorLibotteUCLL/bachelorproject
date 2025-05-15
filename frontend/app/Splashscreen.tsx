import { transform } from "@babel/core";
import React from "react";
import {View, StyleSheet, Animated} from "react-native";

const SplashScreen = () => {
    const imageScale = new Animated.Value(0.1);
    // const imagePosistion = new Animated.Value(-200);

    Animated.parallel([
        Animated.timing(imageScale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }),
        // Animated.timing(imagePosistion, {
        //     toValue: 0,
        //     duration: 1000,
        //     useNativeDriver: true,
        // }),
    ]).start();

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require("../assets/images/Braillo_splashscreen_lightmode.png")}
                style={[
                    styles.image,
                    {
                        transform: [
                            { scale: imageScale },
                            //{ translateY: imagePosistion },
                        ],
                    }
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    image: {
        width: 200,
        height: 200,
        //position: "absolute",
        //top: 0,
        //left: 0,
    },
});

export default SplashScreen;