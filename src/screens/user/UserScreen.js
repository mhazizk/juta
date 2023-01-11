import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { ListItem } from "../../components/List";
import ListSection from "../../components/List/ListSection";
import UserHeaderComponent from "../../components/UserHeader";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
  useGlobalCategories,
  useGlobalLogbooks,
} from "../../reducers/GlobalContext";

const UserScreen = ({ navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { budgets } = useGlobalBudgets();

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          height: "100%",
          backgroundColor: appSettings.theme.style.colors.background,
        }}
      >
        <UserHeaderComponent />
        <ListSection>
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
          {/* // TAG : My Groups */}
          <ListItem
            pressable
            leftLabel="My Groups"
            iconLeftName="people"
            iconPack="IonIcons"
            onPress={() => navigation.navigate(screenList.myGroupsScreen)}
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
            rightLabel={
              Date.now() <= budgets?.budgets[0]?.finish_date
                ? "Active"
                : "Inactive"
            }
            iconLeftName="piggy-bank"
            iconPack="FontAwesome5"
            onPress={() => navigation.navigate(screenList.myBudgetsScreen)}
          />
        </ListSection>
        <ListSection>
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
        </ListSection>
      </ScrollView>
    </>
  );
};

export default UserScreen;
