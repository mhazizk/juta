const subscriptionTypes = [
  {
    price: 0,
    currency: "USD",
    duration: "month",
    durationCount: 1,
    description: "Free subscription",
    name: "Free",
    id: "free",
  },
  {
    price: 9.99,
    currency: "USD",
    duration: "month",
    durationCount: 1,
    description: "Monthly premium subscription",
    name: "Monthly",
    id: "monthly",
  },
  {
    price: 99.99,
    currency: "USD",
    duration: "year",
    durationCount: 1,
    description: "Yearly premium subscription",
    name: "Yearly",
    id: "yearly",
  },
];

export default subscriptionTypes;