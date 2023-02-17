
/**
 * Find loan contact by transaction id
 * 
 * @param transactionId - transaction id
 * @param globalLoan - global loan object
 * @returns Loan contact
 */
const findLoanContactByTransactionId = ({ transactionId, globalLoan }) => {
  const loanContact = globalLoan.contacts.find((contact) => {
    return contact.transactions_id.includes(transactionId);
  });

  return loanContact;
};
export default findLoanContactByTransactionId;
