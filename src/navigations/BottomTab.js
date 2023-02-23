import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
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
import SearchScreen from "../screens/search/SearchScreen";
import UserScreen from "../screens/user/UserScreen";
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
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          animated={true}
          style="auto"
          backgroundColor={globalTheme.colors.header}
        />
        <Tab.Navigator
          initialRouteName={screenList.dashboardScreen}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              let rn = route.name;

              if (rn === screenList.dashboardScreen) {
                iconName = focused ? "grid" : "grid-outline";
                return <IonIcons name={iconName} color={color} size={size} />;
              } else if (rn === screenList.logbookScreen) {
                iconName = focused ? "book" : "book-outline";
                return <IonIcons name={iconName} color={color} size={size} />;
              } else if (rn === screenList.actionScreen) {
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
            tabBarActiveTintColor: globalTheme.bottomTab.activeTintColor,
            tabBarInactiveTintColor: globalTheme.bottomTab.inactiveTintColor,
            // tabBarActiveBackgroundColor: 'black',
            tabBarLabelStyle: { fontSize: 12, paddingBottom: 0 },
            tabBarShowLabel: false,
            // tabBarItemStyle: { height: 64 },
            tabBarStyle: {
              height: 48,
              paddingHorizontal: 0,
              backgroundColor: globalTheme.colors.background,
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
              // title: "Dashboard",
              // tabBarBadge: 3,
              // headerRight: () => (
              //   <TouchableOpacity
              //     onPress={
              //       () =>
              //         navigation.navigate(screenList.bottomTabNavigator, {
              //           screen: screenList.userScreen,
              //         })
              //       // navigation.navigate(screenList.dashboardTourScreen)
              //     }
              //   >
              //     <View
              //       style={{
              //         paddingRight: 16,
              //       }}
              //     >
              //       <TextPrimary
              //         label={userAccount?.displayName}
              //         style={{
              //           color: globalTheme.colors.textHeader,
              //           fontSize: 18,
              //         }}
              //       />
              //     </View>
              //   </TouchableOpacity>
              // ),
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
                marginBottom: 28,
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
