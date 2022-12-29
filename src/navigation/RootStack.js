import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import BottomTab from "./BottomTab";
import ActionScreen from "./screens/ActionScreen";
import ModalScreen from "./screens/ModalScreen";
import TransactionPreviewScreen from "./screens/logbook/TransactionPreviewScreen";
import EditTransactionDetailsScreen from "./screens/logbook/EditTransactionDetailsScreen";
import { useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useGlobalUserAccount,
  useGlobalAppSettings,
  useGlobalTransactions,
  useGlobalSortedTransactions,
  useGlobalLoading,
  useGlobalLogbooks,
  useGlobalCategories,
} from "../utils/GlobalContext";
import { ACTIONS } from "../utils/GlobalReducer";
import {
  setSortedTransactions
} from "../utils/FetchData";
import NewTransactionDetailsScreen from "./screens/logbook/NewTransactionDetailsScreen";
import LoadingScreen from "./screens/LoadingScreen";
import SplashScreen from "./screens/SplashScreen";
import MyLogbooksScreen from "./screens/user/MyLogbooksScreen";
import MyCategoriesScreen from "./screens/user/MyCategoriesScreen";
import EditLogbookScreen from "./screens/user/EditLogbookScreen";
import LogbookPreviewScren from "./screens/user/LogbookPreviewScreen";
import OnboardingScreen from "./screens/initial/OnboardingScreen";
// import { persistStorage.asyncStorage, PERSIST_ACTIONS } from "../utils/Storage";
import persistStorage from "../reducers/persist/persistStorage";
import PERSIST_ACTIONS from "../reducers/persist/persist.actions";
import InitialSetupScreen from "./screens/initial/InitialSetupScreen";
import CategoryPreviewScreen from "./screens/user/CategoryPreviewScreen";
import EditCategoryScreen from "./screens/user/EditCategoryScreen";
import NewCategoryScreen from "./screens/user/NewCategoryScreen";
import MyBudgetsScreen from "./screens/budget/MyBudgetsScreen";
import NewBudgetScreen from "./screens/budget/NewBudgetScreen";
import BudgetPreviewScreen from "./screens/budget/BudgetPreviewScreen";
import EditBudgetScreen from "./screens/budget/EditBudgetScreen";
import AnalyticsScreen from "./screens/dashboard/AnalyticsScreen";
import persistStorage from "../reducers/persist/persistStorage";

const Stack = createStackNavigator();

