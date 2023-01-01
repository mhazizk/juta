import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  ToastAndroid,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { globalStyles, globalTheme } from "../../assets/themes/globalStyles";
import { ButtonPrimary, ButtonSecondary } from "../../components/Button";
import { TextPrimary } from "../../components/Text";
import APP_SETTINGS from "../../config/appSettings";
import {
  convertAndSaveTransctions,
  setSortedTransactions,
} from "../../utils/FetchData";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
  useGlobalCategories,
  useGlobalLoading,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTransactions,
} from "../../reducers/GlobalContext";
import { ACTIONS } from "../../reducers/GlobalReducer";
import screenList from "../../navigations/ScreenList";

const LoadingScreen = ({ route, navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { isLoading, dispatchLoading } = useGlobalLoading();
  const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { budgets, dispatchBudgets } = useGlobalBudgets();

  const [initial, setInitial] = useState(null);

  useEffect(() => {
    // console.log({ onLoad: route.params.initialRawTransactionsLength })
    console.log(route?.params);

    // TAG : Transaction Timeout
    setTimeout(
      () => {
        // TAG : New Insert Transaction Method
        if (
          route?.params?.transaction &&
          route?.params?.loadingType === "insertTransaction"
        ) {
          dispatchSortedTransactions({
            type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.INSERT_TRANSACTION,
            payload: {
              transaction: route?.params?.transaction,
              logbookToOpen: route?.params?.logbookToOpen,
            },
          });
        }

        // TAG : New Patch Transaction Method
        if (
          route?.params?.patchTransaction &&
          route?.params?.prevTransaction &&
          route?.params?.loadingType === "patchTransaction"
        ) {
          dispatchSortedTransactions({
            type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.PATCH_TRANSACTION,
            payload: {
              prevTransaction: route?.params?.prevTransaction,
              patchTransaction: route?.params?.patchTransaction,
              logbookToOpen: route?.params?.logbookToOpen,
            },
          });
        }

        // TAG : New Delete One Transaction Method
        if (
          route?.params?.deleteTransaction &&
          route?.params?.loadingType === "deleteOneTransaction"
        ) {
          dispatchSortedTransactions({
            type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
              .DELETE_ONE_TRANSACTION,
            payload: {
              deleteTransaction: route?.params?.deleteTransaction,
              logbookToOpen: route?.params?.logbookToOpen,
            },
          });
        }

        // TAG : New Patch Logbook Method
        if (
          route?.params?.patchLogbook &&
          logbooks.logbookPatchCounter ===
            route?.params?.initialLogbookPatchCounter &&
          route?.params?.loadingType === "patchLogbook"
        ) {
          console.log("mulai dispatch");
          dispatchLogbooks({
            type: ACTIONS.LOGBOOKS.PATCH,
            payload: route?.params?.patchLogbook,
          });
        }

        // TAG : New Delete One Logbook Method
        if (
          route?.params?.deleteLogbook &&
          logbooks.logbookDeleteCounter ===
            route?.params?.initialLogbookDeleteCounter &&
          route?.params?.loadingType === "deleteOneLogbook"
        ) {
          console.log("mulai dispatch");
          dispatchLogbooks({
            type: ACTIONS.LOGBOOKS.DELETE_ONE,
            payload: route?.params?.deleteLogbook,
          });
        }

        // TAG : New Patch One Category Method
        if (
          route?.params?.patchCategory &&
          categories.categoryPatchCounter ===
            route?.params?.initialCategoryPatchCounter &&
          route?.params?.loadingType === "patchCategory"
        ) {
          console.log("mulai dispatch");
          dispatchCategories({
            type: ACTIONS.CATEGORIES.PATCH,
            payload: {
              targetCategoryType: route?.params?.targetCategoryType,
              patchCategory: route?.params?.patchCategory,
            },
          });
        }

        // TAG : New Insert Category Method
        if (
          route?.params?.insertCategory &&
          categories.categoryInsertCounter ===
            route?.params?.initialCategoryInsertCounter &&
          route?.params?.loadingType === "insertCategory"
        ) {
          console.log("mulai dispatch");
          dispatchCategories({
            type: ACTIONS.CATEGORIES.INSERT,
            payload: {
              categoryType: route?.params?.categoryType,
              insertCategory: route?.params?.insertCategory,
            },
          });
        }

        // TAG : New Delete One Category Method
        if (
          route?.params?.deleteCategory &&
          categories.categoryDeleteCounter ===
            route?.params?.initialCategoryDeleteCounter &&
          route?.params?.loadingType === "deleteCategory"
        ) {
          console.log("mulai dispatch");
          dispatchCategories({
            type: ACTIONS.CATEGORIES.DELETE_ONE,
            payload: route?.params?.deleteCategory,
          });
        }
        // TAG : New Insert Budget Method
        if (
          budgets.budgetInsertCounter ===
            route?.params?.initialBudgetInsertCounter &&
          route?.params?.loadingType === "insertBudget"
        ) {
          console.log("mulai dispatch");
          dispatchBudgets({
            type: ACTIONS.BUDGETS.INSERT,
            payload: route?.params?.insertBudget,
          });
        }

        // TAG : New Patch One Budget Method
        if (
          route?.params?.patchBudget &&
          budgets.budgetPatchCounter ===
            route?.params?.initialBudgetPatchCounter &&
          route?.params?.loadingType === "patchBudget"
        ) {
          console.log("mulai dispatch");
          dispatchBudgets({
            type: ACTIONS.BUDGETS.PATCH,
            payload: route?.params?.patchBudget,
          });
        }

        // TAG : New Delete One Budget Method
        if (
          route?.params?.deleteBudget &&
          budgets.budgetDeleteCounter ===
            route?.params?.initialBudgetDeleteCounter &&
          route?.params?.loadingType === "deleteBudget"
        ) {
          console.log("mulai dispatch");
          dispatchBudgets({
            type: ACTIONS.BUDGETS.DELETE_ONE,
            payload: route?.params?.deleteBudget,
          });
        }

        // TAG : Switch LogBook Timeout
        if (route?.params?.loadingType === "switchLogBook") {
          setTimeout(() => {
            navigation.navigate(screenList.bottomTabNavigator);
          }, 1000);
        }
      },

      100
    );
  }, []);

  // useEffect(() => {
  //     if (!isLoading.status) {
  //         navigation.navigate('Bottom Tab')
  //     }
  // }, [isLoading.status])

  // TAG : New Insert Transaction Method
  useEffect(() => {
    if (
      sortedTransactions.sortedTransactionsInsertCounter >
        route?.params?.initialSortedTransactionsInsertCounter &&
      route?.params?.loadingType === "insertTransaction"
    ) {
      navigation.navigate(screenList.bottomTabNavigator);
      // convertAndSaveTransctions(sortedTransactions);
    }
  }, [sortedTransactions.sortedTransactionsInsertCounter]);

  // TAG : New Patch Sorted Transaction Method
  useEffect(() => {
    // console.log(rawTransactions.transactionsPatchedInSession > route?.params?.initialTransactionsPatchedLength)
    // Patch Transaction
    if (
      sortedTransactions.sortedTransactionsPatchCounter >
        route?.params?.initialSortedTransactionsPatchCounter &&
      route?.params?.loadingType === "patchTransaction"
    ) {
      // console.log(route?.params?.logbookToOpen)
      navigation.navigate(screenList.bottomTabNavigator);
    }
    // Patch Category
    if (
      sortedTransactions.sortedTransactionsPatchCounter >
        route?.params?.initialSortedTransactionsPatchCounter &&
      route?.params?.loadingType === "patchCategory"
    ) {
      navigation.navigate(screenList.categoryPreviewScreen, {
        prevCategoryType: route?.params?.prevCategoryType,
        targetCategoryType: route?.params?.targetCategoryType,
        category: route?.params?.patchCategory,
      });
    }
  }, [sortedTransactions.sortedTransactionsPatchCounter]);

  // TAG : New Patch Logbook Method
  useEffect(() => {
    // console.log({ counter: logbooks.logbookPatchCounter })
    if (
      logbooks.logbookPatchCounter >
        route?.params?.initialLogbookPatchCounter &&
      route?.params?.loadingType === "patchLogbook"
    ) {
      navigation.navigate(screenList.logbookPreviewScreen, {
        logbook: route?.params?.patchLogbook,
      });
    }
  }, [logbooks.logbookPatchCounter]);

  // TAG : New Patch One Category Method
  useEffect(() => {
    if (
      categories.categoryPatchCounter >
        route?.params?.initialCategoryPatchCounter &&
      route?.params?.loadingType === "patchCategory"
    ) {
      dispatchSortedTransactions({
        type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.PATCH_CATEGORY,
        payload: {
          targetCategoryType: route?.params?.targetCategoryType,
          patchCategory: route?.params?.patchCategory,
          initialSortedTransactionsPatchCounter:
            route?.params?.initialSortedTransactionsPatchCounter,
        },
      });
    }
  }, [categories.categoryPatchCounter]);

  // TAG : New Insert Category Method
  useEffect(() => {
    if (
      categories.categoryInsertCounter >
        route?.params?.initialCategoryInsertCounter &&
      route?.params?.loadingType === "insertCategory"
    ) {
      navigation.navigate(screenList.myCategoriesScreen);
    }
  }, [categories.categoryInsertCounter]);

  // TAG : New Insert Budget Method
  useEffect(() => {
    if (
      budgets.budgetInsertCounter > route?.params?.initialBudgetInsertCounter &&
      route?.params?.loadingType === "insertBudget"
    ) {
      navigation.navigate(screenList.myBudgetsScreen);
    }
  }, [budgets.budgetInsertCounter]);

  // TAG : New Patch Budget Method
  useEffect(() => {
    if (
      budgets.budgetPatchCounter > route?.params?.initialBudgetPatchCounter &&
      route?.params?.loadingType === "patchBudget"
    ) {
      navigation.navigate(screenList.myBudgetsScreen);
    }
  }, [budgets.budgetPatchCounter]);

  // TAG : New Delete One Budget Method
  useEffect(() => {
    if (
      budgets.budgetDeleteCounter > route?.params?.initialBudgetDeleteCounter &&
      route?.params?.loadingType === "deleteBudget"
    ) {
      navigation.navigate(screenList.myBudgetsScreen);
    }
  }, [budgets.budgetDeleteCounter]);

  // TAG : New Delete One Category Method
  useEffect(() => {
    if (
      categories.categoryDeleteCounter >
        route?.params?.initialCategoryDeleteCounter &&
      route?.params?.loadingType === "deleteCategory"
    ) {
      navigation.navigate(screenList.myCategoriesScreen);
    }
  }, [categories.categoryDeleteCounter]);

  // TAG : New Delete One Transaction Method
  useEffect(() => {
    if (
      sortedTransactions.sortedTransactionsDeleteCounter >
        route?.params?.initialSortedTransactionsDeleteCounter &&
      route?.params?.loadingType === "deleteOneTransaction"
    ) {
      // console.log('render 4')
      // dispatchSortedTransactions({
      //     type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.DELETE_ONE_TRANSACTION,
      //     payload: { deleteTransaction: route?.params?.deleteTransaction }
      // })
      navigation.navigate(screenList.bottomTabNavigator);
    }
  }, [sortedTransactions.sortedTransactionsDeleteCounter]);

  // TAG : New Delete One Logbook Method (Logbook Reducer)
  useEffect(() => {
    // console.log({ counter: logbooks.logbookPatchCounter })
    if (
      logbooks.logbookDeleteCounter >
        route?.params?.initialLogbookDeleteCounter &&
      route?.params?.loadingType === "deleteOneLogbook"
    ) {
      dispatchSortedTransactions({
        type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.DELETE_ONE_LOGBOOK,
        payload: route?.params?.deleteLogbook,
      });
    }
  }, [logbooks.logbookDeleteCounter]);

  // TAG : New Delete One Logbook Method (Sorted Transactions Reducer)
  useEffect(() => {
    if (
      sortedTransactions.sortedLogbookDeleteCounter >
        route?.params?.initialSortedLogbookDeleteCounter &&
      route?.params?.loadingType === "deleteOneLogbook"
    ) {
      navigation.navigate(screenList.myLogbooksScreen);
    }
  }, [sortedTransactions.sortedLogbookDeleteCounter]);

  // TAG : Save Async Storage && dispatch Sorted Transactions
  const saveAndLoad = async () => {
    console.log("render 3");
    dispatchSortedTransactions({
      type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.SET,
      payload: await setSortedTransactions(rawTransactions.transactions),
    });
    await AsyncStorage.setItem(
      "transactions",
      JSON.stringify(rawTransactions.transactions)
    );
  };

  return (
    <>
      {/* // TAG : Transparent Overlay */}
      {/* <TouchableOpacity onPress={() => navigation.pop(1)} style={{ flex: 1, backgroundColor: 'transparent' }}> */}
      {/* {isLoading && */}
      <View style={{ flex: 1, backgroundColor: "transparent" }} />
      {/* } */}
      {/* </TouchableOpacity> */}

      {/* // TAG : Content card */}
      {/* {isLoading && */}
      <View
        style={{
          backgroundColor: appSettings.theme.style.colors.background,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          maxHeight: "50%",
          paddingVertical: 24,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          // flex:1
        }}
      >
        <ActivityIndicator
          size={48}
          color={appSettings.theme.style.colors.primary}
          style={{ paddingBottom: 16 }}
        />
        <View>
          <TextPrimary label={route?.params?.label} />
        </View>
      </View>
      {/* } */}
    </>
  );
};

export default LoadingScreen;
