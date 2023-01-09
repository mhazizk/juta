import { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { ButtonDisabled, ButtonPrimary } from "../../components/Button";
import CustomTextInput from "../../components/CustomTextInput";
import { TextPrimary } from "../../components/Text";
import { useGlobalAppSettings } from "../../reducers/GlobalContext";

const ForgotPasswordScreen = ({ route, navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const [email, setEmail] = useState("");
  const [showButton, setShowButton] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {}, []);

  useEffect(() => {
    if (email.includes("@")) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [email]);

  const resetPassword = (email) => {};

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
        <View
          style={{
            width: "100%",
            paddingHorizontal: 16,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextPrimary
            label="Forgot Password ?"
            style={{
              paddingVertical: 16,
              fontSize: 48,
              fontWeight: "bold",
            }}
          />
          <TextPrimary
            label="Type your email address below to send a reset password link"
            style={{
              paddingVertical: 16,
              // fontSize: 48,
              // fontWeight: "bold",
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
            inputRef={inputRef}
            inputType="email"
            inputQuery={email}
            onChange={(text) => {
              setEmail(text);
            }}
            placeholder="Email"
          />
        </View>
        {/* // TAG : Button */}
        {showButton && (
          <ButtonPrimary
            style={{ marginVertical: 16 }}
            width={Dimensions.get("window").width - 32}
            label="Reset Password"
            onPress={() => resetPassword(email)}
          />
        )}
        {/* // TAG : Button */}
        {!showButton && (
          <ButtonDisabled
            style={{ marginVertical: 16 }}
            width={Dimensions.get("window").width - 32}
            label="Reset Password"
          />
        )}
      </ScrollView>
    </>
  );
};

export default ForgotPasswordScreen;
