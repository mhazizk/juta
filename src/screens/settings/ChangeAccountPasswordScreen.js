import { signOut } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Alert, Dimensions, ScrollView, View } from "react-native";
import auth from "../../api/firebase/auth";
import firestore from "../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../api/firebase/firestoreCollectionNames";
import resetPassword from "../../api/firebase/updatePassword";
import newPassword from "../../api/firebase/updatePassword";
import { ButtonDisabled, ButtonPrimary } from "../../components/Button";
import CheckList from "../../components/CheckList";
import CustomTextInput from "../../components/CustomTextInput";
import { ListItem } from "../../components/List";
import ListSection from "../../components/List/ListSection";
import Loading from "../../components/Loading";
import { TextPrimary } from "../../components/Text";
import UserHeaderComponent from "../../components/UserHeader";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalUserAccount,
} from "../../reducers/GlobalContext";
import REDUCER_ACTIONS from "../../reducers/reducer.action";
import { getDeviceId } from "../../utils";

const ChangeAccountPasswordScreen = ({ item, navigation }) => {
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { appSettings, dispatchSettings } = useGlobalAppSettings();
  const { dispatchSortedTransactions } = useGlobalSortedTransactions();
  const { dispatchCategories } = useGlobalCategories();
  const { dispatchLogbooks } = useGlobalLogbooks();
  const { dispatchBudgets } = useGlobalBudgets();
  const [user, loading, error] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const inputOldPasswordRef = useRef(null);
  const inputNewPasswordRef = useRef(null);
  const [passwordConditions, setPasswordConditions] = useState([
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
  ]);

  useEffect(() => {
    if (userAccount) {
      // setTimeout(async () => {
      //   firestore.setData(
      //     FIRESTORE_COLLECTION_NAMES.USERS,
      //     userAccount.uid,
      //     userAccount
      //   );
      // }, 1);
    }
  }, [userAccount]);

  useEffect(() => {
    passwordRulesCheck({
      oldPassword,
      newPassword,
      passwordConditions,
      setShowPasswordRules: (item) => setShowPasswordRules(item),
      setShowButton: (item) => setShowButton(item),
      setPasswordConditions: (item) => {
        setPasswordConditions(item);
      },
    });
  }, [oldPassword, newPassword]);

  useEffect(() => {}, [showButton]);
  useEffect(() => {}, [isLoading]);

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          minHeight: "100%",
          width: "100%",
          backgroundColor: appSettings.theme.style.colors.background,
          alignItems: "center",
        }}
      >
        {userAccount && !isLoading && (
          <>
            {/* <ListSection> */}
            {/* // TAG : Old Password Input */}
            <View
              style={{
                paddingHorizontal: 16,
              }}
            >
              <CustomTextInput
                inputRef={inputOldPasswordRef}
                inputType="password"
                inputQuery={oldPassword}
                onChange={(text) => {
                  setOldPassword(text);
                }}
                placeholder="Enter old password"
              />
              {/* // TAG : New Password Input */}
              <CustomTextInput
                inputRef={inputNewPasswordRef}
                inputType="password"
                inputQuery={newPassword}
                onChange={(text) => {
                  setNewPassword(text);
                }}
                placeholder="Enter new password"
              />
            </View>
            {/* </ListSection> */}

            {/* // TAG : Password Rules */}
            {showPasswordRules && (
              <>
                <View
                  style={{
                    paddingHorizontal: 16,
                    width: "100%",
                    alignItems: "flex-start",
                  }}
                >
                  <TextPrimary label="Password must contain:" />
                  {passwordConditions.map((condition) => {
                    return (
                      <CheckList
                        viewOnly
                        primaryLabel={condition.label}
                        item={true}
                        singleChecklist
                        selected={condition.checked}
                      />
                    );
                  })}
                </View>
              </>
            )}

            {/* // TAG : Button Active */}
            {showButton && (
              <ButtonPrimary
                style={{ marginVertical: 16 }}
                width={Dimensions.get("window").width - 32}
                label="Update Password"
                onPress={() => {
                  setIsLoading(true);
                  resetPassword
                    .reauthenticate(oldPassword)
                    .then(() => {
                      resetPassword
                        .changePassword(newPassword)
                        .then(() => {
                          alert("Password reset email sent, check your inbox.");
                        })
                        .then(() => {
                          setIsLoading(false);
                        })
                        .catch((error) => {
                          alert(error.message);
                          setIsLoading(false);
                        });
                    })
                    .catch((error) => alert(error.message));
                  setIsLoading(false);
                }}
              />
            )}
            {/* // TAG : Button Disabled */}
            {!showButton && (
              <ButtonDisabled
                style={{ marginVertical: 16 }}
                width={Dimensions.get("window").width - 32}
                label="Update Password"
              />
            )}
          </>
        )}

        {isLoading && (
          <>
            <Loading />
            <TextPrimary label="Updating password..." />
          </>
        )}
      </ScrollView>
    </>
  );
};

export default ChangeAccountPasswordScreen;

const passwordRulesCheck = ({
  oldPassword,
  newPassword,
  passwordConditions,
  setPasswordConditions,
  setShowPasswordRules,
  setShowButton,
}) => {
  if (!newPassword) {
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
    ]);
  }
  if (oldPassword && newPassword) {
    let id1Checked = passwordConditions.find((item) => item.id === 1).checked;
    let id2Checked = passwordConditions.find((item) => item.id === 2).checked;
    let id3Checked = passwordConditions.find((item) => item.id === 3).checked;
    const checkList = [];
    for (const condition of passwordConditions) {
      switch (true) {
        case !checkList.length:
          if (newPassword.length >= 6) {
            id1Checked = true;
          } else {
            id1Checked = false;
          }
          checkList.push(1);
          break;
        case checkList.length === 1:
          if (/\d/.test(newPassword)) {
            id2Checked = true;
          } else {
            id2Checked = false;
          }
          checkList.push(2);
          break;
        case checkList.length === 2:
          if (/[-!$%^&*()_+|~=`{}[:;<>?,.@#\]]/g.test(newPassword)) {
            id3Checked = true;
          } else {
            id3Checked = false;
          }
          checkList.push(3);
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
    ]);
    setShowButton(true);
    const allValue = [id1Checked, id2Checked, id3Checked];
    if (allValue.some((val) => val === false)) {
      setShowButton(false);
      setShowPasswordRules(true);
    } else {
      setShowPasswordRules(false);
    }
  }
};
