import { createStackNavigator } from "@react-navigation/stack";
import { Text, View } from "react-native";
import { useGlobalAppSettings } from "../utils/GlobalContext";
import EditTransactionDetailsScreen from "./screens/logbook/EditTransactionDetailsScreen";
import SearchScreen from "./screens/search/SearchScreen";

const Stack = createStackNavigator();
const screens = {
  searchScreen: "Search Screen",
  recordDetailsScreen: "Record Details Screen",
};
const SearchStack = () => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  return (
    <Stack.Navigator initialRouteName={screens.searchScreen}>
      <Stack.Screen
        options={{
          title: "Search",
          headerShadowVisible: false,
          headerShown: false,
          headerStyle: {
            backgroundColor: appSettings?.theme?.style?.colors?.header,
          },
        }}
        name={screens.searchScreen}
        component={SearchScreen}
      />
      <Stack.Screen
        name={screens.recordDetailsScreen}
        options={{
          title: "Search",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: appSettings?.theme?.style?.colors?.header,
          },
        }}
        component={EditTransactionDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export default SearchStack;
