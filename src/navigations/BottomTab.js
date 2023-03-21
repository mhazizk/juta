import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform, View } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";

// Screens
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardScreen from "../features/dashboard/screens/DashboardScreen";
import LogbookScreen from "../features/logbook/screens/LogbookScreen";
import {
  useGlobalBadgeCounter,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../reducers/GlobalContext";
import ActionScreen from "../screens/modal/ActionScreen";
import SearchScreen from "../features/search/screens/SearchScreen";
import UserScreen from "../features/user/screens/UserScreen";
import screenList from "./ScreenList";

const Tab = createBottomTabNavigator();

const BottomTab = ({ route, navigation }) => {
  const [activeTab, setActiveTab] = useState();
  const { globalTheme } = useGlobalTheme();
  const { userAccount } = useGlobalUserAccount();
  const { badgeCounter } = useGlobalBadgeCounter();

  useEffect(() => {
    // console.log(badgeCounter);
  }, []);

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          padding: 0,
          margin: 0,
          backgroundColor: globalTheme.colors.background,
        }}
      >
        <View
          style={{
            position: "absolute",
            height: 400,
            right: 0,
            left: 0,
            top: 0,
            backgroundColor: globalTheme.colors.header,
          }}
        />
        <Tab.Navigator
          initialRouteName={screenList.dashboardScreen}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              let rn = route.name;

              switch (rn) {
                case screenList.dashboardScreen:
                  iconName = focused ? "grid" : "grid-outline";
                  return <IonIcons name={iconName} color={color} size={size} />;
                case screenList.logbookScreen:
                  iconName = focused ? "book" : "book-outline";
                  return <IonIcons name={iconName} color={color} size={size} />;
                case screenList.actionScreen:
                  iconName = focused ? "plus" : "plus";
                  return (
                    <View
                      style={{
                        backgroundColor:
                          globalTheme.bottomTab.actionButton.backgroundColor,
                        alignItems: "center",
                        justifyContent: "center",
                        width: 54,
                        height: 54,
                        borderRadius: 54 / 2,
                      }}
                    >
                      <FontAwesome5
                        name={iconName}
                        color={globalTheme.bottomTab.actionButton.iconColor}
                        size={18}
                      />
                    </View>
                  );
                case screenList.searchScreen:
                  iconName = focused ? "search" : "search-outline";
                  return <IonIcons name={iconName} color={color} size={size} />;
                case screenList.userScreen:
                  iconName = focused ? "person" : "person-outline";
                  return <IonIcons name={iconName} color={color} size={size} />;

                default:
                  return;
              }
            },
            // tabBarIconStyle: {},
            tabBarActiveTintColor: globalTheme.bottomTab.activeTintColor,
            tabBarInactiveTintColor: globalTheme.bottomTab.inactiveTintColor,
            tabBarLabelStyle: {
              fontSize: 12,
              paddingBottom: 0,
              marginBottom: 0,
            },
            tabBarShowLabel: false,
            tabBarStyle: {
              alignItems: "center",
              justifyContent: "center",
              height: 48,
              padding: 0,
              margin: 0,
              backgroundColor: globalTheme.colors.background,
            },
            tabBarItemStyle: {
              justifyContent: "center",
              alignSelf: "center",
              height: 48,
              padding: 0,
              marginBottom: Platform.OS === "ios" ? -30 : 0,
            },
            headerShown: true,
            headerBackground: () => (
              <View
                style={{
                  flex: 1,
                  backgroundColor: globalTheme.colors.header,
                }}
              />
            ),

            headerShadowVisible: false,
            tabBarBadgeStyle: {
              textAlign: "center",
              textAlignVertical: "center",
            },
            tabBarHideOnKeyboard: true,
          })}
        >
          {/* // TAG : Dashboard Screen */}
          <Tab.Screen
            options={{
              tabBarBadgeStyle: {
                color: "transparent",
                minWidth: 13,
                minHeight: 13,
                maxHeight: 13,
                maxWidth: 13,
              },
              tabBarBadge:
                badgeCounter?.tab?.dashboardTab === 0
                  ? null
                  : badgeCounter?.tab?.dashboardTab,
              headerShown: false,
            }}
            name={screenList.dashboardScreen}
            component={DashboardScreen}
          />
          {/* // TAG : Logbook Screen */}
          <Tab.Screen
            options={{
              title: "",
              headerShown: false,
              tabBarBadgeStyle: {
                color: "transparent",
                minWidth: 13,
                minHeight: 13,
                maxHeight: 13,
                maxWidth: 13,
              },
              tabBarBadge:
                badgeCounter?.tab?.logbookTab === 0
                  ? null
                  : badgeCounter?.tab?.logbookTab,
            }}
            name={screenList.logbookScreen}
            component={LogbookScreen}
          />
          {/* // TAG : Action Screen */}
          <Tab.Screen
            options={{
              tabBarBadgeStyle: {
                color: "transparent",
                minWidth: 13,
                minHeight: 13,
                maxHeight: 13,
                maxWidth: 13,
              },
              tabBarBadge:
                badgeCounter?.tab?.actionTab === 0
                  ? null
                  : badgeCounter?.tab?.actionTab,
              tabBarItemStyle: {
                alignSelf: "center",
                marginBottom: Platform.OS === "android" ? 28 : 0,
                height: 64,
              },
              tabBarActiveTintColor: globalTheme.colors.background,
            }}
            name={screenList.actionScreen}
            component={ActionScreen}
            listeners={() => ({
              tabPress: (e) => {
                e.preventDefault();
                navigation.navigate(screenList.actionScreen);
              },
            })}
          />
          {/* // TAG : Search Screen */}
          <Tab.Screen
            options={{
              title: "",
              headerShown: false,
              tabBarBadgeStyle: {
                color: "transparent",
                minWidth: 13,
                minHeight: 13,
                maxHeight: 13,
                maxWidth: 13,
              },
              tabBarBadge:
                badgeCounter?.tab?.searchTab === 0
                  ? null
                  : badgeCounter?.tab?.searchTab,
            }}
            name={screenList.searchScreen}
            component={SearchScreen}
          />
          {/* // TAG : User Screen */}
          <Tab.Screen
            options={{
              title: "",
              headerShown: false,
              tabBarBadgeStyle: {
                color: "transparent",
                minWidth: 13,
                minHeight: 13,
                maxHeight: 13,
                maxWidth: 13,
              },
              tabBarBadge:
                badgeCounter?.tab?.userTab === 0
                  ? null
                  : badgeCounter?.tab?.userTab,
            }}
            name={screenList.userScreen}
            component={UserScreen}
          />
        </Tab.Navigator>
      </SafeAreaView>
    </>
  );
};

export default BottomTab;
