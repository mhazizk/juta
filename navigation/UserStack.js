import UserScreen from "./screens/user/UserScreen";
import ProfileScreen from "./screens/user/ProfileScreen";
import AboutScreen from "./screens/user/AboutScreen";
import DataScreen from "./screens/user/DataScreen";
import AccountScreen from "./screens/user/AccountScreen";
import PersonalizationScreen from "./screens/user/PersonalizationScreen";

import { createStackNavigator } from "@react-navigation/stack";
import { Text, View } from "react-native";

const Stack = createStackNavigator();

const screens = {
    userScreen: 'User Screen',
    profileScreen: 'Profile Screen',
    aboutScreen: 'About Screen',
    dataScreen: 'Data Screen',
    accountScreen: 'Account Screen',
    personalizationScreen: 'Personalization Screen'
}

const UserStack = () => {
    return (
            <Stack.Navigator initialRouteName={screens.userScreen}>
                <Stack.Screen name={screens.userScreen} component={UserScreen} />
                <Stack.Screen name={screens.profileScreen} component={ProfileScreen} />
                <Stack.Screen name={screens.accountScreen} component={AccountScreen} />
                <Stack.Screen name={screens.dataScreen} component={DataScreen} />
                <Stack.Screen name={screens.personalizationScreen} component={PersonalizationScreen} />
                <Stack.Screen name={screens.aboutScreen} component={AboutScreen} />
            </Stack.Navigator>
    )
}

export default UserStack;