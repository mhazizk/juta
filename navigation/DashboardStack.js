import { createStackNavigator } from "@react-navigation/stack";
import AnalyticsScreen from "./screens/dashboard/AnalyticsScreen";
import DashboardScreen from "./screens/dashboard/DashboardScreen";
import UserScreen from "./screens/user/UserScreen";

const Stack = createStackNavigator();

const screens = {
    dashboardScreen: 'Dashboard Screen',
    analyticsScreen: 'Analytics Screen'
}

const DashboardStack = () => {

    return (
        <Stack.Navigator initialRouteName={screens.dashboardScreen}>
            <Stack.Screen options={{title:'Dashboard'}} name={screens.dashboardScreen} component={DashboardScreen} />
            <Stack.Screen name={screens.analyticsScreen} component={AnalyticsScreen} />
        </Stack.Navigator>
    )
}


export default DashboardStack;