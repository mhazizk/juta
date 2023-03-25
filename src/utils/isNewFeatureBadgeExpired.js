/**
 * Checks if the new feature badge is expired
 *
 * @param newFeatureStartDateInMillis - Date when the new feature was released
 * @param durationInMillis - Duration of the new feature badge
 * @returns
 */
const isNewFeatureBadgeExpired = (
  newFeatureStartDateInMillis,
  durationInMillis
) => {
  const todayInMillis = Date.now();
  const newFeatureEndDateInMillis =
    newFeatureStartDateInMillis + durationInMillis;
  if (todayInMillis >= newFeatureEndDateInMillis) return true;
  return false;
};
export default isNewFeatureBadgeExpired;
