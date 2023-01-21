import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { TextPrimary } from "../../components/Text";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalRepeatedTransactions,
  useGlobalSortedTransactions,
} from "../../reducers/GlobalContext";
import screenList from "../../navigations/ScreenList";
import REDUCER_ACTIONS from "../../reducers/reducer.action";
import firestore from "../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../api/firebase/firestoreCollectionNames";

const LoadingScreen = ({ route, navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  // const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { budgets, dispatchBudgets } = useGlobalBudgets();
  const { repeatedTransactions, dispatchRepeatedTransactions } =
    useGlobalRepeatedTransactions();

  const [initial, setInitial] = useState(null);

  useEffect(() => {
    // console.log({ onLoad: route.params.initialRawTransactionsLength })
    console.log(route?.params);

    // TAG : Transaction Timeout
    setTimeout(
      () => {
        const {
          loadingType,
          reducerUpdatedAt,

          // sortedTransactions
          transaction,
          prevTransaction,
          patchTransaction,
          deleteTransaction,

          // logbooks
          patchLogbook,
          deleteLogbook,
          logbookToOpen,

          // categories
          insertCategory,
          patchCategory,
          deleteCategory,
          targetCategoryType,

          // budgets
          insertBudget,
          patchBudget,
          deleteBudget,

          // repeatedTransactions
          repeatedTransaction,
          patchedTransactions,
        } = route?.params;

        const logbooksReducerUpdatedAt = logbooks.reducerUpdatedAt;
        const categoriesReducerUpdatedAt = categories.reducerUpdatedAt;
        const budgetsReducerUpdatedAt = budgets.reducerUpdatedAt;

        switch (true) {
          // TAG : Insert One Transaction Method
          case transaction && loadingType === "insertTransaction":
            console.log("start insert transaction");
            dispatchSortedTransactions({
              type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
                .INSERT_TRANSACTION,
              payload: {
                transaction,
                logbookToOpen,
                reducerUpdatedAt,
              },
            });
            break;

          // TAG : Patch One Transaction Method
          case patchTransaction &&
            prevTransaction &&
            loadingType === "patchTransaction":
            dispatchSortedTransactions({
              type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
                .PATCH_TRANSACTION,
              payload: {
                prevTransaction,
                patchTransaction,
                logbookToOpen,
                reducerUpdatedAt,
              },
            });
            break;

          // TAG : Delete One Transaction Method
          case deleteTransaction && loadingType === "deleteOneTransaction":
            dispatchSortedTransactions({
              type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
                .DELETE_ONE_TRANSACTION,
              payload: {
                deleteTransaction,
                logbookToOpen,
                reducerUpdatedAt,
              },
            });
            break;

          // TAG : Patch One Logbook Method
          case patchLogbook &&
            reducerUpdatedAt !== logbooksReducerUpdatedAt &&
            loadingType === "patchLogbook":
            console.log("start patch logbook");
            dispatchLogbooks({
              type: REDUCER_ACTIONS.LOGBOOKS.PATCH,
              payload: {
                reducerUpdatedAt,
                patchLogbook,
              },
            });
            break;

          // TAG : Delete One Logbook Method
          case deleteLogbook &&
            reducerUpdatedAt !== logbooksReducerUpdatedAt &&
            loadingType === "deleteOneLogbook":
            dispatchLogbooks({
              type: REDUCER_ACTIONS.LOGBOOKS.DELETE_ONE,
              payload: {
                deleteLogbook,
                reducerUpdatedAt,
              },
            });
            break;

          // TAG : Patch One Category Method
          case patchCategory &&
            reducerUpdatedAt !== categoriesReducerUpdatedAt &&
            loadingType === "patchCategory":
            dispatchCategories({
              type: REDUCER_ACTIONS.CATEGORIES.PATCH,
              payload: {
                targetCategoryType,
                patchCategory,
                reducerUpdatedAt,
              },
            });
            break;

          // TAG : Insert Category Method
          case insertCategory &&
            reducerUpdatedAt !== categoriesReducerUpdatedAt &&
            loadingType === "insertCategory":
            dispatchCategories({
              type: REDUCER_ACTIONS.CATEGORIES.INSERT,
              payload: {
                categoryType,
                insertCategory,
                reducerUpdatedAt,
              },
            });
            break;

          // TAG : Delete One Category Method
          case deleteCategory &&
            reducerUpdatedAt !== categoriesReducerUpdatedAt &&
            loadingType === "deleteCategory":
            dispatchCategories({
              type: REDUCER_ACTIONS.CATEGORIES.DELETE_ONE,
              payload: { deleteCategory, reducerUpdatedAt },
            });
            break;

          // TAG : Insert One Budget Method
          case reducerUpdatedAt !== budgetsReducerUpdatedAt &&
            loadingType === "insertBudget":
            console.log('start insert budget')
            dispatchBudgets({
              type: REDUCER_ACTIONS.BUDGETS.INSERT,
              payload: { insertBudget, reducerUpdatedAt },
            });
            break;

          // TAG : Patch One Budget Method
          case patchBudget &&
            reducerUpdatedAt !== budgetsReducerUpdatedAt &&
            loadingType === "patchBudget":
            dispatchBudgets({
              type: REDUCER_ACTIONS.BUDGETS.PATCH,
              payload: { patchBudget, reducerUpdatedAt },
            });
            break;

          // TAG : Delete One Budget Method
          case deleteBudget &&
            reducerUpdatedAt !== budgetsReducerUpdatedAt &&
            loadingType === "deleteBudget":
            dispatchBudgets({
              type: REDUCER_ACTIONS.BUDGETS.DELETE_ONE,
              payload: { deleteBudget, reducerUpdatedAt },
            });
            break;

          // TAG : Patch repeated transactions
          case repeatedTransaction &&
            patchedTransactions &&
            loadingType === "patchRepeatedTransaction":
            dispatchRepeatedTransactions({
              type: REDUCER_ACTIONS.REPEATED_TRANSACTIONS.PATCH,
              payload: {
                repeatedTransaction,
                reducerUpdatedAt,
              },
            });
            break;

          // TAG : Switch logbook method
          case loadingType === "switchLogbook":
            setTimeout(() => {
              navigation.navigate(screenList.bottomTabNavigator);
            }, 1000);
            break;

          default:
            break;
        }

        // TAG : New Patch Logbook Method
        // if (
        //   route?.params?.patchLogbook &&
        //   logbooks.logbookPatchCounter ===
        //     route?.params?.initialLogbookPatchCounter &&
        //   route?.params?.loadingType === "patchLogbook"
        // ) {
        //   console.log("mulai dispatch");
        //   dispatchLogbooks({
        //     type: REDUCER_ACTIONS.LOGBOOKS.PATCH,
        //     payload: route?.params?.patchLogbook,
        //   });
        // }

        // TAG : New Delete One Logbook Method
        // if (
        //   route?.params?.deleteLogbook &&
        //   logbooks.logbookDeleteCounter ===
        //     route?.params?.initialLogbookDeleteCounter &&
        //   route?.params?.loadingType === "deleteOneLogbook"
        // ) {
        //   console.log("mulai dispatch");
        //   dispatchLogbooks({
        //     type: REDUCER_ACTIONS.LOGBOOKS.DELETE_ONE,
        //     payload: route?.params?.deleteLogbook,
        //   });
        // }

        // TAG : New Patch One Category Method
        // if (
        //   route?.params?.patchCategory &&
        //   categories.categoryPatchCounter ===
        //     route?.params?.initialCategoryPatchCounter &&
        //   route?.params?.loadingType === "patchCategory"
        // ) {
        //   console.log("mulai dispatch");
        //   dispatchCategories({
        //     type: REDUCER_ACTIONS.CATEGORIES.PATCH,
        //     payload: {
        //       targetCategoryType: route?.params?.targetCategoryType,
        //       patchCategory: route?.params?.patchCategory,
        //     },
        //   });
        // }

        // TAG : New Insert Category Method
        // if (
        //   route?.params?.insertCategory &&
        //   categories.categoryInsertCounter ===
        //     route?.params?.initialCategoryInsertCounter &&
        //   route?.params?.loadingType === "insertCategory"
        // ) {
        //   console.log("mulai dispatch");
        //   dispatchCategories({
        //     type: REDUCER_ACTIONS.CATEGORIES.INSERT,
        //     payload: {
        //       categoryType: route?.params?.categoryType,
        //       insertCategory: route?.params?.insertCategory,
        //     },
        //   });
        // }

        // TAG : New Delete One Category Method
        // if (
        //   route?.params?.deleteCategory &&
        //   categories.categoryDeleteCounter ===
        //     route?.params?.initialCategoryDeleteCounter &&
        //   route?.params?.loadingType === "deleteCategory"
        // ) {
        //   console.log("mulai dispatch");
        //   dispatchCategories({
        //     type: REDUCER_ACTIONS.CATEGORIES.DELETE_ONE,
        //     payload: route?.params?.deleteCategory,
        //   });
        // }
        // TAG : New Insert Budget Method
        // if (
        //   budgets.budgetInsertCounter ===
        //     route?.params?.initialBudgetInsertCounter &&
        //   route?.params?.loadingType === "insertBudget"
        // ) {
        //   console.log("mulai dispatch");
        //   dispatchBudgets({
        //     type: REDUCER_ACTIONS.BUDGETS.INSERT,
        //     payload: route?.params?.insertBudget,
        //   });
        // }

        // TAG : New Patch One Budget Method
        // if (
        //   route?.params?.patchBudget &&
        //   budgets.budgetPatchCounter ===
        //     route?.params?.initialBudgetPatchCounter &&
        //   route?.params?.loadingType === "patchBudget"
        // ) {
        //   console.log("mulai dispatch");
        //   dispatchBudgets({
        //     type: REDUCER_ACTIONS.BUDGETS.PATCH,
        //     payload: route?.params?.patchBudget,
        //   });
        // }

        // TAG : New Delete One Budget Method
        // if (
        //   route?.params?.deleteBudget &&
        //   budgets.budgetDeleteCounter ===
        //     route?.params?.initialBudgetDeleteCounter &&
        //   route?.params?.loadingType === "deleteBudget"
        // ) {
        //   console.log("mulai dispatch");
        //   dispatchBudgets({
        //     type: REDUCER_ACTIONS.BUDGETS.DELETE_ONE,
        //     payload: route?.params?.deleteBudget,
        //   });
        // }

        // TAG : New Patch Repeated Transactions Method
        // if (
        //   route?.params?.loadingType === "patchRepeatedTransactions" &&
        //   route?.params?.repeatedTransaction &&
        //   route?.params?.patchedTransactions
        // ) {
        //   dispatchRepeatedTransactions({
        //     type: REDUCER_ACTIONS.REPEATED_TRANSACTIONS.PATCH,
        //     payload: {
        //       repeatedTransaction: route?.params?.repeatedTransaction,
        //       reducerUpdatedAt: route?.params?.reducerUpdatedAt,
        //     },
        //     // {
        //     //   repeatedTransactions: route?.params?.repeatedTransactions,
        //     //   patchedTransactions: route?.params?.patchedTransactions,
        //     // },
        //   });
        // }

        // TAG : Switch LogBook Timeout
        // if (route?.params?.loadingType === "switchLogBook") {
        //   setTimeout(() => {
        //     navigation.navigate(screenList.bottomTabNavigator);
        //   }, 1000);
        // }
      },

      100
    );
  }, []);

  // useEffect(() => {
  //     if (!isLoading.status) {
  //         navigation.navigate('Bottom Tab')
  //     }
  // }, [isLoading.status])

  // TAG : Sorted Transactions Listener
  useEffect(() => {
    const {
      loadingType,
      prevCategoryType,
      targetCategoryType,
      patchCategory,
      reducerUpdatedAt,
    } = route?.params;

    const isReducerTimestampSame =
      reducerUpdatedAt === sortedTransactions.reducerUpdatedAt;

    switch (true) {
      case isReducerTimestampSame && loadingType === "insertTransaction":
        navigation.navigate(screenList.bottomTabNavigator);
        break;
      case isReducerTimestampSame && loadingType === "patchTransaction":
        navigation.navigate(screenList.bottomTabNavigator);
        break;
      case isReducerTimestampSame && loadingType === "patchCategory":
        navigation.navigate(screenList.categoryPreviewScreen, {
          prevCategoryType,
          targetCategoryType,
          category: patchCategory,
        });
        break;
      case isReducerTimestampSame && loadingType === "deleteOneTransaction":
        navigation.navigate(screenList.bottomTabNavigator);
        break;

      // Delete One Logbook
      case isReducerTimestampSame && loadingType === "deleteOneLogbook":
        navigation.navigate(screenList.myLogbooksScreen);
        break;

      default:
        break;
    }
    // if (
    //   // sortedTransactions.sortedTransactionsInsertCounter >
    //   //   route?.params?.initialSortedTransactionsInsertCounter &&
    //   route?.params.reducerUpdatedAt === sortedTransactions.reducerUpdatedAt &&
    //   route?.params?.loadingType === "insertTransaction"
    // ) {
    //   // convertAndSaveTransctions(sortedTransactions);
    // }

    // Patch One Transaction
    // if (
    //   // sortedTransactions.sortedTransactionsPatchCounter >
    //   //   route?.params?.initialSortedTransactionsPatchCounter &&
    //   route?.params?.reducerUpdatedAt === sortedTransactions.reducerUpdatedAt &&
    //   route?.params?.loadingType === "patchTransaction"
    // ) {
    //   // console.log(route?.params?.logbookToOpen)
    //   navigation.navigate(screenList.bottomTabNavigator);
    // }

    // Patch Category
    // if (
    //   sortedTransactions.sortedTransactionsPatchCounter >
    //     route?.params?.initialSortedTransactionsPatchCounter &&
    //   route?.params?.loadingType === "patchCategory"
    // ) {
    //   navigation.navigate(screenList.categoryPreviewScreen, {
    //     prevCategoryType: route?.params?.prevCategoryType,
    //     targetCategoryType: route?.params?.targetCategoryType,
    //     category: route?.params?.patchCategory,
    //   });
    // }
  }, [sortedTransactions.reducerUpdatedAt]);

  // TAG : Categories Listener
  useEffect(() => {
    const { loadingType, targetCategoryType, patchCategory, reducerUpdatedAt } =
      route?.params;

    const isReducerTimestampSame =
      reducerUpdatedAt === categories.reducerUpdatedAt;

    switch (true) {
      // Insert One Category
      case isReducerTimestampSame && loadingType === "insertCategory":
        navigation.navigate(screenList.myCategoriesScreen);
        break;

      // Patch One Category
      case isReducerTimestampSame && loadingType === "patchCategory":
        dispatchSortedTransactions({
          type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.PATCH_CATEGORY,
          payload: {
            targetCategoryType,
            patchCategory,
            reducerUpdatedAt,
          },
        });
        break;

      // Delete One Category
      case isReducerTimestampSame && loadingType === "deleteCategory":
        navigation.navigate(screenList.myCategoriesScreen);
        break;

      default:
        break;
    }
  }, [categories.reducerUpdatedAt]);

  // TAG : Budgets Listener
  useEffect(() => {
    const { loadingType, patchBudget, reducerUpdatedAt } = route?.params;

    const isReducerTimestampSame =
      reducerUpdatedAt === budgets.reducerUpdatedAt;

    switch (true) {

      // Insert One Budget
      case isReducerTimestampSame && loadingType === "insertBudget":
        navigation.navigate(screenList.myBudgetsScreen);
        break;
      
      // Patch One Budget
      case isReducerTimestampSame && loadingType === "patchBudget":
        navigation.navigate(screenList.myBudgetsScreen);
        break;

      // Delete One Budget
      case isReducerTimestampSame && loadingType === "deleteBudget":
        navigation.navigate(screenList.myBudgetsScreen);
        break;

      default:
        break;
    }
  }, [budgets.reducerUpdatedAt]);

  // TAG : Logbooks Listener
  useEffect(() => {
    const { loadingType, patchLogbook, deleteLogbook, reducerUpdatedAt } =
      route?.params;

    const isReducerTimestampSame =
      reducerUpdatedAt === logbooks.reducerUpdatedAt;

    switch (true) {
      // Patch One Logbook
      case isReducerTimestampSame && loadingType === "patchLogbook":
        console.log("going back to logbook preview screen");
        navigation.navigate(screenList.logbookPreviewScreen, {
          logbook: patchLogbook,
        });
        break;

      // Delete One Logbook
      case isReducerTimestampSame && loadingType === "deleteOneLogbook":
        dispatchSortedTransactions({
          type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
            .DELETE_ONE_LOGBOOK,
          payload: {
            deleteLogbook,
            reducerUpdatedAt,
          },
        });
        break;
      default:
        break;
    }
  }, [logbooks.reducerUpdatedAt]);

  // TAG : Repeated Transactions Listener
  useEffect(() => {
    const {
      loadingType,
      reducerUpdatedAt,
      repeatedTransaction,
      patchedTransactions,
    } = route?.params;

    const isReducerTimestampSame =
      reducerUpdatedAt === repeatedTransactions.reducerUpdatedAt;

    if (loadingType === "patchRepeatedTransaction") {
      // sync updated repeated transaction to firestore
      setTimeout(async () => {
        await firestore.setData(
          FIRESTORE_COLLECTION_NAMES.REPEATED_TRANSACTIONS,
          repeatedTransaction.repeat_id,
          repeatedTransaction
        );
      }, 5000);

      if (isReducerTimestampSame && repeatedTransaction?.transactions?.length) {
        // check timestamp of patched repeated transaction
        const foundPatchedRepeatSection = repeatedTransactions.find(
          (repeatSection) => {
            return repeatSection.repeat_id === repeatedTransaction.repeat_id;
          }
        );

        // if timestamp is same, it means that the patched repeated transaction has been updated in state
        let isTimestampSame = false;
        if (foundPatchedRepeatSection) {
          isTimestampSame =
            foundPatchedRepeatSection._timestamps.updated_at ===
            repeatedTransaction?._timestamps.updated_at;
        }

        // proceeds patching transactions
        if (repeatedTransactions && isTimestampSame) {
          dispatchSortedTransactions({
            type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
              .PATCH_MANY_TRANSACTIONS,
            payload: {
              patchedTransactions,
              reducerUpdatedAt,
            },
          });
        }
      }
    }
  }, [repeatedTransactions.reducerUpdatedAt]);

  // TAG : New Patch Logbook Method
  useEffect(() => {
    // console.log({ counter: logbooks.logbookPatchCounter })
  }, [logbooks.logbookPatchCounter]);

  // TAG : New Patch One Category Method
  useEffect(() => {}, [categories.categoryPatchCounter]);

  // TAG : New Insert Category Method
  useEffect(() => {}, [categories.categoryInsertCounter]);

  // TAG : New Insert Budget Method
  useEffect(() => {}, [budgets.budgetInsertCounter]);

  // TAG : New Patch Budget Method
  useEffect(() => {}, [budgets.budgetPatchCounter]);

  // TAG : New Delete One Budget Method
  useEffect(() => {}, [budgets.budgetDeleteCounter]);

  // TAG : New Delete One Category Method
  useEffect(() => {}, [categories.categoryDeleteCounter]);

  // TAG : New Delete One Transaction Method
  useEffect(() => {}, [sortedTransactions.sortedTransactionsDeleteCounter]);

  // TAG : New Delete One Logbook Method (Logbook Reducer)
  useEffect(() => {
    // console.log({ counter: logbooks.logbookPatchCounter })
  }, [logbooks.logbookDeleteCounter]);

  // TAG : New Delete One Logbook Method (Sorted Transactions Reducer)
  useEffect(() => {}, [sortedTransactions.sortedLogbookDeleteCounter]);

  // TAG : Save Async Storage && dispatch Sorted Transactions
  // const saveAndLoad = async () => {
  //   console.log("render 3");
  //   dispatchSortedTransactions({
  //     type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.SET,
  //     payload: await setSortedTransactions(rawTransactions.transactions),
  //   });
  //   await AsyncStorage.setItem(
  //     "transactions",
  //     JSON.stringify(rawTransactions.transactions)
  //   );
  // };

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
