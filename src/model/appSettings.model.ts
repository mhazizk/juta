import { AppSettingsType, GlobalAppSettingsType } from "../@types/appSettings";
import { darkTheme } from "../assets/themes/darkTheme";

interface newAppSettingsProps {
  uid: string | number[];
}

/**
 * create new app settings
 *
 * @param props uid
 * @returns new app settings
 */
const newAppSettings = (props: newAppSettingsProps) => {
  return {
    uid: props.uid,
    locale: "en-US",
    language: "english",
    fontSize: "medium",
    currency: {
      name: "USD",
      isocode: "en",
      symbol: "$",
    },
    currencyRate: {
      updatedAt: Date.now(),
      data: [
        {
          name: "USD",
          rate: 1,
        },
        {
          name: "IDR",
          rate: 14000,
        },
      ],
    },
    theme: darkTheme,
  } satisfies AppSettingsType;
};

export default newAppSettings;
