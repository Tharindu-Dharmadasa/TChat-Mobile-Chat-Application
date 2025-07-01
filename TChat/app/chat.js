import { FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import EmojiPicker from "emoji-picker-react";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  View,
} from "react-native";
import EmojiModal from "react-native-emoji-modal";

SplashScreen.preventAutoHideAsync();
export default function Chat() {

  //get parameters
  const item = useLocalSearchParams();

  const [getChatArray, setChatArray] = useState([]);
  const [getChatText, setChatText] = useState([]);

  const [getShowPicker, setShowPicker] = useState(false);

  const [loaded, error] = useFonts({
    "Loreal-Shilone": require("../assets/fonts/Loreal-Shilone-Serif.ttf"),
    MotionPicture: require("../assets/fonts/MotionPicture.ttf"),
    "Lato-Light": require("../assets/fonts/Lato-Light.ttf"),
  });

  const onEmojiClick = (event, emojiObject) => {
    setChatText((prevInput) => prevInput + emojiObject.getChatText);
    setShowPicker(false);
  };

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  //fetch chat array from server
  useEffect(() => {
    async function fetchChatArray() {
      let response = await fetch(
        process.env.EXPO_PUBLIC_URL +
          "/TChat/LoadChat?logged_user_id=" +
          item.user_id +
          "&other_user_id=" +
          item.other_user_id
      );

      if (response.ok) {
        let chatArray = await response.json();
        setChatArray(chatArray);
      }
    }

    // fetchChatArray();
    setInterval(() => {
      fetchChatArray();
    }, 2000);
  }, []);

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
        <Pressable onPress={()=>{
          router.push("/home");
        }    
        }>
        <FontAwesome6 name={"arrow-left"} color={"green"} size={22} />
        </Pressable>
        <View
          style={item.other_user_status == 1 ? styles.view4_1 : styles.view4_2}
        >

          {item.avatar_image_found == "true" ? (
            <Image
              style={
                item.other_user_status == 1 ? styles.image1_1 : styles.image1_2
              }
              source={
                process.env.EXPO_PUBLIC_URL +
                "/TChat/AvatarImages/" +
                item.other_user_mobile +
                ".png"
              }
              contentFit="contain"
            />
          ) : (
            <Text style={styles.text1}>{item.other_user_avatar_letters}</Text>
          )}
        </View>

        <View style={styles.view5}>
          <Text style={styles.text2}>{item.other_user_name}</Text>
          <Text style={styles.text3}>
            {item.other_user_status == 1 ? "Online" : "Offline"}
          </Text>
        </View>

        <Pressable>
          <FontAwesome6 name={"phone"} color={"green"} size={22} />
        </Pressable>
      </View>

      <View style={styles.centerView1}>
        <FlashList
          data={getChatArray}
          renderItem={({ item }) => (
            <View
              style={item.side == "right" ? styles.view6_1 : styles.view6_2}
            >
              <Text style={styles.text4}>{item.message}</Text>
              <View style={styles.view7}>
                <Text style={styles.text5}>{item.datetime}</Text>
                {item.side == "right" ? (
                  <FontAwesome6
                    name={"check-double"}
                    color={item.status == 1 ? "green" : "orange"}
                    size={15}
                  />
                ) : null}
              </View>
            </View>
          )}
          estimatedItemSize={200}
        />
      </View>

      <View style={styles.view8}>

        <TextInput
          value={getChatText}
          style={styles.input1}
          onChangeText={(text) => {
            setChatText(text);
          }}
          placeholder="Enter your message here..."
        />

        <Pressable onPress={() => setShowPicker((val) => !val)}>
          <Image
            style={styles.image2}
            name="emoji-icon"
            source="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
          />
          {getShowPicker && (
            <EmojiModal
              style={styles.emojipricker1}
              onEmojiSelected={onEmojiClick}
              onEmojiClick={onEmojiClick}
            />
          )}
        </Pressable>
        <Pressable
          style={styles.pressable1}
          onPress={async () => {
            if (getChatText.length == 0) {
              Alert.alert("Error", "Please Enter Your Message.");
            } else {
              let userJson = await AsyncStorage.getItem("user");
              let user = JSON.parse(userJson);

              let response = await fetch(
                process.env.EXPO_PUBLIC_URL +
                  "/TChat/SendChatText?logged_user_id=" +
                  user.id +
                  "&other_user_id=" +
                  item.other_user_id +
                  "&message=" +
                  getChatText
              );

              if (response.ok) {
                let json = await response.json();

                if (json.success) {
                  console.log("Message Sent");
                  setChatText("");
                }
              }
            }
          }}
        >
          <FontAwesome6 name={"paper-plane"} color={"white"} size={20} />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  view1: {
    flex: 1,
    paddingHorizontal: 10,
  },

  view2: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eaebea",
    flexDirection: "row",
    columnGap: 15,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 10,
  },

  view4_1: {
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },

  view4_2: {
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },

  view5: {
    flex: 1,
  },

  view6_1: {
    borderRadius: 10,
    marginHorizontal: 5,
    marginVertical: 5,
    padding: 10,
    justifyContent: "center",
    alignSelf: "flex-end",
    rowGap: 5,
    backgroundColor: "#00edff",
  },

  view6_2: {
    borderRadius: 10,
    marginHorizontal: 5,
    marginVertical: 5,
    padding: 10,
    justifyContent: "center",
    alignSelf: "flex-start",
    rowGap: 5,
    backgroundColor: "#00edff",
    width: "auto",
  },

  view7: {
    flexDirection: "row",
    columnGap: 10,
  },

  view8: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 10,
    paddingHorizontal: 8,
    marginVertical: 10,
  },

  text1: {
    fontSize: 30,
    fontFamily: "Loreal-Shilone",
    alignSelf: "center",
    justifyContent: "center",
    color: "#0300c9",
  },

  text2: {
    fontSize: 19,
    fontFamily: "Lato-Light",
    fontWeight: "bold",
  },

  text3: {
    fontSize: 15,
    fontFamily: "Lato-Light",
    color: "blue",
  },

  text4: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Lato-Light",
  },

  text5: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Lato-Light",
  },

  image1_1: {
    width: 50,
    height: 50,
    borderColor: "green",
    borderWidth: 2,
    borderRadius: 50,
    backgroundColor: "#b1b1b1",
    justifyContent: "center",
    alignSelf: "center",
  },

  image1_2: {
    width: 50,
    height: 50,
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 50,
    backgroundColor: "#b1b1b1",
    justifyContent: "center",
    alignSelf: "center",
  },

  input1: {
    height: 40,
    borderRadius: 10,
    borderStyle: "solid",
    borderWidth: 1,
    fontSize: 20,
    fontFamily: "Lato-Light",
    flex: 1,
    paddingStart: 10,
  },

  pressable1: {
    backgroundColor: "#83a4d4",
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  centerView1: {
    flex: 1,
    marginVertical:20,
  },

  emojipricker1: {
    width: 20,
    backgroundColor: "red",
    height: 10,
  },

  image2: {
    width: 30,
    height: 30,
    color: "yellow",
  },

});
