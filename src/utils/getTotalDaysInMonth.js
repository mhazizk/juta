/**
 * Get total days in month
 *
 * @param year - year
 * @param month - month in number format (1-12)
 * @returns total days in month
 */
const getTotalDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

export default getTotalDaysInMonth;
