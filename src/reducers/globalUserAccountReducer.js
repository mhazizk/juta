import REDUCER_ACTIONS from "./reducer.action";

const globalUserAccountReducer = (state, action) => {
  switch (action.type) {
    case REDUCER_ACTIONS.USER_ACCOUNT.PROFILE_PICTURE.SET:
      return {
        ...state,
        photoURL: action.payload,
      };
    case REDUCER_ACTIONS.USER_ACCOUNT.DISPLAY_NAME.SET:
      return {
        ...state,
        displayName: action.payload,
      };
    case REDUCER_ACTIONS.USER_ACCOUNT.VERIFICATION.SET:
      return {
        ...state,
        premium: action.payload,
      };
    case REDUCER_ACTIONS.USER_ACCOUNT.EMAIL.SET:
      return {
        ...state,
        email: action.payload,
      };
    case REDUCER_ACTIONS.USER_ACCOUNT.TOKEN.SET:
      return {
        ...state,
        token: action.payload,
      };

    // TAG : Multiple Actions
    case REDUCER_ACTIONS.USER_ACCOUNT.SET_MULTI_ACTIONS:
      // check timestamp for duplicate
      if (
        action.payload?._timestamps?.updated_at > state?._timestamps.updated_at
      ) {
        return { ...state, ...action.payload };
      }
      return state;

    case REDUCER_ACTIONS.USER_ACCOUNT.FORCE_SET:
      return action.payload;

    default:
      return state;
  }
};

export default globalUserAccountReducer;
