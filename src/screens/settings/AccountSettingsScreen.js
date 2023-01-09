import { signOut } from "firebase/auth";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import auth from "../../api/firebase/auth";
import firestore from "../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../api/firebase/firestoreCollectionNames";
import { globalStyles, globalTheme } from "../../assets/themes/globalStyles";
import { ListItem } from "../../components/List";
import SettingsSection from "../../components/List/SettingsSection";
import UserHeaderComponent from "../../components/UserHeader";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalUserAccount,
} from "../../reducers/GlobalContext";
import { ACTIONS } from "../../reducers/GlobalReducer";
import REDUCER_ACTIONS from "../../reducers/reducer.action";

const AccountSettingsScreen = ({ item, navigation }) => {
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { appSettings, dispatchSettings } = useGlobalAppSettings();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (userAccount) {
      setTimeout(async () => {
        firestore.setData(
          FIRESTORE_COLLECTION_NAMES.USERS,
          userAccount.uid,
          userAccount
        );
      }, 1);
    }
  }, [userAccount]);

  return (
    <>
      {userAccount && (
        <View
          style={{
            height: "100%",
            backgroundColor: appSettings.theme.style.colors.background,
          }}
        >
          <UserHeaderComponent />
          {/* <View style={{ backgroundColor: '#fff', padding: 16 }}>
                    <Text style={{ fontSize: 32, color: '#bbb' }}>Profile</Text>
                </View> */}
          <SettingsSection>
            {/* // TAG : Profile */}
            <ListItem
              pressable
              leftLabel="Change Avatar"
              iconLeftName="person"
              iconPack="IonIcons"
              onPress={() => alert("Coming soon")}
            />

            {/* // TAG : Change Display Name */}
            <ListItem
              pressable
              leftLabel="Change Display Name"
              rightLabel={userAccount.displayName}
              iconLeftName="create"
              iconPack="IonIcons"
              onPress={() =>
                navigation.navigate(screenList.modalScreen, {
                  title: "Change Display Name",
                  modalType: "textInput",
                  default: userAccount.displayName,
                  selected: (item) => {
                    dispatchUserAccount({
                      type: REDUCER_ACTIONS.USER_ACCOUNT.DISPLAY_NAME.SET,
                      payload: item,
                    });
                  },
                })
              }
            />
            {/* // TAG : Change Email */}
            <ListItem
              pressable
              leftLabel="Change Email"
              rightLabel={userAccount.email}
              iconLeftName="mail"
              iconPack="IonIcons"
              onPress={() => {}}
            />

            {/* // TAG : Change Password */}
            <ListItem
              pressable
              leftLabel="Change Password"
              iconLeftName="key"
              iconPack="IonIcons"
              onPress={() => alert("Feature in progress ...")}
            />

            {/* // TAG : Premium */}
            <ListItem
              pressable
              leftLabel="Account Type"
              rightLabel={
                userAccount.premium ? "Premium Account" : "Basic Account"
              }
              iconLeftName="checkmark"
              iconPack="IonIcons"
              onPress={() => alert("Feature in progress ...")}
            />
          </SettingsSection>
          <SettingsSection>
            {/* // TAG : Log out */}
            <ListItem
              pressable
              leftLabel="Log out account"
              iconLeftName="log-out-outline"
              iconPack="IonIcons"
              onPress={() =>
                Alert.alert("Log out", "Are you sure you want to log out?", [
                  {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "Yes",
                    onPress: () =>
                      signOut(auth).then(() =>
                        navigation.reset({
                          index: 0,
                          routes: [{ name: screenList.loginScreen }],
                        })
                      ),
                    // style: "default",
                  },
                ])
              }
            />
          </SettingsSection>
        </View>
      )}
    </>
  );
};

export default AccountSettingsScreen;
