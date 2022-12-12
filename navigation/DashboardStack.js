import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native";
import { useGlobalAppSettings } from "../modules/GlobalContext";
import AnalyticsScreen from "./screens/dashboard/AnalyticsScreen";
import DashboardScreen from "./screens/dashboard/DashboardScreen";
import UserScreen from "./screens/user/UserScreen";

const Stack = createStackNavigator();

const screens = {
    dashboardScreen: 'Dashboard Screen',
    analyticsScreen: 'Analytics Screen'
}

const DashboardStack = () => {
    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

    return (
        <Stack.Navigator initialRouteName={screens.dashboardScreen}>
            <Stack.Screen options={{ title: 'Dashboard', headerStyle: { backgroundColor: appSettings.theme.style.colors.background } }} name={screens.dashboardScreen} component={DashboardScreen} />
            <Stack.Screen options={{ headerRight: () => <Text>Test</Text> }} name={screens.analyticsScreen} component={AnalyticsScreen} />
        </Stack.Navigator>
    )
}


export default DashboardStack;