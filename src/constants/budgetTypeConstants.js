import * as utils from "../utils";

const BUDGET_TYPE_CONSTANTS = {
  DEFAULT: "MONTHLY",
  OPTIONS: [
    {
      id: "YEARLY",
      name: "Yearly",
    },
    {
      id: "MONTHLY",
      name: "Monthly",
    },
    {
      id: "WEEKLY",
      name: "Weekly",
    },
    {
      id: "CUSTOM",
      name: "Custom",
    },
  ],
};
export default BUDGET_TYPE_CONSTANTS;
