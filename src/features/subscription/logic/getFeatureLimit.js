import FEATURE_NAME from "../model/featureName";
/**
 * Get subscription limit value
 *
 * @param globalFeatureSwitch - Global feature switch
 * @param subscriptionPlan - Current user subscription plan
 * @param featureName - Subscription limit to check
 * @returns Subscription limit value
 */
const getFeatureLimit = ({
  globalFeatureSwitch,
  subscriptionPlan,
  featureName,
}) => {
  const featureSwitch = globalFeatureSwitch?.featureSwitch;
  let foundLimit = null;
  switch (featureName) {
    case FEATURE_NAME.LOGBOOKS:
      foundLimit = featureSwitch?.find((plan) => {
        return plan.identifier === FEATURE_NAME.LOGBOOKS;
      });
      break;
    case FEATURE_NAME.DEVICES:
      foundLimit = featureSwitch?.find((plan) => {
        return plan.identifier === FEATURE_NAME.DEVICES;
      });
      break;
    case FEATURE_NAME.SECONDARY_CURRENCY:
      foundLimit = featureSwitch?.find((plan) => {
        return plan.identifier === FEATURE_NAME.SECONDARY_CURRENCY;
      });
      break;
    case FEATURE_NAME.RECURRING_TRANSACTIONS:
      foundLimit = featureSwitch?.find((plan) => {
        return plan.identifier === FEATURE_NAME.RECURRING_TRANSACTIONS;
      });
      break;
    case FEATURE_NAME.EXPORT_DATA:
      foundLimit = featureSwitch?.find((plan) => {
        return plan.identifier === FEATURE_NAME.EXPORT_DATA;
      });
      break;
    case FEATURE_NAME.BUDGETS:
      foundLimit = featureSwitch?.find((plan) => {
        return plan.identifier === FEATURE_NAME.BUDGETS;
      });
      break;
    case FEATURE_NAME.FEATURE_WISHLIST:
      foundLimit = featureSwitch?.find((plan) => {
        return plan.identifier === FEATURE_NAME.FEATURE_WISHLIST;
      });
      break;
    case FEATURE_NAME.ATTACHMENT_IMAGES:
      foundLimit = featureSwitch?.find((plan) => {
        return plan.identifier === FEATURE_NAME.ATTACHMENT_IMAGES;
      });
      break;
    case FEATURE_NAME.GROUPS:
      foundLimit = featureSwitch?.find((plan) => {
        return plan.identifier === FEATURE_NAME.GROUPS;
      });
      break;
    case FEATURE_NAME.LOAN:
      foundLimit = featureSwitch?.find((plan) => {
        return plan.identifier === FEATURE_NAME.LOAN;
      });
      break;

    default:
      break;
  }

  return subscriptionPlan === "premium"
    ? foundLimit?.premium
    : foundLimit?.free;
};

export default getFeatureLimit;
