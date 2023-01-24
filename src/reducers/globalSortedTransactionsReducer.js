import deletedManyTransactionsHandler from "./reducer-handler/deletedManyTransactionsHandler";
import insertedManyTransactionsHandler from "./reducer-handler/insertedManyTransactionsHandler";
import patchedManyTransactionsHandler from "./reducer-handler/patchedManyTransactionsHandler";
import REDUCER_ACTIONS from "./reducer.action";

export const globalSortedTransactionsReducer = (state, action) => {
  let reducerUpdatedAt;
  switch (action.type) {
    // TAG : Multi Actions
    case REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.SET_MULTI_ACTIONS:
      return {
        ...state,
        ...action.payload,
      };

    case REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.INIT_SETUP:
      return {
        ...state,
        groupSorted: action.payload,
        reducerUpdatedAt: Date.now(),
        // sortedTransactionsInitCounter: 1,
      };

    // TAG : Patch Category
    case REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.PATCH_CATEGORY:
      reducerUpdatedAt = action.payload.reducerUpdatedAt;
      const patchCategory = action.payload.patchCategory;
      const targetCategoryType = action.payload.targetCategoryType;
      const prevCategoryType = action.payload.prevCategoryType;
      let groupSorted = state.groupSorted;
      let patchedGroupSorted;
      let foundTransactions = [];
      let patchedTransactions = [];

      // Find transaction with the same category id
      const findTransaction = state.groupSorted.forEach((logbook) =>
        logbook.transactions.forEach((section) =>
          section.data.forEach((transaction) => {
            if (transaction.details.category_id === patchCategory.id) {
              foundTransactions.push({
                transaction: {
                  ...transaction,
                  details: {
                    ...transaction.details,
                    in_out: targetCategoryType,
                  },
                },
                sectionTitle: section.title,
                logbookId: logbook.logbook_id,
              });
            }
          })
        )
      );

      // Patch transaction with the same category id
      const patchTransaction = foundTransactions.forEach(
        (patchedTransaction) => {
          // Filter logbook
          const findLogbook = groupSorted.filter((logbook) => {
            return logbook.logbook_id === patchedTransaction.logbookId;
          });
          const findOtherLogbook = groupSorted.filter((logbook) => {
            return logbook.logbook_id !== patchedTransaction.logbookId;
          });

          // Filter section
          const findSection = findLogbook[0].transactions.filter((section) => {
            return section.title === patchedTransaction.sectionTitle;
          });
          const findOtherSection = findLogbook[0]?.transactions.filter(
            (section) => {
              return section.title !== patchedTransaction.sectionTitle;
            }
          );

          // Filter transaction
          // const findTransaction = findSection[0].data.filter((transaction) => {
          //   return transaction.id === patchedTransaction.transaction.id;
          // });
          const findOtherTransaction = findSection[0]?.data.filter(
            (transaction) => {
              return (
                transaction.transaction_id !==
                patchedTransaction.transaction.transaction_id
              );
            }
          );

          groupSorted = [
            ...findOtherLogbook,
            {
              ...findLogbook[0],
              transactions: [
                ...findOtherSection,
                {
                  ...findSection[0],
                  data: [
                    ...findOtherTransaction,
                    patchedTransaction.transaction,
                  ].sort(sortTransactionsDate),
                },
              ].sort(sortLogbookTransactions),
            },
          ];
        }
      );

      return {
        ...state,
        groupSorted: groupSorted || state.groupSorted,
        reducerUpdatedAt,
        // sortedTransactionsPatchCounter:
        //   state.sortedTransactionsPatchCounter + 1,
      };

    // TAG : Delete One Logbook
    case REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.DELETE_ONE_LOGBOOK:
      reducerUpdatedAt = action.payload.reducerUpdatedAt;
      const deleteLogbook = action.payload.deleteLogbook;
      let filterOtherLogbooks = state.groupSorted.filter(
        (logbook) => logbook.logbook_id !== deleteLogbook.logbook_id
      );
      console.log("reducer");
      return {
        ...state,
        groupSorted: [...filterOtherLogbooks],
        logbookToOpen: null,
        reducerUpdatedAt,
        // sortedLogbookDeleteCounter: state.sortedLogbookDeleteCounter + 1,
      };

    // TAG : Insert New Logbook
    case REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.INSERT_LOGBOOK:
      let newLogbook = action.payload.newLogbook;

      const newGroupSortedToBeReplaced = [...state.groupSorted, newLogbook];

      return {
        ...state,
        groupSorted: newGroupSortedToBeReplaced,
        logbookToOpen: action.payload.logbookToOpen,
        reducerUpdatedAt,
        // sortedLogbookInsertCounter: state.sortedLogbookInsertCounter + 1,
      };

    // TAG : Set Initial Sorted Transactions
    case REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.SET:
      let array = [];
      let insert;
      let patch;
      let deleted;

      // if (action.payload) {
      action.payload.forEach((logbook) =>
        logbook.transactions.forEach((section) =>
          section.data.forEach((transaction) =>
            array.push(transaction.transaction_id)
          )
        )
      );
      // }

      // // Increment insert counter
      // if (!state.sortedTransactionsInsertCounter) {
      //   insert = 1;
      // } else {
      //   insert = state.sortedTransactionsInsertCounter + 1;
      // }

      // // Increment patch counter
      // if (!state.sortedTransactionsPatchCounter) {
      //   patch = 1;
      // } else {
      //   patch = state.sortedTransactionsPatchCounter + 1;
      // }

      // // Increment delete counter
      // if (!state.sortedTransactionsDeleteCounter) {
      //   deleted = 1;
      // } else {
      //   deleted = state.sortedTransactionsDeleteCounter + 1;
      // }

      return {
        groupSorted: action.payload,
        reducerUpdatedAt: Date.now(),
        // sortedTransactionsInitCounter: state.sortedTransactionsInitCounter + 1,
        // sortedTransactionsInsertCounter:
        //   state.sortedTransactionsInsertCounter || 0,
        // sortedTransactionsPatchCounter:
        //   state.sortedTransactionsPatchCounter || 0,
        // sortedTransactionsDeleteCounter:
        //   state.sortedTransactionsDeleteCounter || 0,
        // sortedLogbookInsertCounter: state.sortedLogbookInsertCounter || 0,
        // sortedLogbookDeleteCounter: state.sortedLogbookDeleteCounter || 0,
      };

    // TAG : Insert New Transaction Method
    case REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.INSERT_TRANSACTION:
      console.log("start inset transaction 2");
      const newTransaction = action.payload.transaction;
      reducerUpdatedAt = action.payload.reducerUpdatedAt;
      const customDate = `${new Date(
        newTransaction.details.date
      ).getFullYear()}/${(
        "0" +
        (new Date(newTransaction.details.date).getMonth() + 1)
      ).slice(-2)}/${(
        "0" + new Date(newTransaction.details.date).getDate()
      ).slice(-2)}`;
      let groupSortedToBeReplaced;

      // TAG : Find for duplicates
      let duplicate = false;
      state.groupSorted.forEach((logbook) => {
        logbook.transactions.forEach((section) => {
          section.data.forEach((transaction) => {
            if (transaction.transaction_id === newTransaction.transaction_id) {
              duplicate = true;
            }
          });
        });
      });

      switch (duplicate) {
        case false:
          // TAG : Check logbook
          if (
            state.groupSorted.some(
              (logbooks) => logbooks.logbook_id === newTransaction.logbook_id
            )
          ) {
            // Get logboook section
            const foundLogbook = state.groupSorted.filter(
              (logbook) => logbook.logbook_id === newTransaction.logbook_id
            );
            const foundOtherLogbooks = state.groupSorted.filter(
              (logbook) => logbook.logbook_id !== newTransaction.logbook_id
            );
            console.log("first");

            // Check date and Get date section
            const foundDateSection = foundLogbook[0].transactions.filter(
              (dateSection) => dateSection.customDate === customDate
            );
            const foundOtherDateSection = foundLogbook[0].transactions.filter(
              (dateSection) => dateSection.customDate !== customDate
            );
            console.log("second");

            // TAG :  If transaction has new date
            if (!foundDateSection.length) {
              // Create new date section
              const newDateSection = {
                title: new Date(newTransaction.details.date).toDateString(),
                customDate: `${new Date(
                  newTransaction.details.date
                ).getFullYear()}/${(
                  "0" +
                  (new Date(newTransaction.details.date).getMonth() + 1)
                ).slice(-2)}/${(
                  "0" + new Date(newTransaction.details.date).getDate()
                ).slice(-2)}`,
                data: [newTransaction],
              };

              // Insert new date section in logbook
              // Replace initial logbook transactions with new section
              const mergeLogbookTransactions = [
                ...foundOtherDateSection,
                newDateSection,
              ];
              const sortedLogbookTransactions = mergeLogbookTransactions.sort(
                sortLogbookTransactions
              );
              // console.log(foundOtherDateSection)
              const logbookToBeReplaced = {
                ...foundLogbook[0],
                transactions: sortedLogbookTransactions,
              };
              console.log("sixth");
              console.log(logbookToBeReplaced);

              // Rebuild new sorted transactions
              groupSortedToBeReplaced = [
                ...foundOtherLogbooks,
                logbookToBeReplaced,
              ];
              console.log(groupSortedToBeReplaced);
            }

            // TAG : If transaction has same date
            if (foundDateSection.length) {
              // Insert new transaction
              const insertedTransactions = [
                ...foundDateSection[0].data,
                newTransaction,
              ];
              console.log("third");

              // Sort new inserted transactions
              const sortedDateSectionTransactions =
                insertedTransactions.sort(sortTransactionsDate);
              console.log("forth");

              // Replace initial transactions data with sorted transactions
              const sectionToBeInserted = {
                ...foundDateSection[0],
                data: sortedDateSectionTransactions,
              };
              console.log("fifth");

              // Replace initial logbook transactions with new section
              const mergeLogbookTransactions = [
                ...foundOtherDateSection,
                sectionToBeInserted,
              ];
              const sortedLogbookTransactions = mergeLogbookTransactions.sort(
                sortLogbookTransactions
              );
              // console.log(foundOtherDateSection)
              const logbookToBeReplaced = {
                ...foundLogbook[0],
                transactions: sortedLogbookTransactions,
              };
              console.log("sixth");
              console.log(logbookToBeReplaced);

              // Rebuild new sorted transactions
              groupSortedToBeReplaced = [
                ...foundOtherLogbooks,
                logbookToBeReplaced,
              ];
              console.log(groupSortedToBeReplaced);
            }
          }

          return {
            ...state,
            groupSorted: groupSortedToBeReplaced,
            logbookToOpen: action.payload.logbookToOpen,
            reducerUpdatedAt: reducerUpdatedAt,
            // sortedTransactionsInsertCounter:
            //   state.sortedTransactionsInsertCounter + 1,
          };

        case true:
          return {
            ...state,
          };

        default:
          break;
      }

    // SECTION : Patch many transactions method
    case REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
      .PATCH_MANY_TRANSACTIONS:
      reducerUpdatedAt = action.payload.reducerUpdatedAt;
      let insertedTransactions = action.payload.insertedTransactions;
      patchedTransactions = action.payload.patchedTransactions;
      let deletedTransactions = action.payload.deletedTransactions;
      let finalState = null;

      if (insertedTransactions.length > 0) {
        finalState = insertedManyTransactionsHandler(
          finalState || state,
          action
        );
      }

      if (patchedTransactions.length > 0) {
        finalState = patchedManyTransactionsHandler(
          finalState || state,
          action
        );
      }

      if (deletedTransactions.length > 0) {
        finalState = deletedManyTransactionsHandler(
          finalState || state,
          action
        );
      }

      // console.log("line379 reducer");
      console.log(JSON.stringify({ finalState }));
      return finalState || { ...state, reducerUpdatedAt };

    // SECTION : Delete many transactions method
    case REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
      .DELETE_MANY_TRANSACTIONS:
      reducerUpdatedAt = action.payload.reducerUpdatedAt;
      deletedTransactions = action.payload.deletedTransactions;
      finalState = null;
      console.log({ length: deletedTransactions.length });
      if (deletedTransactions.length > 0) {
        finalState = deletedManyTransactionsHandler(state, action);
      }

      // console.log("line379 reducer");
      // console.log(JSON.stringify({ finalState }));
      return finalState || { ...state, reducerUpdatedAt };

    // TAG : Patch One Transaction Method
    case REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.PATCH_TRANSACTION:
      const newPatchTransaction = action.payload.patchTransaction;
      reducerUpdatedAt = action.payload.reducerUpdatedAt;

      // Check if patched transaction id is the same as existing transaction id
      let prevTransaction = null;
      if (action.payload.prevTransaction) {
        prevTransaction = action.payload.prevTransaction;
      } else {
        state.groupSorted.forEach((logbook) => {
          logbook.transactions.forEach((section) => {
            section.data.forEach((transaction) => {
              if (
                transaction.transaction_id ===
                newPatchTransaction.transaction_id
              ) {
                prevTransaction = transaction;
              }
            });
          });
        });
      }

      // Prevent duplicate action from being dispatched by same device

      let isTransactionHasNewerTimestamp = false;
      if (prevTransaction) {
        isTransactionHasNewerTimestamp =
          newPatchTransaction._timestamps.updated_at >
          prevTransaction._timestamps.updated_at;

        customPatchDate = `${new Date(
          newPatchTransaction.details.date
        ).getFullYear()}/${(
          "0" +
          (new Date(newPatchTransaction.details.date).getMonth() + 1)
        ).slice(-2)}/${(
          "0" + new Date(newPatchTransaction.details.date).getDate()
        ).slice(-2)}`;
        customPrevDate = `${new Date(
          prevTransaction.details.date
        ).getFullYear()}/${(
          "0" +
          (new Date(prevTransaction.details.date).getMonth() + 1)
        ).slice(-2)}/${(
          "0" + new Date(prevTransaction.details.date).getDate()
        ).slice(-2)}`;
      }

      let logbookToOpen = null;
      if (action.payload.logbookToOpen) {
        logbookToOpen = action.payload.logbookToOpen;
      }
      // else {
      //   logbookToOpen = state.logbooks.find((logbook) => {
      //     if (logbook.logbook_id === newPatchTransaction.logbook_id) {
      //       return {
      //         name: logbook.logbook_name,
      //         logbook_id: logbook.logbook_id,
      //         logbook_currency: logbook.logbook_currency,
      //       };
      //     }
      //   });
      // }

      let groupSortPatched;
      let mergeLogbookTransactions;
      let sortedLogbookTransactions;
      let prevLogbookToBeReplaced;
      let targetLogbookToBeReplaced;

      if (
        prevTransaction &&
        isTransactionHasNewerTimestamp &&
        customPatchDate &&
        customPrevDate
      ) {
        // TAG : Create new date section
        const newDateSection = {
          title: new Date(
            newPatchTransaction.details.date
          ).toLocaleDateString(),
          customDate: customPatchDate,
          data: [newPatchTransaction],
        };

        // Check patch and prev if logbook id and transaction date is still the same
        const isLogbookIdSame =
          newPatchTransaction.logbook_id === prevTransaction.logbook_id;
        const isTransactionDateSame = customPatchDate === customPrevDate;

        // Get logboook section
        const foundPrevLogbook = state.groupSorted.filter(
          (logbook) => logbook.logbook_id === prevTransaction.logbook_id
        );
        const foundPrevOtherLogbooks = state.groupSorted.filter(
          (logbook) => logbook.logbook_id !== prevTransaction.logbook_id
        );
        const foundTargetLogbook = state.groupSorted.filter(
          (logbook) => logbook.logbook_id === newPatchTransaction.logbook_id
        );
        const foundTargetOtherLogbooks = state.groupSorted.filter(
          (logbook) => logbook.logbook_id !== newPatchTransaction.logbook_id
        );
        console.log("first");

        // Check date and Get date section
        // Target Date Section
        const foundTargetDateSection =
          foundTargetLogbook[0].transactions.filter(
            (dateSection) => dateSection.customDate === customPatchDate
          );
        const foundTargetOtherDateSection =
          foundTargetLogbook[0].transactions.filter(
            (dateSection) => dateSection.customDate !== customPatchDate
          );
        // Prev Date Section
        const foundPrevDateSection = foundPrevLogbook[0].transactions.filter(
          (dateSection) => dateSection.customDate === customPrevDate
        );
        const foundPrevOtherDateSection =
          foundPrevLogbook[0].transactions.filter(
            (dateSection) => dateSection.customDate !== customPrevDate
          );
        // Prev Transactions Data
        const foundPrevOtherTransactionsData =
          foundPrevDateSection[0].data.filter(
            (transaction) =>
              transaction.transaction_id !== newPatchTransaction.transaction_id
          );

        // TAG : OPTION 11
        if (
          !isLogbookIdSame &&
          // isTransactionDateSame &&
          !foundPrevOtherDateSection.length &&
          foundTargetDateSection.length &&
          !foundPrevOtherTransactionsData.length
        ) {
          console.log("OPT 11");

          // TAG : [A] HANDLING PREVIOUS DATE SECTION
          // 1. Remove transaction from previous date section and sort it
          // const sortedPrevOtherTransactionsData = foundPrevOtherTransactionsData.sort(sortTransactions)
          console.log("first");
          // 2. Replace previous date section data with no 1
          // const replacedPrevDateSection = { ...foundPrevDateSection[0], data: sortedPrevOtherTransactionsData }
          console.log("second");

          // TAG : [B] JOIN [A] IN PREVIOUS LOGBOOK
          // 3. Get previous section date, override date section and sort it
          // const overridePrevDateSections = [...foundPrevOtherDateSection, replacedPrevDateSection]
          // sortedLogbookTransactions = foundPrevOtherDateSection.sort(sortLogbookTransactions)
          console.log("third");

          // 4. Replace initial logbook transactions with new section
          prevLogbookToBeReplaced = {
            ...foundPrevLogbook[0],
            transactions: [],
          };
          console.log("forth");
          // console.log(logbookToBeReplaced)

          // TAG : [C] HANDLING TARGET DATE SECTION
          // 5. Get transactions from target date section and sort it
          const getTargetTransactionsData = [
            ...foundTargetDateSection[0].data,
            newPatchTransaction,
          ];
          const sortedTargetTransactionsData =
            getTargetTransactionsData.sort(sortTransactionsDate);
          console.log("fifth");

          // 6. Replace target date section data with no 5
          const replacedTargetDateSection = {
            ...foundTargetDateSection[0],
            data: sortedTargetTransactionsData,
          };
          console.log("sixth");

          // TAG : [D] JOIN [C] IN TARGET LOGBOOK
          // 7. Get previous section date, override 1 date section and sort it
          const removeTargetDateSections = foundTargetOtherDateSection.filter(
            (section) => section.customDate !== customPatchDate
          );
          const overrideTargetDateSections = [
            ...removeTargetDateSections,
            replacedTargetDateSection,
          ];
          console.log("seventh");

          // 8. Sort new transactions date sections
          sortedLogbookTransactions = overrideTargetDateSections.sort(
            sortLogbookTransactions
          );
          console.log("eigth");

          // 9. Replace initial logbook transactions with new section
          targetLogbookToBeReplaced = {
            ...foundTargetLogbook[0],
            transactions: sortedLogbookTransactions,
          };
          console.log("ninth");
          // console.log(logbookToBeReplaced)

          // TAG : [E] JOINING [A] AND [D]

          // 10. Final Override
          const removedTwoLogbooks = foundPrevOtherLogbooks.filter(
            (logbook) =>
              logbook.logbook_id !== newPatchTransaction.logbook_id &&
              logbook.logbook_id !== prevTransaction.logbook_id
          );
          groupSortedToBeReplaced = [
            ...removedTwoLogbooks,
            targetLogbookToBeReplaced,
            prevLogbookToBeReplaced,
          ];
          console.log(groupSortedToBeReplaced);
        }

        // TAG : OPTION 10
        if (
          !isLogbookIdSame &&
          // isTransactionDateSame &&
          !foundPrevOtherDateSection.length &&
          !foundTargetDateSection.length &&
          !foundPrevOtherTransactionsData.length
        ) {
          console.log("OPT 10");

          // TAG : [A] HANDLING PREVIOUS DATE SECTION
          // 1. Remove transaction from previous date section and sort it
          // const sortedPrevOtherTransactionsData = foundPrevOtherTransactionsData.sort(sortTransactions)
          console.log("first");
          // 2. Replace previous date section data with no 1
          // const replacedPrevDateSection = { ...foundPrevDateSection[0], data: sortedPrevOtherTransactionsData }
          console.log("second");

          // TAG : [B] JOIN [A] IN PREVIOUS LOGBOOK
          // 3. Get previous section date, override date section and sort it
          // const overridePrevDateSections = [...foundPrevOtherDateSection, replacedPrevDateSection]
          // sortedLogbookTransactions = foundPrevOtherDateSection.sort(sortLogbookTransactions)
          console.log("third");

          // 4. Replace initial logbook transactions with new section
          prevLogbookToBeReplaced = {
            ...foundPrevLogbook[0],
            transactions: [],
          };
          console.log("forth");
          // console.log(logbookToBeReplaced)

          // TAG : [C] HANDLING TARGET DATE SECTION
          // 5. Get transactions from target date section and sort it
          // const getTargetTransactionsData = [...foundTargetDateSection[0].data, newPatchTransaction]
          // const sortedTargetTransactionsData = getTargetTransactionsData.sort(sortTransactions)
          console.log("fifth");

          // 6. Replace target date section data with no 5
          // const replacedTargetDateSection = { ...foundTargetDateSection[0], data: sortedTargetTransactionsData }
          console.log("sixth");

          // TAG : [D] JOIN [C] IN TARGET LOGBOOK
          // 7. Get previous section date, override 2 date section and sort it
          // const removeTargetDateSections = foundTargetOtherDateSection.filter((section) => section.customDate !== customPatchDate)
          const overrideTargetDateSections = [
            ...foundTargetOtherDateSection,
            newDateSection,
          ];
          console.log("seventh");

          // 8. Sort new transactions date sections
          sortedLogbookTransactions = overrideTargetDateSections.sort(
            sortLogbookTransactions
          );
          console.log("eigth");

          // 9. Replace initial logbook transactions with new section
          targetLogbookToBeReplaced = {
            ...foundTargetLogbook[0],
            transactions: sortedLogbookTransactions,
          };
          console.log("ninth");
          // console.log(logbookToBeReplaced)

          // TAG : [E] JOINING [A] AND [D]

          // 10. Final Override
          const removedTwoLogbooks = foundPrevOtherLogbooks.filter(
            (logbook) =>
              logbook.logbook_id !== newPatchTransaction.logbook_id &&
              logbook.logbook_id !== prevTransaction.logbook_id
          );
          groupSortedToBeReplaced = [
            ...removedTwoLogbooks,
            targetLogbookToBeReplaced,
            prevLogbookToBeReplaced,
          ];
          console.log(groupSortedToBeReplaced);
        }

        // TAG : OPTION 9
        if (
          !isLogbookIdSame &&
          // isTransactionDateSame &&
          foundPrevOtherDateSection.length &&
          !foundTargetDateSection.length &&
          !foundPrevOtherTransactionsData.length
        ) {
          console.log("OPT 9");

          // TAG : [A] HANDLING PREVIOUS DATE SECTION
          // 1. Remove transaction from previous date section and sort it
          const sortedPrevOtherTransactionsData =
            foundPrevOtherTransactionsData.sort(sortTransactionsDate);
          console.log("first");
          // 2. Replace previous date section data with no 1
          const replacedPrevDateSection = {
            ...foundPrevDateSection[0],
            data: sortedPrevOtherTransactionsData,
          };
          console.log("second");

          // TAG : [B] JOIN [A] IN PREVIOUS LOGBOOK
          // 3. Get previous section date, override date section and sort it
          // const overridePrevDateSections = [...foundPrevOtherDateSection, replacedPrevDateSection]
          sortedLogbookTransactions = foundPrevOtherDateSection.sort(
            sortLogbookTransactions
          );
          console.log("third");

          // 4. Replace initial logbook transactions with new section
          prevLogbookToBeReplaced = {
            ...foundPrevLogbook[0],
            transactions: sortedLogbookTransactions,
          };
          console.log("forth");
          // console.log(logbookToBeReplaced)

          // TAG : [C] HANDLING TARGET DATE SECTION
          // 5. Get transactions from target date section and sort it
          // const getTargetTransactionsData = [...foundTargetDateSection[0].data, newPatchTransaction]
          // const sortedTargetTransactionsData = getTargetTransactionsData.sort(sortTransactions)
          console.log("fifth");

          // 6. Replace target date section data with no 5
          // const replacedTargetDateSection = { ...foundTargetDateSection[0], data: sortedTargetTransactionsData }
          console.log("sixth");

          // TAG : [D] JOIN [C] IN TARGET LOGBOOK
          // 7. Get previous section date, override 2 date section and sort it
          // const removeTargetDateSections = foundTargetOtherDateSection.filter((section) => section.customDate !== customPatchDate)
          const overrideTargetDateSections = [
            ...foundTargetOtherDateSection,
            newDateSection,
          ];
          console.log("seventh");

          // 8. Sort new transactions date sections
          sortedLogbookTransactions = overrideTargetDateSections.sort(
            sortLogbookTransactions
          );
          console.log("eigth");

          // 9. Replace initial logbook transactions with new section
          targetLogbookToBeReplaced = {
            ...foundTargetLogbook[0],
            transactions: sortedLogbookTransactions,
          };
          console.log("ninth");
          // console.log(logbookToBeReplaced)

          // TAG : [E] JOINING [A] AND [D]

          // 10. Final Override
          const removedTwoLogbooks = foundPrevOtherLogbooks.filter(
            (logbook) =>
              logbook.logbook_id !== newPatchTransaction.logbook_id &&
              logbook.logbook_id !== prevTransaction.logbook_id
          );
          groupSortedToBeReplaced = [
            ...removedTwoLogbooks,
            targetLogbookToBeReplaced,
            prevLogbookToBeReplaced,
          ];
          console.log(groupSortedToBeReplaced);
        }

        // TAG : OPTION 8
        if (
          !isLogbookIdSame &&
          // isTransactionDateSame &&
          foundPrevOtherDateSection.length &&
          !foundTargetDateSection.length &&
          foundPrevOtherTransactionsData.length
        ) {
          console.log("OPT 8");

          // TAG : [A] HANDLING PREVIOUS DATE SECTION
          // 1. Remove transaction from previous date section and sort it
          const sortedPrevOtherTransactionsData =
            foundPrevOtherTransactionsData.sort(sortTransactionsDate);
          console.log("first");
          // 2. Replace previous date section data with no 1
          const replacedPrevDateSection = {
            ...foundPrevDateSection[0],
            data: sortedPrevOtherTransactionsData,
          };
          console.log("second");

          // TAG : [B] JOIN [A] IN PREVIOUS LOGBOOK
          // 3. Get previous section date, override date section and sort it
          const overridePrevDateSections = [
            ...foundPrevOtherDateSection,
            replacedPrevDateSection,
          ];
          sortedLogbookTransactions = overridePrevDateSections.sort(
            sortLogbookTransactions
          );
          console.log("third");

          // 4. Replace initial logbook transactions with new section
          prevLogbookToBeReplaced = {
            ...foundPrevLogbook[0],
            transactions: sortedLogbookTransactions,
          };
          console.log("forth");
          // console.log(logbookToBeReplaced)

          // TAG : [C] HANDLING TARGET DATE SECTION
          // 5. Get transactions from target date section and sort it
          // const getTargetTransactionsData = [...foundTargetDateSection[0].data, newPatchTransaction]
          // const sortedTargetTransactionsData = getTargetTransactionsData.sort(sortTransactions)
          console.log("fifth");

          // 6. Replace target date section data with no 5
          // const replacedTargetDateSection = { ...foundTargetDateSection[0], data: sortedTargetTransactionsData }
          console.log("sixth");

          // TAG : [D] JOIN [C] IN TARGET LOGBOOK
          // 7. Get previous section date, override 2 date section and sort it
          // const removeTargetDateSections = foundTargetOtherDateSection.filter((section) => section.customDate !== customPatchDate)
          const overrideTargetDateSections = [
            ...foundTargetOtherDateSection,
            newDateSection,
          ];
          console.log("seventh");

          // 8. Sort new transactions date sections
          sortedLogbookTransactions = overrideTargetDateSections.sort(
            sortLogbookTransactions
          );
          console.log("eigth");

          // 9. Replace initial logbook transactions with new section
          targetLogbookToBeReplaced = {
            ...foundTargetLogbook[0],
            transactions: sortedLogbookTransactions,
          };
          console.log("ninth");
          // console.log(logbookToBeReplaced)

          // TAG : [E] JOINING [A] AND [D]

          // 10. Final Override
          const removedTwoLogbooks = foundPrevOtherLogbooks.filter(
            (logbook) =>
              logbook.logbook_id !== newPatchTransaction.logbook_id &&
              logbook.logbook_id !== prevTransaction.logbook_id
          );
          groupSortedToBeReplaced = [
            ...removedTwoLogbooks,
            targetLogbookToBeReplaced,
            prevLogbookToBeReplaced,
          ];
          console.log(groupSortedToBeReplaced);
        }

        // TAG : OPTION 7
        if (
          !isLogbookIdSame &&
          // isTransactionDateSame &&
          foundPrevOtherDateSection.length &&
          foundTargetDateSection.length &&
          !foundPrevOtherTransactionsData.length
        ) {
          console.log("OPT 7");

          // TAG : [A] HANDLING PREVIOUS DATE SECTION
          // 1. Remove transaction from previous date section and sort it
          // const sortedPrevOtherTransactionsData = foundPrevOtherTransactionsData.sort(sortTransactions)
          // console.log('first')
          // 2. Replace previous date section data with no 1
          // const replacedPrevDateSection = { ...foundPrevDateSection[0], data: sortedPrevOtherTransactionsData }
          // console.log('second')

          // TAG : [B] JOIN [A] IN PREVIOUS LOGBOOK
          // 3. Get previous section date, override date section and sort it
          // const overridePrevDateSections = [...foundPrevOtherDateSection, replacedPrevDateSection]
          sortedLogbookTransactions = foundPrevOtherDateSection.sort(
            sortLogbookTransactions
          );
          console.log("third");

          // 4. Replace initial logbook transactions with new section
          prevLogbookToBeReplaced = {
            ...foundPrevLogbook[0],
            transactions: sortedLogbookTransactions,
          };
          console.log("forth");
          // console.log(logbookToBeReplaced)

          // TAG : [C] HANDLING TARGET DATE SECTION
          // 5. Get transactions from target date section and sort it
          const getTargetTransactionsData = [
            ...foundTargetDateSection[0].data,
            newPatchTransaction,
          ];
          const sortedTargetTransactionsData =
            getTargetTransactionsData.sort(sortTransactionsDate);
          console.log("fifth");

          // 6. Replace target date section data with no 5
          const replacedTargetDateSection = {
            ...foundTargetDateSection[0],
            data: sortedTargetTransactionsData,
          };
          console.log("sixth");

          // TAG : [D] JOIN [C] IN TARGET LOGBOOK
          // 7. Get previous section date, override 2 date section and sort it
          const removeTargetDateSections = foundTargetOtherDateSection.filter(
            (section) => section.customDate !== customPatchDate
          );
          const overrideTargetDateSections = [
            ...removeTargetDateSections,
            replacedTargetDateSection,
          ];
          console.log("seventh");

          // 8. Sort new transactions date sections
          sortedLogbookTransactions = overrideTargetDateSections.sort(
            sortLogbookTransactions
          );
          console.log("eigth");

          // 9. Replace initial logbook transactions with new section
          targetLogbookToBeReplaced = {
            ...foundTargetLogbook[0],
            transactions: sortedLogbookTransactions,
          };
          console.log("ninth");
          // console.log(logbookToBeReplaced)

          // TAG : [E] JOINING [A] AND [D]

          // 10. Final Override
          const removedTwoLogbooks = foundPrevOtherLogbooks.filter(
            (logbook) =>
              logbook.logbook_id !== newPatchTransaction.logbook_id &&
              logbook.logbook_id !== prevTransaction.logbook_id
          );
          groupSortedToBeReplaced = [
            ...removedTwoLogbooks,
            targetLogbookToBeReplaced,
            prevLogbookToBeReplaced,
          ];
          console.log(groupSortedToBeReplaced);
        }

        // TAG : OPTION 6
        if (
          !isLogbookIdSame &&
          // isTransactionDateSame &&
          foundPrevOtherDateSection.length &&
          foundTargetDateSection.length &&
          foundPrevOtherTransactionsData.length
        ) {
          console.log("OPT 6");

          // TAG : [A] HANDLING PREVIOUS DATE SECTION
          // 1. Remove transaction from previous date section and sort it
          const sortedPrevOtherTransactionsData =
            foundPrevOtherTransactionsData.sort(sortTransactionsDate);
          console.log("first");
          // 2. Replace previous date section data with no 1
          const replacedPrevDateSection = {
            ...foundPrevDateSection[0],
            data: sortedPrevOtherTransactionsData,
          };
          console.log("second");

          // TAG : [B] JOIN [A] IN PREVIOUS LOGBOOK
          // 3. Get previous section date, override date section and sort it
          const overridePrevDateSections = [
            ...foundPrevOtherDateSection,
            replacedPrevDateSection,
          ];
          sortedLogbookTransactions = overridePrevDateSections.sort(
            sortLogbookTransactions
          );
          console.log("third");

          // 4. Replace initial logbook transactions with new section
          prevLogbookToBeReplaced = {
            ...foundPrevLogbook[0],
            transactions: sortedLogbookTransactions,
          };
          console.log("forth");
          // console.log(logbookToBeReplaced)

          // TAG : [C] HANDLING TARGET DATE SECTION
          // 5. Get transactions from target date section and sort it
          const getTargetTransactionsData = [
            ...foundTargetDateSection[0].data,
            newPatchTransaction,
          ];
          const sortedTargetTransactionsData =
            getTargetTransactionsData.sort(sortTransactionsDate);
          console.log("fifth");

          // 6. Replace target date section data with no 5
          const replacedTargetDateSection = {
            ...foundTargetDateSection[0],
            data: sortedTargetTransactionsData,
          };
          console.log("sixth");

          // TAG : [D] JOIN [C] IN TARGET LOGBOOK
          // 7. Get previous section date, override 2 date section and sort it
          const removeTargetDateSections = foundTargetOtherDateSection.filter(
            (section) => section.customDate !== customPatchDate
          );
          const overrideTargetDateSections = [
            ...removeTargetDateSections,
            replacedTargetDateSection,
          ];
          console.log("seventh");

          // 8. Sort new transactions date sections
          sortedLogbookTransactions = overrideTargetDateSections.sort(
            sortLogbookTransactions
          );
          console.log("eigth");

          // 9. Replace initial logbook transactions with new section
          targetLogbookToBeReplaced = {
            ...foundTargetLogbook[0],
            transactions: sortedLogbookTransactions,
          };
          console.log("ninth");
          // console.log(logbookToBeReplaced)

          // TAG : [E] JOINING [A] AND [D]

          // 10. Final Override
          const removedTwoLogbooks = foundPrevOtherLogbooks.filter(
            (logbook) =>
              logbook.logbook_id !== newPatchTransaction.logbook_id &&
              logbook.logbook_id !== prevTransaction.logbook_id
          );
          groupSortedToBeReplaced = [
            ...removedTwoLogbooks,
            targetLogbookToBeReplaced,
            prevLogbookToBeReplaced,
          ];
          console.log(groupSortedToBeReplaced);
        }

        // TAG : OPTION 5
        if (
          isLogbookIdSame &&
          isTransactionDateSame &&
          foundTargetDateSection.length
        ) {
          console.log("OPT 5");

          // [A] HANDLING TARGET DATE SECTION
          // 1. Get trasnactions from target date section and sort it
          const getTargetTransactionsData = [
            ...foundPrevOtherTransactionsData,
            newPatchTransaction,
          ];
          const sortedTargetTransactionsData =
            getTargetTransactionsData.sort(sortTransactionsDate);
          console.log("third");

          // 4. Replace target date section data with no 3
          const replacedTargetDateSection = {
            ...foundTargetDateSection[0],
            data: sortedTargetTransactionsData,
          };

          // [C] JOINING [A] AND [B]

          // 5. Get previous section date, override 2 date section and sort it
          const overrideDateSections = [
            ...foundTargetOtherDateSection,
            replacedTargetDateSection,
          ];

          // 6. Sort new transactions date sections
          sortedLogbookTransactions = overrideDateSections.sort(
            sortLogbookTransactions
          );
          console.log("forth");

          // 7. Replace initial logbook transactions with new section
          targetLogbookToBeReplaced = {
            ...foundPrevLogbook[0],
            transactions: sortedLogbookTransactions,
          };
          console.log("sixth");
          // console.log(logbookToBeReplaced)

          // 8. Final Override
          groupSortedToBeReplaced = [
            ...foundPrevOtherLogbooks,
            targetLogbookToBeReplaced,
          ];
          console.log(groupSortedToBeReplaced);
        }

        // TAG : OPTION 4
        if (
          isLogbookIdSame &&
          !isTransactionDateSame &&
          foundTargetDateSection.length &&
          !foundPrevOtherTransactionsData.length
        ) {
          console.log("OPT 4");

          // [A] HANDLING PREVIOUS DATE SECTION
          // 1. Remove transaction from previous date section and sort it
          // const sortedPrevOtherTransactionsData = foundPrevOtherTransactionsData.sort(sortTransactions)
          // console.log('first')
          // 2. Replace previous date section data with no 1
          // const replacedPrevDateSection = { ...foundPrevDateSection[0], data: sortedPrevOtherTransactionsData }
          // console.log('second')

          // [B] HANDLING TARGET DATE SECTION
          // 3. Get transactions from target date section and sort it
          const getTargetTransactionsData = [
            ...foundTargetDateSection[0].data,
            newPatchTransaction,
          ];
          const sortedTargetTransactionsData =
            getTargetTransactionsData.sort(sortTransactionsDate);
          console.log("third");

          // 4. Replace target date section data with no 3
          const replacedTargetDateSection = {
            ...foundTargetDateSection[0],
            data: sortedTargetTransactionsData,
          };

          // [C] JOINING [A] AND [B]

          // 5. Get previous section date, override 2 date section and sort it
          const removeTwoDateSections = foundTargetOtherDateSection.filter(
            (section) =>
              section.customDate !== customPatchDate &&
              section.customDate !== customPrevDate
          );
          const overrideDateSections = [
            ...removeTwoDateSections,
            replacedTargetDateSection,
          ];

          // 6. Sort new transactions date sections
          sortedLogbookTransactions = overrideDateSections.sort(
            sortLogbookTransactions
          );
          console.log("forth");

          // 7. Replace initial logbook transactions with new section
          targetLogbookToBeReplaced = {
            ...foundPrevLogbook[0],
            transactions: sortedLogbookTransactions,
          };
          console.log("sixth");
          // console.log(logbookToBeReplaced)

          // 8. Final Override
          groupSortedToBeReplaced = [
            ...foundPrevOtherLogbooks,
            targetLogbookToBeReplaced,
          ];
          console.log(groupSortedToBeReplaced);
        }

        // TAG : OPTION 3
        if (
          isLogbookIdSame &&
          !isTransactionDateSame &&
          foundTargetDateSection.length &&
          foundPrevOtherTransactionsData.length
        ) {
          console.log("OPT 3");

          // [A] HANDLING PREVIOUS DATE SECTION
          // 1. Remove transaction from previous date section and sort it
          const sortedPrevOtherTransactionsData =
            foundPrevOtherTransactionsData.sort(sortTransactionsDate);
          console.log("first");
          // 2. Replace previous date section data with no 1
          const replacedPrevDateSection = {
            ...foundPrevDateSection[0],
            data: sortedPrevOtherTransactionsData,
          };
          console.log("second");

          // [B] HANDLING TARGET DATE SECTION
          // 3. Get transactions from target date section and sort it
          const getTargetTransactionsData = [
            ...foundTargetDateSection[0].data,
            newPatchTransaction,
          ];
          const sortedTargetTransactionsData =
            getTargetTransactionsData.sort(sortTransactionsDate);
          console.log("third");

          // 4. Replace target date section data with no 3
          const replacedTargetDateSection = {
            ...foundTargetDateSection[0],
            data: sortedTargetTransactionsData,
          };

          // [C] JOINING [A] AND [B]

          // 5. Get previous section date, override 2 date section and sort it
          const removeTwoDateSections = foundTargetOtherDateSection.filter(
            (section) =>
              section.customDate !== customPatchDate &&
              section.customDate !== customPrevDate
          );
          const overrideDateSections = [
            ...removeTwoDateSections,
            replacedPrevDateSection,
            replacedTargetDateSection,
          ];

          // 6. Sort new transactions date sections
          sortedLogbookTransactions = overrideDateSections.sort(
            sortLogbookTransactions
          );
          console.log("forth");

          // 7. Replace initial logbook transactions with new section
          targetLogbookToBeReplaced = {
            ...foundPrevLogbook[0],
            transactions: sortedLogbookTransactions,
          };
          console.log("sixth");
          // console.log(logbookToBeReplaced)

          // 8. Final Override
          groupSortedToBeReplaced = [
            ...foundPrevOtherLogbooks,
            targetLogbookToBeReplaced,
          ];
          console.log(groupSortedToBeReplaced);
        }

        // TAG : OPTION 2
        if (
          isLogbookIdSame &&
          !isTransactionDateSame &&
          !foundTargetDateSection.length &&
          !foundPrevOtherTransactionsData.length
        ) {
          console.log("OPT 2");

          mergeLogbookTransactions = [
            ...foundPrevOtherDateSection,
            newDateSection,
          ];

          sortedLogbookTransactions = mergeLogbookTransactions.sort(
            sortLogbookTransactions
          );

          targetLogbookToBeReplaced = {
            ...foundPrevLogbook[0],
            transactions: sortedLogbookTransactions,
          };
          console.log("sixth");
          console.log(targetLogbookToBeReplaced);

          // Rebuild new sorted transactions
          groupSortedToBeReplaced = [
            ...foundPrevOtherLogbooks,
            targetLogbookToBeReplaced,
          ];
          console.log(groupSortedToBeReplaced);
        }

        // TAG : OPTION 1
        if (
          isLogbookIdSame &&
          !isTransactionDateSame &&
          !foundTargetDateSection.length &&
          foundPrevOtherTransactionsData.length
        ) {
          console.log("OPT 1");

          // TAG : New date && same logbook && has prevTransactionsData remains
          // Sort new inserted transactions
          const prevSortedDateSectionTransactions =
            foundPrevOtherTransactionsData.sort(sortTransactionsDate);
          console.log("forth");

          // Replace initial transactions data with sorted transactions
          const newPrevDateSection = {
            ...foundPrevDateSection[0],
            data: prevSortedDateSectionTransactions,
          };
          console.log("fifth");

          // Replace initial logbook transactions with new section
          mergeLogbookTransactions = [
            ...foundPrevOtherDateSection,
            newPrevDateSection,
            newDateSection,
          ];
          sortedLogbookTransactions = mergeLogbookTransactions.sort(
            sortLogbookTransactions
          );
          // console.log(foundOtherDateSection)
          targetLogbookToBeReplaced = {
            ...foundPrevLogbook[0],
            transactions: sortedLogbookTransactions,
          };
          console.log("sixth");
          console.log(targetLogbookToBeReplaced);

          // Rebuild new sorted transactions
          groupSortedToBeReplaced = [
            ...foundPrevOtherLogbooks,
            targetLogbookToBeReplaced,
          ];
          console.log(groupSortedToBeReplaced);
        }

        return {
          ...state,
          groupSorted: groupSortedToBeReplaced,
          // sortedTransactionsPatchCounter:
          //   state.sortedTransactionsPatchCounter + 1,
          logbookToOpen: logbookToOpen,
          reducerUpdatedAt: reducerUpdatedAt,
        };
      }
      return state;

    // TAG : DELETE ONE TRANSACTION
    case REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
      .DELETE_ONE_TRANSACTION:
      reducerUpdatedAt = action.payload.reducerUpdatedAt;
      const deleteTransaction = action.payload.deleteTransaction;
      const customDeleteDate = `${new Date(
        deleteTransaction.details.date
      ).getFullYear()}/${(
        "0" +
        (new Date(deleteTransaction.details.date).getMonth() + 1)
      ).slice(-2)}/${(
        "0" + new Date(deleteTransaction.details.date).getDate()
      ).slice(-2)}`;

      let isDuplicate = false;
      state.groupSorted.forEach((logbook) => {
        logbook.transactions.forEach((section) => {
          section.data.forEach((transaction) => {
            if (
              transaction.transaction_id === deleteTransaction.transaction_id
            ) {
              isDuplicate = true;
            }
          });
        });
      });
      if (isDuplicate) {
        // Get logboook section
        const foundPrevDelLogbook = state.groupSorted.filter(
          (logbook) => logbook.logbook_id === deleteTransaction.logbook_id
        );
        const foundPrevDelOtherLogbooks = state.groupSorted.filter(
          (logbook) => logbook.logbook_id !== deleteTransaction.logbook_id
        );
        // console.log("first");

        // Check date and Get date section
        // Prev Date Section
        const foundPrevDelDateSection =
          foundPrevDelLogbook[0].transactions.filter(
            (dateSection) => dateSection.customDate === customDeleteDate
          );
        const foundPrevDelOtherDateSection =
          foundPrevDelLogbook[0].transactions.filter(
            (dateSection) => dateSection.customDate !== customDeleteDate
          );
        // Prev Transactions Data
        const foundPrevDelOtherTransactionsData =
          foundPrevDelDateSection[0].data.filter(
            (transaction) =>
              transaction.transaction_id !== deleteTransaction.transaction_id
          );

        if (foundPrevDelOtherTransactionsData.length) {
          console.log("if1");

          // [A] HANDLING PREVIOUS DATA
          // 1. Remove transaction from previous date section, sort it, and put it back in date section
          const sortedDelTransactionsData =
            foundPrevDelOtherTransactionsData.sort(sortTransactionsDate);
          const newDateSection = {
            ...foundPrevDelDateSection[0],
            data: sortedDelTransactionsData,
          };
          // 2. Join [1] with other date section in same logbook, sort it
          const mergeLogbookTransactions = [
            ...foundPrevDelOtherDateSection,
            newDateSection,
          ];
          const sortedLogbookTransactions = mergeLogbookTransactions.sort(
            sortLogbookTransactions
          );
          const logbookToBeReplaced = {
            ...foundPrevDelLogbook[0],
            transactions: sortedLogbookTransactions,
          };
          // 3. Join [2] with other logbook
          groupSortedToBeReplaced = [
            ...foundPrevDelOtherLogbooks,
            logbookToBeReplaced,
          ];
          console.log(groupSortedToBeReplaced);
        }

        if (!foundPrevDelOtherTransactionsData.length) {
          console.log("if2");

          // [A] HANDLING PREVIOUS DATA
          // 1. Remove transaction from previous date section, sort it, and put it back in date section
          // const sortedDelTransactionsData = foundPrevDelOtherTransactionsData.sort(sortTransactions)
          // const newDateSection = { ...foundPrevDelDateSection[0], data: sortedDelTransactionsData }
          // 2. Join [1] with other date section in same logbook, sort it
          // const mergeLogbookTransactions = [...foundPrevDelOtherDateSection, newDateSection]
          const sortedLogbookTransactions = foundPrevDelOtherDateSection.sort(
            sortLogbookTransactions
          );
          const logbookToBeReplaced = {
            ...foundPrevDelLogbook[0],
            transactions: sortedLogbookTransactions,
          };
          // 3. Join [2] with other logbook
          groupSortedToBeReplaced = [
            ...foundPrevDelOtherLogbooks,
            logbookToBeReplaced,
          ];
          console.log(groupSortedToBeReplaced);
        }

        return {
          ...state,
          groupSorted: groupSortedToBeReplaced,
          reducerUpdatedAt: reducerUpdatedAt,
          logbookToOpen: action.payload.logbookToOpen,
          // sortedTransactionsDeleteCounter:
          //   state.sortedTransactionsDeleteCounter + 1,
        };
      }
      return state;

    case REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.FORCE_SET:
      return action.payload;

    default:
      return state;
  }
};

const sortTransactionsDate = (prevTransaction, currentTransaction) => {
  return currentTransaction.details.date - prevTransaction.details.date;
};

const sortLogbookTransactions = (
  prevDateTransaction,
  currentDateTransaction
) => {
  if (prevDateTransaction.customDate < currentDateTransaction.customDate) {
    return 1;
  }
  if (prevDateTransaction.customDate > currentDateTransaction.customDate) {
    return -1;
  }
  return 0;
};

export default globalSortedTransactionsReducer;
