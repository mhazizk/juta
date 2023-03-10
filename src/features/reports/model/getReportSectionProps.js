import * as utils from "../../../utils";

/**
 * Get section props for the report
 *
 * @param selectedMode - `thisMonth`, `monthly`, or `yearly`. Default is `monthly`
 * @returns sectionProps
 */
const getReportSectionProps = (selectedMode = "monthly") => {
  const sections = [];

  // const firstDateInThisMonth = utils.getFirstDateOfTheMonth(todayInMillis);
  const todayInMillis = Date.now();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  let year = thisYear;
  let month = thisMonth;

  const section = {
    title: null,
    customDate: null,
    startDateInMillis: null,
    endDateInMillis: null,
    data: {
      totalIncome: 0,
      totalExpense: 0,
      expenseList: [],
      incomeList: [],
      incomeGraph: [],
      expenseGraph: [],
    },
  };

  switch (selectedMode) {
    case "thisMonth":
      const newSection = {
        ...section,
        title: utils.upperCaseThisFirstLetter(
          new Date(thisYear, thisMonth, 1).toLocaleString("default", {
            month: "long",
          })
        ),
        customDate: utils.getCustomDate(
          new Date(thisYear, thisMonth, 1).getTime()
        ),
        startDateInMillis: new Date(
          new Date(thisYear, thisMonth, 1).setHours(0, 0, 0, 0)
        ).getTime(),
        endDateInMillis: utils.getNextDateInRange(
          new Date(thisYear, thisMonth, 1).getTime(),
          "monthly"
        ),
        data: {
          totalIncome: 0,
          totalExpense: 0,
          expenseList: [],
          incomeList: [],
          incomeGraph: [],
          expenseGraph: [],
        },
      };

      sections.push(newSection);

      break;

    case "monthly":
      let totalPreviousDays = 0;
      //   repeat to get 12 months earlier
      for (let i = 0; i < 12; i++) {
        const relativeTimeInMillis = totalPreviousDays * 24 * 60 * 60 * 1000;

        const timeAtTheMoment = todayInMillis - relativeTimeInMillis;

        const yearAtTheMoment = new Date(timeAtTheMoment).getFullYear();
        const monthAtTheMoment = new Date(timeAtTheMoment).getMonth();
        const dateAtTheMoment = new Date(timeAtTheMoment).getDate();
        const firsDateAtTheMomentInMillis = new Date(
          new Date(yearAtTheMoment, monthAtTheMoment, 1).setHours(0, 0, 0, 0)
        ).getTime();

        const newSection = {
          ...section,
          title: utils.upperCaseThisFirstLetter(
            new Date(timeAtTheMoment).toLocaleString("default", {
              month: "long",
            })
          ),
          customDate: utils.getCustomDate(timeAtTheMoment),
          startDateInMillis: firsDateAtTheMomentInMillis,
          endDateInMillis: utils.getNextDateInRange(
            firsDateAtTheMomentInMillis,
            "monthly"
          ),
          data: {
            totalIncome: 0,
            totalExpense: 0,
            expenseList: [],
            incomeList: [],
            incomeGraph: [],
            expenseGraph: [],
          },
        };

        sections.push(newSection);
        totalPreviousDays += utils.getTotalDaysInMonth(
          yearAtTheMoment,
          monthAtTheMoment - i
        );
      }

      break;

    default:
      break;
  }
  console.log(JSON.stringify(sections, null, 2));
  return sections.sort((a, b) => a.customDate.localeCompare(b.customDate));
};
export default getReportSectionProps;
