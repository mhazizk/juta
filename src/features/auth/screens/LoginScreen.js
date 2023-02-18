import { View, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import { TextPrimary } from "../../../components/Text";
import {
  useGlobalAppSettings,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import { ButtonDisabled, ButtonPrimary } from "../../../components/Button";
import CustomTextInput from "../../../components/CustomTextInput";
import { useEffect, useRef, useState } from "react";
import handleUserLogin from "../../../utils/handleUserLogin";
import CheckList from "../../../components/CheckList";
import Loading from "../../../components/Loading";
import LottieView from "lottie-react-native";
import AnimatedLoginText from "../components/AnimatedLoginText";
import screenList from "../../../navigations/ScreenList";
import Footer from "../../../components/Footer";
import REDUCER_ACTIONS from "../../../reducers/reducer.action";
// import useAuth from "../../hooks/useAuth";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../api/firebase/auth";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import { getDeviceId, getDeviceName, getDeviceOSName } from "../../../utils";
import CustomScrollView from "../../../shared-components/CustomScrollView";
const LoginScreen = ({ route, navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const [email, setEmail] = useState("");
  // TODO : Clear up async storage when user logs out and load the last user account
  const [password, setPassword] = useState("");
  const [rememberLogin, setRememberLogin] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // const [authAccount, setAuthAccount] = useState(null);
  const inputEmailRef = useRef(null);
  const inputPasswordRef = useRef(null);
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (route?.params?.account && route?.params?.password) {
      const account = route?.params?.account;
      const password = route?.params?.password;
      setEmail(account.email);
      setPassword(password);
    } else {
    }
  }, []);

  useEffect(() => {
    if (email && password.length >= 6) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [email, password]);

  useEffect(() => {
    if (user) {
      // setEmail(auth.email);
      console.log("hooks", user);
      // navigation.replace(screenList.splashScreen);
    }
  }, [user]);

  const finalCheck = () => {
    setScreenLoading(true);

    // Field check
    switch (true) {
      case !email:
        alert("Please fill in email");
        inputEmailRef.current.focus();
        return;
      case !password || password.length < 6:
        alert("Please fill in password");
        inputPasswordRef.current.focus();
        return;

      default:
        break;
    }

    // Login check
    setTimeout(() => {
      switch (true) {
        case !!email && !!password && !user:
          // New login
          handleUserLogin({ email, password, isPersist: rememberLogin })
            .then((authAccount) => {
              navigation.replace(screenList.splashScreen, {
                fromScreen: screenList.loginScreen,
                targetScreen: screenList.bottomTabNavigator,
              });
            })
            .catch((error) => {
              setScreenLoading(false);
            });
          break;
        case !!email && !!password && !!user:
          // New login
          handleUserLogin({ email, password, isPersist: rememberLogin })
            .then((authAccount) => {
              navigation.replace(screenList.splashScreen, {
                fromScreen: screenList.loginScreen,
                targetScreen: screenList.bottomTabNavigator,
              });
            })
            .catch((error) => {
              setScreenLoading(false);
            });
          break;

        default:
          setScreenLoading(false);
          break;
      }
    }, 1);
  };

  return (
    <>
      <CustomScrollView
        contentContainerStyle={{
          justifyContent: "center",
        }}
      >
        {!screenLoading && (
          <>
            <LottieBackground />
            <View
              style={{
                width: "100%",
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
              <AnimatedLoginText />
            </View>
            <View
              style={{
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
                title={!!email ? "Email" : null}
                onChange={(text) => {
                  setEmail(text);
                }}
                placeholder="Email"
              />
              <CustomTextInput
                inputRef={inputPasswordRef}
                inputType="password"
                inputQuery={password}
                title={!!password ? "Password" : null}
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
                  pressable
                  checkboxPlacement="left"
                  singleChecklist
                  item={true}
                  primaryLabel="Remember me"
                  selected={rememberLogin}
                  onPress={() => {
                    setRememberLogin(!rememberLogin);
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(screenList.forgotPasswordScreen)
                }
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
                      // paddingVertical: 16,
                      fontWeight: "bold",
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {/* // TAG : Button */}
            {showButton && (
              <ButtonPrimary
                style={{ marginVertical: 8 }}
                width={Dimensions.get("window").width - 32}
                label="Login"
                onPress={() => finalCheck()}
              />
            )}
            {/* // TAG : Button */}
            {!showButton && (
              <ButtonDisabled
                style={{ marginVertical: 8 }}
                width={Dimensions.get("window").width - 32}
                label="Login"
              />
            )}
            {/*
             */}
            <TouchableOpacity
              onPress={() => {
                navigation.replace(screenList.signUpScreen);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <TextPrimary
                  label="Don't have an account?"
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
            <Loading />
            {/* <Loading lottie size={150} /> */}
            {/* <TextPrimary
              label="Logging you in ..."
              style={{ paddingVertical: 16 }}
            /> */}
          </>
        )}
      </CustomScrollView>
      <Footer />
    </>
  );
};

const LottieBackground = () => {
  return (
    <>
      {/* // TAG : Header Animated Background */}
      <LottieView
        autoPlay
        resizeMode="cover"
        //   ref={animation}
        source={require("../../../assets/animation/wave.json")}
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
    </>
  );
};

export default LoginScreen;
