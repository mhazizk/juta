import { useEffect, useRef, useState } from "react";
import { View, ScrollView, Dimensions } from "react-native";
import auth from "../../../api/firebase/auth";
import changeEmail from "../../../api/firebase/changeEmail";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import forgotPassword from "../../../api/firebase/forgotPassword";
import { ButtonDisabled, ButtonPrimary } from "../../../components/Button";
import CustomTextInput from "../../../components/CustomTextInput";
import Loading from "../../../components/Loading";
import { TextPrimary } from "../../../components/Text";
import screenList from "../../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import REDUCER_ACTIONS from "../../../reducers/reducer.action";
import CustomScrollView from "../../../shared-components/CustomScrollView";

const UpdateEmailScreen = ({ navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  useEffect(() => {}, []);
  useEffect(() => {
    if (
      email.length > 0 &&
      email.includes("@") &&
      email.includes(".") &&
      email !== userAccount.email &&
      password.length >= 6
    ) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [email, password]);

  return (
    <CustomScrollView>
      {/* <View
        style={{
          width: "100%",
          // paddingHorizontal: 16,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextPrimary
          label="Update Email"
          style={{
            paddingVertical: 16,
            fontSize: 48,
            fontWeight: "bold",
          }}
        />
      </View> */}
      <View
        style={{
          // paddingHorizontal: 16,
          paddingVertical: 0,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CustomTextInput
          editable={false}
          inputRef={passwordInputRef}
          title="Current email"
          inputType="email"
          inputQuery={userAccount.email}
          onChange={(text) => {
            setPassword(text);
          }}
          placeholder="Current password"
        />
        <CustomTextInput
          editable={!isLoading}
          inputRef={emailInputRef}
          title={!!email ? "New email" : null}
          inputType="email"
          inputQuery={email}
          onChange={(text) => {
            setEmail(text);
          }}
          placeholder="New email"
        />
        <CustomTextInput
          editable={!isLoading}
          inputRef={passwordInputRef}
          title={!!password ? "Current password" : null}
          inputType="password"
          inputQuery={password}
          onChange={(text) => {
            setPassword(text);
          }}
          placeholder="Current password"
        />
      </View>
      {!isLoading && (
        <>
          {/* // TAG : Button Active */}
          {showButton && (
            <ButtonPrimary
              style={{ marginVertical: 16 }}
              width={Dimensions.get("window").width - 32}
              label="Update email"
              onPress={() => {
                setIsLoading(true);
                setTimeout(() => {
                  changeEmail(userAccount.email, email, password)
                    .then(() => {
                      const updatedUserAccount = {
                        ...userAccount,
                        email: email,
                        _timestamps: {
                          ...userAccount._timestamps,
                          updated_at: Date.now(),
                          updated_by: userAccount.uid,
                        },
                      };
                      setIsLoading(false);
                      setShowButton(false);
                      console.log("here 99");
                      navigation.reset({
                        index: 0,
                        routes: [
                          {
                            name: screenList.emailVerificationScreen,
                            params: {
                              fromScreen: screenList.updateEmailScreen,
                              userAccountWithNewEmail: updatedUserAccount,
                            },
                          },
                        ],
                      });
                    })
                    .catch((error) => {
                      setIsLoading(false);
                      setShowButton(false);
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
              label="Update email"
            />
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
    </CustomScrollView>
  );
};

export default UpdateEmailScreen;
