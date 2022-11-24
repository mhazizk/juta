import { createStackNavigator } from "@react-navigation/stack";
import LogBookTab from "../components/LogBookTab";
import HomeScreen from "./screens/home/HomeScreen";
import NewLogScreen from "./screens/home/NewLogScreen";
import TransactionDetailsScreen from "./screens/home/oldTransactionDetailsScreen";

const Stack = createStackNavigator();

const screens = {
    logBookScreen: 'Log Book Screen',
    newLogScreen: 'New Log Screen',
    recordScreen: 'Record Details Screen'
}

const LogBooksStack = () => {

    return (
        <Stack.Navigator initialRouteName={screens.logBookScreen}>
            <Stack.Screen options={{title:'Log Books'}} name={screens.logBookScreen} component={LogBookTab} />
            <Stack.Screen name={screens.newLogScreen} component={NewLogScreen} />
            {/* <Stack.Screen options={{title:'Edit Record'}}name={screens.recordScreen} component={RecordDetailsScreen} /> */}
        </Stack.Navigator>
    )
}


export default LogBooksStack;