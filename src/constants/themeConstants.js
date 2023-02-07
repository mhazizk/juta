import { colorOfTheYear2022 } from "../assets/themes/colorOfTheYear2022";
import { colorOfTheYear2023 } from "../assets/themes/colorOfTheYear2023";
import { darkTheme } from "../assets/themes/darkTheme";
import { lightTheme } from "../assets/themes/lightTheme";

const themeConstants = {
  DEFAULT: { name: "Light Theme", id: "light", style: lightTheme },
  USER: { name: "Light Theme", id: "light", style: lightTheme },
  OPTIONS: [
    { name: "Light Theme", id: "light", style: lightTheme },
    { name: "Dark Theme", id: "dark", style: darkTheme },
    {
      name: "Color of The Year 2023",
      id: "colorOfTheYear2023",
      style: colorOfTheYear2023,
    },
    {
      name: "Color of The Year 2022",
      id: "colorOfTheYear2022",
      style: colorOfTheYear2022,
    },
  ],
};

export default themeConstants;
