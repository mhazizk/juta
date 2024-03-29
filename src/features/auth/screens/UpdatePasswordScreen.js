import { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, TouchableOpacity, View } from "react-native";
import updateAccountPassword from "../../../api/firebase/updatePassword";
import { ButtonDisabled, ButtonPrimary } from "../../../components/Button";
import CustomTextInput from "../../../components/CustomTextInput";
import Loading from "../../../components/Loading";
import { TextPrimary } from "../../../components/Text";
import screenList from "../../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import PasswordConditionsChecklist from "../components/PasswordConditionsChecklist";
import passwordCheck from "../model/passwordCheck";
import passwordConditionsList from "../model/passwordConditionsList";

const UpdatePasswordScreen = ({ route, navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const { userAccount } = useGlobalUserAccount();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [showPasswordConditions, setShowPasswordConditions] = useState(false);
  const [passwordConditions, setPasswordConditions] = useState(
    passwordConditionsList
  );
  const [isloading, setIsLoading] = useState(false);
  const inputOldPasswordRef = useRef(null);
  const inputNewPasswordRef = useRef(null);
  const inputConfirmNewPasswordRef = useRef(null);

  useEffect(() => {}, []);

  useEffect(() => {
    if (oldPassword.length >= 6 && !!newPassword) {
      console.log(oldPassword, newPassword);
      passwordCheck({
        email: userAccount.email,
        password: newPassword,
        conditionsList: passwordConditions,
        onAnyUnfulfilledCallback: (newConditions) => {
          setPasswordConditions(newConditions);
          setShowPasswordConditions(true);
          // setTimeout(() => {
          // }, 500);
        },
        onAllFulfilledCallback: (newConditions) => {
          // setTimeout(() => {
          // }, 500);
          setShowPasswordConditions(false);
          setPasswordConditions(newConditions);
        },
      });
    }
    if (showPasswordConditions && !newPassword) {
      setPasswordConditions(passwordConditionsList);
    }
  }, [oldPassword, newPassword]);

  useEffect(() => {
    if (confirmNewPassword.length >= 6 && newPassword === confirmNewPassword) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [confirmNewPassword]);

  return (
    <>
      <CustomScrollView>
        <View
          style={{
            // paddingHorizontal: 16,
            paddingTop: 16,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CustomTextInput
            editable={!isloading}
            inputRef={inputOldPasswordRef}
            inputType="password"
            inputQuery={oldPassword}
            title={!!oldPassword ? "Current password" : null}
            onChange={(text) => {
              setOldPassword(text);
            }}
            placeholder="Current password"
          />
          <CustomTextInput
            editable={!isloading}
            inputRef={inputNewPasswordRef}
            inputType="password"
            inputQuery={newPassword}
            title={!!newPassword ? "New password" : null}
            onChange={(text) => {
              setNewPassword(text);
            }}
            placeholder="New password"
          />
          <CustomTextInput
            editable={!isloading}
            inputRef={inputConfirmNewPasswordRef}
            inputType="password"
            title={!!confirmNewPassword ? "Confirm password" : null}
            inputQuery={confirmNewPassword}
            onChange={(text) => {
              setConfirmNewPassword(text);
            }}
            placeholder="Confirm new password"
          />
          {showPasswordConditions && (
            <PasswordConditionsChecklist conditions={passwordConditions} />
          )}
        </View>
        {!isloading && (
          <>
            {/* // TAG : Button Active */}
            {showButton && (
              <ButtonPrimary
                style={{ marginVertical: 16 }}
                width={Dimensions.get("window").width - 32}
                label="Update password"
                onPress={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    updateAccountPassword(
                      userAccount.email,
                      oldPassword,
                      newPassword
                    )
                      .then(() => {
                        navigation.goBack();
                        setIsLoading(false);
                      })
                      .catch((error) => {
                        setIsLoading(false);
                      });
                  }, 1);
                }}
              />
            )}
            {/* // TAG : Button Disabled */}
            {!showButton && (
              <ButtonDisabled
                style={{ marginVertical: 16 }}
                width={Dimensions.get("window").width - 32}
                label="Update password"
              />
            )}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(screenList.forgotPasswordScreen);
              }}
            >
              <TextPrimary label="Forgot password?" />
            </TouchableOpacity>
          </>
        )}
        {isloading && (
          <View
            style={{
              paddingTop: 16,
            }}
          >
            <Loading />
          </View>
        )}
      </CustomScrollView>
    </>
  );
};

export default UpdatePasswordScreen;
