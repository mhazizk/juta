// TODO : Create a login screen

import {
  View,
  Keyboard,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { TextPrimary } from "../../components/Text";
import { lightTheme } from "../../assets/themes/lightTheme";
import { useGlobalAppSettings } from "../../reducers/GlobalContext";
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
import Footer from "../../components/Footer";
import screenList from "../../navigations/ScreenList";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const SignUpScreen = ({ route, navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [buttonCondition, setButtonCondition] = useState({
    displayName: "no",
    password: "no",
    email: "no",
  });
  const [showButton, setShowButton] = useState(false);
  const [passwordRules, setPasswordConditions] = useState([
    {
      id: 1,
      label: "At least 6 characters",
      checked: false,
    },
    {
      id: 2,
      label: "At least 1 number",
      checked: false,
    },
    {
      id: 3,
      label: "At least 1 special character",
      checked: false,
    },
    {
      id: 4,
      label: "Does not contain your email address or display name",
      checked: false,
    },
  ]);

  useEffect(() => {
    // const keyboardDidShow = Keyboard.addListener("keyboardDidShow", () =>
    //   setIsKeyboardVisible(true)
    // );
    // const keyboardDidHide = Keyboard.addListener("keyboardDidHide", () =>
    //   setIsKeyboardVisible(false)
    // );
    // return () => {
    //   keyboardDidHide.remove();
    //   keyboardDidShow.remove();
    // };
  }, []);

  useEffect(() => {
    if (displayName) {
      setButtonCondition({
        ...buttonCondition,
        displayName: "ok",
      });
    } else {
      setButtonCondition({
        ...buttonCondition,
        displayName: "no",
      });
    }
  }, [displayName]);

  useEffect(() => {
    if (email) {
      setButtonCondition({
        ...buttonCondition,
        email: "ok",
      });
    } else {
      setButtonCondition({
        ...buttonCondition,
        email: "no",
      });
    }
  }, [email]);

  useEffect(() => {
    // console.log(passwordRules);
  }, [passwordRules]);

  useEffect(() => {
    if (
      buttonCondition.displayName === "ok" &&
      buttonCondition.email === "ok" &&
      buttonCondition.password === "ok"
    ) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [buttonCondition]);

  useEffect(() => {
    setTimeout(() => {
      passwordRulesCheck(passwordRules);
    }, 1000);
  }, [password]);

  const inputDisplayNameRef = useRef(null);
  const inputEmailRef = useRef(null);
  const inputPasswordRef = useRef(null);

  const passwordRulesCheck = (conditions) => {
    if (!password) {
      setPasswordConditions([
        {
          id: 1,
          label: "At least 6 characters",
          checked: false,
        },
        {
          id: 2,
          label: "At least 1 number",
          checked: false,
        },
        {
          id: 3,
          label: "At least 1 special character",
          checked: false,
        },
        {
          id: 4,
          label: "Does not contain your email address or display name",
          checked: false,
        },
        {
          id: 5,
          label: "Does not contain generic password",
          checked: false,
        },
      ]);
    }
    if (displayName && email && password) {
      let id1Checked = conditions.find((item) => item.id === 1).checked;
      let id2Checked = conditions.find((item) => item.id === 2).checked;
      let id3Checked = conditions.find((item) => item.id === 3).checked;
      let id4Checked = conditions.find((item) => item.id === 4).checked;
      let id5Checked = conditions.find((item) => item.id === 5).checked;
      const checkList = [];
      for (const condition of conditions) {
        switch (true) {
          case !checkList.length:
            if (password.length >= 6) {
              id1Checked = true;
            } else {
              id1Checked = false;
            }
            checkList.push(1);
            break;
          case checkList.length === 1:
            if (/\d/.test(password)) {
              id2Checked = true;
            } else {
              id2Checked = false;
            }
            checkList.push(2);
            break;
          case checkList.length === 2:
            if (/[-!$%^&*()_+|~=`{}[:;<>?,.@#\]]/g.test(password)) {
              id3Checked = true;
            } else {
              id3Checked = false;
            }
            checkList.push(3);
            break;
          case checkList.length === 3:
            if (
              password.includes(displayName.toLowerCase()) ||
              password.includes(email.toLowerCase())
            ) {
              id4Checked = false;
            } else {
              id4Checked = true;
            }
            checkList.push(4);
            break;

          case checkList.length === 4:
            if (
              // password.includes(displayName.toLowerCase()) ||
              // password.includes(email.toLowerCase()) ||
              password.includes(123456) ||
              password.includes("qwerty")
            ) {
              id5Checked = false;
            } else {
              id5Checked = true;
            }
            checkList.push(5);
            break;

          default:
            break;
        }
      }
      setPasswordConditions([
        {
          id: 1,
          label: "At least 6 characters",
          checked: id1Checked,
        },
        {
          id: 2,
          label: "At least 1 number",
          checked: id2Checked,
        },
        {
          id: 3,
          label: "At least 1 special character",
          checked: id3Checked,
        },
        {
          id: 4,
          label: "Does not contain your email address or display name",
          checked: id4Checked,
        },
        {
          id: 5,
          label: "Does not contain generic password",
          checked: id5Checked,
        },
      ]);
      const allValue = [
        id1Checked,
        id2Checked,
        id3Checked,
        id4Checked,
        id5Checked,
      ];
      if (allValue.some((val) => val === false)) {
        setButtonCondition({
          ...buttonCondition,
          password: "no",
        });
        setShowPasswordRules(true);
      } else {
        setShowPasswordRules(false);
      }
    }
  };

  const finalCheck = (action) => {
    if (!email?.includes("@")) {
      alert("Please fill in email");
      inputEmailRef.current.focus();
      return;
    }

    if (email?.includes("@") && showButton) {
      setScreenLoading(true);
      setTimeout(() => {
        handleUserSignUp({ email, password })
          .then((user) => {
            const newUser = {
              account: {
                displayName: displayName,
                premium: false,
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified,
                photoURL: user.providerData[0].photoURL,
              },
            };
            navigation.replace(screenList.loginScreen, {
              newUser: newUser,
              password: password,
            });
          })
          .catch((error) => {
            alert(error);
            setScreenLoading(false);
          });
      }, 1);
      return;
    }
  };

  return (
    <>
      <ScrollView
        nestedScrollEnabled
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
                paddingTop: showPasswordRules ? "10%" : 0,
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
            {/* // SECTION : Input Section */}
            <View
              style={{
                paddingHorizontal: 16,
                flex: showPasswordRules ? 1 : 0,
                justifyContent: "center",
              }}
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
                  inputQuery={displayName}
                  onChange={(text) => {
                    setDisplayName(text);
                  }}
                  placeholder="Display Name"
                />
                {/* // TAG : Email */}
                <CustomTextInput
                  inputRef={inputEmailRef}
                  inputType="email"
                  inputQuery={email}
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
                  onChange={(text) => {
                    setPassword(text);
                  }}
                  placeholder="Password"
                />
                {/* // TAG : Check Password */}
                <CustomTextInput
                  inputRef={inputPasswordRef}
                  inputType="password"
                  inputQuery={checkPassword}
                  onChange={(text) => {
                    setCheckPassword(text);
                  }}
                  onEndEditing={() => {
                    switch (true) {
                      case password &&
                        checkPassword &&
                        checkPassword === password:
                        return setButtonCondition({
                          ...buttonCondition,
                          password: "ok",
                        });
                      case password &&
                        checkPassword &&
                        checkPassword !== password:
                        setButtonCondition({
                          ...buttonCondition,
                          password: "no",
                        });
                        // alert("Password don't match. Please try again");
                        return;
                      default:
                        return;
                    }
                  }}
                  placeholder="Check Password"
                />
              </View>
              {showPasswordRules && (
                <PasswordRules conditions={passwordRules} />
              )}
            </View>
            {/* //SECTION : Footer */}
            {/* // TODO : Terms and condition hidden */}
            {/* <View
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
                  primaryLabel="I accept all Terms and Conditions"
                  selected={agreeTerms}
                  onPress={() => {
                    setAgreeTerms(!agreeTerms);
                  }}
                />
              </View>
              <TouchableOpacity
                style={
                  {
                    // flex: 1,
                  }
                }
              >
                <View
                  style={{
                    alignItems: "flex-end",
                    paddingRight: 16,
                    //   flex: 1,
                  }}
                >
                  <TextPrimary
                    label="Terms and Conditions"
                    style={{
                      paddingVertical: 16,
                      fontWeight: "bold",
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View> */}
            {/* // TAG : Button Active */}
            {showButton && !showPasswordRules && (
              <ButtonPrimary
                style={{ marginVertical: 16 }}
                width={Dimensions.get("window").width - 32}
                label="Sign up"
                onPress={() => {
                  finalCheck();
                }}
              />
            )}
            {/* // TAG : Button Disabled */}
            {(!showButton || showPasswordRules) && (
              <ButtonDisabled
                style={{ marginVertical: 16 }}
                width={Dimensions.get("window").width - 32}
                label="Sign up"
              />
            )}
            {/* 
          // TODO : Create a signup screen 
           */}
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
                  label="Already have an account ?"
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
            <Loading lottie size={56} />
            <TextPrimary
              label="Signing you up ..."
              style={{ paddingVertical: 16 }}
            />
          </>
        )}
      </ScrollView>
      {/* {!isKeyboardVisible && <Footer />} */}
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

const PasswordRules = ({ conditions }) => {
  return (
    <>
      {conditions && (
        <View
          style={{
            alignItems: "flex-start",
            width: "100%",
            paddingHorizontal: 10,
            // flex: 1,
            // maxHeight: 140,
          }}
        >
          <TextPrimary label="Password Rules" />
          <CheckList
            viewOnly
            primaryLabel={conditions[0].label}
            item={true}
            singleChecklist
            selected={conditions[0].checked}
          />
          <CheckList
            viewOnly
            primaryLabel={conditions[1].label}
            item={true}
            singleChecklist
            selected={conditions[1].checked}
          />
          <CheckList
            viewOnly
            primaryLabel={conditions[2].label}
            item={true}
            singleChecklist
            selected={conditions[2].checked}
          />
          <CheckList
            viewOnly
            primaryLabel={conditions[3].label}
            item={true}
            singleChecklist
            selected={conditions[3].checked}
          />
          <CheckList
            viewOnly
            primaryLabel={conditions[4].label}
            item={true}
            singleChecklist
            selected={conditions[4].checked}
          />
        </View>
      )}
    </>
  );
  // return (
  //   <>
  //     <View
  //       style={{
  //         alignItems: "flex-start",
  //         maxHeight: 140,
  //       }}
  //     >
  //       <TextPrimary label="Password Rules" />
  //       <FlatList
  //         nestedScrollEnabled
  //         data={conditions}
  //         keyExtractor={(item) => item.id}
  //         renderItem={({ item }) => (
  //           <CheckList
  //             viewOnly
  //             primaryLabel={item.label}
  //             item={true}
  //             singleChecklist
  //             selected={item.checked}
  //           />
  //         )}
  //       />
  //     </View>
  //   </>
  // );
};

export default SignUpScreen;
