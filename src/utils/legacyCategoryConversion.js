/**
 * This function is used to convert the legacy category data to the new format
 *
 * @param legacyCategory - Legacy category data
 * @returns new category data with new format
 */
const legacyCategoryConversion = (legacyCategory) => {
  const { expense, income, uid } = legacyCategory;

  // Check if existing categories have `is_shown` property
  const newExpense = expense.map((category) => {
    if (!category.hasOwnProperty("is_shown")) {
      return {
        ...category,
        is_shown: true,
      };
    }
    return category;
  });
  const newIncome = income.map((category) => {
    if (!category.hasOwnProperty("is_shown")) {
      return {
        ...category,
        is_shown: true,
      };
    }
    return category;
  });

  // Check if the existing categories have the initial balance category

  let isInitialBalanceIncomeCategoryAvailable = false;
  newIncome.forEach((category) => {
    if (category.id === "initial_balance_income") {
      isInitialBalanceIncomeCategoryAvailable = true;
    }
  });

  if (!isInitialBalanceIncomeCategoryAvailable) {
    newIncome.push({
      name: "initial balance",
      id: "initial_balance_income",
      icon: { name: "duplicate", color: "default", pack: "IonIcons" },
      is_deletable: false,
      is_shown: true,
      _timestamps: {
        created_at: Date.now(),
        created_by: uid,
        updated_at: Date.now(),
        updated_by: uid,
      },
    });
  }

  let isInitialBalanceExpenseCategoryAvailable = false;
  newExpense.forEach((category) => {
    if (category.id === "initial_balance_expense") {
      isInitialBalanceExpenseCategoryAvailable = true;
    }
  });

  if (!isInitialBalanceExpenseCategoryAvailable) {
    newExpense.push({
      name: "initial balance",
      id: "initial_balance_expense",
      icon: { name: "duplicate", color: "default", pack: "IonIcons" },
      is_deletable: false,
      is_shown: true,
      _timestamps: {
        created_at: Date.now(),
        created_by: uid,
        updated_at: Date.now(),
        updated_by: uid,
      },
    });
  }

  const convertedCategory = {
    uid: uid,
    income: newIncome,
    expense: newExpense,
  };

  return convertedCategory;
};

export default legacyCategoryConversion;
