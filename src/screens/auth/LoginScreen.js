// TODO : Create a login screen

import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { TextPrimary } from "../../components/Text";
import { lightTheme } from "../../assets/themes/lightTheme";
import { useGlobalAppSettings } from "../../reducers/GlobalContext";
import { ButtonPrimary, ButtonSecondary } from "../../components/Button";
import CustomTextInput from "../../components/CustomTextInput";
import { useRef, useState } from "react";
import handleUserLogin from "../../utils/HandlUserLogin";
import handleUserSignUp from "../../utils/HandleUserSignUp";
import CheckList from "../../components/CheckList";
import Loading from "../../components/Loading";
import Carousel from "react-native-reanimated-carousel";
import LottieView from "lottie-react-native";
import { wave } from "../../assets/animation/wave.json";

const LoginScreen = () => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberLogin, setRememberLogin] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);
  const inputEmailRef = useRef(null);
  const inputPasswordRef = useRef(null);

  const finalCheck = (action) => {
    switch (true) {
      case email && password.length >= 6 && action === "login":
        return (
          setScreenLoading(true),
          handleUserLogin({ email, password }),
          setScreenLoading(false)
        );

      case email && password.length >= 6 && action === "signup":
        setScreenLoading(true);
        return handleUserSignUp({ email, password });

      case !email:
        return alert("Please fill in email") && inputEmailRef.current.focus();

      case !password || password.length < 6:
        return (
          alert("Please fill in password") && inputPasswordRef.current.focus()
        );

      default:
        return;
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: appSettings.theme.style.colors.background,
        }}
      >
        {!screenLoading && (
          <>
            <LottieBackground />
            <View
              style={{
                width: "100%",
                paddingHorizontal: 16,
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <TextPrimary
                label="Start Logging"
                style={{
                  // padding: 16,
                  fontSize: 48,
                  fontWeight: "bold",
                }}
              />
              <AnimateLoginText />
            </View>
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 0,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CustomTextInput
                inputRef={inputEmailRef}
                inputType="email"
                inputQuery={email}
                onChange={(text) => {
                  setEmail(text);
                }}
                placeholder="Email"
              />
              <CustomTextInput
                inputRef={inputPasswordRef}
                inputType="password"
                inputQuery={password}
                onChange={(text) => {
                  setPassword(text);
                }}
                placeholder="Password"
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                <CheckList
                  checkboxPlacement="left"
                  singleChecklist
                  item={false}
                  primaryLabel="Remember me"
                  selected={rememberLogin}
                  onPress={() => {
                    setRememberLogin(!rememberLogin);
                  }}
                />
              </View>
              <TouchableOpacity
                style={{
                  flex: 1,
                }}
              >
                <View
                  style={{
                    alignItems: "flex-end",
                    paddingRight: 16,
                    //   flex: 1,
                  }}
                >
                  <TextPrimary
                    label="Forgot password ?"
                    style={{
                      paddingVertical: 16,
                      fontWeight: "bold",
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <ButtonPrimary
              style={{ marginVertical: 16 }}
              width={Dimensions.get("window").width - 32}
              label="Login"
              onPress={() => {
                finalCheck("login");
              }}
            />
            {/* 
          // TODO : Create a signup screen 
           */}
            <TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <TextPrimary
                  label="Don't have an account ?"
                  style={{
                    paddingVertical: 16,
                  }}
                />
                <TextPrimary
                  label="Sign up"
                  style={{
                    paddingLeft: 8,
                    paddingVertical: 16,
                    fontWeight: "bold",
                  }}
                />
              </View>
            </TouchableOpacity>
          </>
        )}
        {screenLoading && (
          <>
            <Loading size={56} />
            <TextPrimary
              label="Logging you in ..."
              style={{ paddingVertical: 16 }}
            />
          </>
        )}
      </ScrollView>
      {/* // TAG : Footer */}
      <View
        style={{
          position: "absolute",
          bottom: 16,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextPrimary label="Cash Log" />
        <TextPrimary label="v.1.0.0" />
      </View>
    </>
  );
};

const AnimateLoginText = () => {
  const textData = [
    { name: "food", emoji: "🍜" },
    { name: "travel", emoji: "🚗" },
    { name: "shopping", emoji: "🛍" },
    { name: "salary", emoji: "💰" },
    { name: "bills", emoji: "📝" },
    { name: "games", emoji: "🎮" },
    { name: "gifts", emoji: "🎁" },
  ];
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          //   height: 64,
        }}
      >
        <TextPrimary
          label="Your"
          style={{
            paddingBottom: 16,
            fontSize: 48,
            fontWeight: "bold",
          }}
        />
        <View
          style={{
            flex: 1,
            // alignItems: "flex-start",
          }}
        >
          <Carousel
            vertical
            //   mode='vertical-stack'
            loop
            autoPlay
            autoPlayInterval={1000}
            scrollAnimationDuration={1000}
            //   width={100}
            height={72}
            data={textData}
            key={(index) => index}
            renderItem={({ index }) => (
              <>
                <View
                  style={{
                    // flex: 1,
                    // width: 200,
                    // height: 64,
                    flexDirection: "row",
                    paddingLeft: 10,
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <TextPrimary
                    label={textData[index].name}
                    style={{
                      color: "#CD0E61",
                      fontSize: 48,
                      fontWeight: "bold",
                    }}
                  />
                  <TextPrimary
                    label={textData[index].emoji}
                    style={{
                      marginLeft: 8,
                      fontSize: 32,
                    }}
                  />
                </View>
              </>
            )}
          />
        </View>
      </View>
    </>
  );
};

const LottieBackground = () => {
  return (
    <>
      {/* // TAG : ANIMATED BACKGROUND */}
      <LottieView
        autoPlay
        resizeMode="cover"
        //   ref={animation}
        source={require("../../assets/animation/wave.json")}
        style={{
          transform: [{ rotateZ: "90deg" }],
          overflow: "visible",
          top: -350,
          right: 10,
          position: "absolute",
          width: 650,
          height: 650,
        }}
      />
      {/* // TAG : ANIMATED BACKGROUND */}
      {/* <LottieView
        autoPlay
        resizeMode="cover"
        //   ref={animation}
        source={require("../../assets/animation/wave.json")}
        style={{
          overflow: "visible",
          bottom: -100,
          left: -100,
          position: "absolute",
          width: 350,
          height: 350,
        }}
      /> */}
    </>
  );
};

export default LoginScreen;
