import { StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { globalStyles, globalTheme } from "../../assets/themes/globalStyles";
import { ListItem } from "../../components/List";
import UserHeaderComponent from "../../components/UserHeader";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalUserAccount,
} from "../../reducers/GlobalContext";
import { ACTIONS } from "../../reducers/GlobalReducer";

const ProfileSettingsScreen = ({ item, navigation }) => {
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { appSettings, dispatchSettings } = useGlobalAppSettings();

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

          {/* // TAG : Profile */}
          <ListItem
            pressable
            leftLabel="Change Avatar"
            iconLeftName="person"
            iconPack="IonIcons"
            onPress={() => alert("Coming soon")}
          />

          {/* // TAG : Change Nick Name */}
          <ListItem
            pressable
            leftLabel="Change Nick Name"
            rightLabel={userAccount.account.displayName}
            iconLeftName="create"
            iconPack="IonIcons"
            onPress={() =>
              navigation.navigate(screenList.modalScreen, {
                title: "Change Nick Name",
                modalType: "textInput",
                default: userAccount.account.displayName,
                selected: (item) => {
                  dispatchUserAccount({
                    type: ACTIONS.USER_ACCOUNT.NICKNAME.SET,
                    payload: item,
                  });
                },
              })
            }
          />
        </View>
      )}
    </>
  );
};

export default ProfileSettingsScreen;
