import uuid from "react-native-uuid";
const createNewTransactionFromActiveRepeatedTransaction = (
  repeatedTransactions,
  transactions
) => {
  const today = Date.now();
  const modifiedRepeatedTransactions = [];
  const newTransactions = [];
  // loop all repeated transactions and check if they are active
  repeatedTransactions.forEach((repeatSection) => {
    // check if the next repeat status is active and repeat date has passed

    switch (true) {
      case repeatSection.repeat_status === "active" &&
        repeatSection.next_repeat_date < today:
        // get number of transactions to create
        const numberOfNewTransactions = Math.floor(
          (today - repeatSection.next_repeat_date) /
            repeatSection.repeat_type.range
        );

        for (let i = 0; i < numberOfNewTransactions; i++) {
          // create new transaction
          const newTransaction = {
            uid: repeatSection.uid,
            transaction_id: uuid.v4(),
            logbook_id: repeatSection.repeat_logbook_id,
            repeat_id: repeatSection.repeat_id,
            details: {
              amount: repeatSection.repeat_amount,
              category_id: repeatSection.repeat_category_id,
              notes: repeatSection.repeat_notes,
              date:
                repeatSection.next_repeat_date +
                i * repeatSection.repeat_type.range,
              in_out: repeatSection.repeat_in_out,
              type: repeatSection.repeat_transaction_type,
            },
            _timestamps: {
              created_at: Date.now(),
              updated_at: Date.now(),
              created_by: repeatSection.uid,
              updated_by: repeatSection.uid,
            },
          };
          newTransactions.push(newTransaction);
        }

        const newRepeatDate =
          repeatSection.next_repeat_date +
          numberOfNewTransactions * repeatSection.repeat_type.range;
        const modifiedRepeatedTransaction = {
          ...repeatSection,
          next_repeat_date: newRepeatDate,
        };
        modifiedRepeatedTransactions.push(modifiedRepeatedTransaction);

        break;

      default:
        break;
    }
  });

  //   remove repeated Transaction section duplicates
  let filteredOutRepeatedTransactions = repeatedTransactions;
  modifiedRepeatedTransactions.forEach((repeatSection) => {
    filteredOutRepeatedTransactions = filteredOutRepeatedTransactions.filter(
      (existingRepeatSection) => {
        return existingRepeatSection.repeat_id !== repeatSection.repeat_id;
      }
    );
  });

  // TODO : move repeat feature to server
  // return {
  //   getAllRepeatedTransactions: filteredOutRepeatedTransactions,
  //   getAllTransactions: [...newTransactions, ...transactions],
  //   getModifiedRepeatedTransactionsOnly: modifiedRepeatedTransactions,
  //   getNewTransactionsOnly: newTransactions,
  // };
  // TAG :temporary fix : return original repeated transactions
  return {
    getAllRepeatedTransactions: repeatedTransactions,
    getAllTransactions: transactions,
    getModifiedRepeatedTransactionsOnly: [],
    getNewTransactionsOnly: [],
  };
};

export default createNewTransactionFromActiveRepeatedTransaction;
