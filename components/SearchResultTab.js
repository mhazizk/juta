import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import icons from "react-native-vector-icons/Ionicons";
import TransactionSearchScreen from "../navigation/screens/search/TransactionSearchScreen";
import LogBookSearchScreen from "../navigation/screens/search/LogBookSearchScreen";
import CategorySearchScreen from "../navigation/screens/search/CategorySearchScreen";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
} from "../modules/GlobalContext";
import IonIcons from "react-native-vector-icons/Ionicons";
import { View } from "react-native";

const Tab = createMaterialTopTabNavigator();

const SearchResultTab = () => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  const search = {
    transactionSearchScreen: "Transaction Search Screen",
    logbookSearchScreen: "LogBook Search Screen",
    categorySearchScreen: "Category Search Screen",
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIndicatorStyle: {
          backgroundColor: appSettings.theme.style.colors.textHeader,
          borderRadius: 16,
          height: 3,
          marginBottom: 0,
        },
        tabBarActiveTintColor: appSettings.theme.style.colors.textHeader,
        tabBarInactiveTintColor:
          appSettings.theme.style.text.textSecondary.color,
        tabBarIndicatorContainerStyle: {
          backgroundColor: appSettings.theme.style.colors.header,
          justifyContent: "center",
        },
        tabBarIconStyle: {},
        // tabBarIcon: ({ focused, color, size }) => {
        //     let iconName;
        //     switch (true) {
        //         case route.name === search.transactionSearchScreen:
        //             iconName = focused ? 'cash' : 'cash-outline'
        //             return <IonIcons name={iconName} color={color} size={20} />
        //         case route.name === search.logbookSearchScreen:
        //             iconName = focused ? 'book' : 'book-outline'
        //             return <IonIcons name={iconName} color={color} size={20} />
        //         case route.name === search.categorySearchScreen:
        //             iconName = focused ? 'pricetags' : 'pricetags-outline'
        //             return <IonIcons name={iconName} color={color} size={20} />
        //         default:
        //             return;
        //     }
        // }
      })}
    >
      <Tab.Screen
        options={{
          title: "Transactions",
        }}
        name={search.transactionSearchScreen}
        component={TransactionSearchScreen}
      />
      <Tab.Screen
        options={{ title: "Log Books" }}
        name={search.logbookSearchScreen}
        component={LogBookSearchScreen}
      />
      <Tab.Screen
        options={{ title: "Categories" }}
        name={search.categorySearchScreen}
        component={CategorySearchScreen}
      />
    </Tab.Navigator>
  );
};

export default SearchResultTab;
