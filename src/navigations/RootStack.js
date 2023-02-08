import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  useGlobalAppSettings,
  useGlobalBadgeCounter,
  useGlobalBudgets,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalRepeatedTransactions,
  useGlobalSortedTransactions,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../reducers/GlobalContext";
import MyCategoriesScreen from "../screens/categories/MyCategoriesScreen";
import EditLogbookScreen from "../screens/logbook/EditLogbookScreen";
import MyLogbooksScreen from "../screens/logbook/MyLogbooksScreen";
import ActionScreen from "../screens/modal/ActionScreen";
import LoadingScreen from "../screens/modal/LoadingScreen";
import ModalScreen from "../screens/modal/ModalScreen";
import SplashScreen from "../screens/modal/SplashScreen";
import EditTransactionDetailsScreen from "../features/transactions/screens/EditTransactionDetailsScreen";
import NewTransactionDetailsScreen from "../features/transactions/screens/NewTransactionDetailsScreen";
import TransactionPreviewScreen from "../features/transactions/screens/TransactionPreviewScreen";
import BottomTab from "./BottomTab";
import BudgetPreviewScreen from "../screens/budget/BudgetPreviewScreen";
import EditBudgetScreen from "../screens/budget/EditBudgetScreen";
import MyBudgetsScreen from "../screens/budget/MyBudgetsScreen";
import NewBudgetScreen from "../screens/budget/NewBudgetScreen";
import AnalyticsScreen from "../screens/analytics/AnalyticsScreen";
import InitialSetupScreen from "../features/onboarding/screens/InitialSetupScreen";
import OnboardingScreen from "../features/onboarding/screens/OnboardingScreen";
import CategoryPreviewScreen from "../screens/categories/CategoryPreviewScreen";
import EditCategoryScreen from "../screens/categories/EditCategoryScreen";
import LogbookPreviewScren from "../screens/logbook/LogbookPreviewScreen";
import NewCategoryScreen from "../screens/categories/NewCategoryScreen";
import UserScreen from "../screens/user/UserScreen";
import MyAccountScreen from "../screens/settings/MyAccountScreen";
import DeveloperScreen from "../screens/user/DeveloperScreen";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import SearchScreen from "../screens/search/SearchScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import AboutScreen from "../screens/settings/AboutScreen";
import screenList from "./ScreenList";
import LogbookScreen from "../screens/logbook/LogbookScreen";
import { Alert, TouchableOpacity, View } from "react-native";
import LoginScreen from "../features/auth/screens/LoginScreen";
import UpdatePasswordScreen from "../features/auth/screens/UpdatePasswordScreen";
import firestore from "../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../api/firebase/firestoreCollectionNames";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../api/firebase/auth";
import DashboardTourScreen from "../screens/tour/DashboardTourScreen";
import MyGroupsScreen from "../features/groups/screens/MyGroupsScreen";
import NewGroupScreen from "../features/groups/screens/NewGroupScreen";
import EditGroupScreen from "../features/groups/screens/EditGroupScreen";
import GroupPreviewScreen from "../features/groups/screens/GroupPreviewScreen";
import DevicesScreen from "../features/devices/screens/DevicesScreen";
import IonIcons from "react-native-vector-icons/Ionicons";
import { TextPrimary } from "../components/Text";
import { useNavigation } from "@react-navigation/native";
import ChangeAccountPasswordScreen from "../screens/settings/ChangeAccountPasswordScreen";
import uuid from "react-native-uuid";
import useFirestoreSubscriptions from "../hooks/useFirestoreSubscriptions";
import PaywallScreen from "../features/subscription/screens/PaywallScreen";
import MySubscriptionScreen from "../features/subscription/screens/MySubscriptionScreen";
import SUBSCRIPTION_LIMIT from "../features/subscription/model/subscriptionLimit";
import getSubscriptionLimit from "../features/subscription/logic/getSubscriptionLimit";
import ExportScreen from "../features/export/screens/ExportScreen";
import MyRepeatedTransactionsScreen from "../features/repeated-transactions/screens/MyRepeatedTransactionsScreen";
import RepeatedTransactionsDetailsScreen from "../features/repeated-transactions/screens/RepeatedTransactionDetailsScreen";
import EditRepeatedTransactionScreen from "../features/repeated-transactions/screens/EditRepeatedTransactionScreen";
import REDUCER_ACTIONS from "../reducers/reducer.action";
import FeatureWishlistScreen from "../features/feature-wishlist/screens/FeatureWishlistScreen";
import NewFeatureWishlistScreen from "../features/feature-wishlist/screens/NewFeatureWishlistScreen";
import MyProfilePictureScreen from "../features/profile-picture/screens/MyProfilePictureScreen";
import ImageViewerScreen from "../features/image-viewer/screens/ImageViewerScreen";
import TermsOfServiceScreen from "../features/tos-privacy-policy/screens/TermsOfServiceScreen";
import PrivacyPolicyScreen from "../features/tos-privacy-policy/screens/PrivacyPolicyScreen";
import updateSubscriptionStatus from "../api/revenue-cat/updateSubscriptionStatus";
import SubscriptionHistoryScreen from "../features/subscription/screens/SubscriptionHistoryScreen";
import EmailVerificationScreen from "../features/auth/screens/EmailVerificationScreen";
import LogoutScreen from "../features/auth/screens/LogoutScreen";
import ForgotPasswordScreen from "../features/auth/screens/ForgotPasswordScreen";
import SignUpScreen from "../features/auth/screens/SignUpScreen";
import UpdateEmailScreen from "../features/auth/screens/UpdateEmailScreen";
const Stack = createStackNavigator();

