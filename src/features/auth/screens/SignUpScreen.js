import { View, Dimensions, TouchableOpacity, Alert } from "react-native";
import { TextPrimary } from "../../../components/Text";
import {
  useExpoPushToken,
  useGlobalAppSettings,
  useGlobalCurrencyRates,
  useGlobalFeatureSwitch,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import { ButtonDisabled, ButtonPrimary } from "../../../components/Button";
import CustomTextInput from "../../../components/CustomTextInput";
import { useEffect, useRef, useState } from "react";
import handleUserSignUp from "../../../utils/handleUserSignUp";
import CheckList from "../../../components/CheckList";
import Loading from "../../../components/Loading";
import LottieView from "lottie-react-native";
import AnimatedLoginText from "../components/AnimatedLoginText";
import screenList from "../../../navigations/ScreenList";
import handleUserUpdateProfile from "../../../utils/handleUserUpdateProfile";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import userAccountModel from "../../../model/userAccountModel";
import passwordConditionsList from "../model/passwordConditionsList";
import PasswordConditionsChecklist from "../components/PasswordConditionsChecklist";
import passwordCheck from "../model/passwordCheck";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../api/firebase/auth";
import REDUCER_ACTIONS from "../../../reducers/reducer.action";
import appSettingsFallback from "../../../reducers/fallback-state/appSettingsFallback";
import getSecretFromCloudFunctions from "../../../api/firebase/getSecretFromCloudFunctions";
import SECRET_KEYS from "../../../constants/secretManager";
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import LoopingHeroIcon from "../components/LoopingHeroIcon";

const SignUpScreen = ({ route, navigation }) => {
  const { expoPushToken, setExpoPushToken } = useExpoPushToken();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { dispatchGlobalFeatureSwitch } = useGlobalFeatureSwitch();
  const { globalCurrencyRates, dispatchGlobalCurrencyRates } =
    useGlobalCurrencyRates();
  const { dispatchUserAccount } = useGlobalUserAccount();
  // const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordConditionsChecklist, setShowPasswordConditionsChecklist] =
    useState(false);
  const [showButton, setShowButton] = useState(false);
  const [passwordConditions, setPasswordConditions] = useState(
    passwordConditionsList
  );
  const [user, loading, error] = useAuthState(auth);
  const [activeIconName, setActiveIconName] = useState("fast-food");

  const heightView = useSharedValue(0);
  const animatedHeightStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(heightView.value, 500),
    };
  });

  useEffect(() => {}, []);

  useEffect(() => {
    const isDisplayNameValid = displayName.length > 0;
    const isEmailValid = email.includes("@") && email.includes(".");
    const isPasswordValid = passwordConditions.every((item) => {
      return item.checked === true;
    });
    const isConfirmedPasswordValid = password === confirmPassword;
    const isAllowedToSignup =
      isDisplayNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfirmedPasswordValid &&
      agreeTerms;
    switch (true) {
      case isAllowedToSignup:
        setShowButton(true);
        break;

      default:
        setShowButton(false);
        break;
    }
  }, [displayName, email, confirmPassword, passwordConditions, agreeTerms]);

  useEffect(() => {
    if (password.length > 0) {
      setTimeout(() => {
        // passwordRulesCheck(passwordConditions);
        passwordCheck({
          email,
          password,
          conditionsList: passwordConditions,
          onAnyUnfulfilledCallback: (newConditions) => {
            setPasswordConditions(newConditions);
            setShowPasswordConditionsChecklist(true);
          },
          onAllFulfilledCallback: (newConditions) => {
            setShowPasswordConditionsChecklist(false);
            setPasswordConditions(newConditions);
          },
        });
      }, 1);
    }
  }, [password]);

  const inputDisplayNameRef = useRef(null);
  const inputEmailRef = useRef(null);
  const inputPasswordRef = useRef(null);
  const inputConfirmPasswordRef = useRef(null);

  const handleNewAccount = (user) => {
    const account = userAccountModel({
      displayName: displayName,
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      photoURL: user.photoURL,
    });

    const newAppSettings = {
      ...appSettingsFallback,
      uid: account.uid,
      _timestamps: {
        ...appSettingsFallback._timestamps,
        created_by: account.uid,
        updated_by: account.uid,
        updated_at: Date.now(),
      },
    };

    const newGlobalCurrencyRates = {
      ...globalCurrencyRates,
      _timestamps: {
        ...globalCurrencyRates._timestamps,
        created_by: account.uid,
        updated_by: account.uid,
        updated_at: Date.now(),
      },
    };

    dispatchAppSettings({
      type: REDUCER_ACTIONS.APP_SETTINGS.FORCE_SET,
      payload: newAppSettings,
    });

    dispatchUserAccount({
      type: REDUCER_ACTIONS.USER_ACCOUNT.FORCE_SET,
      payload: account,
    });
    dispatchGlobalCurrencyRates({
      type: REDUCER_ACTIONS.CURRENCY_RATES.FORCE_SET,
      payload: newGlobalCurrencyRates,
    });

    setTimeout(async () => {
      await firestore.setData(
        FIRESTORE_COLLECTION_NAMES.USERS,
        account.uid,
        account
      );
      await firestore.setData(
        FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
        account.uid,
        newAppSettings
      );
      await firestore.setData(
        FIRESTORE_COLLECTION_NAMES.CURRENCY_RATES,
        account.uid,
        newGlobalCurrencyRates
      );
      // await postLogSnagEvent(
      //   account.displayName,
      //   LOGSNAG_EVENT_TYPES.USER_SIGNUP
      // );
      await handleUserUpdateProfile({
        displayName,
        photoURL: null,
      }).catch((error) => {
        alert(error);
        setScreenLoading(false);
      });
    }, 500);
    setTimeout(() => {
      navigation.replace(screenList.emailVerificationScreen, {
        fromScreen: screenList.signUpScreen,
      });
    }, 1500);
  };

  const finalCheck = (action) => {
    if (!email?.includes("@")) {
      alert("Please fill in email");
      inputEmailRef.current.focus();
      return;
    }

    if (email?.includes("@") && showButton) {
      Alert.alert(
        "Sign up",
        `Are you sure you want to sign up with this email?\n${email}`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              setScreenLoading(true);
              setTimeout(() => {
                handleUserSignUp({ email, password, displayName })
                  .then((user) => {
                    const collection = getSecretFromCloudFunctions(
                      SECRET_KEYS.FEATURE_SWITCH_COLLECTION_NAME
                    );
                    const doc = getSecretFromCloudFunctions(
                      SECRET_KEYS.FEATURE_SWITCH_DOCUMENT_ID
                    );
                    Promise.all([collection, doc]).then((values) => {
                      const collectionName = values[0];
                      const documentId = values[1];
                      firestore
                        .getOneDoc(collectionName, documentId)
                        .then((data) => {
                          dispatchGlobalFeatureSwitch({
                            type: REDUCER_ACTIONS.FEATURE_SWITCH.FORCE_SET,
                            payload: data,
                          });
                        })
                        .catch((error) => {});
                    });
                    handleNewAccount(user);
                  })
                  .catch((error) => {
                    // alert(error);
                    switch (error.code) {
                      case "auth/email-already-in-use":
                        // if (user.email === email) {
                        //   handleNewAccount(user);
                        // }
                        break;
                      default:
                        break;
                    }
                    setScreenLoading(false);
                  });
              }, 1);
            },
          },
        ]
      );

      return;
    }
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
            <LoopingHeroIcon activeIconName={null} />
            <View
              style={{
                width: "100%",
                paddingTop: showPasswordConditionsChecklist ? "10%" : 0,
                // paddingHorizontal: 16,
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
              <AnimatedLoginText
                onScrollEnd={(iconName) => setActiveIconName(iconName)}
              />
            </View>
            {/* // SECTION : Input Section */}
            <Animated.View
              onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                heightView.value = height;
              }}
              style={[
                {
                  // paddingHorizontal: 16,
                  // flex: showPasswordConditionsChecklist ? 0 : 0,
                  justifyContent: "center",
                },
                // animatedHeightStyle,
              ]}
            >
              <View
                style={{
                  // paddingHorizontal: 16,
                  paddingVertical: 0,
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* // TAG : Display Name */}
                <CustomTextInput
                  inputRef={inputDisplayNameRef}
                  inputType="displayName"
                  title={!!displayName ? "Display name" : null}
                  inputQuery={displayName}
                  onChange={(text) => {
                    setDisplayName(text);
                  }}
                  placeholder="Display name"
                />
                {/* // TAG : Email */}
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
                {/* // TAG : Password */}
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
                {/* // TAG : Confirm Password */}
                <CustomTextInput
                  inputRef={inputConfirmPasswordRef}
                  inputType="password"
                  inputQuery={confirmPassword}
                  title={!!confirmPassword ? "Confirm password" : null}
                  onChange={(text) => {
                    setConfirmPassword(text);
                  }}
                  onEndEditing={() => {
                    switch (true) {
                      case password &&
                        confirmPassword &&
                        confirmPassword === password:
                        break;
                      case password &&
                        confirmPassword &&
                        confirmPassword !== password:
                        break;
                      default:
                        return;
                    }
                  }}
                  placeholder="Check Password"
                />
              </View>
              {showPasswordConditionsChecklist && (
                <PasswordConditionsChecklist conditions={passwordConditions} />
              )}
            </Animated.View>
            {/* //SECTION : Terms of Service and Privacy Policy */}
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 16,
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                width: "100%",
                // flexWrap: "wrap",
              }}
            >
              <CheckList
                pressable
                checkboxPlacement="left"
                singleChecklist
                marginRight={0}
                item={true}
                selected={agreeTerms}
                onPress={() => {
                  setAgreeTerms(!agreeTerms);
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  paddingVertical: 0,
                  marginVertical: 0,
                  width: "100%",
                  flex: 1,
                }}
              >
                <TextPrimary label="I accept " />
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(screenList.termsOfServiceScreen);
                  }}
                >
                  <TextPrimary
                    label="Terms of Service"
                    style={{
                      fontWeight: "bold",
                    }}
                  />
                </TouchableOpacity>
                <TextPrimary label=" and " />
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(screenList.privacyPolicyScreen);
                  }}
                  style={{
                    flexWrap: "wrap",
                    flexDirection: "row",
                  }}
                >
                  <TextPrimary
                    label="Privacy Policy"
                    style={{
                      paddingTop: 4,
                      fontWeight: "bold",
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* // TAG : Button Active */}
            {showButton && (
              <ButtonPrimary
                style={{ marginVertical: 8 }}
                width={Dimensions.get("window").width - 32}
                label="Sign up"
                onPress={() => {
                  finalCheck();
                }}
              />
            )}
            {/* // TAG : Button Disabled */}
            {!showButton && (
              <ButtonDisabled
                style={{ marginVertical: 8 }}
                width={Dimensions.get("window").width - 32}
                label="Sign up"
              />
            )}
            {/* // TAG : Log In Route */}
            <TouchableOpacity
              onPress={() => {
                navigation.replace(screenList.loginScreen);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <TextPrimary
                  label="Already have an account?"
                  style={{
                    paddingVertical: 16,
                  }}
                />
                <TextPrimary
                  label="Log in"
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
            {/* <Loading lottie size={56} /> */}
            <TextPrimary
              label="Signing you up ..."
              style={{ paddingVertical: 16 }}
            />
          </>
        )}
      </CustomScrollView>
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

export default SignUpScreen;
