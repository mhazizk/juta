import { darkFallTheme } from "../assets/themes/darkFallTheme/darkFallTheme";
import { darkMonoTheme } from "../assets/themes/darkMonoTheme/darkMonoTheme";
import { lightMonoTheme } from "../assets/themes/lightMonoTheme/lightMonoTheme";
import { creamyLighteaTheme } from "../assets/themes/creamyLightea/creamyLighteaTheme";

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
      ...creamyLighteaTheme.identifier,
      style: creamyLighteaTheme,
    },
  ],
};

export default THEME_CONSTANTS;
