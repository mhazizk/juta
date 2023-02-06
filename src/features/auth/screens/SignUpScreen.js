// TODO : Create a login screen

import { View, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import { TextPrimary } from "../../../components/Text";
import { useGlobalAppSettings } from "../../../reducers/GlobalContext";
import { ButtonDisabled, ButtonPrimary } from "../../../components/Button";
import CustomTextInput from "../../../components/CustomTextInput";
import { useEffect, useRef, useState } from "react";
import handleUserSignUp from "../../../utils/HandleUserSignUp";
import CheckList from "../../../components/CheckList";
import Loading from "../../../components/Loading";
import LottieView from "lottie-react-native";
import AnimatedLoginText from "../../../components/AnimatedLoginText";
import screenList from "../../../navigations/ScreenList";
import handleUserUpdateProfile from "../../../utils/HandleUserUpdateProfile";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import userAccountModel from "../../../model/userAccountModel";
import LOGSNAG_EVENT_TYPES from "../../../api/logsnag/logSnagEventTypes";
import passwordConditionsList from "../model/passwordConditionsList";
import PasswordConditionsChecklist from "../components/PasswordConditionsChecklist";

const SignUpScreen = ({ route, navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  // const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordConditionsChecklist, setShowPasswordConditionsChecklist] =
    useState(false);
  const [buttonCondition, setButtonCondition] = useState({
    displayName: "no",
    password: "no",
    email: "no",
  });
  const [showButton, setShowButton] = useState(false);
  const [passwordConditions, setPasswordConditions] = useState(
    passwordConditionsList
  );

  useEffect(() => {}, []);

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
  }, [passwordConditions]);

  useEffect(() => {
    if (
      buttonCondition.displayName === "ok" &&
      buttonCondition.email === "ok" &&
      buttonCondition.password === "ok" &&
      agreeTerms
    ) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [buttonCondition, agreeTerms]);

  useEffect(() => {
    setTimeout(() => {
      passwordRulesCheck(passwordConditions);
    }, 1);
  }, [password]);

  const inputDisplayNameRef = useRef(null);
  const inputEmailRef = useRef(null);
  const inputPasswordRef = useRef(null);
  const inputConfirmPasswordRef = useRef(null);

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
        setShowPasswordConditionsChecklist(true);
      } else {
        setShowPasswordConditionsChecklist(false);
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
        handleUserSignUp({ email, password, displayName })
          .then((user) => {
            const account = userAccountModel({
              displayName: displayName,
              uid: user.uid,
              email: user.email,
              emailVerified: user.emailVerified,
              photoURL: user.photoURL,
            });

            setTimeout(async () => {
              await firestore.setData(
                FIRESTORE_COLLECTION_NAMES.USERS,
                account.uid,
                account
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
            }, 1);
            setTimeout(() => {
              navigation.replace(screenList.emailVerificationScreen, {
                fromScreen: screenList.signUpScreen,
              });
            }, 1000);
          })
          .catch((error) => {
            // alert(error);
            console.log(error);
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
                paddingTop: showPasswordConditionsChecklist ? "10%" : 0,
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
                flex: showPasswordConditionsChecklist ? 1 : 0,
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
                        return setButtonCondition({
                          ...buttonCondition,
                          password: "ok",
                        });
                      case password &&
                        confirmPassword &&
                        confirmPassword !== password:
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
              {showPasswordConditionsChecklist && (
                <PasswordConditionsChecklist conditions={passwordConditions} />
              )}
            </View>
            {/* //SECTION : Terms of Service and Privacy Policy */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "100%",
              }}
            >
              <CheckList
                pressable
                checkboxPlacement="left"
                singleChecklist
                marginRight={0}
                item={true}
                // primaryLabel="I accept all Terms of Services and Privacy Policy"
                selected={agreeTerms}
                onPress={() => {
                  setAgreeTerms(!agreeTerms);
                }}
              />
              <TextPrimary label="I accept all" />
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(screenList.termsOfServiceScreen);
                }}
              >
                <TextPrimary
                  label="Terms of Service"
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 4,
                    fontWeight: "bold",
                  }}
                />
              </TouchableOpacity>
              <TextPrimary label="and" />
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(screenList.privacyPolicyScreen);
                }}
              >
                <TextPrimary
                  label="Privacy Policy"
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 4,
                    fontWeight: "bold",
                  }}
                />
              </TouchableOpacity>
            </View>
            {/* // TAG : Button Active */}
            {showButton && !showPasswordConditionsChecklist && (
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
            {(!showButton || showPasswordConditionsChecklist) && (
              <ButtonDisabled
                style={{ marginVertical: 16 }}
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
