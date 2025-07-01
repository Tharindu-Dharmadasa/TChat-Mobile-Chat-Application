import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

SplashScreen.preventAutoHideAsync();
export default function () {
  const [loaded, error] = useFonts({
    "Loreal-Shilone": require("../assets/fonts/Loreal-Shilone-Serif.ttf"),
    MotionPicture: require("../assets/fonts/MotionPicture.ttf"),
    "Lato-Light": require("../assets/fonts/Lato-Light.ttf"),
  });

  const logoPath = require("../assets/images/logo.png");

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <LinearGradient
      colors={["#0300c9", "#126fee", "#00edff"]}
      style={styles.view1}
    >
      <StatusBar hidden={true} />

      <View style={styles.view2}>
        <Image style={styles.image1} source={logoPath} contentFit={"contain"} />
        <Text style={styles.text1}>Welcome to T-Chat Chat Application.</Text>
        <Text style={styles.text2}>
          Share Your Smile with This World and Find Friends.
        </Text>
      </View>

      <View style={styles.view3}>
        <Pressable
          style={styles.pressable1}
          onPress={() => {
            router.replace("/signin");
          }}
        >
          <Text style={styles.text3}>Let's Start</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  view1: {
    flex: 1,
    rowGap: 10,
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  view2: {
    flex: 2,
    justifyContent: "center",
    backgroundColor: LinearGradient,
  },

  view3: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderWidth: 2,
    borderBottomColor: "white",
  },

  image1: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignSelf: "center",
  },

  text1: {
    fontSize: 45,
    fontFamily: "Loreal-Shilone",
    textAlign: "center",
    marginTop: 30,
    color: "#ffaf04",
  },

  text2: {
    fontSize: 30,
    fontFamily: "MotionPicture",
    textAlign: "center",
    marginTop: 20,
    color: "white",
  },

  pressable1: {
    height: 60,
    backgroundColor: "#0300c9",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },

  text3: {
    fontSize: 30,
    fontFamily: "Lato-Light",
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
});
