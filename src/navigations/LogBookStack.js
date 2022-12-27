import { createStackNavigator } from "@react-navigation/stack";
import { useEffect } from "react";
import LogBookTab from "../components/LogBookTab";
import { useGlobalAppSettings } from "../reducers/GlobalContext";
import HomeScreen from "../screens/logbook/HomeScreen";
import LogBookScreen from "../screens/logbook/LogBookScreen";
import NewLogScreen from "../screens/logbook/NewLogScreen";
import TransactionDetailsScreen from "../screens/logbook/oldTransactionDetailsScreen";

const Stack = createStackNavigator();

const screens = {
  logBookScreen: "Log Book Screen",
  newLogScreen: "New Log Screen",
  recordScreen: "Record Details Screen",
};

const LogBooksStack = ({ route }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  return (
    <Stack.Navigator
      initialRouteName={screens.logBookScreen}
      screenOptions={{
        headerMode: "float",
      }}
    >
      <Stack.Screen
        options={{
          title: "Log Books",
          headerStyle: {
            backgroundColor: appSettings.theme.style.colors.header,
          },
          headerShadowVisible: false,
          // headerLeft: (leftHeader) => (
          //     <>
          //     </>
          // )
        }}
        name={screens.logBookScreen}
        component={LogBookScreen}
      />

      <Stack.Screen name={screens.newLogScreen} component={NewLogScreen} />
      {/* <Stack.Screen options={{title:'Edit Record'}}name={screens.recordScreen} component={RecordDetailsScreen} /> */}
    </Stack.Navigator>
  );
};

export default LogBooksStack;
