/**
 * Get relative date from a given date in milliseconds
 *
 * @params date in milliseconds
 * @returns relative date or stringify date
 *
 * @example
 * getRelativeDate(1620000000000) // returns 'May 10, 2021'
 *
 */
const getRelativeDate = (dateInMillis) => {
  let relativeDate = new Date(dateInMillis).toDateString();
  const thisDate = new Date().getDate();
  const thisMonth = new Date().getMonth() + 1;
  const thisYear = new Date().getFullYear();

  const date = new Date(dateInMillis).getDate();
  const month = new Date(dateInMillis).getMonth() + 1;
  const year = new Date(dateInMillis).getFullYear();

  const isSameYearAndMonth = thisYear === year && thisMonth === month;

  if (isSameYearAndMonth) {
    switch (thisDate - date) {
      case -1:
        relativeDate = "Tomorrow";
        break;
      case 0:
        relativeDate = "Today";
        break;
      case 1:
        relativeDate = "Yesterday";
        break;
      default:
        break;
    }
  }

  return relativeDate;
};
export default getRelativeDate;
