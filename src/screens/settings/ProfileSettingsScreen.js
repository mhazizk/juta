import { StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  globalStyles,
  globalTheme
} from "../../assets/themes/globalStyles";
import { ListItem } from "../../components/List";
import UserHeaderComponent from "../../components/UserHeader";
import {
  useGlobalAppSettings,
  useGlobalUserAccount
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

          {/* // ! Profile */}
          <ListItem
            pressable
            leftLabel="Change Avatar"
            iconLeftName="person"
            iconPack="IonIcons"
            onPress={() => alert("Coming soon")}
          />

          {/* // ! Change Nick Name */}
          <ListItem
            pressable
            leftLabel="Change Nick Name"
            rightLabel={userAccount.profile.nickname}
            iconLeftName="create"
            iconPack="IonIcons"
            onPress={() =>
              navigation.navigate("Modal Screen", {
                title: "Change Nick Name",
                modalType: "textInput",
                default: userAccount.profile.nickname,
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
