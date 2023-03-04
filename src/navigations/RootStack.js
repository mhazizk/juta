import { useNavigation } from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Alert, AppState, View } from "react-native";
import auth from "../api/firebase/auth";
import firestore from "../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../api/firebase/firestoreCollectionNames";
import listenSubscriptionStatus from "../api/revenue-cat/listenSubscriptionStatus";
import MODAL_TYPE_CONSTANTS from "../constants/modalTypeConstants";
import AboutScreen from "../features/about/screens/AboutScreen";
import AnalyticsScreen from "../features/analytics/screens/AnalyticsScreen";
import ChangeAccountPasswordScreen from "../features/auth/screens/ChangeAccountPasswordScreen";
import EmailVerificationScreen from "../features/auth/screens/EmailVerificationScreen";
import ForgotPasswordScreen from "../features/auth/screens/ForgotPasswordScreen";
import LoginScreen from "../features/auth/screens/LoginScreen";
import LogoutScreen from "../features/auth/screens/LogoutScreen";
import SignUpScreen from "../features/auth/screens/SignUpScreen";
import UpdateEmailScreen from "../features/auth/screens/UpdateEmailScreen";
import UpdatePasswordScreen from "../features/auth/screens/UpdatePasswordScreen";
import BudgetPreviewScreen from "../features/budgets/screens/BudgetPreviewScreen";
import EditBudgetScreen from "../features/budgets/screens/EditBudgetScreen";
import MyBudgetsScreen from "../features/budgets/screens/MyBudgetsScreen";
import NewBudgetScreen from "../features/budgets/screens/NewBudgetScreen";
import CategoryPreviewScreen from "../features/categories/screens/CategoryPreviewScreen";
import EditCategoryScreen from "../features/categories/screens/EditCategoryScreen";
import MyCategoriesScreen from "../features/categories/screens/MyCategoriesScreen";
import NewCategoryScreen from "../features/categories/screens/NewCategoryScreen";
import DashboardScreen from "../features/dashboard/screens/DashboardScreen";
import DevicesScreen from "../features/devices/screens/DevicesScreen";
import ExportScreen from "../features/export/screens/ExportScreen";
import EditGroupScreen from "../features/groups/screens/EditGroupScreen";
import GroupPreviewScreen from "../features/groups/screens/GroupPreviewScreen";
import MyGroupsScreen from "../features/groups/screens/MyGroupsScreen";
import NewGroupScreen from "../features/groups/screens/NewGroupScreen";
import ImageViewerScreen from "../features/image-viewer/screens/ImageViewerScreen";
import EditLoanContactScreen from "../features/loan/screens/EditLoanContactScreen";
import LoanContactPreviewScreen from "../features/loan/screens/LoanContactPreviewScreen";
import LoanContactSelectorScreen from "../features/loan/screens/LoanContactSelectorScreen";
import MyLoansScreen from "../features/loan/screens/MyLoansScreen";
import NewLoanContactScreen from "../features/loan/screens/NewLoanContactScreen";
import createNewLogbook from "../features/logbook/model/createNewLogbookAndSyncToFirestore";
import EditLogbookScreen from "../features/logbook/screens/EditLogbookScreen";
import LogbookPreviewScren from "../features/logbook/screens/LogbookPreviewScreen";
import LogbookScreen from "../features/logbook/screens/LogbookScreen";
import MyLogbooksScreen from "../features/logbook/screens/MyLogbooksScreen";
import MyAccountScreen from "../features/my-account/screens/MyAccountScreen";
import InitialSetupScreen from "../features/onboarding/screens/InitialSetupScreen";
import OnboardingScreen from "../features/onboarding/screens/OnboardingScreen";
import MyProfilePictureScreen from "../features/profile-picture/screens/MyProfilePictureScreen";
import EditRepeatedTransactionScreen from "../features/repeated-transactions/screens/EditRepeatedTransactionScreen";
import MyRepeatedTransactionsScreen from "../features/repeated-transactions/screens/MyRepeatedTransactionsScreen";
import RepeatedTransactionsDetailsScreen from "../features/repeated-transactions/screens/RepeatedTransactionDetailsScreen";
import SearchScreen from "../features/search/screens/SearchScreen";
import SettingsScreen from "../features/settings/screens/SettingsScreen";
import SplashScreen from "../features/splash-screen/screens/SplashScreen";
import getFeatureLimit from "../features/subscription/logic/getFeatureLimit";
import FEATURE_NAME from "../features/subscription/model/featureName";
import MySubscriptionScreen from "../features/subscription/screens/MySubscriptionScreen";
import PaywallScreen from "../features/subscription/screens/PaywallScreen";
import SubscriptionHistoryScreen from "../features/subscription/screens/SubscriptionHistoryScreen";
import NoInternetScreen from "../features/system/screens/NoInternetScreen";
import PrivacyPolicyScreen from "../features/tos-privacy-policy/screens/PrivacyPolicyScreen";
import TermsOfServiceScreen from "../features/tos-privacy-policy/screens/TermsOfServiceScreen";
import EditTransactionDetailsScreen from "../features/transactions/screens/EditTransactionDetailsScreen";
import NewTransactionDetailsScreen from "../features/transactions/screens/NewTransactionDetailsScreen";
import TransactionPreviewScreen from "../features/transactions/screens/TransactionPreviewScreen";
import DeveloperScreen from "../features/user/screens/DeveloperScreen";
import UserScreen from "../features/user/screens/UserScreen";
import useFirestoreSubscriptions from "../hooks/useFirestoreSubscriptions";
import {
  useGlobalAppSettings,
  useGlobalBadgeCounter,
  useGlobalBudgets,
  useGlobalCategories,
  useGlobalCurrencyRates,
  useGlobalFeatureSwitch,
  useGlobalLoan,
  useGlobalLogbooks,
  useGlobalRepeatedTransactions,
  useGlobalSortedTransactions,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../reducers/GlobalContext";
import REDUCER_ACTIONS from "../reducers/reducer.action";
import ActionScreen from "../screens/modal/ActionScreen";
import LoadingScreen from "../screens/modal/LoadingScreen";
import ModalScreen from "../screens/modal/ModalScreen";
import DashboardTourScreen from "../screens/tour/DashboardTourScreen";
import BottomTab from "./BottomTab";
import HeaderButtonRight from "./components/HeaderButtonRight";
import screenList from "./ScreenList";
const Stack = createStackNavigator();

const RootStack = () => {
  const { globalTheme, dispatchGlobalTheme } = useGlobalTheme();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { globalCurrencyRates, dispatchGlobalCurrencyRates } =
    useGlobalCurrencyRates();
  const { globalLoan, dispatchGlobalLoan } = useGlobalLoan();
  const { budgets, dispatchBudgets } = useGlobalBudgets();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { repeatedTransactions, dispatchRepeatedTransactions } =
    useGlobalRepeatedTransactions();
  const { globalFeatureSwitch, dispatchGlobalFeatureSwitch } =
    useGlobalFeatureSwitch();
  const navigation = useNavigation();
  const [user, loading, error] = useAuthState(auth);
  const { badgeCounter, dispatchBadgeCounter } = useGlobalBadgeCounter();
  const [lastSettingsUpdate, setLastSettingsUpdate] = useState(
    appSettings?._timestamps?.updated_at
  );
  const appState = useRef(AppState.currentState);
  const userAccountRef = useRef(userAccount);
  const appSettingsRef = useRef(appSettings);
  const logbooksRef = useRef(logbooks);
  const sortedTransactionsRef = useRef(sortedTransactions);
  const categoriesRef = useRef(categories);
  const budgetsRef = useRef(budgets);
  const repeatedTransactionsRef = useRef(repeatedTransactions);
  const badgeCounterRef = useRef(badgeCounter);
  const globalThemeRef = useRef(globalTheme);
  const globalCurrencyRatesRef = useRef(globalCurrencyRates);
  const globalLoanRef = useRef(globalLoan);

  const callback = useCallback(() => {
    useFirestoreSubscriptions({
      uid: userAccount.uid,
      appSettings: appSettingsRef,
      dispatchAppSettings,

      userAccount: userAccountRef,
      dispatchUserAccount,

      logbooks: logbooksRef,
      dispatchLogbooks,

      sortedTransactions: sortedTransactionsRef,
      dispatchSortedTransactions,

      categories: categoriesRef,
      dispatchCategories,

      repeatedTransactions: repeatedTransactionsRef,
      dispatchRepeatedTransactions,

      budgets: budgetsRef,
      dispatchBudgets,

      badgeCounter: badgeCounterRef,
      dispatchBadgeCounter,

      globalCurrencyRates: globalCurrencyRatesRef,
      dispatchGlobalCurrencyRates,

      globalLoan: globalLoanRef,
      dispatchGlobalLoan,
    });
  }, [
    userAccountRef,
    appSettingsRef,
    logbooksRef,
    sortedTransactionsRef,
    categoriesRef,
    budgetsRef,
    badgeCounterRef,
    globalThemeRef,
    globalCurrencyRatesRef,
    globalLoanRef,
  ]);

  // TAG : useEffect for state
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {

        // TODO : commented for testing on iOS simulator
        // listenSubscriptionStatus({
        //   globalFeatureSwitch,
        //   appSettings,
        //   userAccount,
        //   callback: ({ newUserAccount, newAppSettings }) => {
        //     dispatchAppSettings({
        //       type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
        //       payload: newAppSettings,
        //     });

        //     dispatchUserAccount({
        //       type: REDUCER_ACTIONS.USER_ACCOUNT.SET_MULTI_ACTIONS,
        //       payload: newUserAccount,
        //     });
        //     setTimeout(async () => {
        //       await firestore.setData(
        //         FIRESTORE_COLLECTION_NAMES.USERS,
        //         newUserAccount.uid,
        //         newUserAccount
        //       );
        //       await firestore.setData(
        //         FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
        //         newUserAccount.uid,
        //         newAppSettings
        //       );
        //     }, 5000);
        //   },
        // });
      }
      appState.current = nextAppState;
      console.log(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);
  // Save Sorted Transactions to storage
  useEffect(() => {
    console.log(JSON.stringify({ globalFeatureSwitch }, null, 2));
  }, [globalFeatureSwitch]);

  useEffect(() => {
    if (logbooks.logbooks) {
    }
  }, [logbooks]);

  useEffect(() => {
    if (
      !!appSettings?.theme_id &&
      appSettings?.theme_id !== globalTheme.identifier.id
    ) {
      setTimeout(() => {
        dispatchGlobalTheme({
          type: REDUCER_ACTIONS.THEME.SET,
          payload: appSettings?.theme_id,
        });
      }, 1);
    }
  }, [appSettings?.theme_id]);

  // useEffect(() => {
  // }, [appSettings]);

  useEffect(() => {
    console.log(JSON.stringify({ globalCurrencyRates }, null, 2));
  }, [globalCurrencyRates]);

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
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: globalTheme.colors.textHeader,
        headerBackground: () => (
          <>
            <View
              style={{
                backgroundColor: globalTheme.colors.header,
                flex: 1,
              }}
            />
          </>
        ),
      }}
    >
      {/* // SECTION : INITIAL */}
      {/* // TAG : Splash Screen */}
      <Stack.Screen
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
        name={screenList.splashScreen}
        component={SplashScreen}
      />

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
        options={noHeader}
        component={BottomTab}
      />

      {/* // SECTION : MODAL AND SYSTEM // */}
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

      {/* // TAG : No Internet Screen */}
      <Stack.Screen
        options={{
          ...noHeader,
        }}
        name={screenList.noInternetScreen}
        component={NoInternetScreen}
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
      {/* // TAG : Logout Screen */}
      <Stack.Screen
        options={{
          ...noHeader,
        }}
        name={screenList.logoutScreen}
        component={LogoutScreen}
      />
      {/* // TAG : Sign Up Screen */}
      <Stack.Screen
        options={{
          ...noHeader,
        }}
        name={screenList.signUpScreen}
        component={SignUpScreen}
      />

      {/* // TAG : Email Verification Screen */}
      <Stack.Screen
        options={{
          ...noHeader,
        }}
        name={screenList.emailVerificationScreen}
        component={EmailVerificationScreen}
      />

      {/* // TAG : Update Password Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "Update Password",
        }}
        name={screenList.updatePasswordScreen}
        component={UpdatePasswordScreen}
      />

      {/* // TAG : Update Password Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "Update Email",
        }}
        name={screenList.updateEmailScreen}
        component={UpdateEmailScreen}
      />

      {/* // TAG : Forgot Password Screen */}
      <Stack.Screen
        options={{
          ...noHeader,
        }}
        name={screenList.forgotPasswordScreen}
        component={ForgotPasswordScreen}
      />

      {/* // SECTION : TOUR SCREEN */}
      <Stack.Screen
        options={{
          ...noHeader,
          cardOverlayEnabled: true,
          detachPreviousScreen: false,
          cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid,
          cardStyle: { backgroundColor: "transparent" },
        }}
        name={screenList.dashboardTourScreen}
        component={DashboardTourScreen}
      />

      {/* // SECTION : DASHBOARD */}
      {/* // TAG : Dashboard Screen */}
      <Stack.Screen
        options={{
          ...noHeader,
          // headerTitle: "Dashboard",
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
        component={LogbookScreen}
      />
      {/* // TAG : My Logbooks Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "My Logbooks",
          headerRight: () => {
            return (
              <HeaderButtonRight
                textLabel="Add"
                iconName="add"
                onPress={() => {
                  // get logbook limit from subscription plan
                  const logbookLimit = getFeatureLimit({
                    globalFeatureSwitch,
                    subscriptionPlan: userAccount.subscription?.plan,
                    featureName: FEATURE_NAME.LOGBOOKS,
                  });

                  // check if user has reached the limit
                  if (logbookLimit === logbooks.logbooks?.length) {
                    // show alert
                    Alert.alert(
                      "Logbook Limit Reached",
                      `You have reached the limit of ${logbookLimit} logbooks. Please upgrade your subscription to add more logbooks.`
                    );
                  }

                  // if not, show modal to create new logbook
                  if (logbookLimit > logbooks.logbooks?.length) {
                    // console.log(navigation);
                    navigation.navigate(screenList.modalScreen, {
                      modalType: MODAL_TYPE_CONSTANTS.TEXT_INPUT,
                      title: "Create new logbook",
                      placeholder: "Enter new logbook name...",
                      selected: (item) => {
                        createNewLogbook({
                          dispatchLogbooks,
                          dispatchSortedTransactions,
                          logbookName: item,
                          uid: userAccount.uid,
                          defaultCurrency:
                            appSettings.logbookSettings.defaultCurrency,
                        });
                      },
                    });
                  }
                }}
              />
            );
          },
        }}
        name={screenList.myLogbooksScreen}
        component={MyLogbooksScreen}
      />

      {/* // TAG : Logbook Preview Screen */}
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

      {/* // SECTION : CATEGORIES SECTION : */}
      {/* // TAG : My Categories Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "My Categories",
          headerRight: () => {
            return (
              <HeaderButtonRight
                textLabel="Add"
                iconName="add"
                onPress={() => {
                  navigation.navigate(screenList.newCategoryScreen);
                }}
              />
            );
          },
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

      {/* // SECTION : MY GROUPS */}
      {/* // TAG : My Groups Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "My Groups",
        }}
        name={screenList.myGroupsScreen}
        component={MyGroupsScreen}
      />
      {/* // TAG : New Group Screen */}
      <Stack.Screen
        options={{
          ...noHeader,
        }}
        name={screenList.newGroupScreen}
        component={NewGroupScreen}
      />
      {/* // TAG : Edit Group Screen */}
      <Stack.Screen
        options={{
          ...noHeader,
        }}
        name={screenList.editGroupScreen}
        component={EditGroupScreen}
      />
      {/* // TAG : Group Preview Screen */}
      <Stack.Screen
        options={{
          ...noHeader,
        }}
        name={screenList.groupPreviewScreen}
        component={GroupPreviewScreen}
      />

      {/* // SECTION : USER */}
      {/* // TAG : User Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "User" }}
        name={screenList.userScreen}
        component={UserScreen}
      />
      {/* // SECTION : Loans */}
      {/* // TAG : My Loans Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "My Loans",
          headerRight: () => {
            return (
              <HeaderButtonRight
                textLabel="Add contact"
                iconName="add"
                onPress={() => {
                  // get repeat limit from subscription plan
                  const loanContactsLimit = getFeatureLimit({
                    globalFeatureSwitch,
                    subscriptionPlan: userAccount.subscription?.plan,
                    featureName: FEATURE_NAME.LOAN,
                  });

                  const currentLoanContacts = globalLoan.contacts.length;

                  // check if user has reached the limit
                  if (currentLoanContacts >= loanContactsLimit) {
                    // show alert
                    Alert.alert(
                      "Upgrade Subscription",
                      `Upgrade your subscription to add new loan contacts.`,
                      [
                        { text: "Cancel", onPress: () => {}, style: "cancel" },
                        {
                          text: "Upgrade",
                          onPress: () => {
                            navigation.navigate(screenList.paywallScreen);
                          },
                        },
                      ]
                    );
                  } else {
                    navigation.navigate(screenList.newLoanContactScreen, {
                      fromScreen: screenList.myLoansScreen,
                      targetScreen: screenList.myLoansScreen,
                    });
                  }
                }}
              />
            );
          },
        }}
        name={screenList.myLoansScreen}
        component={MyLoansScreen}
      />
      {/* // TAG : New Loan Contact Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "New Loan Contact" }}
        name={screenList.newLoanContactScreen}
        component={NewLoanContactScreen}
      />
      {/* // TAG : Edit Loan Contact Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Edit Loan Contact" }}
        name={screenList.editLoanContactScreen}
        component={EditLoanContactScreen}
      />
      {/* // TAG : Loan Contact Preview Screen */}
      <Stack.Screen
        options={({ route }) => ({
          ...showHeader,
          title: "Loan Contact Preview",
          // headerRight: () => {
          //   return (
          //     <HeaderButtonRight
          //       textLabel="Edit"
          //       iconName="create-outline"
          //       onPress={() => {
          //         navigation.navigate(screenList.editLoanContactScreen, {
          //           contact: route.params.contact,
          //           loanContactTransactionDetails:
          //             route.params.loanContactTransactionDetails,
          //           targetScreen: route.params.targetScreen,
          //         });
          //       }}
          //     />
          //   );
          // },
        })}
        name={screenList.loanContactPreviewScreen}
        component={LoanContactPreviewScreen}
      />
      {/* // TAG : Loan Contact Selector Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Select Loan Contact" }}
        name={screenList.loanContactSelectorScreen}
        component={LoanContactSelectorScreen}
      />

      {/* // SECTION : REPEATED TRANSACTIONS */}
      {/* // TAG : My Repeated Transactions Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "My Repeated Transactions",
          headerRight: () => {
            return (
              <HeaderButtonRight
                textLabel="Add"
                iconName="add"
                onPress={() => {
                  // get repeat limit from subscription plan
                  const repeatLimit = getFeatureLimit({
                    globalFeatureSwitch,
                    subscriptionPlan: userAccount.subscription?.plan,
                    featureName: FEATURE_NAME.RECURRING_TRANSACTIONS,
                  });

                  // check if user has reached the limit
                  if (!repeatLimit) {
                    // show alert
                    Alert.alert(
                      "Upgrade Subscription",
                      `Upgrade your subscription to add new repeated transactions.`,
                      [
                        { text: "OK", onPress: () => {}, style: "cancel" },
                        {
                          text: "Upgrade",
                          onPress: () => {
                            navigation.navigate(screenList.paywallScreen);
                          },
                        },
                      ]
                    );
                  }

                  // if not, show modal to create new transaction
                  if (repeatLimit) {
                    navigation.navigate(screenList.newTransactionDetailsScreen);
                  }
                }}
              />
            );
          },
        }}
        name={screenList.myRepeatedTransactionsScreen}
        component={MyRepeatedTransactionsScreen}
      />
      {/* // TAG : Repeated Transaction Details Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Repeated Transaction Details" }}
        name={screenList.repeatedTransactionDetailsScreen}
        component={RepeatedTransactionsDetailsScreen}
      />
      {/* // TAG : Edit Repeated Transaction Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Edit Repeated Transaction" }}
        name={screenList.editRepeatedTransactionScreen}
        component={EditRepeatedTransactionScreen}
      />

      {/* // SECTION : DEVICES */}
      {/* // TAG : Devices Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Active Devices" }}
        name={screenList.devicesScreen}
        component={DevicesScreen}
      />

      {/* // SECTION : ACCOUNT CREDENTIALS */}
      {/* // TAG : Devices Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Change Password" }}
        name={screenList.changeAccountPasswordScreen}
        component={ChangeAccountPasswordScreen}
      />

      {/* // SECTION : SUBSCRIPTION */}
      {/* // TAG : Subscription History Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Subscription History" }}
        name={screenList.subscriptionHistoryScreen}
        component={SubscriptionHistoryScreen}
      />
      {/* // TAG : My Subscription Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "My Subscription" }}
        name={screenList.mySubscriptionScreen}
        component={MySubscriptionScreen}
      />
      {/* // TAG : Paywall Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Subscription Plan" }}
        name={screenList.paywallScreen}
        component={PaywallScreen}
      />

      {/* // TODO : Hold all this feature */}
      {/* // SECTION : FEATURE WISHLIST */}
      {/* // TAG : Feature Wishlist Screen */}
      {/* <Stack.Screen
        options={{
          ...showHeader,
          title: "Feature Wishlist",
          headerRight: () => {
            return (
              <HeaderButtonRight
                textLabel="Add"
                iconName="add"
                onPress={() => {
                  if (
                    !getFeatureLimit(
                      {globalFeatureSwitch,
                        subscriptionPlan:
                        userAccount.subscription?.plan,
                        featureName:
                      FEATURE_NAME.FEATURE_WISHLIST}
                    )
                  ) {
                    // show alert
                    Alert.alert(
                      "Upgrade to Premium",
                      `Upgrade your subscription to add new feature wishlist.`,
                      [
                        { text: "OK", onPress: () => {}, style: "cancel" },
                        {
                          text: "Upgrade",
                          onPress: () => {
                            navigation.navigate(screenList.paywallScreen);
                          },
                        },
                      ]
                    );
                  } else {
                    navigation.navigate(screenList.newFeatureWishlistScreen);
                  }
                }}
              />
            );
          },
        }}
        name={screenList.featureWishlistScreen}
        component={FeatureWishlistScreen}
      /> */}
      {/* // TAG : New Wishlist Screen */}
      {/* <Stack.Screen
        options={{ ...showHeader, title: "New Feature Wishlist" }}
        name={screenList.newFeatureWishlistScreen}
        component={NewFeatureWishlistScreen}
      /> */}

      {/* // SECTION : TERMS OF SERVICE */}
      {/* // TAG : Terms of Service Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Terms of Service" }}
        name={screenList.termsOfServiceScreen}
        component={TermsOfServiceScreen}
      />
      {/* // SECTION : PRIVACY POLICY */}
      {/* // TAG : Privacy Policy Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Privacy Policy" }}
        name={screenList.privacyPolicyScreen}
        component={PrivacyPolicyScreen}
      />
      {/* // SECTION : EXPORT */}
      {/* // TAG : Subscription Plan Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Export Data" }}
        name={screenList.exportScreen}
        component={ExportScreen}
      />

      {/* // SECTION : MY PROFILE PICTURE */}
      {/* // TAG : My Profile Picture Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "My Profile Picture" }}
        name={screenList.myProfilePictureScreen}
        component={MyProfilePictureScreen}
      />

      {/* // SECTION : IMAGE VIEWER */}
      {/* // TAG : Image Viewer Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "Attachment Image" }}
        name={screenList.imageViewerScreen}
        component={ImageViewerScreen}
      />
      {/* // SECTION : SETTINGS */}
      {/* // TAG : Settings Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "Settings",
        }}
        name={screenList.settingsScreen}
        component={SettingsScreen}
      />

      {/* // TAG : Account Settings Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "My Account" }}
        name={screenList.myAccountScreen}
        component={MyAccountScreen}
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
