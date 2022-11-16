import { Text, View } from "react-native";
import { NavigationContainer, TabActions } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IonIcons from 'react-native-vector-icons/Ionicons';

// Screens
import SearchScreen from "./screens/search/SearchScreen";
import UserScreen from "./screens/user/UserScreen";
import { useState } from "react";
import HomeStack from "./HomeStack";
import UserStack from "./UserStack";
import SearchStack from "./SearchStack";

// Screen names
const stacks = {
    homeStack: 'Home Stack',
    searchStack: 'Search Stack',
    userStack: 'User Stack'
}

const Tab = createBottomTabNavigator();

const BottomNavbar = () => {
    const [activeTab, setActiveTab] = useState();

    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName={stacks.homeStack}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        let rn = route.name;

                        if (rn === stacks.homeStack) {
                            iconName = focused ? 'book' : 'book-outline'
                        } else if (rn === stacks.searchStack) {
                            iconName = focused ? 'search' : 'search-outline'
                        } else if (rn === stacks.userStack) {
                            iconName = focused ? 'person' : 'person-outline'
                        }
                        return <IonIcons name={iconName} color={color} size={size} />

                    },
                    tabBarIconStyle: { paddingTop: 0 },
                    tabBarActiveTintColor: '#fff',
                    tabBarActiveBackgroundColor: 'black',
                    // tabBarLabelStyle: {fontSize:16, paddingVertical:10 },
                    tabBarShowLabel: false,
                    // tabBarItemStyle: { height: 64 },
                    tabBarStyle: { height: 48 },
                    headerShown: false,
                    tabBarBadge: '!',
                    tabBarBadgeStyle: { textAlign: 'center', textAlignVertical: 'center' }
                }
                )
                }
            >
                <Tab.Screen name={stacks.homeStack} component={HomeStack} />
                <Tab.Screen name={stacks.searchStack} component={SearchStack} />
                <Tab.Screen name={stacks.userStack} component={UserStack} />

            </Tab.Navigator>
        </NavigationContainer >
    )
}

export default BottomNavbar;