import { useGlobalAppSettings } from "../reducers/GlobalContext";

// Find Logbook By Id
const findLogbookById = ({ id, logbooks }) => {
  const filteredLogbook = logbooks.filter((logbook) => {
    if (logbook.logbook_id === id) {
      return logbook;
    }
  });
  if (filteredLogbook.length) {
    return filteredLogbook.map((item) => item)[0];
  }
};

// Find Category Icon Name by Id
const findCategoryIconNameById = ({ id, categories }) => {
  const filteredExpenseCategory = categories.expense.filter((category) => {
    return category.id === id;
  });
  const filteredIncomeCategory = categories.income.filter((category) => {
    return category.id === id;
  });

  if (filteredExpenseCategory.length) {
    return filteredExpenseCategory.map((item) => item.icon.name)[0];
  } else {
    return filteredIncomeCategory.map((item) => item.icon.name)[0];
  }
};

// Find Category Name by Id
const findCategoryNameById = ({ id, categories }) => {
  const filteredExpenseCategory = categories.expense.filter((category) => {
    return category.id === id;
  });
  const filteredIncomeCategory = categories.income.filter((category) => {
    return category.id === id;
  });

  if (filteredExpenseCategory.length) {
    const mapped = filteredExpenseCategory.map((item) => item.name);
    // console.log(mapped[0])
    return mapped[0][0].toUpperCase() + mapped[0].substring(1);
  } else {
    const mapped = filteredIncomeCategory.map((item) => item.name);
    return mapped[0][0].toUpperCase() + mapped[0].substring(1);
  }
};

// Find Category Color by Id
const findCategoryColorById = ({ id, categories, defaultColor }) => {
  const filteredExpenseCategory = categories.expense.filter((category) => {
    return category.id === id;
  });
  const filteredIncomeCategory = categories.income.filter((category) => {
    return category.id === id;
  });

  if (filteredExpenseCategory.length) {
    const mapped = filteredExpenseCategory.map((item) => item.icon.color);
    return mapped[0] === "default" ? defaultColor : mapped[0];
  } else {
    const mapped = filteredIncomeCategory.map((item) => item.icon.color);
    return mapped[0] === "default" ? defaultColor : mapped[0];
  }
};

// Find Category Icon Pack by Id
const findCategoryIconPackById = ({ id, categories }) => {
  const filteredExpenseCategory = categories.expense.filter((category) => {
    return category.id === id;
  });
  const filteredIncomeCategory = categories.income.filter((category) => {
    return category.id === id;
  });

  if (filteredExpenseCategory.length) {
    const mapped = filteredExpenseCategory.map((item) => item.icon.pack);
    return mapped[0];
  } else {
    const mapped = filteredIncomeCategory.map((item) => item.icon.pack);
    return mapped[0];
  }
};

const findCategoryTypeById = ({ id, categories }) => {
  const filteredExpenseCategory = categories.expense.filter((category) => {
    return category.id === id;
  });
  const filteredIncomeCategory = categories.income.filter((category) => {
    return category.id === id;
  });

  if (filteredExpenseCategory.length) {
    return "expense";
  } else {
    return "income";
  }
};

export default {
  findLogbookById,
  findCategoryIconNameById,
  findCategoryNameById,
  findCategoryColorById,
  findCategoryIconPackById,
  findCategoryTypeById,
};
