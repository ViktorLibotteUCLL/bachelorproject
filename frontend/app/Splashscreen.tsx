import { transform } from "@babel/core";
import React from "react";
import { View, StyleSheet, Animated } from "react-native";

const SplashScreen = () => {
    const imageScale = new Animated.Value(0);
    const imagePosistionB = new Animated.ValueXY({ x: 150, y: 0 });
    const imagePosistionRaillo = new Animated.ValueXY({ x: -150, y: 0 });

    Animated.sequence([
        Animated.timing(imagePosistionB, {
            toValue: { x: 75, y: 0 },
            duration: 1000,
            useNativeDriver: true,
        }),
        Animated.parallel([
            Animated.timing(imageScale, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(imagePosistionRaillo, {
                toValue: { x: -45, y: 0 },
                duration: 1000,
                useNativeDriver: true,
            }),
        ]),
    ]).start();

    return (
        <View style={styles.container}>
            <View style={styles.imageRow}>
                <Animated.Image
                    source={require("../assets/images/Splashscreen_B_lightmode_no_bg.png")}
                    style={[
                        styles.image,
                        {
                            transform: [
                                //{ scale: imageScale },
                                { translateX: imagePosistionB.x },
                                { translateY: imagePosistionB.y },
                            ],
                        },
                    ]}
                />
                <Animated.Image
                    source={require("../assets/images/Splashscreen_raillo_lightmode_no_bg.png")}
                    style={[
                        styles.image,
                        {
                            transform: [
                                { translateX: imagePosistionRaillo.x },
                                { translateY: imagePosistionRaillo.y },
                                { scale: imageScale },
                            ],
                        },
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    imageRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
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
