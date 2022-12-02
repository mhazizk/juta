import { createStackNavigator } from "@react-navigation/stack";
import { Text, View } from "react-native"
import EditTransactionDetailsScreen from "./screens/home/EditTransactionDetailsScreen";
import SearchScreen from "./screens/search/SearchScreen";

const Stack = createStackNavigator();
const screens = {
    searchScreen: 'Search Screen',
    recordDetailsScreen: 'Record Details Screen'
}
const SearchStack = () => {
    return (
        <Stack.Navigator initialRouteName={screens.searchScreen}>
            <Stack.Screen options={{title:'Search'}} name={screens.searchScreen} component={SearchScreen} />
            <Stack.Screen name={screens.recordDetailsScreen} component={EditTransactionDetailsScreen} />
        </Stack.Navigator>
    )
}

export default SearchStack;