import REDUCER_ACTIONS from "./reducer.action";

const globalGroupsReducer = (state, action) => {
  switch (action.type) {
    case REDUCER_ACTIONS.GROUPS.FORCE_SET:
      return action.payload;
    case REDUCER_ACTIONS.GROUPS.INSERT:
      return action.payload;

    default:
      break;
  }
};
