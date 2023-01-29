import uuid from "react-native-uuid";

const repeatTransactionsHandler = (uid, repeatTransactions, transactions) => {
  // get all transactions details inside repeatTransctions array
  const allTransactions = [];
  repeatTransactions.transactions.forEach((transactionID) => {
    transactions.forEach((transaction) => {
      if (transactionID === transaction.transaction_id) {
        allTransactions.push(transaction);
      }
    });
  });

  // get transaction with latest transaction date in allTransactions array
  const latestTransaction = allTransactions.reduce((a, b) => {
    return a.details.transaction_date > b.details.transaction_date ? a : b;
  });

  // check if next transaction repeat date is less than or equal to today
  const today = Date.now();
  const nextTransactionRepeatDate =
    latestTransaction.details.transaction_date +
    repeatTransactions.repeat_type.range;
  if (nextTransactionRepeatDate <= today) {
    // create new transaction
    const newTransaction = {
      ...latestTransaction,
      transaction_id: uuid.v4(),
      details: {
        ...latestTransaction.details,
        transaction_date: nextTransactionRepeatDate,
      },
      _timestamps: {
        created_at: Date.now(),
        created_by: uid,
        updated_at: Date.now(),
        updated_by: uid,
      },
    };
    // insert new transaction into transactions array
    transactions.push(newTransaction);
    // insert new transaction id into repeatTransactions array
    repeatTransactions.transactions.push(newTransaction.transaction_id);
  } else {
    // do nothing
  }

  return {
    repeatTransactions,
    transactions,
  };
};

export default repeatTransactionsHandler;
