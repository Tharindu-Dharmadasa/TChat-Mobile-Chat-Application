import { FontAwesome6 } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";

SplashScreen.preventAutoHideAsync();
export default function () {
  const [getImage, setImage] = useState(null);

  const [getMobile, setMobile] = useState("");
  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getPassword, setPassword] = useState("");

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

      <Image style={styles.image1} source={logoPath} contentFit={"contain"} />

      <View style={styles.view2}>
        <Text style={styles.text1}>Create Your Chat Account</Text>
        <FontAwesome6 name={"hand-point-down"} color={"white"} size={33} />
      </View>

      <View style={styles.view3}>
        <ScrollView>
          <Pressable 
            onPress={async () => {
              let result = await ImagePicker.launchImageLibraryAsync({});

              if (!result.canceled) {
                setImage(result.assets[0].uri);
              }
            }} style={styles.avatar1_1}
          >
            <Text style={styles.text7}>Select Your Profile Picture</Text>
            <Image
              style={styles.avatar1}
              source={getImage}
              contentFit="contain"
            />
          </Pressable>
          <Text style={styles.text3}>Mobile</Text>
          <TextInput
            style={styles.input1}
            inputMode="tel"
            maxLength={10}
            onChangeText={(text) => {
              setMobile(text);
            }}
            onEndEditing={async () => {}}
            placeholder="Your Mobile..."
          />

          <Text style={styles.text3}>First Name</Text>
          <TextInput
            style={styles.input1}
            inputMode="text"
            onChangeText={(text) => {
              setFirstName(text);
            }}
            onEndEditing={async () => {}}
            placeholder="Your First Name..."
          />

          <Text style={styles.text3}>Last Name</Text>
          <TextInput
            style={styles.input1}
            inputMode="text"
            onChangeText={(text) => {
              setLastName(text);
            }}
            onEndEditing={async () => {}}
            placeholder="Your Last Name..."
          />

          <Text style={styles.text3}>Password</Text>
          <TextInput
            style={styles.input1}
            secureTextEntry={true}
            inputMode="text"
            maxLength={20}
            placeholder="Your Password..."
            onChangeText={(text) => {
              setPassword(text);
            }}
          />

          <Pressable style={styles.pressable2} onPress={async ()=>{
            let formData = new FormData();
            formData.append("mobile", getMobile);
            formData.append("firstName", getFirstName);
            formData.append("lastName", getLastName);
            formData.append("password", getPassword);

            if (getImage != null) {
              formData.append("avatarImage", {
                name: "avatar.png",
                type: "image/png",
                uri: getImage,
              });
            }

            let response = await fetch(
              process.env.EXPO_PUBLIC_URL+"/TChat/SignUp",
              {
                method: "POST",
                body: formData,
              }
            );

            if (response.ok) {
              let json = await response.json();

              if (json.success) {
                //user registration complete
                Alert.alert("Message","User Registration Complete.");
                router.push("/signin");
              } else {
                //problem occured
                Alert.alert("Error", json.message);
              }
            }
          }}>
            <FontAwesome6 name={"right-to-bracket"} color={"white"} size={18} />
            <Text style={styles.text4}>Create Account</Text>
          </Pressable>

          <View style={styles.pressable3}>
            <Text style={styles.text5}>Already Registered ?</Text>
            <Pressable onPress={() => {
                router.push("/signin")
            }}>
              <Text style={styles.text6}>Go to Sign In</Text>
            </Pressable>
          </View>
        </ScrollView>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: LinearGradient,
    flexDirection: "row",
    paddingHorizontal: 10,
  },

  view3: {
    flex: 6,
    justifyContent: "center",
    backgroundColor: "white",
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  image1: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
  },

  text1: {
    fontSize: 35,
    fontFamily: "Loreal-Shilone",
    textAlign: "center",
    marginRight: 20,
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
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },

  text3: {
    fontSize: 20,
    fontFamily: "Lato-Light",
    textAlign: "center",
    paddingVertical: 15,
    fontWeight: "bold",
  },

  input1: {
    width: "100%",
    height: 50,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    fontSize: 16,
  },

  pressable2: {
    height: 60,
    backgroundColor: "#0300c9",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginTop: 20,
    flexDirection: "row",
  },

  text4: {
    fontFamily: "Lato-Light",
    fontSize: 23,
    fontWeight: "bold",
    marginLeft: 10,
    color: "white",
  },

  pressable3: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginTop: 20,
    flexDirection: "row",
    columnGap: 10,
  },

  text5: {
    fontSize: 15,
    fontFamily: "Lato-Light",
  },

  text6: {
    fontSize: 15,
    fontFamily: "Lato-Light",
    color: "blue",
  },

  avatar1: {
    width: 80,
    height: 80,
    borderColor: "black",
    borderWidth:1,
    borderRadius: 50,
    backgroundColor: "#b1b1b1",
    justifyContent: "center",
    alignSelf: "center",
  },

  avatar1_1:{
    borderWidth:2,
    paddingVertical:5,
    borderRadius:15,
  },

  text7: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 15,
    fontFamily: "Lato-Light",
    fontWeight: "bold",
  },
});
