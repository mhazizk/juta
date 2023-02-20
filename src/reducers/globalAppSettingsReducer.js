import REDUCER_ACTIONS from "./reducer.action";

const globalAppSettingsReducer = (state, action) => {
  switch (action.type) {
    // Set App Theme
    case REDUCER_ACTIONS.APP_SETTINGS.THEME.SET:
      return {
        ...state,
        theme_id: action.payload,
      };
    // Set App Font Size
    case REDUCER_ACTIONS.APP_SETTINGS.FONT_SIZE.SET:
      return {
        ...state,
        fontSize: action.payload,
      };
    // Set App Language
    case REDUCER_ACTIONS.APP_SETTINGS.LANGUAGE.SET:
      return {
        ...state,
        language: action.payload.language,
        locale: action.payload.locale,
      };

    // Set App Currency
    case REDUCER_ACTIONS.APP_SETTINGS.CURRENCY_RATE.SET:
      return {
        ...state,
        currencyRate: action.payload,
      };

    // Push Screen Hidden
    case REDUCER_ACTIONS.APP_SETTINGS.SCREEN_HIDDEN.PUSH:
      return {
        ...state,
        hiddenScreens: [...state.hiddenScreens, action.payload],
      };

    // TAG : Multiple Actions
    case REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS:
      // check timestamp for duplicate
      if (
        action.payload?._timestamps?.updated_at > state?._timestamps.updated_at
      ) {
        return { ...state, ...action.payload };
      }
      return state;

    case REDUCER_ACTIONS.APP_SETTINGS.FORCE_SET:
      return action.payload;

    default:
      return state;
  }
};

export default globalAppSettingsReducer;
