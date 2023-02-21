import REDUCER_ACTIONS from "./reducer.action";

const globalFeatureSwitchReducer = (state, action) => {
  switch (action.type) {
    case REDUCER_ACTIONS.FEATURE_SWITCH.FORCE_SET:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default globalFeatureSwitchReducer;
