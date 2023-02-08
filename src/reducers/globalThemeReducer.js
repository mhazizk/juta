import { darkFallTheme } from "../assets/themes/darkFallTheme/darkFallTheme";
import { colorOfTheYear2023 } from "../assets/themes/colorOfTheYear2023/colorOfTheYear2023";
import { darkMonoTheme } from "../assets/themes/darkMonoTheme/darkMonoTheme";
import { lightMonoTheme } from "../assets/themes/lightMonoTheme/lightMonoTheme";
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

      if (targetThemeId === identifier.id) {
        return state;
      } else {
        return foundTargetTheme.style;
      }

    default:
      return state;
  }
};
export default globalThemeReducer;
