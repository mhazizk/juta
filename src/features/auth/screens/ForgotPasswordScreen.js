import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import auth from "../../../api/firebase/auth";
import forgotPassword from "../../../api/firebase/forgotPassword";
import { ButtonDisabled, ButtonPrimary } from "../../../components/Button";
import CustomTextInput from "../../../components/CustomTextInput";
import Loading from "../../../components/Loading";
import { TextPrimary } from "../../../components/Text";
import { useGlobalAppSettings } from "../../../reducers/GlobalContext";

const ForgotPasswordScreen = () => {
  const { appSettings } = useGlobalAppSettings();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [resendLinkTimerInSeconds, setResendLinkTimerInSeconds] =
    useState(null);
  const emailInputRef = useRef(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log(JSON.stringify(user));
    });
  }, []);
  useEffect(() => {
    if (email.length > 0 && email.includes("@") && email.includes(".")) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [email]);

  useEffect(() => {
    const timer =
      resendLinkTimerInSeconds > 0 &&
      setInterval(
        () => setResendLinkTimerInSeconds(resendLinkTimerInSeconds - 1),
        1000
      );
    if (resendLinkTimerInSeconds === 0) {
      setShowButton(true);
    }
    return () => clearInterval(timer);
  }, [resendLinkTimerInSeconds]);

  return (
    <ScrollView
      contentContainerStyle={{
        minHeight: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: appSettings.theme.style.colors.background,
      }}
    >
      <View
        style={{
          width: "100%",
          paddingHorizontal: 16,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextPrimary
          label="Forgot Password?"
          style={{
            paddingVertical: 16,
            fontSize: 48,
            fontWeight: "bold",
          }}
        />
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
          editable={!isLoading}
          inputRef={emailInputRef}
          inputType="email"
          inputQuery={email}
          onChange={(text) => {
            setEmail(text);
          }}
          placeholder="Email"
        />
      </View>
      {!isLoading && (
        <>
          {/* // TAG : Button Active */}
          {showButton && (
            <ButtonPrimary
              style={{ marginVertical: 16 }}
              width={Dimensions.get("window").width - 32}
              label="Send reset link"
              onPress={() => {
                setIsLoading(true);
                setTimeout(() => {
                  forgotPassword(email).then(() => {});
                  setIsLoading(false);
                  setResendLinkTimerInSeconds(15);
                  setShowButton(false);
                }, 1);
              }}
            />
          )}
          {/* // TAG : Button Disabled */}
          {!showButton && (
            <ButtonDisabled
              style={{ marginVertical: 16 }}
              width={Dimensions.get("window").width - 32}
              label={
                resendLinkTimerInSeconds > 0
                  ? `Resend link in ${resendLinkTimerInSeconds} seconds`
                  : "Send reset link"
              }
            />
          )}
          {resendLinkTimerInSeconds > 0 && (
            <TextPrimary label="Not getting the email? Try resending the link" />
          )}
        </>
      )}
      {isLoading && (
        <View
          style={{
            paddingTop: 16,
          }}
        >
          <Loading />
        </View>
      )}
    </ScrollView>
  );
};

export default ForgotPasswordScreen;
