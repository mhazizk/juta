import * as utils from "../../../utils";

/**
 * Get section props for the report
 *
 * @param selectedMode - `monthly` or `yearly`. Default is `monthly`
 * @returns sectionProps
 */
const getReportSectionProps = (selectedMode = "monthly") => {
  const sections = [];

  switch (selectedMode) {
    case "monthly":
      const thisYear = new Date().getFullYear();
      const thisMonth = new Date().getMonth();

      //   repeat to get 12 months earlier
      for (let i = 0; i < 12; i++) {
        let year = thisYear;
        let month = thisMonth;
        // let nextYear = thisYear + 1;
        // let nextMonth = thisMonth + 1;

        year = month < 0 ? year - i : year;
        month = month < 0 ? 11 : month - i;

        const section = {
          title: utils.upperCaseThisFirstLetter(
            new Date(year, month, 1).toLocaleString("default", {
              month: "long",
            })
          ),
          customDate: utils.getCustomDate(new Date(year, month, 1).getTime()),
          startDateInMillis: new Date(
            new Date(year, month, 1).setHours(0, 0, 0, 0)
          ).getTime(),
          endDateInMillis: utils.getNextDateInRange(
            new Date(year, month, 1).getTime(),
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

        sections.push(section);
      }

      break;

    default:
      break;
  }

  return sections.sort((a, b) => a.customDate.localeCompare(b.customDate));
};
export default getReportSectionProps;
