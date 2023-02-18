const findRepeatedTransactionSectionById = ({
  repeatID = null,
  transactionID = null,
  repeatedTransactions,
}) => {
  let foundRepeatSection;
  switch (true) {
    case repeatID:
      // get repeat section with repeat id
      foundRepeatSection = repeatedTransactions.find((repeatSection) => {
        repeatSection.repeat_id === repeatID;
      });
      break;

    case transactionID:
      // get repeat section with transaction id
      foundRepeatSection = repeatedTransactions.forEach((repeatSection) => {
        repeatSection.transactions.forEach((transaction_id) => {
          if (transaction_id === transactionID) {
            foundRepeatSection = repeatSection;
          }
        });
      });
      break;

    default:
      break;
  }
  return foundRepeatSection;
};
export default findRepeatedTransactionSectionById;
