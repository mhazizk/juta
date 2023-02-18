import findTransactionsByIds from "./findTransactionsByIds";
import getTotalAmountAndConvertToDefaultCurrency from "./getTotalAmountAndConvertToDefaultCurrency";

/**
 *
 * @param getNextAmount - Option to get the next amount to pay
 * @param getNextDate - Option to get the next date to pay
 * @param checkIfAllPaid - Option to check if all the loan has been paid
 * @param getTotalContactsNotYetPaid - Option to get the total contacts that has not yet paid
 * @param getContactNames - Option to get the contact names
 * @param globalCurrencyRates - Global currency rates
 * @param targetCurrencyName - Target currency name
 * @param logbooks - Logbooks
 * @param globalLoan - Global loan
 * @param groupSorted - Group sorted
 * @returns
 */
const getNextLoanPayment = ({
  getNextAmount = false,
  getNextDate = false,
  checkIfAllPaid = false,
  getTotalContactsNotYetPaid = false,
  getContactNames = false,
  globalCurrencyRates,
  targetCurrencyName,
  logbooks,
  globalLoan,
  groupSorted,
}) => {
  // get all the transactions that are not paid
  const contactsNotYetPaid = globalLoan.contacts.filter((contact) => {
    return contact.is_paid === false;
  });

  // get neareast payment due date
  const nearestPaymentDueInMillis = contactsNotYetPaid.sort((a, b) => {
    return a.payment_due_date - b.payment_due_date;
  });
  //   get nearest payment due date in date
  const nearestPaymentDueInDate = new Date(
    nearestPaymentDueInMillis[0]?.payment_due_date
  ).getDate();

  // get transactions id from contacts that have the nearest payment due date
  const transactionIdsToFind = [];
  contactsNotYetPaid.forEach((contact) => {
    if (
      new Date(contact.payment_due_date).getDate() === nearestPaymentDueInDate
    ) {
      transactionIdsToFind.push(...contact.transactions_id);
    }
  });

  switch (true) {
    case getNextAmount:
      // get transactions details from transaction ids
      const getSum = findTransactionsByIds({
        transactionIds: transactionIdsToFind,
        groupSorted: groupSorted,
        callback: (transactions) => {
          return getTotalAmountAndConvertToDefaultCurrency({
            invertResult: true,
            transactions,
            logbooks,
            globalCurrencyRates,
            targetCurrencyName,
          });
        },
      });
      return getSum;

    case getNextDate:
      return nearestPaymentDueInDate - new Date().getDate();

    case checkIfAllPaid:
      return contactsNotYetPaid?.length === 0;

    case getTotalContactsNotYetPaid:
      return contactsNotYetPaid?.length;

    case getContactNames:
      const filterNames = contactsNotYetPaid.filter((contact) => {
        const totalAmount = findTransactionsByIds({
          transactionIds: contact.transactions_id,
          groupSorted: groupSorted,
          callback: (transactions) => {
            return getTotalAmountAndConvertToDefaultCurrency({
              invertResult: true,
              transactions,
              logbooks,
              globalCurrencyRates,
              targetCurrencyName,
            });
          },
        });
        if (
          new Date(contact.payment_due_date).getDate() ===
            nearestPaymentDueInDate &&
          totalAmount !== 0
        ) {
          return {
            contact_name: contact.contact_name,
            totalAmount,
          };
        }
      });
      return filterNames.map((contact) => contact.contact_name);

    default:
      break;
  }
};

export default getNextLoanPayment;
