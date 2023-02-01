import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { TextPrimary } from "../../components/Text";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
  useGlobalCategories,
  useGlobalFeatureWishlist,
  useGlobalLogbooks,
  useGlobalRepeatedTransactions,
  useGlobalSortedTransactions,
  useGlobalUserAccount,
} from "../../reducers/GlobalContext";
import screenList from "../../navigations/ScreenList";
import REDUCER_ACTIONS from "../../reducers/reducer.action";
import firestore from "../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../api/firebase/firestoreCollectionNames";
import LOADING_TYPES from "./loading.type";
import {
  deleteAttachmentImage,
  uploadAndGetAttachmentImageURL,
} from "../../api/firebase/cloudStorage";
import uuid from "react-native-uuid";
import postLogSnagEvent from "../../api/logsnag/postLogSnagEvent";
import LOGSNAG_EVENT_TYPES from "../../api/logsnag/logSnagEventTypes";

const LoadingScreen = ({ route, navigation }) => {
  const { userAccount } = useGlobalUserAccount();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  // const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { budgets, dispatchBudgets } = useGlobalBudgets();
  const { globalFeatureWishlist, dispatchGlobalFeatureWishlist } =
    useGlobalFeatureWishlist();
  const { repeatedTransactions, dispatchRepeatedTransactions } =
    useGlobalRepeatedTransactions();

  const [initial, setInitial] = useState(null);

  useEffect(() => {
    // console.log({ onLoad: route.params.initialRawTransactionsLength })
    console.log("loadingScreenParams :" + JSON.stringify(route?.params));

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
          deletedTransactions,

          // feature wishlist
          featureWishlist,
        } = route?.params;

        const logbooksReducerUpdatedAt = logbooks.reducerUpdatedAt;
        const categoriesReducerUpdatedAt = categories.reducerUpdatedAt;
        const budgetsReducerUpdatedAt = budgets.reducerUpdatedAt;
        const featureWishlistReducerUpdatedAt =
          globalFeatureWishlist.reducerUpdatedAt;

        switch (true) {
          // TAG : Insert One Transaction Method
          case transaction &&
            loadingType === LOADING_TYPES.TRANSACTIONS.INSERT_ONE:
            postLogSnagEvent(
              userAccount.displayName,
              LOGSNAG_EVENT_TYPES.TRANSACTION_NEW
            );
            if (transaction.details.attachment_URL.length > 0) {
              const newAttachmentURL = transaction.details.attachment_URL.map(
                (uri) => {
                  return { uri: uri, id: uuid.v4() };
                }
              );

              const getNewURL = async () => {
                const attachmentURL = [];
                await newAttachmentURL.reduce(async (prev, curr) => {
                  await prev;
                  const newURL = await uploadAndGetAttachmentImageURL(
                    curr.uri,
                    curr.id
                  );
                  attachmentURL.push(newURL);
                }, Promise.resolve());
                alert("attachment Uploaded");
                return attachmentURL;
              };

              getNewURL().then((attachmentURL) => {
                const finalTransaction = {
                  ...transaction,
                  details: {
                    ...transaction.details,
                    attachment_URL: attachmentURL,
                  },
                };
                setTimeout(async () => {
                  await firestore.setData(
                    FIRESTORE_COLLECTION_NAMES.TRANSACTIONS,
                    finalTransaction.transaction_id,
                    finalTransaction
                  );
                }, 5000);
                dispatchSortedTransactions({
                  type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
                    .INSERT_TRANSACTION,
                  payload: {
                    transaction: finalTransaction,
                    logbookToOpen,
                    reducerUpdatedAt,
                  },
                });
              });
            } else {
              setTimeout(async () => {
                await firestore.setData(
                  FIRESTORE_COLLECTION_NAMES.TRANSACTIONS,
                  transaction.transaction_id,
                  transaction
                );
              }, 5000);
              dispatchSortedTransactions({
                type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
                  .INSERT_TRANSACTION,
                payload: {
                  transaction,
                  logbookToOpen,
                  reducerUpdatedAt,
                },
              });
            }
            break;

          // TAG : Patch One Transaction Method
          case patchTransaction &&
            prevTransaction &&
            loadingType === LOADING_TYPES.TRANSACTIONS.PATCH_ONE:
            const newAttachmentURL =
              patchTransaction.details.attachment_URL.filter((uri) => {
                return uri.includes("file://");
              });

            const uriWithUUID = newAttachmentURL.map((uri) => {
              return { uri: uri, id: uuid.v4() };
            });

            const deleteWebAttachmentURL = [];

            prevTransaction.details.attachment_URL.forEach((uri) => {
              if (
                !patchTransaction.details.attachment_URL.includes(uri) &&
                !uri.includes("file://")
              ) {
                deleteWebAttachmentURL.push(uri);
              }
            });
            const getNewURL = async () => {
              const attachmentURL = [];
              await uriWithUUID.reduce(async (prev, curr) => {
                await prev;
                const newURL = await uploadAndGetAttachmentImageURL(
                  curr.uri,
                  curr.id
                );
                attachmentURL.push(newURL);
              }, Promise.resolve());
              return attachmentURL;
            };

            if (newAttachmentURL.length > 0) {
              getNewURL().then((attachmentURL) => {
                const finalTransaction = {
                  ...patchTransaction,
                  details: {
                    ...patchTransaction.details,
                    attachment_URL: [
                      ...patchTransaction.details.attachment_URL.filter(
                        (uri) => {
                          return !uri.includes("file://");
                        }
                      ),
                      ...attachmentURL,
                    ],
                  },
                  _timestamps: {
                    ...patchTransaction._timestamps,
                    updated_at: Date.now(),
                    updated_by: userAccount.uid,
                  },
                };
                setTimeout(async () => {
                  await firestore.setData(
                    FIRESTORE_COLLECTION_NAMES.TRANSACTIONS,
                    finalTransaction.transaction_id,
                    finalTransaction
                  );
                  if (deleteWebAttachmentURL.length > 0) {
                    deleteWebAttachmentURL.forEach(async (url) => {
                      await deleteAttachmentImage(url);
                    });
                  }
                }, 5000);

                dispatchSortedTransactions({
                  type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
                    .PATCH_TRANSACTION,
                  payload: {
                    prevTransaction,
                    patchTransaction: finalTransaction,
                    logbookToOpen,
                    reducerUpdatedAt,
                  },
                });
              });
            } else {
              const finalTransaction = {
                ...patchTransaction,
                _timestamps: {
                  ...patchTransaction._timestamps,
                  updated_at: Date.now(),
                  updated_by: userAccount.uid,
                },
              };

              setTimeout(async () => {
                await firestore.setData(
                  FIRESTORE_COLLECTION_NAMES.TRANSACTIONS,
                  finalTransaction.transaction_id,
                  finalTransaction
                );
                if (deleteWebAttachmentURL.length > 0) {
                  deleteWebAttachmentURL.forEach(async (url) => {
                    await deleteAttachmentImage(url);
                  });
                }
              }, 5000);

              dispatchSortedTransactions({
                type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
                  .PATCH_TRANSACTION,
                payload: {
                  prevTransaction,
                  patchTransaction: finalTransaction,
                  logbookToOpen,
                  reducerUpdatedAt,
                },
              });
            }
            break;

          // TAG : Delete One Transaction Method
          case deleteTransaction && loadingType === "deleteOneTransaction":
            postLogSnagEvent(
              userAccount.displayName,
              LOGSNAG_EVENT_TYPES.TRANSACTION_DELETE
            );

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
            console.log("start insert budget");
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

          // TAG : Patch one repeated transactions
          case repeatedTransaction &&
            (patchedTransactions || deletedTransactions) &&
            (loadingType === LOADING_TYPES.REPEATED_TRANSACTIONS.PATCH_ALL ||
              loadingType ===
                LOADING_TYPES.REPEATED_TRANSACTIONS
                  .DELETE_PREVIOUS_TRANSACTIONS_INSIDE_THIS_ONE):
            console.log("start patch repeated transaction");
            dispatchRepeatedTransactions({
              type: REDUCER_ACTIONS.REPEATED_TRANSACTIONS.PATCH,
              payload: {
                repeatedTransaction,
                reducerUpdatedAt,
              },
            });
            break;

          // TAG : Patch one repeated transaction for next occurence
          case repeatedTransaction &&
            loadingType === LOADING_TYPES.REPEATED_TRANSACTIONS.PATCH_NEXT:
            dispatchRepeatedTransactions({
              type: REDUCER_ACTIONS.REPEATED_TRANSACTIONS.PATCH,
              payload: {
                repeatedTransaction,
                reducerUpdatedAt,
              },
            });
            break;

          // TAG : Delete one repeated transactions
          case repeatedTransaction &&
            loadingType ===
              LOADING_TYPES.REPEATED_TRANSACTIONS
                .DELETE_THIS_ONE_AND_ALL_TRANSACTIONS_INSIDE:
            console.log("line 254 hapus sini");
            dispatchRepeatedTransactions({
              type: REDUCER_ACTIONS.REPEATED_TRANSACTIONS.DELETE_ONE,
              payload: {
                repeatedTransaction,
                reducerUpdatedAt,
              },
            });
            break;

          // TAG : Insert one feature wishlist
          case reducerUpdatedAt !== featureWishlistReducerUpdatedAt &&
            loadingType === LOADING_TYPES.FEATURE_WISHLIST.INSERT_ONE:
            dispatchGlobalFeatureWishlist({
              type: REDUCER_ACTIONS.FEATURE_WISHLIST.INSERT,
              payload: {
                featureWishlist,
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
      },

      1
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
      reducerUpdatedAt,
      insertedTransactions,
      patchedTransactions,
      deletedTransactions,
      prevCategoryType,
      targetCategoryType,
      patchCategory,
    } = route?.params;

    const isReducerTimestampSame =
      reducerUpdatedAt === sortedTransactions.reducerUpdatedAt;

    switch (true) {
      case isReducerTimestampSame &&
        loadingType === LOADING_TYPES.TRANSACTIONS.INSERT_ONE:
        navigation.navigate(screenList.bottomTabNavigator);
        break;
      case isReducerTimestampSame &&
        loadingType === LOADING_TYPES.TRANSACTIONS.PATCH_ONE:
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

      // Delete many transactions
      case isReducerTimestampSame &&
        (loadingType ===
          LOADING_TYPES.REPEATED_TRANSACTIONS
            .DELETE_THIS_ONE_AND_ALL_TRANSACTIONS_INSIDE ||
          loadingType ===
            LOADING_TYPES.REPEATED_TRANSACTIONS
              .DELETE_PREVIOUS_TRANSACTIONS_INSIDE_THIS_ONE):
        setTimeout(async () => {
          deletedTransactions.length > 0 &&
            deletedTransactions.forEach(async (transaction) => {
              await firestore.deleteData(
                FIRESTORE_COLLECTION_NAMES.TRANSACTIONS,
                transaction.transaction_id,
                transaction
              );
            });
        }, 5000);
        navigation.navigate(screenList.myRepeatedTransactionsScreen);

        break;

      // Patch all repeated transactions
      case isReducerTimestampSame &&
        loadingType === LOADING_TYPES.REPEATED_TRANSACTIONS.PATCH_ALL:
        console.log(LOADING_TYPES.REPEATED_TRANSACTIONS.PATCH_ALL);
        // Sync all patched transactions to firebase
        setTimeout(() => {
          insertedTransactions.length > 0 &&
            insertedTransactions.forEach(async (transaction) => {
              await firestore.setData(
                FIRESTORE_COLLECTION_NAMES.TRANSACTIONS,
                transaction.transaction_id,
                transaction
              );
            });
          patchedTransactions.length > 0 &&
            patchedTransactions.forEach(async (transaction) => {
              await firestore.setData(
                FIRESTORE_COLLECTION_NAMES.TRANSACTIONS,
                transaction.transaction_id,
                transaction
              );
            });
          deletedTransactions.length > 0 &&
            deletedTransactions.forEach(async (transaction) => {
              await firestore.deleteData(
                FIRESTORE_COLLECTION_NAMES.TRANSACTIONS,
                transaction.transaction_id,
                transaction
              );
            });
        }, 5000);

        navigation.navigate(screenList.myRepeatedTransactionsScreen);

        break;

      default:
        break;
    }
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
      insertedTransactions,
      patchedTransactions,
      deletedTransactions,
    } = route?.params;

    const isReducerTimestampSame =
      reducerUpdatedAt === repeatedTransactions.reducerUpdatedAt;

    switch (true) {
      case isReducerTimestampSame &&
        loadingType === LOADING_TYPES.REPEATED_TRANSACTIONS.PATCH_NEXT:
        setTimeout(async () => {
          await firestore.setData(
            FIRESTORE_COLLECTION_NAMES.REPEATED_TRANSACTIONS,
            repeatedTransaction.repeat_id,
            repeatedTransaction
          );
        }, 5000);

        navigation.navigate(screenList.repeatedTransactionDetailsScreen, {
          repeatSection: repeatedTransaction,
        });
        break;

      case isReducerTimestampSame &&
        loadingType === LOADING_TYPES.REPEATED_TRANSACTIONS.PATCH_ALL:
        // sync updated repeated transaction to firestore
        setTimeout(async () => {
          await firestore.setData(
            FIRESTORE_COLLECTION_NAMES.REPEATED_TRANSACTIONS,
            repeatedTransaction.repeat_id,
            repeatedTransaction
          );
        }, 5000);

        if (repeatedTransaction?.transactions?.length > 0) {
          // check timestamp of patched repeated transaction
          const foundPatchedRepeatSection =
            repeatedTransactions.repeatedTransactions.find((repeatSection) => {
              return repeatSection.repeat_id === repeatedTransaction.repeat_id;
            });

          // if timestamp is same, it means that the patched repeated transaction has been updated in state
          let isTimestampSame = false;
          if (foundPatchedRepeatSection) {
            isTimestampSame =
              foundPatchedRepeatSection._timestamps.updated_at ===
              repeatedTransaction?._timestamps.updated_at;
          }

          // proceeds patching transactions
          if (!!repeatedTransaction.transactions.length && isTimestampSame) {
            dispatchSortedTransactions({
              type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
                .PATCH_MANY_TRANSACTIONS,
              payload: {
                insertedTransactions,
                patchedTransactions,
                deletedTransactions,
                reducerUpdatedAt,
              },
            });
          }
        }

        break;
      case isReducerTimestampSame &&
        loadingType ===
          LOADING_TYPES.REPEATED_TRANSACTIONS
            .DELETE_THIS_ONE_AND_ALL_TRANSACTIONS_INSIDE:
        setTimeout(async () => {
          await firestore.deleteData(
            FIRESTORE_COLLECTION_NAMES.REPEATED_TRANSACTIONS,
            repeatedTransaction.repeat_id,
            repeatedTransaction
          );
        }, 5000);

        dispatchSortedTransactions({
          type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
            .DELETE_MANY_TRANSACTIONS,
          payload: {
            deletedTransactions,
            reducerUpdatedAt,
          },
        });
        break;
      case isReducerTimestampSame &&
        loadingType ===
          LOADING_TYPES.REPEATED_TRANSACTIONS
            .DELETE_PREVIOUS_TRANSACTIONS_INSIDE_THIS_ONE:
        setTimeout(async () => {
          await firestore.setData(
            FIRESTORE_COLLECTION_NAMES.REPEATED_TRANSACTIONS,
            repeatedTransaction.repeat_id,
            repeatedTransaction
          );
        }, 5000);

        dispatchSortedTransactions({
          type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
            .DELETE_MANY_TRANSACTIONS,
          payload: {
            deletedTransactions,
            reducerUpdatedAt,
          },
        });
        break;

      default:
        break;
    }
  }, [repeatedTransactions.reducerUpdatedAt]);

  useEffect(() => {
    const { reducerUpdatedAt, featureWishlist, loadingType } = route?.params;

    const isReducerTimestampSame =
      reducerUpdatedAt === globalFeatureWishlist.reducerUpdatedAt;

    switch (true) {
      case isReducerTimestampSame &&
        loadingType === LOADING_TYPES.FEATURE_WISHLIST.INSERT_ONE:
        navigation.navigate(screenList.featureWishlistScreen);
        break;

      default:
        break;
    }
  }, [globalFeatureWishlist.reeducerUpdatedAt]);

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
