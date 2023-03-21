import { signOut } from "firebase/auth";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Alert, View } from "react-native";
import auth from "../../../api/firebase/auth";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import UserHeaderComponent from "../../../components/UserHeader";
import MODAL_TYPE_CONSTANTS from "../../../constants/modalTypeConstants";
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
import CustomScrollView from "../../../shared-components/CustomScrollView";

const MyGroupsScreen = ({ item, navigation }) => {
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { globalTheme } = useGlobalAppSettings();
  const { appSettings, dispatchSettings } = useGlobalAppSettings();
  const { dispatchSortedTransactions } = useGlobalSortedTransactions();
  const { dispatchCategories } = useGlobalCategories();
  const { dispatchLogbooks } = useGlobalLogbooks();
  const { dispatchBudgets } = useGlobalBudgets();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (userAccount) {
      setTimeout(async () => {
        // firestore.setData(
        //   FIRESTORE_COLLECTION_NAMES.USERS,
        //   userAccount.uid,
        //   userAccount
        // );
      }, 1);
    }
  }, [userAccount]);

  return (
    <>
      <CustomScrollView>
        {userAccount && (
          <>
            <UserHeaderComponent />
            {/* <View style={{ backgroundColor: '#fff', padding: 16 }}>
                    <Text style={{ fontSize: 32, color: '#bbb' }}>Profile</Text>
                </View> */}
            <ListSection>
              {/* // TAG : Edit Group */}
              <ListItem
                pressable
                leftLabel="edit group"
                iconLeftName="person"
                iconPack="IonIcons"
                onPress={() => navigation.navigate(screenList.editGroupScreen)}
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
                    modalType: MODAL_TYPE_CONSTANTS.TEXT_INPUT,
                    maxLength: 14,
                    defaultOption: userAccount.displayName,
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
                  userAccount?.subscription?.plan === "premium"
                    ? "Premium Account"
                    : "Basic Account"
                }
                iconLeftName="checkmark"
                iconPack="IonIcons"
                onPress={() => alert("Feature in progress ...")}
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
                      onPress: () =>
                        signOut(auth).then(() => {
                          // dispatchSortedTransactions({
                          //   type: REDUCER_ACTIONS.SORTED_TRANSACTIONS
                          //     .GROUP_SORTED.FORCE_SET,
                          //   payload: InitialSortedTransactions,
                          // });
                          // dispatchCategories({
                          //   type: REDUCER_ACTIONS.CATEGORIES.FORCE_SET,
                          //   payload: initialCategories,
                          // });
                          // dispatchLogbooks({
                          //   type: REDUCER_ACTIONS.LOGBOOKS.FORCE_SET,
                          //   payload: initialLogbooks,
                          // });
                          navigation.reset({
                            index: 0,
                            routes: [{ name: screenList.loginScreen }],
                          });
                        }),
                      // style: "default",
                    },
                  ])
                }
              />
            </ListSection>
          </>
        )}
      </CustomScrollView>
    </>
  );
};

export default MyGroupsScreen;
