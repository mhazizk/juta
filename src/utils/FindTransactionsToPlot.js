// import * as utils from "../utils";
import FindById from "../utils/FindById";

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
}) => {
  let transactionList = [];
  let spentList = [];
  let totalSpent = 0;
  let mainGraph = [];
  let unsortedMainGraph = [];
  let shadowGraph = [];
  let limitLine = [];
  let dailyLimit = 0;
  let today = Date.now();
  let month = new Date(today).getMonth();
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
          totalSpent += list.transaction.details.amount;
        });
        if (graph.rangeDay === 365) {
          for (let i = 0; i < 12; i++) {
            let sumAmount = [];
            let reducedAmount = 0;
            transactionList.forEach((list) => {
              if (
                new Date(list.transaction.details.date).getMonth() ===
                month - i
              ) {
                sumAmount.push(list.transaction.details.amount);
              }
            });
            if (sumAmount.length) {
              reducedAmount = sumAmount.reduce((a, b) => a + b, 0);
            }
            const monthName = new Date(
              today - 1000 * 60 * 60 * 24 * 30 * i
            ).toLocaleDateString(appSettings.locale, {
              month: "short",
            });
            const monthNumber = new Date(
              today - 1000 * 60 * 60 * 24 * 30 * i
            ).getMonth();
            const nYear = new Date(
              today - 1000 * 60 * 60 * 24 * 30 * i
            ).getFullYear();
            unsortedMainGraph.push({
              x: monthName,
              y: reducedAmount,
              month: monthNumber,
              year: nYear,
            });
            unsortedMainGraph.sort((a, b) => {
              if (a.month < b.month) {
                return -1;
              }
              if (a.month > b.month) {
                return 1;
              }
              return 0;
            });
          }
        }

        if (graph.rangeDay === 7 || graph.rangeDay === 30) {
          for (let i = 0; i < graph.rangeDay; i++) {
            let sumAmount = [];
            let reducedAmount = 0;
            let date = new Date(today - 1000 * 60 * 60 * 24 * i);
            transactionList.forEach((list) => {
              if (
                new Date(list.transaction.details.date).getDate() ===
                date.getDate()
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
              // i: date.getDate(),
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
      if (budgets.budgets.length) {
        budgets.budgets.forEach((budget) => {
          if (budget.start_date <= today && budget.finish_date >= today) {
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
            shadowLimit = data.y;
          }
        });
        unsortedMainGraph.forEach((data) => {
          mainGraph.push({
            x: data.x,
            y: data.y,
            epochDate: data.epochDate,
            month: data.month,
            year: data.year,
          });
          shadowGraph.push({
            x: data.x,
            y: dailyLimit > shadowLimit ? dailyLimit : shadowLimit,
            epochDate: data.epochDate,
            month: data.month,
            year: data.year,
          });
          if (dailyLimit && dailyLimit < shadowLimit) {
            limitLine.push({
              x: data.x,
              y: dailyLimit,
              epochDate: data.epochDate,
              month: data.month,
              year: data.year,
            });
          }
        });
      }

      setActiveBudget({
        ...activeBudget,
        spent: totalSpent,
        limit: dailyLimit,
      });
      setGraph({
        ...graph,
        // status:
        //   mainGraph.length || shadowGraph.length || limitLine.length
        //     ? "done"
        //     : "empty",
        graphData: { mainGraph, shadowGraph, limitLine },
      });
      setShowGraph(true);
    } else {
      setGraph({
        // status: "empty",
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
