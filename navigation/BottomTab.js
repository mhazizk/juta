import { Text, View } from "react-native";
import { NavigationContainer, TabActions } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IonIcons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// Screens
import SearchScreen from "./screens/search/SearchScreen";
import UserScreen from "./screens/user/UserScreen";
import { useState } from "react";
import LogBooksStack from "./LogBookStack";
import UserStack from "./UserStack";
import SearchStack from "./SearchStack";
import DashboardScreen from "./screens/dashboard/DashboardScreen";
import ActionScreen from "./screens/ActionScreen";
import LogBookTab from "../components/LogBookTab";
import DashboardStack from "./DashboardStack";

// Screen names
const stacks = {
    dashboardStack: 'Dashboard Stack',
    logBookStack: 'Log Book Stack',
    actionStack: 'Action Stack',
    searchStack: 'Search Stack',
    userStack: 'User Stack'
}

const Tab = createBottomTabNavigator();

const BottomTab = ({ route, navigation }) => {
    const [activeTab, setActiveTab] = useState();

    return (
        <>
            <Tab.Navigator
                initialRouteName={stacks.dashboardStack}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        let rn = route.name;

                        if (rn === stacks.dashboardStack) {
                            iconName = focused ? 'analytics' : 'analytics-outline'
                            return <IonIcons name={iconName} color={color} size={size} />
                        } else if (rn === stacks.logBookStack) {
                            iconName = focused ? 'book' : 'book-outline'
                            return <IonIcons name={iconName} color={color} size={size} />
                        } else if (rn === stacks.actionStack) {
                            iconName = focused ? 'plus' : 'plus'
                            return (
                                <View style={{ backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', width: 54, height: 54, borderRadius: 54 / 2 }}>
                                    <FontAwesome5 name={iconName} color='#fff' size={18} />
                                </View>)
                        } else if (rn === stacks.searchStack) {
                            iconName = focused ? 'search' : 'search-outline'
                            return <IonIcons name={iconName} color={color} size={size} />
                        } else if (rn === stacks.userStack) {
                            iconName = focused ? 'person' : 'person-outline'
                            return <IonIcons name={iconName} color={color} size={size} />
                        }
                        // return <IonIcons name={iconName} color={color} size={size} />

                    },
                    tabBarIconStyle: {},
                    tabBarActiveTintColor: '#000',
                    // tabBarActiveBackgroundColor: 'black',
                    tabBarLabelStyle: { fontSize: 12, paddingBottom: 0 },
                    tabBarShowLabel: false,
                    // tabBarItemStyle: { height: 64 },
                    tabBarStyle: { height: 48, paddingHorizontal: 0 },
                    headerShown: false,
                    // tabBarBadge: '!',
                    tabBarBadgeStyle: { textAlign: 'center', textAlignVertical: 'center' },
                    tabBarHideOnKeyboard: true,
                }
                )
                }
            >
                <Tab.Screen options={{ title: 'Dashboard' }} name={stacks.dashboardStack} component={DashboardStack} />
                <Tab.Screen options={{ title: 'Log Book' }}
                    name={stacks.logBookStack}
                    component={LogBooksStack} />
                <Tab.Screen options={{
                    tabBarItemStyle: { alignSelf: 'center', marginBottom: 28, height: 64 },
                    tabBarActiveTintColor: '#fff'
                }}
                    name={stacks.actionStack}
                    component={ActionScreen}
                    listeners={() => ({
                        tabPress: (e) => { e.preventDefault(); navigation.navigate('Action Screen') }
                    })}
                />
                <Tab.Screen options={{ title: 'Search' }} name={stacks.searchStack} component={SearchStack} />
                <Tab.Screen options={{ title: 'Settings' }} name={stacks.userStack} component={UserStack} />

            </Tab.Navigator>
        </>
    )
}

export default BottomTab;