import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableNativeFeedback,
  ScrollView,
  TouchableOpacity,
  AppState,
} from "react-native";
import auth from "../../api/firebase/auth";
import authStateDidChange from "../../api/firebase/getAuthState";
import sendEmailToVerify from "../../api/firebase/sendEmailToVerify";
import { ButtonPrimary } from "../../components/Button";
import CustomTextInput from "../../components/CustomTextInput";
import { TextPrimary, TextSecondary } from "../../components/Text";
import screenList from "../../navigations/ScreenList";
import LottieView from "lottie-react-native";
import {
  useGlobalAppSettings,
  useGlobalUserAccount,
} from "../../reducers/GlobalContext";
import { useIsFocused } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth/react-native";
import firestore from "../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../api/firebase/firestoreCollectionNames";
import REDUCER_ACTIONS from "../../reducers/reducer.action";

const EmailVerificationScreen = ({ navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [loginTimerInSeconds, setLoginTimerInSeconds] = useState(null);
  const [resendLinkTimerInSeconds, setResendLinkTimerInSeconds] =
    useState(null);
  const [showResendEmailLink, setShowResendEmailLink] = useState(false);
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    sendEmailToVerify();
    setResendLinkTimerInSeconds(15);
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        auth.currentUser.reload().then(async () => {
          if (auth.currentUser.emailVerified) {
            setIsEmailVerified(true);
            setLoginTimerInSeconds(5);
            const account = await firestore.getOneDoc(
              FIRESTORE_COLLECTION_NAMES.USERS,
              auth.currentUser.uid
            );
            const verifiedAccount = {
              ...account,
              emailVerified: true,
              _timestamps: {
                ...account._timestamps,
                updated_at: Date.now(),
                updated_by: auth.currentUser.uid,
              },
            };
            await firestore.setData(
              FIRESTORE_COLLECTION_NAMES.USERS,
              auth.currentUser.uid,
              verifiedAccount
            );
            dispatchUserAccount({
              type: REDUCER_ACTIONS.USER_ACCOUNT.FORCE_SET,
              payload: verifiedAccount,
            });
          }
        });
        console.log("App has come to the foreground!");
        // console.log(appState.current);
      }
      appState.current = nextAppState;
      console.log(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (isEmailVerified) {
      console.log("Email verified");
    }
  }, [isEmailVerified]);

  useEffect(() => {
    const timer =
      loginTimerInSeconds > 0 &&
      setInterval(() => setLoginTimerInSeconds(loginTimerInSeconds - 1), 1000);
    if (loginTimerInSeconds === 0) {
      navigation.navigate(screenList.splashScreen, {
        redirect: screenList.initialSetupScreen,
      });
    }
    return () => clearInterval(timer);
  }, [loginTimerInSeconds]);

  useEffect(() => {
    const timer =
      resendLinkTimerInSeconds > 0 &&
      setInterval(
        () => setResendLinkTimerInSeconds(resendLinkTimerInSeconds - 1),
        1000
      );
    if (resendLinkTimerInSeconds === 0) {
      setShowResendEmailLink(true);
    }
    return () => clearInterval(timer);
  }, [resendLinkTimerInSeconds]);

  return (
    <ScrollView
      contentContainerStyle={{
        minHeight: "100%",
        backgroundColor: appSettings.theme.style.colors.background,
        alignItems: "flex-start",
        justifyContent: "center",
        paddingHorizontal: 16,
      }}
    >
      <TextPrimary
        label="Email Verification"
        style={{
          alignSelf: "center",
          // paddingVertical: 32,
          fontSize: 36,
          fontWeight: "bold",
        }}
      />
      {isEmailVerified && (
        <>
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LottieView
              autoPlay
              resizeMode="contain"
              //   ref={animation}
              source={require("../../assets/animation/checkmark-confetti.json")}
              style={{
                overflow: "visible",
                width: 150,
                height: 150,
              }}
            />

            <TextPrimary
              label="Your email has been verified."
              style={{
                paddingBottom: 8,
              }}
            />
            <TextPrimary
              label={`Logging in to your account in ${loginTimerInSeconds} seconds`}
            />
          </View>
        </>
      )}
      {!isEmailVerified && (
        <>
          <TextPrimary
            label="Open your email and click the link to verify your email address"
            style={{
              paddingTop: 32,
              paddingBottom: 16,
            }}
          />
          <TextPrimary
            label="If you don't see the email, check other places it might be, like your junk, spam, social, or other folders"
            style={{
              paddingBottom: 32,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
            }}
          >
            <TextPrimary label="Don't get the email? " />
            {showResendEmailLink && (
              <TouchableOpacity
                onPress={() => {
                  // sendEmailToVerify();
                  setShowResendEmailLink(false);
                  setResendLinkTimerInSeconds(15);
                }}
              >
                <TextPrimary
                  label="Resend Email"
                  style={{
                    fontWeight: "bold",
                  }}
                />
              </TouchableOpacity>
            )}
            {!showResendEmailLink && (
              <TextPrimary
                label={`Resend email in ${resendLinkTimerInSeconds} seconds`}
                style={{
                  fontWeight: "bold",
                }}
              />
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default EmailVerificationScreen;
