import REDUCER_ACTIONS from "./reducer.action";

const globalBudgetsReducer = (state, action) => {
  let reducerUpdatedAt;
  switch (action.type) {
    case REDUCER_ACTIONS.BUDGETS.FORCE_SET:
      return action.payload;

    case REDUCER_ACTIONS.BUDGETS.SET:
      return {
        reducerUpdatedAt: Date.now(),
        budgets: [action.payload],
        // budgetPatchCounter: 0,
        // budgetInsertCounter: 0,
        // budgetDeleteCounter: 0,
      };

    case REDUCER_ACTIONS.BUDGETS.INSERT:
      reducerUpdatedAt = action.payload.reducerUpdatedAt;
      let sortInsertedBudgets = [
        ...state.budgets,
        action.payload.insertBudget,
      ].sort((a, b) => {
        if (a.budget_name < b.budget_name) {
          return -1;
        }
        if (a.budget_name > b.budget_name) {
          return 1;
        }
        return 0;
      });

      return {
        ...state,
        budgets: [...sortInsertedBudgets],
        reducerUpdatedAt,
        // budgetInsertCounter: state.budgetInsertCounter + 1,
      };

    case REDUCER_ACTIONS.BUDGETS.PATCH:
      reducerUpdatedAt = action.payload.reducerUpdatedAt;
      let patchBudget = action.payload.patchBudget;

      let foundBudget = state.budgets.filter(
        (budget) => budget.budget_id === patchBudget.budget_id
      );

      let foundOtherBudgets = state.budgets.filter(
        (budget) => budget.budget_id !== patchBudget.budget_id
      );

      let sortBudgets = [...foundOtherBudgets, patchBudget].sort((a, b) => {
        if (a.budget_name < b.budget_name) {
          return -1;
        }
        if (a.budget_name > b.budget_name) {
          return 1;
        }
        return 0;
      });

      return {
        ...state,
        budgets: [...sortBudgets],
        reducerUpdatedAt,
        // budgetPatchCounter: state.budgetPatchCounter + 1,
      };

    case REDUCER_ACTIONS.BUDGETS.DELETE_ONE:
      reducerUpdatedAt = action.payload.reducerUpdatedAt;
      let deleteBudget = action.payload.deleteBudget;

      let foundOtherBudget = state.budgets.filter(
        (budget) => budget.budget_id !== deleteBudget.budget_id
      );

      if (!foundOtherBudget.length) {
        return {
          ...state,
          budgets: [],
          reducerUpdatedAt,
          // budgetDeleteCounter: state.budgetDeleteCounter + 1,
        };
      }

      let sortOtherBudgets = foundOtherBudget.sort((a, b) => {
        if (a.budget_name < b.budget_name) {
          return -1;
        }
        if (a.budget_name > b.budget_name) {
          return 1;
        }
        return 0;
      });

      return {
        ...state,
        budgets: [...sortOtherBudgets],
        reducerUpdatedAt,
        // budgetDeleteCounter: state.budgetDeleteCounter + 1,
      };

    default:
      return state;
  }
};

export default globalBudgetsReducer;
