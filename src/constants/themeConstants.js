import { darkFallTheme } from "../assets/themes/darkFallTheme/darkFallTheme";
import { colorOfTheYear2023 } from "../assets/themes/colorOfTheYear2023/colorOfTheYear2023";
import { darkMonoTheme } from "../assets/themes/darkMonoTheme/darkMonoTheme";
import { lightMonoTheme } from "../assets/themes/lightMonoTheme/lightMonoTheme";

const THEME_CONSTANTS = {
  DEFAULT: {
    ...lightMonoTheme.identifier,
    style: lightMonoTheme,
  },
  USER: {
    ...lightMonoTheme.identifier,
    style: lightMonoTheme,
  },
  OPTIONS: [
    {
      ...lightMonoTheme.identifier,
      style: lightMonoTheme,
    },
    {
      ...darkMonoTheme.identifier,
      style: darkMonoTheme,
    },
    {
      ...darkFallTheme.identifier,
      style: darkFallTheme,
    },
    {
      ...colorOfTheYear2023.identifier,
      style: colorOfTheYear2023,
    },
  ],
};

export default THEME_CONSTANTS;
