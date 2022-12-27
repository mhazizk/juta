import UserHeaderComponent from "../components/UserHeader";
import AboutScreen from "../screens/user/AboutScreen";
import AccountScreen from "../screens/user/AccountScreen";
import DataScreen from "../screens/user/DataScreen";
import PersonalizationScreen from "../screens/user/PersonalizationScreen";
import ProfileScreen from "../screens/user/ProfileScreen";
import UserScreen from "../screens/user/UserScreen";

import { createStackNavigator } from "@react-navigation/stack";
import { Text, View } from "react-native";
import { useGlobalAppSettings } from "../reducers/GlobalContext";
import MyCategoriesScreen from "../screens/categories/MyCategoriesScreen";
import MyLogbooksScreen from "../screens/logbook/MyLogbooksScreen";
import DeveloperScreen from "../screens/user/DeveloperScreen";
import SettingsScreen from "../screens/user/SettingsScreen";

const Stack = createStackNavigator();

const screens = {
  userScreen: "User Screen",
  profileScreen: "Profile Screen",
  aboutScreen: "About Screen",
  dataScreen: "Data Screen",
  accountScreen: "Account Screen",
  personalizationScreen: "Personalization Screen",
  settingsScreen: "Settings Screen",
  myLogbooksScreen: "My Logbooks Screen",
  myCategoriesScreen: "My Categories Screen",
  developerScreen: "Developer Screen",
};

const UserStack = () => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  return (
    <>
      <Stack.Navigator initialRouteName={screens.userScreen}>
        <Stack.Screen
          options={{
            title: "",
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: appSettings.theme.style.colors.background,
            },
          }}
          name={screens.userScreen}
          component={UserScreen}
        />
        <Stack.Screen
          options={{
            title: "",
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: appSettings.theme.style.colors.background,
            },
          }}
          name={screens.profileScreen}
          component={ProfileScreen}
        />
        <Stack.Screen
          options={{
            title: "",
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: appSettings.theme.style.colors.background,
            },
          }}
          name={screens.accountScreen}
          component={AccountScreen}
        />
        <Stack.Screen
          options={{
            title: "",
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: appSettings.theme.style.colors.background,
            },
          }}
          name={screens.dataScreen}
          component={DataScreen}
        />
        <Stack.Screen
          options={{
            title: "",
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: appSettings.theme.style.colors.background,
            },
          }}
          name={screens.personalizationScreen}
          component={PersonalizationScreen}
        />
        <Stack.Screen
          options={{
            title: "",
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: appSettings.theme.style.colors.background,
            },
          }}
          name={screens.aboutScreen}
          component={AboutScreen}
        />
        <Stack.Screen
          options={{
            title: "",
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: appSettings.theme.style.colors.background,
            },
          }}
          name={screens.settingsScreen}
          component={SettingsScreen}
        />
        {/* <Stack.Screen options={{ title: 'My Logbooks', headerShadowVisible: false }} name={screens.myLogbooksScreen} component={MyLogbooksScreen} />
            <Stack.Screen options={{ title: '', headerShadowVisible: false }} name={screens.myCategoriesScreen} component={MyCategoriesScreen} /> */}
        <Stack.Screen
          options={{
            title: "",
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: appSettings.theme.style.colors.background,
            },
          }}
          name={screens.developerScreen}
          component={DeveloperScreen}
        />
      </Stack.Navigator>
    </>
  );
};

export default UserStack;
