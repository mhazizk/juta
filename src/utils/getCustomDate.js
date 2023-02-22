/**
 * This function returns the date in format YYYY/MM/DD
 *
 * @param dateInMillis - Date in milliseconds
 * @returns Date in format YYYY/MM/DD
 */
const getCustomDate = (dateInMillis) => {
  return `${new Date(dateInMillis).getFullYear()}/${(
    "0" +
    (new Date(dateInMillis).getMonth() + 1)
  ).slice(-2)}/${("0" + new Date(dateInMillis).getDate()).slice(-2)}`;
};

export default getCustomDate;
