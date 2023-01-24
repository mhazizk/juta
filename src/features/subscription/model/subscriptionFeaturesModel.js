import SUBSCRIPTION_LIMIT from "./subscriptionLimit";

const subscriptionFeaturesModel = [
  {
    id: 1,
    identifier: SUBSCRIPTION_LIMIT.LOGBOOKS,
    name: "Number of logbooks",
    iconName: "book",
    free: 2,
    premium: 5,
  },
  {
    id: 2,
    identifier: SUBSCRIPTION_LIMIT.DEVICES,
    name: "Maximum devices per account",
    iconName: "person",
    free: 1,
    premium: 5,
  },
  {
    id: 6,
    identifier: SUBSCRIPTION_LIMIT.BUDGETS,
    name: "Budgets",
    iconName: "pie-chart",
    free: 1,
    premium: 5,
  },
  {
    id: 3,
    identifier: SUBSCRIPTION_LIMIT.SECONDARY_CURRENCY,
    name: "Secondary currency",
    iconName: "logo-usd",
    free: false,
    premium: true,
  },
  {
    id: 4,
    identifier: SUBSCRIPTION_LIMIT.RECURRING_TRANSACTIONS,
    name: "Recurring transactions",
    iconName: "repeat",
    free: false,
    premium: true,
  },
  {
    id: 5,
    identifier: SUBSCRIPTION_LIMIT.EXPORT_DATA,
    name: "Export data",
    iconName: "share-outline",
    free: false,
    premium: true,
  },
  {
    id: 6,
    identifier: SUBSCRIPTION_LIMIT.FEATURE_WISHLIST,
    name: "Feature wishlist",
    iconName: "bulb",
    free: false,
    premium: true,
  },
  // {
  //   id: 7,
  //   identifier: SUBSCRIPTION_LIMIT.GROUPS,
  //   name: "Groups and sharing logbooks",
  //   iconName: "people",
  //   free: false,
  //   premium: true,
  // },
];

export default subscriptionFeaturesModel;
