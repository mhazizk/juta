import THEME_CONSTANTS from "../constants/themeConstants";
import REDUCER_ACTIONS from "./reducer.action";

const globalThemeReducer = (state, action) => {
  const { identifier } = state;
  switch (action.type) {
    case REDUCER_ACTIONS.THEME.SET:
      const targetThemeId = action.payload;
      const foundTargetTheme = THEME_CONSTANTS.OPTIONS.find((theme) => {
        return theme.id === action.payload;
      });

      if (targetThemeId !== identifier.id) {
        return foundTargetTheme.style;
      } else {
        return state;
      }

    default:
      return state;
  }
};
export default globalThemeReducer;
