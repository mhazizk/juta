import REDUCER_ACTIONS from "./reducer.action";

const globalCategoriesReducer = (state, action) => {
  let reducerUpdatedAt;
  switch (action.type) {
    case REDUCER_ACTIONS.CATEGORIES.FORCE_SET:
      return action.payload;

    case REDUCER_ACTIONS.CATEGORIES.SET_MULTI_ACTIONS:
      return {
        ...state,
        ...action.payload,
      };

    case REDUCER_ACTIONS.CATEGORIES.SET:
      return {
        ...state,
        reducerUpdatedAt: Date.now(),
        categories: action.payload,
      };

    case REDUCER_ACTIONS.CATEGORIES.INSERT:
      reducerUpdatedAt = action.payload.reducerUpdatedAt;
      let insertCategory = action.payload.insertCategory;
      let insertCategoryType = action.payload.categoryType;

      if (insertCategoryType === "expense") {
        const sortedExpenseCategory = [
          ...state.categories.expense,
          insertCategory,
        ].sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });

        return {
          ...state,
          categories: {
            ...state.categories,
            expense: sortedExpenseCategory,
          },
          reducerUpdatedAt,
          // categoryInsertCounter: state.categoryInsertCounter + 1,
        };
      }

      if (insertCategoryType === "income") {
        const sortedIncomeCategory = [
          ...state.categories.income,
          insertCategory,
        ].sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });

        return {
          ...state,
          categories: {
            ...state.categories,
            income: sortedIncomeCategory,
          },
          reducerUpdatedAt,
          // categoryInsertCounter: state.categoryInsertCounter + 1,
        };
      }

    case REDUCER_ACTIONS.CATEGORIES.DELETE_ONE:
      reducerUpdatedAt = action.payload.reducerUpdatedAt;
      let deleteCategory = action.payload.deleteCategory;

      const findExpenseCategoryToDelete = state.categories.expense.filter(
        (category) => category.id === deleteCategory.id
      );
      const findIncomeCategoryToDelete = state.categories.income.filter(
        (category) => category.id === deleteCategory.id
      );

      if (findExpenseCategoryToDelete.length) {
        const foundExpenseCategory = state.categories.expense.filter(
          (category) => category.id !== deleteCategory.id
        );
        const sortedExpenseCategory = foundExpenseCategory.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });

        return {
          ...state,
          categories: {
            ...state.categories,
            expense: sortedExpenseCategory,
          },
          reducerUpdatedAt,
          // categoryDeleteCounter: state.categoryDeleteCounter + 1,
        };
      }

      if (findIncomeCategoryToDelete.length) {
        const foundIncomeCategory = state.categories.income.filter(
          (category) => category.id !== deleteCategory.id
        );
        const sortedIncomeCategory = foundIncomeCategory.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });

        return {
          ...state,
          categories: {
            ...state.categories,
            income: sortedIncomeCategory,
          },
          reducerUpdatedAt,
          // categoryDeleteCounter: state.categoryDeleteCounter + 1,
        };
      }

    case REDUCER_ACTIONS.CATEGORIES.PATCH:
      reducerUpdatedAt = action.payload.reducerUpdatedAt;
      let patchCategory = action.payload.patchCategory;
      let patchCategoryType = action.payload.targetCategoryType;

      const findExpenseCategory = state.categories.expense.filter(
        (category) => category.id === patchCategory.id
      );
      const findOtherExpenseCategory = state.categories.expense.filter(
        (category) => category.id !== patchCategory.id
      );
      const findIncomeCategory = state.categories.income.filter(
        (category) => category.id === patchCategory.id
      );
      const findOtherIncomeCategory = state.categories.income.filter(
        (category) => category.id !== patchCategory.id
      );

      if (patchCategoryType === "expense" && !findExpenseCategory.length) {
        const sortedExpenseCategory = [
          ...state.categories.expense,
          patchCategory,
        ].sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });

        const sortedIncomeCategory = findOtherIncomeCategory.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });

        return {
          ...state,
          categories: {
            expense: sortedExpenseCategory,
            income: sortedIncomeCategory,
          },
          reducerUpdatedAt,
          // categoryPatchCounter: state.categoryPatchCounter + 1,
        };
      }

      if (patchCategoryType === "income" && !findIncomeCategory.length) {
        const sortedExpenseCategory = findOtherExpenseCategory.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });

        const sortedIncomeCategory = [
          ...state.categories.income,
          patchCategory,
        ].sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });

        return {
          ...state,
          categories: {
            expense: sortedExpenseCategory,
            income: sortedIncomeCategory,
          },
          reducerUpdatedAt,
          // categoryPatchCounter: state.categoryPatchCounter + 1,
        };
      }

      if (patchCategoryType === "expense" && findExpenseCategory.length) {
        const foundExpenseCategory = state.categories.expense.filter(
          (category) => category.id !== patchCategory.id
        );
        const sortedExpenseCategory = [
          ...foundExpenseCategory,
          patchCategory,
        ].sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });

        return {
          ...state,
          categories: {
            ...state.categories,
            expense: sortedExpenseCategory,
          },
          reducerUpdatedAt,
          // categoryPatchCounter: state.categoryPatchCounter + 1,
        };
      }

      if (patchCategoryType === "income" && findIncomeCategory.length) {
        const foundIncomeCategory = state.categories.income.filter(
          (category) => category.id !== patchCategory.id
        );
        const sortedIncomeCategory = [
          ...foundIncomeCategory,
          patchCategory,
        ].sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });

        return {
          ...state,
          categories: {
            ...state.categories,
            income: sortedIncomeCategory,
          },
          reducerUpdatedAt,
          // categoryPatchCounter: state.categoryPatchCounter + 1,
        };
      }

    default:
      return state;
  }
};

export default globalCategoriesReducer;
