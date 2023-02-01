import { useEffect } from "react";
import { View } from "react-native";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import UserHeaderComponent from "../../../components/UserHeader";
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

const MyGroupsScreen = ({ item, navigation }) => {
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { appSettings, dispatchSettings } = useGlobalAppSettings();
  const { dispatchSortedTransactions } = useGlobalSortedTransactions();
  const { dispatchCategories } = useGlobalCategories();
  const { dispatchLogbooks } = useGlobalLogbooks();
  const { dispatchBudgets } = useGlobalBudgets();

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
      <View
        style={{
          height: "100%",
          backgroundColor: appSettings.theme.style.colors.background,
        }}
      >
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
          </>
        )}
      </View>
    </>
  );
};

export default MyGroupsScreen;
