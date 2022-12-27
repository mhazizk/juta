import {
  findCategoryColorById,
  findCategoryIconNameById,
  findCategoryIconPackById,
  findCategoryNameById,
  findCategoryTypeById,
} from "./FindById";

const getSpentList = ({
  groupSorted,
  expenseOnly,
  incomeOnly,
  categories,
  rangeDay,
  setSpentList,
}) => {
  // Get all transactions within the date range
  if (groupSorted.length) {
    const today = Date.now();
    let transactionList = [];
    let spentList = [];
    let uniqueCategoriesId = [];
    let uniqueCategoryList = [];

    if (groupSorted.some((logbook) => logbook.transactions.length)) {
      groupSorted.forEach((logbook) =>
        logbook.transactions.forEach((section) =>
          section.data.forEach((transaction) => {
            if (
              transaction.details.date <= today &&
              transaction.details.date >= today - 1000 * 60 * 60 * 24 * rangeDay
            ) {
              switch (true) {
                case expenseOnly && transaction.details.in_out === "expense":
                  transactionList.push(transaction);
                  break;
                case incomeOnly && transaction.details.in_out === "income":
                  transactionList.push(transaction);
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
        let totalSpent = 0;
        transactionList.forEach((transaction) => {
          if (transaction.details.category_id === category.id) {
            totalSpent += transaction.details.amount;
          }
        });
        spentList.push({
          category: category,
          totalSpent: totalSpent,
        });
      });
    }
    return setSpentList(
      spentList.sort((a, b) => {
        if (a.totalSpent < b.totalSpent) return 1;
        if (a.totalSpent > b.totalSpent) return -1;
        return 0;
      })
    );
  }
};

export default getSpentList;
