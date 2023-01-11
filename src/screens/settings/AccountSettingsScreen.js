import * as Application from "expo-application";
import * as Device from "expo-device";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import auth from "../../api/firebase/auth";
import firestore from "../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../api/firebase/firestoreCollectionNames";
import { colorOfTheYear2023 } from "../../assets/themes/colorOfTheYear2023";
import { globalStyles, globalTheme } from "../../assets/themes/globalStyles";
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
import { ACTIONS } from "../../reducers/GlobalReducer";
import initialCategories from "../../reducers/initial-state/InitialCategories";
import initialLogbooks from "../../reducers/initial-state/InitialLogbooks";
import InitialSortedTransactions from "../../reducers/initial-state/InitialSortedTransactions";
import REDUCER_ACTIONS from "../../reducers/reducer.action";
import { getDeviceId } from "../../utils";

const AccountSettingsScreen = ({ item, navigation }) => {
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { dispatchSortedTransactions } = useGlobalSortedTransactions();
  const { dispatchCategories } = useGlobalCategories();
  const { dispatchLogbooks } = useGlobalLogbooks();
  const { dispatchBudgets } = useGlobalBudgets();
  const [isLoading, setIsLoading] = useState(false);
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
      <ScrollView
        contentContainerStyle={{
          minHeight: "100%",
          backgroundColor: appSettings.theme.style.colors.background,
        }}
      >
        {userAccount && !isLoading && (
          <>
            <UserHeaderComponent />
            {/* <View style={{ backgroundColor: '#fff', padding: 16 }}>
                    <Text style={{ fontSize: 32, color: '#bbb' }}>Profile</Text>
                </View> */}
            <ListSection>
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
                    maxLength: 14,
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
                onPress={() =>
                  navigation.navigate(screenList.changeAccountPasswordScreen)
                }
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
            </ListSection>
            <ListSection>
              {/* // TAG : Active Devices */}
              <ListItem
                pressable
                leftLabel="Active Devices"
                rightLabel={userAccount.devicesLoggedIn?.length + " device(s)"}
                iconLeftName="laptop-outline"
                iconPack="IonIcons"
                onPress={() => navigation.navigate(screenList.devicesScreen)}
              />
            </ListSection>
            <ListSection>
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
                      onPress: async () => {
                        setIsLoading(true);

                        // Get device id
                        const deviceId = await getDeviceId();
                        const removedDeviceIdFromDevicesLoggedIn =
                          userAccount.devicesLoggedIn?.filter(
                            (device) => device.device_id !== deviceId
                          );

                        try {
                          // Update user account
                          await firestore.setData(
                            FIRESTORE_COLLECTION_NAMES.USERS,
                            userAccount.uid,
                            {
                              ...userAccount,
                              devicesLoggedIn:
                                removedDeviceIdFromDevicesLoggedIn,
                            }
                          );
                          signOut(auth).then(() => {
                            dispatchAppSettings({
                              type: REDUCER_ACTIONS.APP_SETTINGS.THEME.SET,
                              payload: { style: colorOfTheYear2023 },
                            });
                            navigation.reset({
                              index: 0,
                              routes: [{ name: screenList.loginScreen }],
                            });
                          });
                        } catch (error) {
                          alert(error);
                          setIsLoading(false);
                        }
                      },
                    },
                  ])
                }
              />
            </ListSection>
          </>
        )}
        {isLoading && (
          <>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: appSettings.theme.style.colors.background,
              }}
            >
              <Loading />
              <TextPrimary label="Logging you out..." />
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
};

export default AccountSettingsScreen;
