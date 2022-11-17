import UserScreen from "./screens/user/UserScreen";
import ProfileScreen from "./screens/user/ProfileScreen";
import AboutScreen from "./screens/user/AboutScreen";
import DataScreen from "./screens/user/DataScreen";
import AccountScreen from "./screens/user/AccountScreen";
import PersonalizationScreen from "./screens/user/PersonalizationScreen";
import UserHeaderComponent from "../components/UserHeader";

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
            <Stack.Navigator initialRouteName={screens.userScreen} >
                <Stack.Screen options={{title:'',headerShadowVisible:false}}  name={screens.userScreen} component={UserScreen} />
                <Stack.Screen options={{title:'',headerShadowVisible:false }} name={screens.profileScreen} component={ProfileScreen} />
                <Stack.Screen options={{title:'',headerShadowVisible:false}} name={screens.accountScreen} component={AccountScreen} />
                <Stack.Screen options={{title:'',headerShadowVisible:false}} name={screens.dataScreen} component={DataScreen} />
                <Stack.Screen options={{title:'',headerShadowVisible:false}} name={screens.personalizationScreen} component={PersonalizationScreen} />
                <Stack.Screen options={{title:'',headerShadowVisible:false}} name={screens.aboutScreen} component={AboutScreen} />
            </Stack.Navigator>
    )
}

export default UserStack;