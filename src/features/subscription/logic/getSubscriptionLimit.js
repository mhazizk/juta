import SUBSCRIPTION_LIMIT from "../model/subscriptionLimit";
/**
 * Get subscription limit value
 *
 * @param globalSubscriptionFeatures - Global subscription features
 * @param subscriptionPlan - Currenct user subscription plan
 * @param subscriptionLimit - Subscription limit to check
 * @returns Subscription limit value
 */
const getSubscriptionLimit = ({
  globalSubscriptionFeatures,
  subscriptionPlan,
  subscriptionLimit,
}) => {
  const { subscriptionFeatureList } = globalSubscriptionFeatures;
  let foundLimit = null;
  switch (subscriptionLimit) {
    case SUBSCRIPTION_LIMIT.LOGBOOKS:
      foundLimit = subscriptionFeatureList.find((plan) => {
        return plan.identifier === SUBSCRIPTION_LIMIT.LOGBOOKS;
      });
      break;
    case SUBSCRIPTION_LIMIT.DEVICES:
      foundLimit = subscriptionFeatureList.find((plan) => {
        return plan.identifier === SUBSCRIPTION_LIMIT.DEVICES;
      });
      break;
    case SUBSCRIPTION_LIMIT.SECONDARY_CURRENCY:
      foundLimit = subscriptionFeatureList.find((plan) => {
        return plan.identifier === SUBSCRIPTION_LIMIT.SECONDARY_CURRENCY;
      });
      break;
    case SUBSCRIPTION_LIMIT.RECURRING_TRANSACTIONS:
      foundLimit = subscriptionFeatureList.find((plan) => {
        return plan.identifier === SUBSCRIPTION_LIMIT.RECURRING_TRANSACTIONS;
      });
      break;
    case SUBSCRIPTION_LIMIT.EXPORT_DATA:
      foundLimit = subscriptionFeatureList.find((plan) => {
        return plan.identifier === SUBSCRIPTION_LIMIT.EXPORT_DATA;
      });
      break;
    case SUBSCRIPTION_LIMIT.BUDGETS:
      foundLimit = subscriptionFeatureList.find((plan) => {
        return plan.identifier === SUBSCRIPTION_LIMIT.BUDGETS;
      });
      break;
    case SUBSCRIPTION_LIMIT.FEATURE_WISHLIST:
      foundLimit = subscriptionFeatureList.find((plan) => {
        return plan.identifier === SUBSCRIPTION_LIMIT.FEATURE_WISHLIST;
      });
      break;
    case SUBSCRIPTION_LIMIT.ATTACHMENT_IMAGES:
      foundLimit = subscriptionFeatureList.find((plan) => {
        return plan.identifier === SUBSCRIPTION_LIMIT.ATTACHMENT_IMAGES;
      });
      break;
    case SUBSCRIPTION_LIMIT.GROUPS:
      foundLimit = subscriptionFeatureList.find((plan) => {
        return plan.identifier === SUBSCRIPTION_LIMIT.GROUPS;
      });
      break;
    case SUBSCRIPTION_LIMIT.LOAN:
      foundLimit = subscriptionFeatureList.find((plan) => {
        return plan.identifier === SUBSCRIPTION_LIMIT.LOAN;
      });
      break;

    default:
      break;
  }

  return subscriptionPlan === "premium" ? foundLimit.premium : foundLimit.free;
};

export default getSubscriptionLimit;
