import REDUCER_ACTIONS from "./reducer.action";

const globalBudgetsReducer = (state, action) => {
  let reducerUpdatedAt = action.payload.reducerUpdatedAt;
  let insertBudget = action.payload.insertBudget;
  let patchBudget = action.payload.patchBudget;
  let deleteBudget = action.payload.deleteBudget;

  switch (action.type) {
    case REDUCER_ACTIONS.BUDGETS.FORCE_SET:
      return action.payload;

    case REDUCER_ACTIONS.BUDGETS.SET:
      return {
        reducerUpdatedAt: Date.now(),
        budgets: [action.payload],
      };

    case REDUCER_ACTIONS.BUDGETS.INSERT:
      let sortInsertedBudgets = [...state.budgets, insertBudget].sort(
        (a, b) => {
          if (a.budget_name < b.budget_name) {
            return -1;
          }
          if (a.budget_name > b.budget_name) {
            return 1;
          }
          return 0;
        }
      );

      return {
        ...state,
        budgets: [...sortInsertedBudgets],
        reducerUpdatedAt,
      };

    case REDUCER_ACTIONS.BUDGETS.PATCH:
      if (reducerUpdatedAt > state.reducerUpdatedAt) {
        let foundOtherBudgets = state.budgets.filter(
          (budget) => budget?.budget_id !== patchBudget.budget_id
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
        };
      } else {
        return state;
      }

    case REDUCER_ACTIONS.BUDGETS.DELETE_ONE:
      if (reducerUpdatedAt > state.reducerUpdatedAt) {
        let foundOtherBudget = state.budgets?.filter(
          (budget) => budget?.budget_id !== deleteBudget.budget_id
        );

        if (!foundOtherBudget.length) {
          return {
            ...state,
            budgets: [],
            reducerUpdatedAt,
          };
        }

        let sortOtherBudgets = foundOtherBudget?.sort((a, b) => {
          return a.budget_name.localCompare(b.budget_name);
        });

        return {
          ...state,
          budgets: [...sortOtherBudgets],
          reducerUpdatedAt,
        };
      } else {
        return state;
      }

    default:
      return state;
  }
};

export default globalBudgetsReducer;
