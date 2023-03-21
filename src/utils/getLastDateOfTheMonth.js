/**
 * Get the last date of the month
 *
 * @param date - Date in milliseconds
 * @returns last date of the month
 */
const getLastDateOfTheMonth = (dateInMillis) => {
  const date = new Date(dateInMillis) || new Date();
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};
export default getLastDateOfTheMonth;
