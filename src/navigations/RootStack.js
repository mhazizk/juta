import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { useEffect, useMemo } from "react";
import { setSortedTransactions } from "../utils/FetchData";
import persistStorage from "../reducers/persist/persistStorage";
import PERSIST_ACTIONS from "../reducers/persist/persist.actions";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLoading,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTransactions,
  useGlobalUserAccount,
} from "../reducers/GlobalContext";
import { ACTIONS } from "../reducers/GlobalReducer";
import MyCategoriesScreen from "../screens/categories/MyCategoriesScreen";
import EditLogbookScreen from "../screens/logbook/EditLogbookScreen";
import MyLogbooksScreen from "../screens/logbook/MyLogbooksScreen";
import ActionScreen from "../screens/modal/ActionScreen";
import LoadingScreen from "../screens/modal/LoadingScreen";
import ModalScreen from "../screens/modal/ModalScreen";
import SplashScreen from "../screens/modal/SplashScreen";
import EditTransactionDetailsScreen from "../screens/transactions/EditTransactionDetailsScreen";
import NewTransactionDetailsScreen from "../screens/transactions/NewTransactionDetailsScreen";
import TransactionPreviewScreen from "../screens/transactions/TransactionPreviewScreen";
import BottomTab from "./BottomTab";
import BudgetPreviewScreen from "../screens/budget/BudgetPreviewScreen";
import EditBudgetScreen from "../screens/budget/EditBudgetScreen";
import MyBudgetsScreen from "../screens/budget/MyBudgetsScreen";
import NewBudgetScreen from "../screens/budget/NewBudgetScreen";
import AnalyticsScreen from "../screens/analytics/AnalyticsScreen";
import InitialSetupScreen from "../screens/initial/InitialSetupScreen";
import OnboardingScreen from "../screens/initial/OnboardingScreen";
import CategoryPreviewScreen from "../screens/categories/CategoryPreviewScreen";
import EditCategoryScreen from "../screens/categories/EditCategoryScreen";
import LogbookPreviewScren from "../screens/logbook/LogbookPreviewScreen";
import NewCategoryScreen from "../screens/categories/NewCategoryScreen";
import CurrencySettingsScreen from "../screens/settings/CurrencySettingsScreen";
import PersonalizationSettingsScreen from "../screens/settings/PersonalizationSettingsScreen";
import AccountSettingsScreen from "../screens/settings/AccountSettingsScreen";
import UserScreen from "../screens/user/UserScreen";
import ProfileSettingsScreen from "../screens/settings/ProfileSettingsScreen";
import DeveloperScreen from "../screens/user/DeveloperScreen";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import SearchScreen from "../screens/search/SearchScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import AboutScreen from "../screens/settings/AboutScreen";
import screenList from "./ScreenList";
import LogBookScreen from "../screens/logbook/LogBookScreen";
import { Alert, BackHandler } from "react-native";
import REDUCER_ACTIONS from "../reducers/reducer.action";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";

const Stack = createStackNavigator();

