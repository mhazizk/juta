import REDUCER_ACTIONS from "./reducer.action";

const globalSubscriptionFeaturesReducer = (state, action) => {
  switch (action.type) {
    case REDUCER_ACTIONS.SUBSCRIPTION_FEATURES.FORCE_SET:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default globalSubscriptionFeaturesReducer;
