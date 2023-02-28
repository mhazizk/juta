// import * as utils from "../utils";
import FindById from "./FindById";
import convertCurrency from "./convertCurrency";
import getTotalDaysInMonth from "./getTotalDaysInMonth";

const findTransactionsToPlot = ({
  groupSorted,
  logbooks,
  expenseOnly,
  categories,
  budgets,
  graph,
  setGraph,
  setShowGraph,
  activeBudget,
  setActiveBudget,
  appSettings,
  globalCurrencyRates,
}) => {
  console.log(JSON.stringify({ budgets }, null, 2));
  let transactionList = [];
  let spentList = [];
  let totalSpent = 0;
  let mainGraph = [];
  let unsortedMainGraph = [];
  let shadowGraph = [];
  let limitLine = [];
  let dailyLimit = 0;
  let today = Date.now();
  let month = new Date(today).getMonth() + 1;
  let year = new Date(today).getFullYear();
  let day = new Date(today).getDate();

  if (groupSorted?.length) {
    if (groupSorted.some((logbook) => logbook.transactions.length)) {
      //  if (expenseOnly) {
      groupSorted.forEach((logbook) => {
        logbook.transactions.forEach((section) => {
          section.data.forEach((transaction) => {
            // Find transactions within range
            if (
              transaction.details.in_out === "expense" &&
              transaction.details.date <= today &&
              transaction.details.date >=
                today - 1000 * 60 * 60 * 24 * graph.rangeDay
            ) {
              const iconColor = FindById.findCategoryColorById({
                id: transaction?.details.category_id,
                categories: categories.categories,
              });
              const iconName = FindById.findCategoryIconNameById({
                id: transaction?.details.category_id,
                categories: categories.categories,
              });
              const iconPack = FindById.findCategoryIconNameById({
                id: transaction?.details.category_id,
                categories: categories.categories,
              });
              const categoryName = FindById.findCategoryNameById({
                id: transaction?.details.category_id,
                categories: categories.categories,
              });
              const foundLogbook = FindById.findLogbookById({
                id: logbook.logbook_id,
                logbooks: logbooks.logbooks,
              });
              transactionList.push({
                transaction: transaction,
                category: {
                  categoryName,
                  categoryId: transaction.details.category_id,
                  icon: { iconPack, iconColor, iconName },
                },
                logbook: {
                  logbookName: foundLogbook.logbook_name,
                  logbookId: logbook.logbook_id,
                  logbookCurrency: foundLogbook.logbook_currency,
                },
              });
              // }
              // else {
              //   console.log("No transactions found");
              //   return;
              //   setGraph({
              //   status: "empty",
              //   rangeDay: 7,
              //   graphData: {
              //     mainGraph: [],
              //     shadowGraph: [],
              //     limitLine: [],
              //   },
              // });
            }
          });
        });
      });
      if (transactionList.length) {
        transactionList.forEach((list) => {
          totalSpent += convertCurrency({
            globalCurrencyRates,
            amount: list.transaction.details.amount,
            from: FindById.findLogbookById({
              id: list.transaction.logbook_id,
              logbooks: logbooks.logbooks,
            }).logbook_currency.name,
            target: appSettings.logbookSettings.defaultCurrency.name,
          });
        });
        if (graph.rangeDay === 365) {
          let totalPreviousDays = 0;
          // make this month number into 0
          const monthDeviation = 0 - month;
          for (let i = 1; i <= 12; i++) {
            let sumAmount = [];
            let reducedAmount = 0;
            let currentYear = year;

            transactionList.forEach((list) => {
              if (
                new Date(list.transaction.details.date).getMonth() ===
                month - i
              ) {
                currentMonth = new Date(
                  list.transaction.details.date
                ).getMonth();

                currentYear = new Date(
                  list.transaction.details.date
                ).getFullYear();

                sumAmount.push(list.transaction.details.amount);
              }
            });
            if (sumAmount.length) {
              reducedAmount = sumAmount.reduce((a, b) => a + b, 0);
            }
            const selected = today - 1000 * 60 * 60 * 24 * totalPreviousDays;
            const monthName = new Date(selected).toLocaleDateString(
              appSettings.locale,
              {
                month: "short",
              }
            );
            const nYear = new Date(selected).getFullYear();
            const monthNumber = (
              "0" +
              (new Date(selected).getMonth() + 1)
            ).slice(-2);
            unsortedMainGraph.push({
              x: `${nYear}/${monthNumber}`,
              y: reducedAmount,
              monthName: monthName,
              year: nYear,
            });
            unsortedMainGraph.sort((a, b) => {
              return a.x.localeCompare(b.x);
            });
            totalPreviousDays += getTotalDaysInMonth(currentYear, month - i);
          }
        }

        if (graph.rangeDay === 7 || graph.rangeDay === 30) {
          const totalDays =
            graph.rangeDay === 7 ? 7 : getTotalDaysInMonth(year, month);
          for (let i = 0; i < totalDays; i++) {
            let sumAmount = [];
            let reducedAmount = 0;
            let date = new Date(today - 1000 * 60 * 60 * 24 * i);
            let currentDate = date.getDate();
            let currentMonth = date.getMonth() + 1;
            let currentYear = date.getFullYear();
            transactionList.forEach((list) => {
              const transactionDate = new Date(
                list.transaction.details.date
              ).getDate();
              const transactionMonth =
                new Date(list.transaction.details.date).getMonth() + 1;
              const transactionYear = new Date(
                list.transaction.details.date
              ).getFullYear();

              if (
                transactionDate === currentDate &&
                transactionMonth === currentMonth &&
                transactionYear === currentYear
              ) {
                sumAmount.push(list.transaction.details.amount);
              }
            });
            if (sumAmount.length) {
              reducedAmount = sumAmount.reduce((a, b) => a + b, 0);
            }
            const month = date.toLocaleDateString(appSettings.locale, {
              month: "short",
            });
            const numDay = date.toLocaleDateString(appSettings.locale, {
              day: "numeric",
            });
            const shortDay = date.toLocaleDateString(appSettings.locale, {
              weekday: "short",
            });
            const year = date.toLocaleDateString(appSettings.locale, {
              year: "numeric",
            });
            let x;
            switch (graph.rangeDay) {
              case 7:
                x = `${shortDay}`;
                break;
              case 30:
                x = `${month} ${numDay}`;
                break;
              case 365:
                x = `${month} ${year}`;
                break;
              default:
                x = `${numDay}`;
                break;
            }
            unsortedMainGraph.push({
              i: date.getTime(),
              x: x,
              y: reducedAmount,
              epochDate: date.getTime(),
            });
            unsortedMainGraph = unsortedMainGraph.sort((a, b) => {
              if (a.i < b.i) return -1;
              if (a.i > b.i) return 1;
              return 0;
            });
          }
        }
      }
      if (budgets.budgets.length > 0) {
        budgets.budgets.forEach((budget) => {
          if (budget?.start_date <= today && budget?.finish_date >= today) {
            const range = budget.finish_date - budget.start_date;
            const rangeDay = range / (1000 * 60 * 60 * 24);
            dailyLimit = +parseFloat(budget.limit / rangeDay).toFixed(2);
          }
        });
      }

      if (unsortedMainGraph.length) {
        let shadowLimit = 0;
        unsortedMainGraph.forEach((data) => {
          if (data.y > shadowLimit) {
            switch (graph.rangeDay) {
              case 7:
                shadowLimit = data.y;
                break;
              case 30:
                shadowLimit = data.y;
              case 365:
                shadowLimit = data.y;

              default:
                break;
            }
          }
        });
        unsortedMainGraph.forEach((data) => {
          mainGraph.push({
            x: data.x,
            y: +parseFloat(data.y).toFixed(2),
            epochDate: data.epochDate,
            monthName: data.monthName,
            year: data.year,
          });
          shadowGraph.push({
            x: data.x,
            y: +parseFloat(
              dailyLimit > shadowLimit ? dailyLimit : shadowLimit
            ).toFixed(2),
            epochDate: data.epochDate,
            monthName: data.monthName,
            year: data.year,
          });
          if (dailyLimit && dailyLimit < shadowLimit) {
            limitLine.push({
              x: data.x,
              y: dailyLimit,
              epochDate: data.epochDate,
              monthName: data.monthName,
              year: data.year,
            });
          }
        });
      }

      if (transactionList.length > 0) {
        setActiveBudget({
          ...activeBudget,
          spent: +parseFloat(totalSpent).toFixed(2),
          limit: dailyLimit,
        });
        setGraph({
          ...graph,
          graphData: { mainGraph, shadowGraph, limitLine },
        });
        setShowGraph(true);
      } else {
        setGraph({
          rangeDay: 7,
          graphData: {
            mainGraph: [],
            shadowGraph: [],
            limitLine: [],
          },
        });
        setShowGraph(false);
      }
    } else {
      setGraph({
        rangeDay: 7,
        graphData: {
          mainGraph: [],
          shadowGraph: [],
          limitLine: [],
        },
      });
      setShowGraph(false);
    }
    // }
  }
};

export default findTransactionsToPlot;