const RootStack = ({ navigation }) => {
  const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { isLoading, dispatchLoading } = useGlobalLoading();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();

  // TAG : useEffect for state
  useEffect(() => {
    // BackHandler.addEventListener("hardwareBackPress", exitPrompt);
    // dispatchLoading({
    //   type: ACTIONS.LOADING.SET,
    //   payload: true,
    // });
    // return () => {
    //   BackHandler.removeEventListener("hardwareBackPress", exitPrompt);
    // };
  }, []);

  // Save Sorted Transactions to storage
  useEffect(() => {
    if (userAccount) {
      persistStorage.asyncSecureStorage({
        action: PERSIST_ACTIONS.SET,
        key: "account",
        rawValue: userAccount,
      });
    }
  }, [userAccount]);

  // Save Sorted Transactions to storage
  useEffect(() => {
    if (sortedTransactions) {
      persistStorage.asyncStorage({
        action: PERSIST_ACTIONS.SET,
        key: "sortedTransactions",
        rawValue: sortedTransactions,
      });
    }
  }, [sortedTransactions]);

  // Save App Settings to storage
  useEffect(() => {
    if (appSettings) {
      persistStorage.asyncStorage({
        action: PERSIST_ACTIONS.SET,
        key: "appSettings",
        rawValue: appSettings,
      });
    }
  }, [appSettings]);

  // Save Logbooks to storage
  useEffect(() => {
    if (logbooks) {
      persistStorage.asyncStorage({
        action: PERSIST_ACTIONS.SET,
        key: "logbooks",
        rawValue: logbooks,
      });
    }
  }, [logbooks]);

  // Save Categories to storage
  useEffect(() => {
    if (categories) {
      persistStorage.asyncStorage({
        action: PERSIST_ACTIONS.SET,
        key: "categories",
        rawValue: categories,
      });
    }
  }, [categories]);

  // const dispatchInitSortedTransactions = () => {
  const getSortedTransactions = useMemo(() => {
    return async () => {
      try {
        dispatchSortedTransactions({
          type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.SET,
          payload: await setSortedTransactions(),
        });
      } catch (error) {
        console.log(error);
      }
    };
  }, [rawTransactions]);
  // }

  // Get Transaction File from storage
  const getFileFromStorage = async () => {
    try {
      const json = await AsyncStorage.getItem("trx");
      if (json !== null) {
        const parsed = JSON.parse(json);
        dispatchRawTransactions({
          type: ACTIONS.TRANSACTIONS.SET,
          payload: parsed,
        });
      }
    } catch (error) {
      alert(error);
    }
  };

  // function exitPrompt() {
  //   Alert.alert("Are you sure you want to exit?", [
  //     { text: "Cancel", onPress: () => null, style: "cancel" },
  //     {
  //       text: "Yes",
  //       onPress: () => {
  //         dispatchAppSettings({
  //           type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
  //           payload: {
  //             ...appSettings,
  //             hiddenScreens: appSettings.hiddenScreens.filter((screen) => {
  //               screen !== screenList.splashScreen;
  //             }),
  //           },
  //         });
  //         BackHandler.exitApp();
  //       },
  //     },
  //   ]);
  // }

  const noHeader = {
    headerShown: false,
    title: "",
  };

  const showHeader = {
    headerShown: true,
    headerStyle: {
      backgroundColor: appSettings?.theme?.style?.colors?.header,
    },
  };

  const showHeaderNoBack = {
    headerShown: true,
    headerLeft: (leftHeader) => <></>,
    headerStyle: {
      backgroundColor: appSettings?.theme?.style?.colors?.header,
    },
  };

  return (
    <Stack.Navigator
      initialRouteName={screenList.splashScreen}
      // screenOptions={{
      //   headerShown: true,
      // }}
    >
      {/* // SECTION : INITIAL */}
      {/* // TAG : Splash Screen */}
      {!appSettings?.hiddenScreens?.some(
        (screen) => screen === screenList.splashScreen
      ) && (
        <Stack.Screen
          options={{
            gestureEnabled: false,
            presentation: "transparentModal",
            headerShown: false,
            cardOverlayEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid,
          }}
          name={screenList.splashScreen}
          component={SplashScreen}
        />
      )}

      {/* // TAG : Onboarding Screen */}
      {!appSettings?.hiddenScreens?.some(
        (screen) => screen === screenList.onboardingScreen
      ) && (
        <Stack.Screen
          options={noHeader}
          name={screenList.onboardingScreen}
          component={OnboardingScreen}
        />
      )}

      {/* // TAG : Initial Setup Screen */}
      {!appSettings?.hiddenScreens?.some(
        (screen) => screen === screenList.initialSetupScreen
      ) && (
        <Stack.Screen
          options={noHeader}
          name={screenList.initialSetupScreen}
          component={InitialSetupScreen}
        />
      )}

      {/* // TAG : Bottom Tab */}
      <Stack.Screen
        name={screenList.bottomTabNavigator}
        options={{
          ...noHeader,
        }}
        component={BottomTab}
      />

      {/* // SECTION : MODAL // */}
      {/* // TAG : Modal Screen */}
      <Stack.Screen
        options={{
          presentation: "transparentModal",
          headerShown: false,
          cardOverlayEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid,
        }}
        name={screenList.modalScreen}
        component={ModalScreen}
      />

      {/* // TAG : Action Screen */}
      <Stack.Screen
        options={{
          presentation: "transparentModal",
          headerShown: false,
          cardOverlayEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid,
        }}
        name={screenList.actionScreen}
        component={ActionScreen}
      />

      {/* // TAG : Loading Screen */}
      <Stack.Screen
        options={{
          gestureEnabled: false,
          presentation: "transparentModal",
          headerShown: false,
          cardOverlayEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid,
        }}
        name={screenList.loadingScreen}
        component={LoadingScreen}
      />

      {/* // SECTION : AUTH */}
      {/* // TAG : Login Screen */}
      <Stack.Screen
        options={{
          ...noHeader,
        }}
        name={screenList.loginScreen}
        component={LoginScreen}
      />
      {/* // TAG : Register Screen */}
      <Stack.Screen
        options={{
          ...noHeader,
        }}
        name={screenList.registerScreen}
        component={RegisterScreen}
      />

      {/* // SECTION : DASHBOARD */}
      {/* // TAG : Dashboard Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          headerTitle: "Dashboard",
        }}
        name={screenList.dashboardScreen}
        component={DashboardScreen}
      />

      {/* // SECTION : ANALYTICS */}
      {/* // TAG : Analytics Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "Analytics",
        }}
        name={screenList.analyticsScreen}
        component={AnalyticsScreen}
      />

      {/* // SECTION : TRANSACTION SECTION : */}
      {/* // TAG : Transaction Preview Screen */}
      <Stack.Screen
        options={showHeader}
        name={screenList.transactionPreviewScreen}
        component={TransactionPreviewScreen}
      />

      {/* // TAG : Transaction Details Screen */}
      <Stack.Screen
        options={showHeader}
        name={screenList.transactionDetailsScreen}
        component={EditTransactionDetailsScreen}
      />

      {/* // TAG : New Transaction Details Screen */}
      <Stack.Screen
        options={{
          ...showHeaderNoBack,
          title: "New Transaction",
        }}
        name={screenList.newTransactionDetailsScreen}
        component={NewTransactionDetailsScreen}
      />

      {/* // SECTION : LOGBOOKS */}
      {/* // TAG : Logbook Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "Logbooks",
        }}
        name={screenList.logbookScreen}
        component={LogBookScreen}
      />
      {/* // TAG : My Logbooks Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "My Logbooks",
        }}
        name={screenList.myLogbooksScreen}
        component={MyLogbooksScreen}
      />

      {/* // TAG : Edit Logbook Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "Logbook Preview",
        }}
        name={screenList.logbookPreviewScreen}
        component={LogbookPreviewScren}
      />

      {/* // TAG : Edit Logbook Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "Edit Logbook",
        }}
        name={screenList.editLogbookScreen}
        component={EditLogbookScreen}
      />

      {/* // SECTION : CA SECTION : */}
      {/* // TAG : My Categories Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "My Categories",
        }}
        name={screenList.myCategoriesScreen}
        component={MyCategoriesScreen}
      />

      {/* // TAG : Category Preview Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "Category Preview",
        }}
        name={screenList.categoryPreviewScreen}
        component={CategoryPreviewScreen}
      />

      {/* // TAG : Edit Category Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "Edit Category",
        }}
        name={screenList.editCategoryScreen}
        component={EditCategoryScreen}
      />

      {/* // TAG : New Category Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "New Category",
        }}
        name={screenList.newCategoryScreen}
        component={NewCategoryScreen}
      />

      {/* // SECTION : BUDGETS */}
      {/* // TAG : My Budgets Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "My Budgets",
        }}
        name={screenList.myBudgetsScreen}
        component={MyBudgetsScreen}
      />

      {/* // TAG : My Budgets Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "New Budget",
        }}
        name={screenList.newBudgetScreen}
        component={NewBudgetScreen}
      />

      {/* // TAG : Budget Preview Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "Budget Preview",
        }}
        name={screenList.budgetPreviewScreen}
        component={BudgetPreviewScreen}
      />

      {/* // TAG : Edit Budget Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "Edit Budget",
        }}
        name={screenList.editBudgetScreen}
        component={EditBudgetScreen}
      />

      {/* // SECTION : SEARCH */}
      {/* // TAG : Search Screen */}
      <Stack.Screen
        options={{
          ...noHeader,
        }}
        name={screenList.searchScreen}
        component={SearchScreen}
      />

      {/* // SECTION : USER */}
      {/* // TAG : User Settings Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "User" }}
        name={screenList.userScreen}
        component={UserScreen}
      />

      {/* // TAG : Profile Settings Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Profile Settings" }}
        name={screenList.profileSettingsScreen}
        component={ProfileSettingsScreen}
      />

      {/* // SECTION : SETTINGS */}
      {/* // TAG : Settings Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Settings" }}
        name={screenList.settingsScreen}
        component={SettingsScreen}
      />
      {/* // TAG : Currency Settings Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Currency Settings" }}
        name={screenList.currencySettingsScreen}
        component={CurrencySettingsScreen}
      />

      {/* // TAG : Personalization Settings Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Personalization Settings" }}
        name={screenList.personalizationSettingsScreen}
        component={PersonalizationSettingsScreen}
      />

      {/* // TAG : Account Settings Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Account Settings" }}
        name={screenList.accountSettingsScreen}
        component={AccountSettingsScreen}
      />

      {/* // TAG : Developer Settings Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Developer Settings" }}
        name={screenList.developerSettingsScreen}
        component={DeveloperScreen}
      />

      {/* // TAG : About Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "About" }}
        name={screenList.aboutScreen}
        component={AboutScreen}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
