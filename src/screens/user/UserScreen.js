import {
  Image,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { ListItem } from "../../components/List";
import SettingsSection from "../../components/List/SettingsSection";
import UserHeaderComponent from "../../components/UserHeader";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
} from "../../reducers/GlobalContext";

const UserScreen = ({ navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();

  return (
    <>
      <View
        style={{
          height: "100%",
          backgroundColor: appSettings.theme.style.colors.background,
        }}
      >
        <UserHeaderComponent />
        <SettingsSection>
          {/* // TAG : My Profile */}
          <ListItem
            pressable
            leftLabel="My Account"
            iconLeftName="person"
            iconPack="IonIcons"
            onPress={() =>
              navigation.navigate(screenList.accountSettingsScreen)
            }
          />
          {/* // TAG : My Logbooks */}
          <ListItem
            pressable
            leftLabel="My Logbooks"
            rightLabel={`${logbooks?.logbooks?.length} logbook(s)`}
            iconLeftName="book"
            iconPack="IonIcons"
            onPress={() => navigation.navigate(screenList.myLogbooksScreen)}
          />
          {/* // TAG : My Categories */}
          <ListItem
            pressable
            leftLabel="My Categories"
            rightLabel={`${
              categories?.categories.expense?.length +
              categories?.categories.income?.length
            } categories`}
            iconLeftName="pricetags"
            iconPack="IonIcons"
            onPress={() => navigation.navigate(screenList.myCategoriesScreen)}
          />
          {/* // TAG : My Budget */}
          <ListItem
            pressable
            leftLabel="My Budgets"
            // rightLabel={`${logbooks?.logbooks?.length} logbook(s)`}
            iconLeftName="piggy-bank"
            iconPack="FontAwesome5"
            onPress={() => navigation.navigate(screenList.myBudgetsScreen)}
          />
        </SettingsSection>
        <SettingsSection>
          {/* // TAG : Settings */}
          <ListItem
            pressable
            leftLabel="Settings"
            iconLeftName="build"
            iconPack="IonIcons"
            onPress={() => navigation.navigate(screenList.settingsScreen)}
          />
          {/* // TAG : About */}
          <ListItem
            pressable
            leftLabel="About"
            iconLeftName="information-circle"
            iconPack="IonIcons"
            onPress={() => navigation.navigate(screenList.aboutScreen)}
          />
          {/* // TAG : Developer*/}
          <ListItem
            pressable
            leftLabel="Developer"
            iconLeftName="code"
            iconPack="IonIcons"
            onPress={() =>
              navigation.navigate(screenList.developerSettingsScreen)
            }
          />
        </SettingsSection>
      </View>
    </>
  );
};

const styles = new StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  flatListView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    height: 48,
  },
  flatListViewUnderscore: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    // backgroundColor: 'green',
    paddingVertical: 0,
    paddingLeft: 16,
    borderColor: "#d9d9d9",
    borderBottomWidth: 0.5,
    minHeight: 46,
    textAlignVertical: "center",
  },
  flatListViewText: {
    display: "flex",
    color: "#000",
    textAlignVertical: "center",
    fontSize: 18,
    textAlignVertical: "center",
  },
});

export default UserScreen;