const RootStack = () => {
  const { globalTheme, dispatchGlobalTheme } = useGlobalTheme();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { budgets, dispatchBudgets } = useGlobalBudgets();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { repeatedTransactions, dispatchRepeatedTransactions } =
    useGlobalRepeatedTransactions();
  const navigation = useNavigation();
  const [user, loading, error] = useAuthState(auth);
  const { badgeCounter, dispatchBadgeCounter } = useGlobalBadgeCounter();
  const [lastSettingsUpdate, setLastSettingsUpdate] = useState(
    appSettings?._timestamps?.updated_at
  );

  const userAccountRef = useRef(userAccount);
  const appSettingsRef = useRef(appSettings);
  const logbooksRef = useRef(logbooks);
  const sortedTransactionsRef = useRef(sortedTransactions);
  const categoriesRef = useRef(categories);
  const budgetsRef = useRef(budgets);
  const repeatedTransactionsRef = useRef(repeatedTransactions);
  const badgeCounterRef = useRef(badgeCounter);
  const globalThemeRef = useRef(globalTheme);

  const callback = useCallback(() => {
    useFirestoreSubscriptions({
      uid: userAccount.uid,
      subscribeAll: true,

      appSettings: appSettingsRef,
      dispatchAppSettings: dispatchAppSettings,

      userAccount: userAccountRef,
      dispatchUserAccount: dispatchUserAccount,

      logbooks: logbooksRef,
      dispatchLogbooks: dispatchLogbooks,

      sortedTransactions: sortedTransactionsRef,
      dispatchSortedTransactions: dispatchSortedTransactions,

      categories: categoriesRef,
      dispatchCategories: dispatchCategories,

      repeatedTransactions: repeatedTransactionsRef,
      dispatchRepeatedTransactions: dispatchRepeatedTransactions,

      budgets: budgetsRef,
      dispatchBudgets: dispatchBudgets,

      badgeCounter: badgeCounterRef,
      dispatchBadgeCounter: dispatchBadgeCounter,
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
  ]);

  // TAG : useEffect for state
  useEffect(() => {
    updateSubscriptionStatus({
      appSettings,
      dispatchAppSettings,
      userAccount,
      dispatchUserAccount,
    });
  }, []);
  // Save Sorted Transactions to storage
  useEffect(() => {}, [userAccount]);

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
              <TouchableOpacity
                style={{
                  marginRight: 20,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => {
                  // get logbook limit from subscription plan
                  const logbookLimit = getSubscriptionLimit(
                    userAccount.subscription?.plan,
                    SUBSCRIPTION_LIMIT.LOGBOOKS
                  );

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
                      modalType: "textInput",
                      title: "Create New Log Book",
                      placeholder: "Enter new log book name ...",
                      selected: (item) => {
                        const newLogbook = {
                          _timestamps: {
                            created_at: Date.now(),
                            created_by: userAccount.uid,
                            updated_at: Date.now(),
                            updated_by: userAccount.uid,
                          },
                          uid: userAccount.uid,
                          logbook_currency: {
                            name: "IDR",
                            symbol: "Rp",
                            isoCode: "id",
                          },
                          logbook_type: "basic",
                          group_id: null,
                          logbook_id: uuid.v4(),
                          logbook_name: item,
                          logbook_records: [],
                          logbook_categories: [],
                        };

                        setTimeout(async () => {
                          await firestore.setData(
                            FIRESTORE_COLLECTION_NAMES.LOGBOOKS,
                            newLogbook.logbook_id,
                            newLogbook
                          );
                        }, 5000);

                        dispatchLogbooks({
                          type: REDUCER_ACTIONS.LOGBOOKS.INSERT,
                          payload: newLogbook,
                        });

                        dispatchSortedTransactions({
                          type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
                            .INSERT_LOGBOOK,
                          payload: {
                            newLogbook: {
                              logbook_id: newLogbook.logbook_id,
                              transactions: [],
                            },
                            logbookToOpen: {
                              name: newLogbook.logbook_name,
                              logbook_id: newLogbook.logbook_id,
                              logbook_currency: {
                                name: "IDR",
                                symbol: "Rp",
                                isoCode: "id",
                              },
                            },
                          },
                        });
                      },
                    });
                  }
                }}
              >
                <IonIcons
                  name="add"
                  size={20}
                  color={globalTheme.colors.textHeader}
                />
                <TextPrimary
                  label="Add"
                  style={{ color: globalTheme.colors.textHeader }}
                />
              </TouchableOpacity>
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
              <TouchableOpacity
                style={{
                  marginRight: 20,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => {
                  // console.log(navigation);
                  navigation.navigate(screenList.newCategoryScreen);
                }}
              >
                <IonIcons
                  name="add"
                  size={20}
                  color={globalTheme.colors.textHeader}
                />
                <TextPrimary
                  label="Add"
                  style={{ color: globalTheme.colors.textHeader }}
                />
              </TouchableOpacity>
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

      {/* // SECTION : REPEATED TRANSACTIONS */}
      {/* // TAG : My Repeated Transactions Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "My Repeated Transactions",
          headerRight: () => {
            return (
              <TouchableOpacity
                style={{
                  marginRight: 20,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => {
                  // get repeat limit from subscription plan
                  const repeatLimit = getSubscriptionLimit(
                    userAccount.subscription?.plan,
                    SUBSCRIPTION_LIMIT.RECURRING_TRANSACTIONS
                  );

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
              >
                <IonIcons
                  name="add"
                  size={20}
                  color={globalTheme.colors.textHeader}
                />
                <TextPrimary
                  label="Add"
                  style={{ color: globalTheme.colors.textHeader }}
                />
              </TouchableOpacity>
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

      {/* // SECTION : FEATURE WISHLIST */}
      {/* // TAG : Feature Wishlist Screen */}
      <Stack.Screen
        options={{
          ...showHeader,
          title: "Feature Wishlist",
          headerRight: () => {
            return (
              <TouchableOpacity
                style={{
                  marginRight: 20,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => {
                  if (
                    !getSubscriptionLimit(
                      userAccount.subscription?.plan,
                      SUBSCRIPTION_LIMIT.FEATURE_WISHLIST
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
              >
                <IonIcons
                  name="add"
                  size={20}
                  color={globalTheme.colors.textHeader}
                />
                <TextPrimary
                  label="Add"
                  style={{ color: globalTheme.colors.textHeader }}
                />
              </TouchableOpacity>
            );
          },
        }}
        name={screenList.featureWishlistScreen}
        component={FeatureWishlistScreen}
      />
      {/* // TAG : New Wishlist Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "New Feature Wishlist" }}
        name={screenList.newFeatureWishlistScreen}
        component={NewFeatureWishlistScreen}
      />

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
