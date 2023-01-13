import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
    Alert,
    ScrollView, View
} from "react-native";
import auth from "../../../api/firebase/auth";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import { colorOfTheYear2023 } from "../../../assets/themes/colorOfTheYear2023";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import Loading from "../../../components/Loading";
import { TextPrimary } from "../../../components/Text";
import UserHeaderComponent from "../../../components/UserHeader";
import useFirestoreSubscriptions from "../../../hooks/useFirestoreSubscriptions";
import screenList from "../../../navigations/ScreenList";
import {
    useGlobalAppSettings,
    useGlobalBudgets,
    useGlobalCategories,
    useGlobalLogbooks,
    useGlobalSortedTransactions,
    useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import REDUCER_ACTIONS from "../../../reducers/reducer.action";
import { getDeviceId } from "../../../utils";

const SubscriptionPlanScreen = ({ item, navigation }) => {
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
                  userAccount?.subscription?.plan === 'premium' ? "Premium Account" : "Basic Account"
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
                        if (user) {
                          // Get device id
                          const deviceId = await getDeviceId();
                          const removedDeviceIdFromDevicesLoggedIn =
                            userAccount.devicesLoggedIn?.filter(
                              (device) => device.device_id !== deviceId
                            );

                          // Update user account
                          await firestore
                            .setData(
                              FIRESTORE_COLLECTION_NAMES.USERS,
                              userAccount.uid,
                              {
                                ...userAccount,
                                devicesLoggedIn:
                                  removedDeviceIdFromDevicesLoggedIn,
                              }
                            )
                            .then(() => {
                              // Unsubscribe firestore subscriptions
                              useFirestoreSubscriptions({
                                uid: userAccount.uid,
                                unsubscribeAll: true,
                              });
                              setTimeout(() => {
                                signOut(auth).then(() => {
                                  dispatchAppSettings({
                                    type: REDUCER_ACTIONS.APP_SETTINGS.THEME
                                      .SET,
                                    payload: { style: colorOfTheYear2023 },
                                  });
                                  dispatchUserAccount({
                                    type: REDUCER_ACTIONS.USER_ACCOUNT
                                      .FORCE_SET,
                                    payload: null,
                                  });
                                  setTimeout(() => {
                                    navigation.reset({
                                      index: 0,
                                      routes: [
                                        { name: screenList.loginScreen },
                                      ],
                                    });
                                  }, 500);
                                });
                              }, 1500);
                            });

                          // setTimeout(() => {
                          //   console.log("Unsubscribing firestore from account");
                          // }, 1500);
                          // setTimeout(() => {}, 3000);
                        }

                        // } catch (error) {
                        //   alert(error);
                        //   setIsLoading(false);
                        // }
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

export default SubscriptionPlanScreen;
