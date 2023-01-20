import REDUCER_ACTIONS from "./reducer.action";

const globalUserAccountReducer = (state, action) => {
  switch (action.type) {
    case REDUCER_ACTIONS.USER_ACCOUNT.AVATAR.SET:
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
      return { ...state, ...action.payload };

    case REDUCER_ACTIONS.USER_ACCOUNT.FORCE_SET:
      return action.payload;

    default:
      return state;
  }
};

export default globalUserAccountReducer;
