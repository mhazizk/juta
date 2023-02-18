const patchedManyTransactionsHandler = (state, action) => {
  const newPatchedTransactions = action.payload.patchedTransactions;
  const reducerUpdatedAt = action.payload.reducerUpdatedAt;
  let customPatchDate = null;
  let customPrevDate = null;
  let groupSortedHasBeenReplaced = null;
  let foundPrevLogbook = null;

  // STEP : 2. loop patch the new transactions
  newPatchedTransactions.forEach((newPatchedTransaction) => {
    if (!groupSortedHasBeenReplaced) {
      groupSortedHasBeenReplaced = state.groupSorted;
    }
    // STEP : 1. compare previous logbook id with new logbook id
    // find the previous logbook id
    groupSortedHasBeenReplaced.forEach((logbook) => {
      logbook.transactions.forEach((section) => {
        section.data.forEach((transaction) => {
          if (
            transaction.transaction_id ===
            newPatchedTransactions[0].transaction_id
          ) {
            foundPrevLogbook = logbook;
          }
        });
      });
    });

    // compare the previous logbook id with the new logbook id
    let prevLogbookId = foundPrevLogbook?.logbook_id;
    let isLogbookIdSame = false;
    if (prevLogbookId) {
      isLogbookIdSame = prevLogbookId === newPatchedTransactions[0].logbook_id;
    }

    console.log("line 33");
    // STEP : 3. create new custom date
    customPatchDate = `${new Date(
      newPatchedTransaction.details.date
    ).getFullYear()}/${(
      "0" +
      (new Date(newPatchedTransaction.details.date).getMonth() + 1)
    ).slice(-2)}/${(
      "0" + new Date(newPatchedTransaction.details.date).getDate()
    ).slice(-2)}`;

    // STEP : 4. get previous transaction
    let prevTransaction = null;
    groupSortedHasBeenReplaced.forEach((logbook) => {
      logbook.transactions.forEach((section) => {
        section.data.forEach((transaction) => {
          if (
            transaction.transaction_id === newPatchedTransaction.transaction_id
          ) {
            prevTransaction = transaction;
          }
        });
      });
    });

    // STEP : 5. create new custom date for previous transaction
    customPrevDate = `${new Date(
      prevTransaction.details.date
    ).getFullYear()}/${(
      "0" +
      (new Date(prevTransaction.details.date).getMonth() + 1)
    ).slice(-2)}/${(
      "0" + new Date(prevTransaction.details.date).getDate()
    ).slice(-2)}`;

    // STEP : 6. if the logbook id is the same, then just patch the transaction
    if (isLogbookIdSame) {
      console.log("line 70");
      // STEP : 7. if the new date is the same as the previous date
      if (customPatchDate === customPrevDate) {
        const foundSection = foundPrevLogbook.transactions.find((section) => {
          if (section.customDate === customPatchDate) {
            return section;
          }
        });

        // STEP : 8. patch the transaction
        const newSection = {
          ...foundSection,
          data: [
            ...foundSection.data.filter(
              (transaction) =>
                transaction.transaction_id !==
                newPatchedTransaction.transaction_id
            ),
            newPatchedTransaction,
          ].sort(sortDescendingTransactionsDate),
        };

        // STEP : 9. replace the section
        const newLogbook = {
          ...foundPrevLogbook,
          transactions: [
            ...foundPrevLogbook.transactions.filter(
              (section) => section.customDate !== customPatchDate
            ),
            newSection,
          ].sort(sortDescendingLogbookTransactions),
        };

        // STEP : 10. replace the logbook
        groupSortedHasBeenReplaced = [
          ...groupSortedHasBeenReplaced.filter(
            (logbook) => logbook.logbook_id !== newPatchedTransaction.logbook_id
          ),
          newLogbook,
        ];
      } else {
        // STEP : 7. if the date is different
        console.log("line 112");
        const foundPreviousSection = foundPrevLogbook.transactions.find(
          (section) => {
            if (section.customDate === customPrevDate) {
              return section;
            }
          }
        );

        // STEP : 8. remove the transaction from section
        const newPreviousSection = {
          ...foundPreviousSection,
          data: [
            ...foundPreviousSection.data.filter((transaction) => {
              return (
                transaction.transaction_id !== prevTransaction.transaction_id
              );
            }),
          ].sort(sortDescendingTransactionsDate),
        };

        // STEP : 9. put the new previous section back to the logbook
        const newPreviousLogbook = {
          ...foundPrevLogbook,
          transactions:
            newPreviousSection.data.length > 0 &&
            foundPrevLogbook.transactions.length > 0
              ? [
                  ...foundPrevLogbook.transactions.filter(
                    (section) => section.customDate !== customPrevDate
                  ),
                  newPreviousSection,
                ]
              : !newPreviousSection.data.length &&
                foundPrevLogbook.transactions.length > 0
              ? [
                  ...foundPrevLogbook.transactions.filter(
                    (section) => section.customDate !== customPrevDate
                  ),
                ]
              : [],
        };

        // console.log(newPreviousLogbook);
        // STEP : 10. find target section
        const foundSectionToBePatched = newPreviousLogbook.transactions.find(
          (section) => {
            if (section.customDate === customPatchDate) {
              return section;
            }
          }
        );

        // STEP : 11. if the section is not found, then create a new section
        if (!foundSectionToBePatched) {
          console.log("line 167");
          const newSectionToBePatched = {
            title: new Date(newPatchedTransaction.details.date).toDateString(),
            customDate: customPatchDate,
            data: [newPatchedTransaction],
          };
          const newPatchedLogbook = {
            ...newPreviousLogbook,
            transactions: [
              ...newPreviousLogbook.transactions,
              newSectionToBePatched,
            ].sort(sortDescendingLogbookTransactions),
          };
          groupSortedHasBeenReplaced = [
            ...groupSortedHasBeenReplaced.filter(
              (logbook) => logbook.logbook_id !== prevLogbookId
            ),
            newPatchedLogbook,
          ];
        } else {
          // STEP : 11. if the section is found, then patch the transaction
          const newPatchedSection = {
            ...foundSectionToBePatched,
            data: [...foundSectionToBePatched.data, newPatchedTransaction].sort(
              sortDescendingTransactionsDate
            ),
          };

          // STEP : 12. put the new patched section back to the logbook
          const newPatchedLogbook = {
            ...newPreviousLogbook,
            transactions: [
              ...newPreviousLogbook.transactions.filter(
                (section) => section.customDate !== customPatchDate
              ),
              newPatchedSection,
            ].sort(sortDescendingLogbookTransactions),
          };

          // STEP : 13. put the new patched logbook back to the group
          groupSortedHasBeenReplaced = [
            ...groupSortedHasBeenReplaced.filter(
              (logbook) => logbook.logbook_id !== prevLogbookId
            ),
            newPatchedLogbook,
          ];
        }
      }
    } else {
      // STEP : 6. if logbook id is different, find the previous logbook
      console.log("line 217");
      groupSortedHasBeenReplaced.forEach((logbook) => {
        logbook.transactions.forEach((section) => {
          section.data.forEach((transaction) => {
            if (
              transaction.transaction_id ===
              newPatchedTransaction.transaction_id
            ) {
              foundPrevLogbook = logbook;
            }
          });
        });
      });

      const foundPreviousSection = foundPrevLogbook.transactions.find(
        (section) => {
          if (section.customDate === customPrevDate) {
            return section;
          }
        }
      );

      // STEP : 7. remove the transaction from section
      const newPreviousSection = {
        ...foundPreviousSection,
        data: [
          ...foundPreviousSection.data.filter((transaction) => {
            return (
              transaction.transaction_id !== prevTransaction.transaction_id
            );
          }),
        ].sort(sortDescendingTransactionsDate),
      };

      // STEP : 8. put the new previous section back to the logbook
      const newPreviousLogbook = {
        ...foundPrevLogbook,
        transactions:
          newPreviousSection.data.length > 0 &&
          foundPrevLogbook.transactions.length > 0
            ? [
                ...foundPrevLogbook.transactions.filter(
                  (section) => section.customDate !== customPrevDate
                ),
                newPreviousSection,
              ]
            : !newPreviousSection.data.length &&
              foundPrevLogbook.transactions.length > 0
            ? [
                ...foundPrevLogbook.transactions.filter(
                  (section) => section.customDate !== customPrevDate
                ),
              ]
            : [],
      };

      // STEP : 9. find the target section
      const foundTargetLogbook = groupSortedHasBeenReplaced.find(
        (logbook) => logbook.logbook_id === newPatchedTransaction.logbook_id
      );
      const foundTargetSection = foundTargetLogbook.transactions.find(
        (section) => {
          if (section.customDate === customPatchDate) {
            return section;
          }
        }
      );

      // STEP : 10. if the section is not found, then create a new section
      if (!foundTargetSection) {
        console.log("line 287");
        const newSectionToBePatched = {
          title: new Date(newPatchedTransaction.details.date).toDateString(),
          customDate: customPatchDate,
          data: [newPatchedTransaction],
        };
        const newPatchedLogbook = {
          ...foundTargetLogbook,
          transactions: [
            ...foundTargetLogbook.transactions,
            newSectionToBePatched,
          ].sort(sortDescendingLogbookTransactions),
        };
        groupSortedHasBeenReplaced = [
          ...groupSortedHasBeenReplaced.filter(
            (logbook) =>
              logbook.logbook_id !== foundPrevLogbook.logbook_id &&
              logbook.logbook_id !== newPatchedTransaction.logbook_id
          ),
          newPreviousLogbook,
          newPatchedLogbook,
        ];
      } else {
        // STEP : 11. if the section is found, then insert the transaction
        console.log("line 311");
        const newPatchedSection = {
          ...foundTargetSection,
          data: [...foundTargetSection.data, newPatchedTransaction].sort(
            sortDescendingTransactionsDate
          ),
        };

        // STEP : 12. put the new patched section back to the logbook
        const newPatchedLogbook = {
          ...newPreviousLogbook,
          transactions: [
            ...newPreviousLogbook.transactions.filter(
              (section) => section.customDate !== customPatchDate
            ),
            newPatchedSection,
          ].sort(sortDescendingLogbookTransactions),
        };

        // STEP : 13. put the new patched logbook back to the group
        groupSortedHasBeenReplaced = [
          ...groupSortedHasBeenReplaced.filter(
            (logbook) =>
              logbook.logbook_id !== foundPrevLogbook.logbook_id &&
              logbook.logbook_id !== newPatchedTransaction.logbook_id
          ),
          newPreviousLogbook,
          newPatchedLogbook,
        ];
      }
    }
    console.log(JSON.stringify({ groupSortedHasBeenReplaced }, null, 2));
  });

  return {
    ...state,
    reducerUpdatedAt,
    groupSorted: groupSortedHasBeenReplaced,
  };
};

const sortDescendingTransactionsDate = (a, b) => {
  return b.details.date - a.details.date;
};

const sortDescendingLogbookTransactions = (a, b) => {
  return b.customDate < a.customDate ? -1 : 1;
};

export default patchedManyTransactionsHandler;
