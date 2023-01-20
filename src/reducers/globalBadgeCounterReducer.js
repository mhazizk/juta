import REDUCER_ACTIONS from "./reducer.action";

const globalBadgeCounterReducer = (state, action) => {
  switch (action.type) {
    case REDUCER_ACTIONS.BADGE_COUNTER.FORCE_SET_ALL:
      return action.payload;
    case REDUCER_ACTIONS.BADGE_COUNTER.TAB.SET_BADGE_IN_DASHBOARD_TAB:
      return {
        ...state,
        tab: {
          ...state.tab,
          dashboardTab: Number(action.payload),
        },
      };

    case REDUCER_ACTIONS.BADGE_COUNTER.TAB.SET_BADGE_IN_LOGBOOK_TAB:
      return {
        ...state,
        tab: {
          ...state.tab,
          logbookTab: Number(action.payload),
        },
      };
    case REDUCER_ACTIONS.BADGE_COUNTER.TAB.SET_BADGE_IN_ACTION_TAB:
      return {
        ...state,
        tab: {
          ...state.tab,
          actionTab: Number(action.payload),
        },
      };
    case REDUCER_ACTIONS.BADGE_COUNTER.TAB.SET_BADGE_IN_SEARCH_TAB:
      return {
        ...state,
        tab: {
          ...state.tab,
          searchTab: Number(action.payload),
        },
      };
    case REDUCER_ACTIONS.BADGE_COUNTER.TAB.SET_BADGE_IN_USER_TAB:
      return {
        ...state,
        tab: {
          ...state.tab,
          userTab: Number(action.payload),
        },
      };

    default:
      return state;
  }
};

export default globalBadgeCounterReducer;
