import { FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

SplashScreen.preventAutoHideAsync();
export default function Home() {
  const [getChatArray, setChatArray] = useState([]);

  const [loaded, error] = useFonts({
    "Loreal-Shilone": require("../assets/fonts/Loreal-Shilone-Serif.ttf"),
    MotionPicture: require("../assets/fonts/MotionPicture.ttf"),
    "Lato-Light": require("../assets/fonts/Lato-Light.ttf"),
  });

  useEffect(() => {
    async function fetchData() {
      let userJson = await AsyncStorage.getItem("user");

      if (userJson !== null) {
        let user = JSON.parse(userJson);

      let response = await fetch(
        process.env.EXPO_PUBLIC_URL + "/TChat/LoadHomeData?id=" + user.id
      );

      if (response.ok) {
        let json = await response.json();
        if (json.success) {
          let chatArray = json.jsonChatArray;
          setChatArray(chatArray);
          
        }
      }
      }
      else{
        router.replace("/index");
      }
      
    }

    // fetchData();

    setInterval(
       () => {
        fetchData();
      },3000
    );

    
  }, []);

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

      <FlashList
        data={getChatArray}
        renderItem={({ item }) => (
          <View style={styles.view2}>
            <View style={styles.view4}>
              {item.user_avatar_image_found ? (
                <Image
                  style={styles.image1_1}
                  source={
                    process.env.EXPO_PUBLIC_URL +
                    "/TChat/AvatarImages/" +
                    item.user_mobile +
                    ".png"
                  }
                  contentFit="contain"
                />
              ) : (
                <Text style={styles.text6_1}>{item.user_avatar_letters}</Text>
              )}
            </View>

            <View style={styles.view5}>
              <Text style={styles.text1}>{item.user_name}</Text>
              <Text style={styles.text2}>{item.user_mobile}</Text>
              <Text style={styles.text3}>Registered: {item.user_registered_date}</Text>
            </View>
            <Pressable
              onPress={async () => {
                try {
                  console.log("2");

                  await AsyncStorage.removeItem("user");
                  console.log("Data removed");
                } catch (exception) {
                  console.log(exception);
                }
              }}
            >
              <FontAwesome6
                    name={"power-off"}
                    color={"red"}
                    size={20}
                  />
            </Pressable>
          </View>
        )}
        estimatedItemSize={200}
      />

      <View style={styles.view3}>
        <FlashList
          data={getChatArray}
          renderItem={({ item }) => (
            <Pressable
              style={styles.view6}
              onPress={() => {
                router.push({
                  pathname: "/chat",
                  params: item,
                });
              }}
            >
              <View
                ={
                  styleitem.other_user_status == 1 ? styles.view7_2 : styles.view7_1
                }
              >
                {item.avatar_image_found ? (
                  <Image
                    style={styles.image1}
                    source={
                      process.env.EXPO_PUBLIC_URL +
                      "/TChat/AvatarImages/" +
                      item.other_user_mobile +
                      ".png"
                    }
                    contentFit="contain"
                  />
                ) : (
                  <Text style={styles.text6}>
                    {item.other_user_avatar_letters}
                  </Text>
                )}
              </View>
              <View style={styles.view8}>
                <Text style={styles.text4}>{item.other_user_name}</Text>
                <Text style={styles.text5}>{item.message}</Text>

                <View style={styles.view9}>
                  <Text style={styles.text3}>{item.dateTime}</Text>
                  <FontAwesome6
                    name={"check-double"}
                    color={item.chat_status_id == 1 ? "green" : "orange"}
                    size={20}
                  />
                </View>
              </View>
            </Pressable>
          )}
          estimatedItemSize={200}
        />
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
    alignSelf: "center",
    backgroundColor: LinearGradient,
    flexDirection: "row",
    columnGap: 15,
    marginTop: 10,
    paddingHorizontal: 10,
  },

  view3: {
    flex: 7,
    justifyContent: "center",
    backgroundColor: "white",
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 10,
  },

  view4: {
    width: 60,
    height: 60,
    backgroundColor: "white",
    borderRadius: 50,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  view5: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
  },

  view6: {
    flexDirection: "row",
    marginVertical: 10,
    columnGap: 10,
    borderBottomWidth:1,
    paddingVertical:5,
  },

  view7_1: {
    width: 80,
    height: 80,
    backgroundColor: "white",
    borderRadius: 50,
    borderStyle: "solid",
    borderWidth: 3,
    borderColor: "red",
    justifyContent: "center",
  },

  view7_2: {
    width: 80,
    height: 80,
    backgroundColor: "white",
    borderRadius: 50,
    borderStyle: "solid",
    borderWidth: 3,
    borderColor: "green",
    justifyContent: "center",
  },

  view8: {
    flex: 1,
  },

  view9: {
    flexDirection: "row",
    columnGap: 10,
    alignSelf: "flex-end",
    alignItems: "center",
  },

  text1: {
    fontSize: 20,
    fontFamily: "Lato-Light",
    fontWeight: "bold",
    color: "white",
  },

  text2: {
    fontSize: 17,
    fontFamily: "Lato-Light",
    fontWeight: "bold",
    color: "white",
  },

  text3: {
    paddingVertical: 5,
    fontSize: 14,
    fontFamily: "Lato-Light",
    fontWeight: "bold",
    
  },

  text4: {
    fontSize: 20,
    fontFamily: "Lato-Light",
    fontWeight: "bold",
  },

  text5: {
    fontSize: 14,
    fontFamily: "Lato-Light",
    fontWeight: "bold",
    color: "purple",
    paddingVertical:10
  },

  text6: {
    fontSize: 40,
    fontFamily: "Loreal-Shilone",
    alignSelf: "center",
    justifyContent: "center",
    color: "black",
  },

  text6_1: {
    fontSize: 40,
    fontFamily: "Loreal-Shilone",
    alignSelf: "center",
    justifyContent: "center",
    color: "black",
  },

  image1: {
    width: 70,
    height: 70,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: "#b1b1b1",
    justifyContent: "center",
    alignSelf: "center",
  },

  image1_1: {
    width: 50,
    height: 50,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: "#b1b1b1",
    justifyContent: "center",
    alignSelf: "center",
  },
});
