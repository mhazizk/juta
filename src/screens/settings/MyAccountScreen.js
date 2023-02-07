import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Alert, ScrollView, View } from "react-native";
import auth from "../../api/firebase/auth";
import firestore from "../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../api/firebase/firestoreCollectionNames";
import { colorOfTheYear2023 } from "../../assets/themes/colorOfTheYear2023/colorOfTheYear2023";
import { ListItem } from "../../components/List";
import ListSection from "../../components/List/ListSection";
import Loading from "../../components/Loading";
import { TextPrimary } from "../../components/Text";
import UserHeaderComponent from "../../components/UserHeader";
import getSubscriptionLimit from "../../features/subscription/logic/getSubscriptionLimit";
import SUBSCRIPTION_LIMIT from "../../features/subscription/model/subscriptionLimit";
import useFirestoreSubscriptions from "../../hooks/useFirestoreSubscriptions";
import screenList from "../../navigations/ScreenList";
import appSettingsFallback from "../../reducers/fallback-state/appSettingsFallback";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../reducers/GlobalContext";
import REDUCER_ACTIONS from "../../reducers/reducer.action";
import CustomScrollView from "../../shared-components/CustomScrollView";
import { getDeviceId } from "../../utils";

const MyAccountScreen = ({ item, navigation }) => {
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { dispatchSortedTransactions } = useGlobalSortedTransactions();
  const { dispatchCategories } = useGlobalCategories();
  const { dispatchLogbooks } = useGlobalLogbooks();
  const { dispatchBudgets } = useGlobalBudgets();
  const [isLoading, setIsLoading] = useState(false);
  const [user, loading, error] = useAuthState(auth);

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

  return (
    <>
      <CustomScrollView>
        {userAccount && !isLoading && (
          <>
            <UserHeaderComponent />
            {/* <View style={{ backgroundColor: '#fff', padding: 16 }}>
                    <Text style={{ fontSize: 32, color: '#bbb' }}>Profile</Text>
                </View> */}
            <ListSection>
              {/* // TAG : Change Profile */}
              <ListItem
                pressable
                leftLabel="Change Profile Picture"
                iconLeftName="person"
                iconPack="IonIcons"
                onPress={() =>
                  navigation.navigate(screenList.myProfilePictureScreen)
                }
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
                    defaultOption: userAccount.displayName,
                    selected: (item) => {
                      const modifiedUserAcount = {
                        ...userAccount,
                        displayName: item,
                        _timestamps: {
                          ...userAccount._timestamps,
                          updated_at: Date.now(),
                          updated_by: userAccount.uid,
                        },
                      };
                      dispatchUserAccount({
                        type: REDUCER_ACTIONS.USER_ACCOUNT.SET_MULTI_ACTIONS,
                        payload: modifiedUserAcount,
                      });
                      setTimeout(async () => {
                        await firestore.setData(
                          FIRESTORE_COLLECTION_NAMES.USERS,
                          userAccount.uid,
                          modifiedUserAcount
                        );
                      }, 5000);
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
                onPress={() => {
                  navigation.navigate(screenList.updateEmailScreen);
                }}
              />

              {/* // TAG : Change Password */}
              <ListItem
                pressable
                leftLabel="Change Password"
                iconLeftName="key"
                iconPack="IonIcons"
                onPress={() =>
                  navigation.navigate(screenList.updatePasswordScreen)
                }
              />
            </ListSection>
            <ListSection>
              {/* // TAG : Premium Subscription */}
              <ListItem
                pressable
                leftLabel="Subscription"
                rightLabel={
                  userAccount?.subscription?.plan === "premium"
                    ? "Premium Account"
                    : "Free Account"
                }
                iconLeftName="ribbon"
                iconPack="IonIcons"
                onPress={() =>
                  navigation.navigate(screenList.mySubscriptionScreen)
                }
              />
              {/* // TAG : Export Data */}
              <ListItem
                pressable
                disabled={
                  !getSubscriptionLimit(
                    userAccount.subscription.plan,
                    SUBSCRIPTION_LIMIT.EXPORT_DATA
                  )
                }
                iconPack="IonIcons"
                iconLeftName="share-outline"
                leftLabel="Export Data"
                onPress={() => {
                  if (
                    getSubscriptionLimit(
                      userAccount.subscription.plan,
                      SUBSCRIPTION_LIMIT.EXPORT_DATA
                    )
                  ) {
                    navigation.navigate(screenList.exportScreen);
                  } else {
                    Alert.alert(
                      "Export Data",
                      "Upgrade to premium to export your data"
                    );
                  }
                }}
              />
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
                              navigation.reset({
                                index: 0,
                                routes: [{ name: screenList.logoutScreen }],
                              });
                            });
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
                backgroundColor: globalTheme.colors.background,
              }}
            >
              <Loading />
              <TextPrimary label="Logging you out..." />
            </View>
          </>
        )}
      </CustomScrollView>
    </>
  );
};

export default MyAccountScreen;
