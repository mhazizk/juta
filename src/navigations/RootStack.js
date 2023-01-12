import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { useEffect, useMemo, useState } from "react";
import { setSortedTransactions } from "../utils/FetchData";
import persistStorage from "../reducers/persist/persistStorage";
import PERSIST_ACTIONS from "../reducers/persist/persist.actions";
import {
  useGlobalAppSettings,
  useGlobalBadgeCounter,
  useGlobalBudgets,
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
import UserScreen from "../screens/user/UserScreen";
import AccountSettingsScreen from "../screens/settings/AccountSettingsScreen";
import DeveloperScreen from "../screens/user/DeveloperScreen";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import SearchScreen from "../screens/search/SearchScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import AboutScreen from "../screens/settings/AboutScreen";
import screenList from "./ScreenList";
import LogBookScreen from "../screens/logbook/LogBookScreen";
import { Alert, BackHandler, TouchableOpacity } from "react-native";
import REDUCER_ACTIONS from "../reducers/reducer.action";
import LoginScreen from "../screens/auth/LoginScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
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
const Stack = createStackNavigator();

const RootStack = () => {
  const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { isLoading, dispatchLoading } = useGlobalLoading();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { budgets, dispatchBudgets } = useGlobalBudgets();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();
  const navigation = useNavigation();
  const [user, loading, error] = useAuthState(auth);
  const { badgeCounter, setBadgeCounter } = useGlobalBadgeCounter();

  const subscription = ({ uid, subscribeAll, unsubscribeAll }) => {
    const unsubscribeAppSettings = firestore.getAndListenOneDoc(
      FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
      uid,
      (data) => {
        setBadgeCounter({
          ...badgeCounter,
          userTab: badgeCounter.userTab + 1,
        });
        dispatchAppSettings({
          type: REDUCER_ACTIONS.APP_SETTINGS.FORCE_SET,
          payload: data,
        });
      },
      (error) => alert(error)
    );
    // unsubscribeAppSettings = userAccountSubscription;

    const unsubscribeUserAccount = firestore.getAndListenOneDoc(
      FIRESTORE_COLLECTION_NAMES.USERS,
      uid,
      (data) => {
        setBadgeCounter({
          ...badgeCounter,
          userTab: badgeCounter.userTab + 1,
        });
        dispatchUserAccount({
          type: REDUCER_ACTIONS.USER_ACCOUNT.FORCE_SET,
          payload: data,
        });
      },
      (error) => alert(error)
    );
    // unsubscribeUserAccount = userAccountSubscription;

    const unsubscribeLogbooks = firestore.getAndListenMultipleDocs(
      FIRESTORE_COLLECTION_NAMES.LOGBOOKS,
      uid,
      (error) => alert(error),
      (data) => {},
      (data, type) => {
        switch (type) {
          case "added":
            dispatchLogbooks({
              type: REDUCER_ACTIONS.LOGBOOKS.INSERT,
              payload: data,
            });
            break;
          case "modified":
            dispatchLogbooks({
              type: REDUCER_ACTIONS.LOGBOOKS.PATCH,
              payload: data,
            });
            break;
          case "removed":
            dispatchLogbooks({
              type: REDUCER_ACTIONS.LOGBOOKS.DELETE_ONE,
              payload: data,
            });
            break;

          default:
            break;
        }
      }
      // dispatchLogbooks({
      //   type: REDUCER_ACTIONS.LOGBOOKS.SET,
      //   payload: data,
      // })
    );
    // unsubscribeLogbooks = logbooksSubscription;

    const unsubscribeTransactions = firestore.getAndListenMultipleDocs(
      FIRESTORE_COLLECTION_NAMES.TRANSACTIONS,
      uid,
      (error) => alert(error),
      (data) => {},
      (data, type) => {
        switch (type) {
          case "added":
            setBadgeCounter({
              ...badgeCounter,
              logbookTab: badgeCounter.logbookTab + 1,
            });

            dispatchSortedTransactions({
              type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
                .INSERT_TRANSACTION,
              payload: {
                transaction: data,
                logbookToOpen: logbooks.logbooks.find((logbook) => {
                  if (logbook.logbook_id === data.logbook_id) {
                    return {
                      name: logbook.logbook_name,
                      logbook_id: logbook.logbook_id,
                      logbook_currency: logbook.logbook_currency,
                    };
                  }
                }),
              },
            });
            break;
          case "modified":
            setBadgeCounter({
              ...badgeCounter,
              logbookTab: badgeCounter.logbookTab + 1,
            });

            // TODO : Update transaction
            // dispatchSortedTransactions({
            //   type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
            //     .PATCH_TRANSACTION,
            //   payload: {
            //     transaction: data,
            //     logbookToOpen: logbooks.logbooks.find((logbook) => {
            //       if (logbook.logbook_id === data.logbook_id) {
            //         return {
            //           name: logbook.logbook_name,
            //           logbook_id: logbook.logbook_id,
            //           logbook_currency: logbook.logbook_currency,
            //         };
            //       }
            //     }),
            //   },
            // });
            break;

          case "removed":
            setBadgeCounter({
              ...badgeCounter,
              logbookTab: badgeCounter.logbookTab + 1,
            });
            //  TODO : fix delete transaction bug if section is empty
            dispatchSortedTransactions({
              type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
                .DELETE_ONE_TRANSACTION,
              payload: {
                deleteTransaction: data,
                logbookToOpen: logbooks.logbooks.find((logbook) => {
                  if (logbook.logbook_id === data.logbook_id) {
                    return {
                      name: logbook.logbook_name,
                      logbook_id: logbook.logbook_id,
                      logbook_currency: logbook.logbook_currency,
                    };
                  }
                }),
              },
            });
            break;

          default:
            break;
        }
      }
    );
    // unsubscribeTransactions = transactionsSubscription;

    const unsubscribeCategories = firestore.getAndListenOneDoc(
      FIRESTORE_COLLECTION_NAMES.CATEGORIES,
      uid,
      (data) => {
        dispatchCategories({
          type: REDUCER_ACTIONS.CATEGORIES.SET,
          payload: data,
        });
      },
      (error) => alert(error)
    );
    // unsubscribeCategories = categoriesSubscription;

    const unsubscribeBudgets = firestore.getAndListenMultipleDocs(
      FIRESTORE_COLLECTION_NAMES.BUDGETS,
      uid,
      (error) => alert(error),
      (data) => {},
      (data) => {}
      // dispatchBudgets({
      //   type: REDUCER_ACTIONS.BUDGETS.SET,
      //   payload: data,
      // }),
    );

    if (subscribeAll) {
      return () => {
        unsubscribeAppSettings;
        unsubscribeUserAccount;
        unsubscribeLogbooks;
        unsubscribeTransactions;
        unsubscribeCategories;
        unsubscribeBudgets;
      };
    }
    if (unsubscribeAll) {
      return () => {
        unsubscribeAppSettings();
        unsubscribeUserAccount();
        unsubscribeLogbooks();
        unsubscribeTransactions();
        unsubscribeCategories();
        unsubscribeBudgets();
      };
    }
  };

  // TAG : useEffect for state
  useEffect(() => {
    // let unsubscribeAppSettings;
    // let unsubscribeUserAccount;
    // let unsubscribeLogbooks;
    // let unsubscribeTransactions;
    // let unsubscribeCategories;
    // let unsubscribeBudgets;

    // Subscribe to firestore
    // if (userAccount.uid) {
    //   // TAG : Subscription Section
    //   subscription({ subscribeAll: true });
    // }
    if (userAccount && user && !isLoading) {
      subscription({ uid: userAccount.uid, subscribeAll: true });
    }
    return () => {
      // Unsubscribe from firestore
      if (userAccount) {
        subscription({ uid: userAccount.uid, unsubscribeAll: true });
      }
    };
  }, []);
  // TODO : REFACTOR SUBSCRIPTION FUNCTION SO IT CAN BE CALLED FROM ACCOUNT SCREEN
  // Save Sorted Transactions to storage
  useEffect(() => {
    // TODO : snapshot listener for cross device sync
    if (userAccount && user && !isLoading) {
      setTimeout(async () => {
        subscription({ uid: userAccount.uid, subscribeAll: true });
        await firestore.setData(
          FIRESTORE_COLLECTION_NAMES.USERS,
          userAccount.uid,
          userAccount
        );
      }, 1);
    }
  }, [userAccount, user, isLoading]);

  // Save Sorted Transactions to storage
  useEffect(() => {
    if (sortedTransactions) {
      // persistStorage.asyncStorage({
      //   action: PERSIST_ACTIONS.SET,
      //   key: "sortedTransactions",
      //   rawValue: sortedTransactions,
      // });
    }
  }, [sortedTransactions]);

  // Save App Settings to storage
  useEffect(() => {
    if (appSettings && user && !isLoading) {
      setTimeout(async () => {
        await firestore.setData(
          FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
          appSettings.uid,
          appSettings
        );
      }, 1);
    }
  }, [appSettings]);

  // Save Logbooks to storage
  useEffect(() => {
    if (logbooks.logbooks) {
      // setTimeout(async () => {
      //   await firestore.setData(
      //     FIRESTORE_COLLECTION_NAMES.LOGBOOKS,
      //     logbooks.logbooks.uid,
      //     userAccount
      //   );
      // }, 1);
    }
  }, [logbooks]);

  // Save Categories to storage
  useEffect(() => {
    if (categories) {
      // persistStorage.asyncStorage({
      //   action: PERSIST_ACTIONS.SET,
      //   key: "categories",
      //   rawValue: categories,
      // });
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
      {/* // TAG : Sign Up Screen */}
      <Stack.Screen
        options={{
          ...noHeader,
        }}
        name={screenList.signUpScreen}
        component={SignUpScreen}
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
        component={LogBookScreen}
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
                  // console.log(navigation);
                  navigation.navigate(screenList.modalScreen, {
                    modalType: "textInput",
                    title: "Create New Log Book",
                    placeholder: "Enter new log book name ...",
                    selected: (item) => {
                      const newLogbook = {
                        _timestamps: {
                          created_at: Date.now(),
                          updated_at: Date.now(),
                        },
                        _id: uuid.v4(),
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
                        __v: 0,
                      };

                      setTimeout(async () => {
                        await firestore.setData(
                          FIRESTORE_COLLECTION_NAMES.LOGBOOKS,
                          newLogbook.logbook_id,
                          newLogbook
                        );
                      }, 1);

                      dispatchLogbooks({
                        type: ACTIONS.LOGBOOKS.INSERT,
                        payload: newLogbook,
                      });

                      dispatchSortedTransactions({
                        type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
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
                }}
              >
                <IonIcons
                  name="add"
                  size={20}
                  color={appSettings.theme.style.colors.textHeader}
                />
                <TextPrimary
                  label="Add"
                  style={{ color: appSettings.theme.style.colors.textHeader }}
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
                  color={appSettings.theme.style.colors.textHeader}
                />
                <TextPrimary
                  label="Add"
                  style={{ color: appSettings.theme.style.colors.textHeader }}
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
      {/* // TAG : User Settings Screen */}
      <Stack.Screen
        options={{ ...showHeader, title: "User" }}
        name={screenList.userScreen}
        component={UserScreen}
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
