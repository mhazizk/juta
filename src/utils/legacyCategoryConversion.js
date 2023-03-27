import categoriesFallback from "../reducers/fallback-state/categoriesFallback";

/**
 * This function is used to convert the legacy category data to the new format
 *
 * @param legacyCategory - Legacy category data
 * @returns new category data with new format
 */
const legacyCategoryConversion = (legacyCategory) => {
  const { expense, income, uid } = legacyCategory;

  // Check if existing categories have `is_shown` property
  const newExpense = expense[0].hasOwnProperty("is_shown")
    ? expense.map((category) => {
        return {
          ...category,
          is_shown: true,
        };
      })
    : expense;
  const newIncome = income[0].hasOwnProperty("is_shown")
    ? income.map((category) => {
        return {
          ...category,
          is_shown: true,
        };
      })
    : income;

  // Check if the existing categories have the initial balance category

  let isInitialBalanceIncomeCategoryAvailable = false;
  newIncome.forEach((category) => {
    if (category.id === "initial_balance_income") {
      isInitialBalanceIncomeCategoryAvailable = true;
    }
  });

  if (!isInitialBalanceIncomeCategoryAvailable) {
    const initialBalanceIncomeCategory = categoriesFallback({
      uid,
      created_at: Date.now(),
      updated_at: Date.now(),
    }).income.find((category) => category.id === "initial_balance_income");
    newIncome.push(initialBalanceIncomeCategory);
  }

  let isInitialBalanceExpenseCategoryAvailable = false;
  newExpense.forEach((category) => {
    if (category.id === "initial_balance_expense") {
      isInitialBalanceExpenseCategoryAvailable = true;
    }
  });

  if (!isInitialBalanceExpenseCategoryAvailable) {
    const initialBalanceExpenseCategory = categoriesFallback({
      uid,
      created_at: Date.now(),
      updated_at: Date.now(),
    }).expense.find((category) => category.id === "initial_balance_expense");

    newExpense.push(initialBalanceExpenseCategory);
  }

  const convertedCategory = {
    uid: uid,
    income: newIncome,
    expense: newExpense,
  };

  return convertedCategory;
};

export default legacyCategoryConversion;
