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
import {
  useGlobalAppSettings,
  useGlobalUserAccount,
} from "../../reducers/GlobalContext";
import {
  ButtonDisabled,
  ButtonPrimary,
  ButtonSecondary,
} from "../../components/Button";
import CustomTextInput from "../../components/CustomTextInput";
import { useEffect, useRef, useState } from "react";
import handleUserLogin from "../../utils/HandlUserLogin";
import handleUserSignUp from "../../utils/HandleUserSignUp";
import CheckList from "../../components/CheckList";
import Loading from "../../components/Loading";
import Carousel from "react-native-reanimated-carousel";
import LottieView from "lottie-react-native";
import { wave } from "../../assets/animation/wave.json";
import AnimatedLoginText from "../../components/AnimatedLoginText";
import screenList from "../../navigations/ScreenList";
import Footer from "../../components/Footer";
import REDUCER_ACTIONS from "../../reducers/reducer.action";
// import useAuth from "../../hooks/useAuth";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import auth from "../../api/firebase/auth";
import persistStorage from "../../reducers/persist/persistStorage";
import PERSIST_ACTIONS from "../../reducers/persist/persist.actions";
const LoginScreen = ({ route, navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const [email, setEmail] = useState("");
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
      const loadUserAccount = persistStorage
        .asyncSecureStorage({
          action: PERSIST_ACTIONS.GET,
          key: "authAccount",
        })
        .then((account) => {
          setEmail(account?.email);
          // setPassword(account.password);
        });
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

    // if (rememberLogin) {
    //   persistStorage.asyncSecureStorage({
    //     action: PERSIST_ACTIONS.SET,
    //     key: "authAccount",
    //     rawValue: {
    //       displayName:
    //         auth.currentUser.displayName || route?.params?.account?.name,
    //       premium: false,
    //       uid: auth.currentUser.uid || route?.params?.account?.uid,
    //       email: auth.currentUser.email || route?.params?.account?.email,
    //       emailVerified: auth.currentUser.emailVerified,
    //       photoURL: auth.currentUser.photoURL,
    //     },
    //   });
    // }

    // Login check
    setTimeout(() => {
      switch (true) {
        case !!email && !!password && route.params?.status === "NEW_USER":
          dispatchUserAccount({
            type: REDUCER_ACTIONS.USER_ACCOUNT.FORCE_SET,
            payload: {
              displayName: auth.currentUser.displayName,
              premium: false,
              uid: auth.currentUser.uid,
              email: auth.currentUser.email,
              emailVerified: auth.currentUser.emailVerified,
              photoURL: auth.currentUser.photoURL,
            },
          });
          return navigation.replace(screenList.initialSetupScreen);

        case !!email && !!password:
          dispatchUserAccount({
            type: REDUCER_ACTIONS.USER_ACCOUNT.FORCE_SET,
            payload: {
              displayName: auth.currentUser.displayName,
              premium: false,
              uid: auth.currentUser.uid,
              email: auth.currentUser.email,
              emailVerified: auth.currentUser.emailVerified,
              photoURL: auth.currentUser.photoURL,
            },
          });
          return navigation.replace(screenList.splashScreen);

        case !user:
          // New login
          handleUserLogin({ email, password })
            .then((authAccount) => {
              const account = {
                displayName: authAccount.displayName,
                premium: false,
                uid: authAccount.uid,
                email: authAccount.email,
                emailVerified: authAccount.emailVerified,
                photoURL: authAccount.photoURL,
              };
              dispatchUserAccount({
                type: REDUCER_ACTIONS.USER_ACCOUNT.FORCE_SET,
                payload: account,
              });
              if (rememberLogin) {
                persistStorage.asyncSecureStorage({
                  action: PERSIST_ACTIONS.SET,
                  key: "authAccount",
                  rawValue: account,
                });
              }
              navigation.replace(screenList.splashScreen);
            })
            .catch((error) => {
              // alert(error);
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
              <AnimatedLoginText />
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
                      paddingVertical: 16,
                      fontWeight: "bold",
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {/* // TAG : Button */}
            {showButton && (
              <ButtonPrimary
                style={{ marginVertical: 16 }}
                width={Dimensions.get("window").width - 32}
                label="Login"
                onPress={() => finalCheck()}
              />
            )}
            {/* // TAG : Button */}
            {!showButton && (
              <ButtonDisabled
                style={{ marginVertical: 16 }}
                width={Dimensions.get("window").width - 32}
                label="Login"
              />
            )}
            {/* 
          // TODO : Create a signup screen 
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
            <Loading lottie size={150} />
            {/* <TextPrimary
              label="Logging you in ..."
              style={{ paddingVertical: 16 }}
            /> */}
          </>
        )}
      </ScrollView>
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
