import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/home/HomeScreen";
import NewLog from "./screens/home/NewLogScreen";
import RecordDetailsScreen from "./screens/home/RecordDetailsScreen";

const Stack = createStackNavigator();

const screens = {
    homeScreen: 'Home Screen',
    newLogScreen: 'New Log Screen',
    recordScreen: 'Record Details Screen'
}

const HomeStack = () => {

    return (
        <Stack.Navigator initialRouteName={screens.homeScreen}>
            <Stack.Screen name={screens.homeScreen} component={HomeScreen} />
            <Stack.Screen name={screens.newLogScreen} component={NewLog} />
            <Stack.Screen name={screens.recordScreen} component={RecordDetailsScreen} />
        </Stack.Navigator>
    )
}


export default HomeStack;