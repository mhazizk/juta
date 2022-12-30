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

  // ! useEffect for state
  useEffect(() => {
    dispatchLoading({
      type: ACTIONS.LOADING.SET,
      payload: true,
    });
  }, []);

  useEffect(() => {
    if (sortedTransactions) {
      persistStorage.asyncStorage({
        action: PERSIST_ACTIONS.SET,
        key: "sortedTransactions",
        rawValue: sortedTransactions,
      });
    }
  }, [sortedTransactions]);

  useEffect(() => {
    if (appSettings) {
      persistStorage.asyncStorage({
        action: PERSIST_ACTIONS.SET,
        key: "appSettings",
        rawValue: appSettings,
      });
    }
  }, [appSettings]);

  useEffect(() => {
    if (logbooks) {
      persistStorage.asyncStorage({
        action: PERSIST_ACTIONS.SET,
        key: "logbooks",
        rawValue: logbooks,
      });
    }
  }, [logbooks]);

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
      if (json != null) {
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
      initialRouteName={screenList.onboardingScreen}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* // ! Bottom Tab */}
      <Stack.Screen
        name={screenList.bottomTab}
        options={{
          ...noHeader,
        }}
        component={BottomTab}
      />

      {/* // ! MODAL SECTION // */}
      {/* // ! Modal Screen */}
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

      {/* // ! Action Screen */}
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

      {/* // ! Loading Screen */}
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

      {/* // ! DASHBOARD SECTION */}
      {/* // ! Dashboard Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          headerTitle: "Dashboard",
        }}
        name={screenList.dashboardScreen}
        component={DashboardScreen}
      />

      {/* // ! ANALYTICS SECTION */}
      {/* // ! Analytics Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "Analytics",
        }}
        name={screenList.analyticsScreen}
        component={AnalyticsScreen}
      />

      {/* // ! INITIAL SECTION */}
      {/* // ! Onboarding Screen */}
      {!appSettings?.screenHidden?.some(
        (screen) => screen === "Onboarding Screen"
      ) && (
        <Stack.Screen
          options={noHeader}
          name={screenList.onboardingScreen}
          component={OnboardingScreen}
        />
      )}

      {/* // ! Initial Setup Screen */}
      {!appSettings?.screenHidden?.some(
        (screen) => screen === "Initial Setup Screen"
      ) && (
        <Stack.Screen
          options={noHeader}
          name={screenList.initialSetupScreen}
          component={InitialSetupScreen}
        />
      )}

      {/* // ! Splash Screen */}
      {!appSettings?.screenHidden?.some(
        (screen) => screen === "Splash Screen"
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

      {/* // ! TRANSACTION SECTION */}
      {/* // ! Transaction Preview Screen */}
      <Stack.Screen
        options={showHeader}
        name={screenList.transactionPreviewScreen}
        component={TransactionPreviewScreen}
      />

      {/* // ! Transaction Details Screen */}
      <Stack.Screen
        options={showHeader}
        name={screenList.transactionDetailsScreen}
        component={EditTransactionDetailsScreen}
      />

      {/* // ! New Transaction Details Screen */}
      <Stack.Screen
        options={{
          ...showHeaderNoBack,
          title: "New Transaction",
        }}
        name={screenList.newTransactionDetailsScreen}
        component={NewTransactionDetailsScreen}
      />

      {/* // ! LOGBOOKS SECTION */}
      {/* // ! Logbook Screen */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Logbooks",
          headerStyle: {
            backgroundColor: appSettings?.theme?.style?.colors?.header,
          },
        }}
        name={screenList.logbookScreen}
        component={LogBookScreen}
      />
      {/* // ! My Logbooks Screen */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: "My Logbooks",
          headerStyle: {
            backgroundColor: appSettings?.theme?.style?.colors?.header,
          },
        }}
        name={screenList.myLogbooksScreen}
        component={MyLogbooksScreen}
      />

      {/* // ! Edit Logbook Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "Logbook Preview",
        }}
        name={screenList.logbookPreviewScreen}
        component={LogbookPreviewScren}
      />

      {/* // ! Edit Logbook Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "Edit Logbook",
        }}
        name={screenList.editLogbookScreen}
        component={EditLogbookScreen}
      />

      {/* // ! CATEGORIES SECTION */}
      {/* // ! My Categories Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "My Categories",
        }}
        name={screenList.myCategoriesScreen}
        component={MyCategoriesScreen}
      />

      {/* // ! Category Preview Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "Category Preview",
        }}
        name={screenList.categoryPreviewScreen}
        component={CategoryPreviewScreen}
      />

      {/* // ! Edit Category Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "Edit Category",
        }}
        name={screenList.editCategoryScreen}
        component={EditCategoryScreen}
      />

      {/* // ! New Category Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "New Category",
        }}
        name={screenList.newCategoryScreen}
        component={NewCategoryScreen}
      />

      {/* // ! BUDGETS SECTION */}
      {/* // ! My Budgets Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "My Budgets",
        }}
        name={screenList.myBudgetsScreen}
        component={MyBudgetsScreen}
      />

      {/* // ! My Budgets Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "New Budget",
        }}
        name={screenList.newBudgetScreen}
        component={NewBudgetScreen}
      />

      {/* // ! Budget Preview Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "Budget Preview",
        }}
        name={screenList.budgetPreviewScreen}
        component={BudgetPreviewScreen}
      />

      {/* // ! Edit Budget Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "Edit Budget",
        }}
        name={screenList.editBudgetScreen}
        component={EditBudgetScreen}
      />

      {/* // ! SEARCH SECTION */}
      {/* // ! Search Screen */}
      <Stack.Screen
        options={{
          ...noHeader,
        }}
        name={screenList.searchScreen}
        component={SearchScreen}
      />

      {/* // ! USER SECTION */}
      {/* // ! User Settings Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "User" }}
        name={screenList.userScreen}
        component={UserScreen}
      />

      {/* // ! Profile Settings Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Profile Settings" }}
        name={screenList.profileSettingsScreen}
        component={ProfileSettingsScreen}
      />

      {/* // ! SETTINGS SECTION */}
      {/* // ! Settings Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Settings" }}
        name={screenList.settingsScreen}
        component={SettingsScreen}
      />
      {/* // ! Currency Settings Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Currency Settings" }}
        name={screenList.currencySettingsScreen}
        component={CurrencySettingsScreen}
      />

      {/* // ! Personalization Settings Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Personalization Settings" }}
        name={screenList.personalizationSettingsScreen}
        component={PersonalizationSettingsScreen}
      />

      {/* // ! Account Settings Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Account Settings" }}
        name={screenList.accountSettingsScreen}
        component={AccountSettingsScreen}
      />

      {/* // ! Developer Settings Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Developer Settings" }}
        name={screenList.developerSettingsScreen}
        component={DeveloperScreen}
      />

      {/* // ! About Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "About" }}
        name={screenList.aboutScreen}
        component={AboutScreen}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
