import REDUCER_ACTIONS from "./reducer.action";

const globalCurrencyRatesReducer = (state, action) => {
  const { updated_at: stateUpdatedAt } = state._timestamps;

  switch (action.payload) {
    case REDUCER_ACTIONS.CURRENCY_RATES.SET:
      return {
        ...state,
        ...action.payload,
      };

    case REDUCER_ACTIONS.CURRENCY_RATES.FORCE_SET:
      return action.payload;

    case REDUCER_ACTIONS.CURRENCY_RATES.SET_MULTI_ACTIONS:
      const { updated_at: payloadUpdatedAt } = action.payload._timestamps;
      // check if timestamp is newer
      if (payloadUpdatedAt > stateUpdatedAt) {
        return { ...state, ...action.payload };
      }
      return state;
    default:
      return state;
  }
};
export default globalCurrencyRatesReducer;
