import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";

// Screens
import { useState } from "react";
import { useGlobalAppSettings } from "../reducers/GlobalContext";
import ActionScreen from "../screens/modal/ActionScreen";
import UserScreen from "../screens/user/UserScreen";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import LogBookScreen from "../screens/logbook/LogBookScreen";
import SearchScreen from "../screens/search/SearchScreen";
import screenList from "./ScreenList";


const Tab = createBottomTabNavigator();

const BottomTab = ({ route, navigation }) => {
  const [activeTab, setActiveTab] = useState();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  return (
    <>
      <Tab.Navigator
        initialRouteName={screenList.dashboardScreen}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === screenList.dashboardScreen) {
              iconName = focused ? "analytics" : "analytics-outline";
              return <IonIcons name={iconName} color={color} size={size} />;
            } else if (rn === screenList.logBookScreen) {
              iconName = focused ? "book" : "book-outline";
              return <IonIcons name={iconName} color={color} size={size} />;
            } else if (rn === screenList.actionScreen) {
              iconName = focused ? "plus" : "plus";
              return (
                <View
                  style={{
                    backgroundColor: appSettings.theme.style.colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                    width: 54,
                    height: 54,
                    borderRadius: 54 / 2,
                  }}
                >
                  <FontAwesome5
                    name={iconName}
                    color={appSettings.theme.style.colors.background}
                    size={18}
                  />
                </View>
              );
            } else if (rn === screenList.searchScreen) {
              iconName = focused ? "search" : "search-outline";
              return <IonIcons name={iconName} color={color} size={size} />;
            } else if (rn === screenList.userScreen) {
              iconName = focused ? "person" : "person-outline";
              return <IonIcons name={iconName} color={color} size={size} />;
            }
            // return <IonIcons name={iconName} color={color} size={size} />
          },
          tabBarIconStyle: {},
          tabBarActiveTintColor: appSettings.theme.style.colors.primary,
          // tabBarActiveBackgroundColor: 'black',
          tabBarLabelStyle: { fontSize: 12, paddingBottom: 0 },
          tabBarShowLabel: false,
          // tabBarItemStyle: { height: 64 },
          tabBarStyle: {
            height: 48,
            paddingHorizontal: 0,
            backgroundColor: appSettings.theme.style.colors.background,
          },
          headerShown: false,
          // tabBarBadge: '!',
          tabBarBadgeStyle: {
            textAlign: "center",
            textAlignVertical: "center",
          },
          tabBarHideOnKeyboard: true,
        })}
      >
        {/* <Tab.Screen
          options={{ title: "Dashboard" }}
          name={screenList.dashboardStack}
          component={DashboardStack}
        /> */}
        <Tab.Screen
          options={{ title: "Dashboard" }}
          name={screenList.dashboardScreen}
          component={DashboardScreen}
        />
        {/* <Tab.Screen
          options={{ title: "Log Book" }}
          name={screenList.logBookStack}
          component={LogBooksStack}
        /> */}
        <Tab.Screen
          options={{ title: "Log Book" }}
          name={screenList.logBookScreen}
          component={LogBookScreen}
        />
        <Tab.Screen
          options={{
            tabBarItemStyle: {
              alignSelf: "center",
              marginBottom: 28,
              height: 64,
            },
            tabBarActiveTintColor: appSettings.theme.style.colors.background,
          }}
          name={screenList.actionScreen}
          component={ActionScreen}
          listeners={() => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("Action Screen");
            },
          })}
        />
        {/* <Tab.Screen
          options={{ title: "Search" }}
          name={screenList.searchStack}
          component={SearchStack}
        /> */}
        <Tab.Screen
          options={{ title: "Search" }}
          name={screenList.searchScreen}
          component={SearchScreen}
        />
        <Tab.Screen
          options={{ title: "Settings" }}
          name={screenList.userScreen}
          component={UserScreen}
        />
        {/* <Tab.Screen
          options={{ title: "Settings" }}
          name={screenList.userStack}
          component={UserStack}
        /> */}
      </Tab.Navigator>
    </>
  );
};

export default BottomTab;
