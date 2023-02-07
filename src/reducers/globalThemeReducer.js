import { colorOfTheYear2022 } from "../assets/themes/colorOfTheYear2022";
import { colorOfTheYear2023 } from "../assets/themes/colorOfTheYear2023";
import { darkTheme } from "../assets/themes/darkTheme";
import { lightTheme } from "../assets/themes/lightTheme";
import themeConstants from "../constants/themeConstants";
import REDUCER_ACTIONS from "./reducer.action";

const globalThemeReducer = (state, action) => {
  switch (action.type) {
    case REDUCER_ACTIONS.THEME.SET:
      const theme = themeConstants.OPTIONS.find((theme) => {
        return theme.id === action.payload;
      });
      return theme.style;

    default:
      break;
  }
};
export default globalThemeReducer;
