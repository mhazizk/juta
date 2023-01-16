import subscriptionFeaturesModel from "../model/subscriptionFeaturesModel";
import SUBSCRIPTION_LIMIT from "../model/subscriptionLimit";

const getSubscriptionLimit = (subscriptionPlan, subscriptionLimit) => {
  let foundLimit = null;
  switch (subscriptionLimit) {
    case SUBSCRIPTION_LIMIT.LOGBOOKS:
      foundLimit = subscriptionFeaturesModel.find((plan) => {
        return plan.identifier === SUBSCRIPTION_LIMIT.LOGBOOKS;
      });
      break;
    case SUBSCRIPTION_LIMIT.DEVICES:
      foundLimit = subscriptionFeaturesModel.find((plan) => {
        return plan.identifier === SUBSCRIPTION_LIMIT.DEVICES;
      });
      break;
    case SUBSCRIPTION_LIMIT.SECONDARY_CURRENCY:
      foundLimit = subscriptionFeaturesModel.find((plan) => {
        return plan.identifier === SUBSCRIPTION_LIMIT.SECONDARY_CURRENCY;
      });
      break;
    case SUBSCRIPTION_LIMIT.RECURRING_TRANSACTIONS:
      foundLimit = subscriptionFeaturesModel.find((plan) => {
        return plan.identifier === SUBSCRIPTION_LIMIT.RECURRING_TRANSACTIONS;
      });
      break;
    case SUBSCRIPTION_LIMIT.EXPORT_DATA:
      foundLimit = subscriptionFeaturesModel.find((plan) => {
        return plan.identifier === SUBSCRIPTION_LIMIT.EXPORT_DATA;
      });
      break;
    case SUBSCRIPTION_LIMIT.BUDGETS:
      foundLimit = subscriptionFeaturesModel.find((plan) => {
        return plan.identifier === SUBSCRIPTION_LIMIT.BUDGETS;
      });
      break;
    case SUBSCRIPTION_LIMIT.GROUPS:
      foundLimit = subscriptionFeaturesModel.find((plan) => {
        return plan.identifier === SUBSCRIPTION_LIMIT.GROUPS;
      });
      break;

    default:
      break;
  }

  return subscriptionPlan === "premium" ? foundLimit.premium : foundLimit.free;
};

export default getSubscriptionLimit;