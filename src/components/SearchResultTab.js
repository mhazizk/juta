// import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// import { View } from "react-native";
// import {
//   default as icons,
//   default as IonIcons,
// } from "react-native-vector-icons/Ionicons";
// import {
//   useGlobalAppSettings,
//   useGlobalCategories,
//   useGlobalLogbooks,
//   useGlobalSortedTransactions,
// } from "../reducers/GlobalContext";
// import CategorySearchScreen from "../screens/search/CategorySearchScreen";
// import LogBookSearchScreen from "../screens/search/LogBookSearchScreen";
// import TransactionSearchScreen from "../screens/search/TransactionSearchScreen";

// const Tab = createMaterialTopTabNavigator();

// const SearchResultTab = () => {
//   const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

//   const search = {
//     transactionSearchScreen: "Transaction Search Screen",
//     logbookSearchScreen: "LogBook Search Screen",
//     categorySearchScreen: "Category Search Screen",
//   };

//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIndicatorStyle: {
//           backgroundColor: appSettings.theme.style.colors.textHeader,
//           borderRadius: 16,
//           height: 3,
//           marginBottom: 0,
//         },
//         tabBarActiveTintColor: appSettings.theme.style.colors.textHeader,
//         tabBarInactiveTintColor:
//           appSettings.theme.style.text.textSecondary.color,
//         tabBarIndicatorContainerStyle: {
//           backgroundColor: appSettings.theme.style.colors.header,
//           justifyContent: "center",
//         },
//         tabBarIconStyle: {},
//         // tabBarIcon: ({ focused, color, size }) => {
//         //     let iconName;
//         //     switch (true) {
//         //         case route.name === search.transactionSearchScreen:
//         //             iconName = focused ? 'cash' : 'cash-outline'
//         //             return <IonIcons name={iconName} color={color} size={20} />
//         //         case route.name === search.logbookSearchScreen:
//         //             iconName = focused ? 'book' : 'book-outline'
//         //             return <IonIcons name={iconName} color={color} size={20} />
//         //         case route.name === search.categorySearchScreen:
//         //             iconName = focused ? 'pricetags' : 'pricetags-outline'
//         //             return <IonIcons name={iconName} color={color} size={20} />
//         //         default:
//         //             return;
//         //     }
//         // }
//       })}
//     >
//       <Tab.Screen
//         options={{
//           title: "Transactions",
//         }}
//         name={search.transactionSearchScreen}
//         component={TransactionSearchScreen}
//       />
//       <Tab.Screen
//         options={{ title: "Log Books" }}
//         name={search.logbookSearchScreen}
//         component={LogBookSearchScreen}
//       />
//       <Tab.Screen
//         options={{ title: "Categories" }}
//         name={search.categorySearchScreen}
//         component={CategorySearchScreen}
//       />
//     </Tab.Navigator>
//   );
// };

// export default SearchResultTab;
