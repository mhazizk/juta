import { createStackNavigator } from "@react-navigation/stack";
import { Text, View } from "react-native"
import RecordDetailsScreen from "./screens/home/RecordDetailsScreen";
import SearchScreen from "./screens/search/SearchScreen";

const Stack = createStackNavigator();
const screens = {
    searchScreen: 'Search Screen',
    recordDetailsScreen: 'Record Details Screen'
}
const SearchStack = () => {
    return (
        <Stack.Navigator initialRouteName={screens.searchScreen}>
            <Stack.Screen name={screens.searchScreen} component={SearchScreen} />
            <Stack.Screen name={screens.recordDetailsScreen} component={RecordDetailsScreen} />
        </Stack.Navigator>
    )
}

export default SearchStack;