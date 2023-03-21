/**
 * Get the start date of the month
 *
 * @param date - Date in milliseconds
 * @returns start date of the month
 */
const getFirstDateOfTheMonth = (dateInMillis) => {
  const date = new Date(dateInMillis) || new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
};
export default getFirstDateOfTheMonth;
