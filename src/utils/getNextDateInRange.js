import getFirstDateOfTheMonth from "./getFirstDateOfTheMonth";
import getLastDateOfTheMonth from "./getLastDateOfTheMonth";

/**
 * Get the next date in range
 *
 * Automatically calculate the next date in given range
 *
 * @param startDateInMillis - Date in milliseconds
 * @param range - Range constants (daily, weekly, monthly, yearly)
 * @param getTimeAtMidnight - Make input date to `0h:0m:0s` and return date at `23h:59m:59s` (default as `true`)
 * @returns target date in milliseconds
 * @example
 * const startDateInMillis = new Date().getTime();
 * const targetDateInMillis = getNextDateInRange(startDateInMillis, "monthly");
 *
 */
const getNextDateInRange = (
  startDateInMillis,
  range,
  getTimeAtMidnight = true
) => {
  const startDateAtMidninght = new Date(startDateInMillis).setHours(0, 0, 0, 0);
  const startDateInMillisAtMidnight = new Date(startDateAtMidninght).getTime();

  const startDateInMillisToUse = getTimeAtMidnight
    ? startDateInMillisAtMidnight
    : startDateInMillis;

  const startDate = new Date(startDateInMillisToUse).getDate();
  const startMonth = new Date(startDateInMillisToUse).getMonth();
  const startYear = new Date(startDateInMillisToUse).getFullYear();
  let nextDate;
  let nextMonth;
  let nextYear;
  let targetDateInMillis;
  let nextDateInMillis;
  let setMidnightDate;

  switch (range) {
    case "weekly":
      nextDateInMillis = 6 * 24 * 60 * 60 * 1000;
      targetDateInMillis = startDateInMillisToUse + nextDateInMillis;

      if (getTimeAtMidnight) {
        setMidnightDate = new Date(
          startDateInMillisToUse + nextDateInMillis
        ).setHours(23, 59, 59, 999);

        targetDateInMillis = new Date(setMidnightDate).getTime();
      }

      return targetDateInMillis;
    case "monthly":
      const firstDateThisMonthInMillis = getFirstDateOfTheMonth(
        startDateInMillisToUse
      ).getTime();
      const endDateThisMonthInMillis = getLastDateOfTheMonth(
        startDateInMillisToUse
      ).getTime();

      nextDateInMillis =
        startDateInMillisToUse +
        endDateThisMonthInMillis -
        firstDateThisMonthInMillis;

      nextDate = new Date(nextDateInMillis).getDate();
      nextMonth = new Date(nextDateInMillis).getMonth();
      nextYear = new Date(nextDateInMillis).getFullYear();

      targetDateInMillis = new Date(nextYear, nextMonth, nextDate).getTime();
      if (getTimeAtMidnight) {
        setMidnightDate = new Date(nextYear, nextMonth, nextDate).setHours(
          23,
          59,
          59,
          999
        );
        targetDateInMillis = new Date(setMidnightDate).getTime();
      }
      return targetDateInMillis;
    case "yearly":
      // check current year is it leap year or not
      const isLeapYear = startYear % 4 === 0;
      switch (isLeapYear) {
        case true:
          nextDateInMillis = 365 * 24 * 60 * 60 * 1000;
          break;
        case false:
          nextDateInMillis = 364 * 24 * 60 * 60 * 1000;
          break;

        default:
          break;
      }
      targetDateInMillis = startDateInMillisToUse + nextDateInMillis;

      if (getTimeAtMidnight) {
        setMidnightDate = new Date(
          startDateInMillisToUse + nextDateInMillis
        ).setHours(23, 59, 59, 999);
        targetDateInMillis = new Date(setMidnightDate).getTime();
      }

      return targetDateInMillis;
  }
};
export default getNextDateInRange;
