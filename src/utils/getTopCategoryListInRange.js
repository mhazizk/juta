import convertCurrency from "./convertCurrency";
import FindById from "./FindById";
import getTotalAmountAndConvertToDefaultCurrency from "./getTotalAmountAndConvertToDefaultCurrency";
/**
 *
 * @param startDateInMillis - start date in milliseconds
 * @param endDateInMillis - end date in milliseconds
 * @param globalCurrencyRates - globalCurrencyRates state
 * @param appSettings - appSettings state from `appSettings`
 * @param logbooks - logbooks state from `logbooks.logbooks`
 * @param groupSorted - groupSorted state `sortedTransactions.groupSorted`
 * @param transactionTypeToGet - transaction type to filter. (`all`, `expense`, or `income`). Default is `all`
 * @param categories - categories state from `categories.categories`
 * @param callback - callback function to run after the function is done
 *
 * @returns transactionList array in type of {`category`, `totalAmount`} object
 */
const getTopCategoryListInRange = ({
  startDateInMillis,
  endDateInMillis,
  globalCurrencyRates,
  appSettings,
  logbooks,
  groupSorted,
  transactionTypeToGet = "all",
  categories,
  callback,
}) => {
  // Get all transactions within the date range
  if (groupSorted.length) {
    let transactionList = [];
    let allCategoryListToReturn = [];
    let expenseCategoryListToReturn = [];
    let incomeCategoryListToReturn = [];
    let uniqueCategoriesId = [];
    let uniqueCategoryList = [];

    if (groupSorted.some((logbook) => logbook.transactions.length)) {
      groupSorted.forEach((logbook) =>
        logbook.transactions.forEach((section) =>
          section.data.forEach((transaction) => {
            const logbookCurrencyName = FindById.findLogbookById({
              id: transaction.logbook_id,
              logbooks,
            }).logbook_currency.name;
            if (
              transaction.details.date <= endDateInMillis &&
              transaction.details.date >= startDateInMillis
            ) {
              const convertedAmount = convertCurrency({
                amount: transaction.details.amount,
                from: logbookCurrencyName,
                target: appSettings.logbookSettings.defaultCurrency.name,
                globalCurrencyRates,
              });
              switch (transactionTypeToGet) {
                case "all":
                  transactionList.push({
                    ...transaction,
                    details: {
                      ...transaction.details,
                      amount: convertedAmount,
                    },
                  });
                  break;
                case "expense":
                  if (transaction.details.in_out === "expense")
                    transactionList.push({
                      ...transaction,
                      details: {
                        ...transaction.details,
                        amount: convertedAmount,
                      },
                    });
                  break;
                case "income":
                  if (transaction.details.in_out === "income")
                    transactionList.push({
                      ...transaction,
                      details: {
                        ...transaction.details,
                        amount: convertedAmount,
                      },
                    });
                  break;
                default:
                  break;
              }
            }
          })
        )
      );
    }
    //   Get unique categories from the transaction list
    if (transactionList.length) {
      transactionList.forEach((transaction) => {
        uniqueCategoriesId.push(transaction.details.category_id);
      });
    }

    //   Remove category duplicates
    if (uniqueCategoriesId.length) {
      uniqueCategoriesId = [...new Set(uniqueCategoriesId)];
    }

    //   Get category details
    if (uniqueCategoriesId.length) {
      uniqueCategoriesId.forEach((id) => {
        let expenseCategory = categories.expense.find(
          (category) => category.id === id
        );
        let incomeCategory = categories.income.find(
          (category) => category.id === id
        );

        uniqueCategoryList.push(expenseCategory || incomeCategory);
      });
    }
    //   Get each category's total spent
    if (uniqueCategoryList.length) {
      uniqueCategoryList.forEach((category) => {
        let totalAmount = 0;
        let categoryType;
        transactionList.forEach((transaction) => {
          if (transaction.details.category_id === category.id) {
            totalAmount += transaction.details.amount;
            categoryType = transaction.details.in_out;
          }
        });
        if (categoryType === "expense")
          expenseCategoryListToReturn.push({ category, totalAmount });
        if (categoryType === "income")
          incomeCategoryListToReturn.push({ category, totalAmount });
        allCategoryListToReturn.push({
          category: category,
          totalAmount: totalAmount,
        });
      });
    }

    // Sort the list by total amount
    allCategoryListToReturn = allCategoryListToReturn.sort((a, b) => {
      return b.totalAmount - a.totalAmount;
    });
    expenseCategoryListToReturn = expenseCategoryListToReturn.sort((a, b) => {
      return b.totalAmount - a.totalAmount;
    });
    incomeCategoryListToReturn = incomeCategoryListToReturn.sort((a, b) => {
      return b.totalAmount - a.totalAmount;
    });

    return callback({
      allCategoryList: allCategoryListToReturn,
      expenseCategoryList: expenseCategoryListToReturn,
      incomeCategoryList: incomeCategoryListToReturn,
    });
  }
};

export default getTopCategoryListInRange;
