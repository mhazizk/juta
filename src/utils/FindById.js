import { useGlobalAppSettings } from "../reducers/GlobalContext";

// Find Logbook By Id
const findLogbookById = ({ id, logbooks }) => {
  const findlogbook = logbooks.find((logbook) => logbook.logbook_id === id);
  return findlogbook;
};

// Find Category Icon Name by Id
const findCategoryIconNameById = ({ id, categories }) => {
  if (!id || !categories) {
    return;
  }

  const filteredExpenseCategory = categories.expense.find((category) => {
    return category.id === id;
  });
  const filteredIncomeCategory = categories.income.find((category) => {
    return category.id === id;
  });

  return (filteredExpenseCategory || filteredIncomeCategory)?.icon.name;
  // filteredExpenseCategory.map((item) => item.icon.name)[0] ||
  // filteredIncomeCategory.map((item) => item.icon.name)[0]
  // );
};

// Find Category Name by Id
const findCategoryNameById = ({ id, categories }) => {
  if (!id || !categories) {
    return;
  }

  const filteredExpenseCategory = categories.expense.find((category) => {
    return category.id === id;
  });
  const filteredIncomeCategory = categories.income.find((category) => {
    return category.id === id;
  });

  const categoryName = (filteredExpenseCategory || filteredIncomeCategory)
    ?.name;
  // filteredExpenseCategory.map((item) => item.name) ||
  // filteredIncomeCategory.map((item) => item.name);
  return categoryName[0]?.toUpperCase() + categoryName?.substring(1);
};

// Find Category Color by Id
const findCategoryColorById = ({ id, categories, defaultColor }) => {
  if (!id || !categories || !defaultColor) {
    return;
  }

  const filteredExpenseCategory = categories.expense.find((category) => {
    return category.id === id;
  });
  const filteredIncomeCategory = categories.income.find((category) => {
    return category.id === id;
  });
  const categoryColor = (filteredExpenseCategory || filteredIncomeCategory)
    ?.icon.color;
  // filteredExpenseCategory.map((item) => item.icon.color) ||
  // filteredIncomeCategory.map((item) => item.icon.color);
  return categoryColor === "default" ? defaultColor : categoryColor;
};

// Find Category Icon Pack by Id
const findCategoryIconPackById = ({ id, categories }) => {
  if (!id || !categories) {
    return;
  }

  const filteredExpenseCategory = categories.expense.find((category) => {
    return category.id === id;
  });
  const filteredIncomeCategory = categories.income.find((category) => {
    return category.id === id;
  });
  return (filteredExpenseCategory || filteredIncomeCategory)?.icon.pack;
};

const findCategoryTypeById = ({ id, categories }) => {
  if (!id || !categories) {
    return;
  }

  const filteredExpenseCategory = categories.expense.find((category) => {
    return category.id === id;
  });
  const filteredIncomeCategory = categories.income.find((category) => {
    return category.id === id;
  });

  return filteredExpenseCategory ? "expense" : "income";
};

const findCategoryById = ({ id, categories, transaction, setState }) => {
  if (!id || !categories || !transaction) {
    return;
  }

  if (transaction) {
    const foundExpenseCategory = categories.expense.find((category) => {
      return category.id === id;
    });
    const foundIncomeCategory = categories.income.find((category) => {
      return category.id === id;
    });

    return foundExpenseCategory || foundIncomeCategory;
    // setState(foundExpenseCategory[0] || foundIncomeCategory[0]);
  }
};

export default {
  findLogbookById,
  findCategoryIconNameById,
  findCategoryNameById,
  findCategoryColorById,
  findCategoryIconPackById,
  findCategoryTypeById,
  findCategoryById,
};