const screens = {
  // Main tab navigator
  bottomTab: "Bottom Tab",

  // First Screen to show
  initialSplashScreen: "Initial Splash Screen",
  initialSetupScreen: "Initial Setup Screen",
  splashScreen: "Splash Screen",
  onboardingScreen: "Onboarding Screen",

  // Transactions Screen
  transactionDetailsScreen: "Transaction Details Screen",
  newTransactionDetailsScreen: "New Transaction Details Screen",
  transactionPreviewScreen: "Transaction Preview Screen",

  // User Screen
  newCategoryScreen: "New Category Screen",
  myCategoriesScreen: "My Categories Screen",
  categoryPreviewScreen: "Category Preview Screen",
  editCategoryScreen: "Edit Category Screen",
  myLogbooksScreen: "My Logbooks Screen",
  logbookPreviewScreen: "Logbook Preview Screen",
  editLogbookScreen: "Edit Logbook Screen",

  // Budget Screen
  myBudgetsScreen: "My Budgets Screen",
  newBudgetScreen: "New Budget Screen",
  editBudgetScreen: "Edit Budget Screen",
  budgetPreviewScreen: "Budget Preview Screen",

  // Analytics Screen
  analyticsScreen: "Analytics Screen",

  // Modal Screen
  modalScreen: "Modal Screen",
  actionScreen: "Action Screen",
  loadingScreen: "Loading Screen",
};

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

  return (
    <Stack.Navigator
      initialRouteName={screens.onboardingScreen}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* // ! Onboarding Screen */}
      {!appSettings?.screenHidden?.some(
        (screen) => screen === "Onboarding Screen"
      ) && (
        <Stack.Screen
          options={{
            headerShown: false,
            title: "",
            // headerLeft: (leftHeader) => (
            //     <>
            //     </>
            // )
          }}
          name={screens.onboardingScreen}
          component={OnboardingScreen}
        />
      )}

      {/* // ! Initial Setup Screen */}
      {!appSettings?.screenHidden?.some(
        (screen) => screen === "Initial Setup Screen"
      ) && (
        <Stack.Screen
          options={{
            headerShown: false,
            title: "",
            // headerLeft: (leftHeader) => (
            //     <>
            //     </>
            // )
          }}
          name={screens.initialSetupScreen}
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
          name={screens.splashScreen}
          component={SplashScreen}
        />
      )}

      {/* // ! Bottom Tab */}
      <Stack.Screen
        name={screens.bottomTab}
        options={{
          title: "New Transaction",
          headerLeft: (leftHeader) => <></>,
        }}
        component={BottomTab}
      />

      {/* // ! Modal Screen */}
      <Stack.Screen
        options={{
          presentation: "transparentModal",
          headerShown: false,
          cardOverlayEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid,
        }}
        name={screens.modalScreen}
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
        name={screens.actionScreen}
        component={ActionScreen}
      />

      {/* // ! Transaction Preview Screen */}
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: appSettings?.theme?.style?.colors?.header,
          },
          // title:'New Transaction',
          // headerLeft: (leftHeader) => (
          //     <>
          // {/* <TouchableOpacity onPress={()=>navigation.pop(1)} style={{paddingHorizontal:11}}>
          //     <IonIcons name='close' size={24} style={{ margin: 3 }} />
          // </TouchableOpacity> */}
          // </>)
        }}
        name={screens.transactionPreviewScreen}
        component={TransactionPreviewScreen}
      />

      {/* // ! Transaction Details Screen */}
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: appSettings?.theme?.style?.colors?.header,
          },
          // title:'New Transaction',
          // headerLeft: (leftHeader) => (
          //     <>
          // {/* <TouchableOpacity onPress={()=>navigation.pop(1)} style={{paddingHorizontal:11}}>
          //     <IonIcons name='close' size={24} style={{ margin: 3 }} />
          // </TouchableOpacity> */}
          // </>)
        }}
        name={screens.transactionDetailsScreen}
        component={EditTransactionDetailsScreen}
      />

      {/* // ! New Transaction Details Screen */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: "New Transaction",
          headerStyle: {
            backgroundColor: appSettings?.theme?.style?.colors?.header,
          },
          headerLeft: (leftHeader) => <></>,
        }}
        name={screens.newTransactionDetailsScreen}
        component={NewTransactionDetailsScreen}
      />

      {/* // ! My Logbooks Screen */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: "My Logbooks",
          headerStyle: {
            backgroundColor: appSettings?.theme?.style?.colors?.header,
          },
          // headerLeft: (leftHeader) => (
          //     <>
          //     </>
          // )
        }}
        name={screens.myLogbooksScreen}
        component={MyLogbooksScreen}
      />

      {/* // ! Edit Logbook Screen */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Logbook Preview",
          headerStyle: {
            backgroundColor: appSettings?.theme?.style?.colors?.header,
          },
          // headerLeft: (leftHeader) => (
          //     <>
          //     </>
          // )
        }}
        name={screens.logbookPreviewScreen}
        component={LogbookPreviewScren}
      />

      {/* // ! Edit Logbook Screen */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Edit Logbook",
          headerStyle: {
            backgroundColor: appSettings?.theme?.style?.colors?.header,
          },
          // headerLeft: (leftHeader) => (
          //     <>
          //     </>
          // )
        }}
        name={screens.editLogbookScreen}
        component={EditLogbookScreen}
      />

      {/* // ! My Categories Screen */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: "My Categories",
          headerStyle: {
            backgroundColor: appSettings?.theme?.style?.colors?.header,
          },
          // headerLeft: (leftHeader) => (
          //     <>
          //     </>
          // )
        }}
        name={screens.myCategoriesScreen}
        component={MyCategoriesScreen}
      />

      {/* // ! Category Preview Screen */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Category Preview",
          headerStyle: {
            backgroundColor: appSettings?.theme?.style?.colors?.header,
          },
          // headerLeft: (leftHeader) => (
          //     <>
          //     </>
          // )
        }}
        name={screens.categoryPreviewScreen}
        component={CategoryPreviewScreen}
      />

      {/* // ! Edit Category Screen */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Edit Category",
          headerStyle: {
            backgroundColor: appSettings?.theme?.style?.colors?.header,
          },
          // headerLeft: (leftHeader) => (
          //     <>
          //     </>
          // )
        }}
        name={screens.editCategoryScreen}
        component={EditCategoryScreen}
      />

      {/* // ! New Category Screen */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: "New Category",
          headerStyle: {
            backgroundColor: appSettings?.theme?.style?.colors?.header,
          },
        }}
        name={screens.newCategoryScreen}
        component={NewCategoryScreen}
      />

      {/* // ! My Budgets Screen */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: "My Budgets",
          headerStyle: {
            backgroundColor: appSettings?.theme?.style?.colors?.header,
          },
          // headerLeft: (leftHeader) => (
          //     <>
          //     </>
          // )
        }}
        name={screens.myBudgetsScreen}
        component={MyBudgetsScreen}
      />

      {/* // ! My Budgets Screen */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: "New Budget",
          headerStyle: {
            backgroundColor: appSettings?.theme?.style?.colors?.header,
          },
          // headerLeft: (leftHeader) => (
          //     <>
          //     </>
          // )
        }}
        name={screens.newBudgetScreen}
        component={NewBudgetScreen}
      />

      {/* // ! Budget Preview Screen */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Budget Preview",
          headerStyle: {
            backgroundColor: appSettings?.theme?.style?.colors?.header,
          },
          // headerLeft: (leftHeader) => (
          //     <>
          //     </>
          // )
        }}
        name={screens.budgetPreviewScreen}
        component={BudgetPreviewScreen}
      />

      {/* // ! Analytics Screen */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Analytics",
          headerStyle: {
            backgroundColor: appSettings?.theme?.style?.colors?.header,
          },
          // headerLeft: (leftHeader) => (
          //     <>
          //     </>
          // )
        }}
        name={screens.analyticsScreen}
        component={AnalyticsScreen}
      />

      {/* // ! Edit Budget Screen */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Edit Budget",
          headerStyle: {
            backgroundColor: appSettings?.theme?.style?.colors?.header,
          },
          // headerLeft: (leftHeader) => (
          //     <>
          //     </>
          // )
        }}
        name={screens.editBudgetScreen}
        component={EditBudgetScreen}
      />

      {/* // ! Action Screen */}
      <Stack.Screen
        options={{
          gestureEnabled: false,
          presentation: "transparentModal",
          headerShown: false,
          cardOverlayEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid,
        }}
        name={screens.loadingScreen}
        component={LoadingScreen}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
