import { useEffect, useState } from "react";
import {
  Dimensions,
  Text,
  TouchableNativeFeedback,
  TouchableHighlight,
  View,
  TouchableOpacity,
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import ChartComponent from "../../../components/Chart";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
} from "../../../modules/GlobalContext";
import {
  findCategoryColorById,
  findCategoryIconNameById,
  findCategoryNameById,
  findLogbookById,
} from "../../../modules/FindById";
import { CustomBarChart } from "../../../components/CustomBarChart";
import { hexToRgb } from "../../../modules/HexToRGB";

const AnalyticsScreen = () => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { budgets, dispatchBudgets } = useGlobalBudgets();

  const [activeBudget, setActiveBudget] = useState({
    budget: null,
    spent: null,
    transactionList: [],
  });

  const [graph, setGraph] = useState({
    status: "loading",
    rangeDay: 7,
    graphData: {
      mainGraph: [],
      shadowGraph: [],
      limitLine: [],
    },
  });

  useEffect(() => {
    findTransactions();
  }, []);

  useEffect(() => {
    console.log(JSON.stringify(graph));
  }, [graph]);

  useEffect(() => {
    setGraph({
      ...graph,
      status: "loading",
    });
    findTransactions();
  }, [sortedTransactions.groupSorted]);

  // ! Function Section

  // Find transactions within range
  const findTransactions = () => {
    // setGraph({
    //   ...graph,
    //   status: "loading",
    // });

    let transactionList = [];
    let spentList = [];
    let mainGraph = [];
    let unsortedMainGraph = [];
    let shadowGraph = [];
    let limitLine = [];
    let dailyLimit = 0;
    let today = Date.now();
    let month = new Date(today).getMonth();
    let year = new Date(today).getFullYear();
    let day = new Date(today).getDate();

    if (sortedTransactions.groupSorted.length) {
      sortedTransactions.groupSorted.forEach((logbook) => {
        logbook.transactions.forEach((section) => {
          section.data.forEach((transaction) => {
            // Find transactions within range
            if (
              transaction.details.date <= today &&
              transaction.details.date >=
                today - 1000 * 60 * 60 * 24 * graph.rangeDay
            ) {
              const iconColor = findCategoryColorById({
                id: transaction.details.category_id,
                categories: categories.categories,
              });
              const iconName = findCategoryIconNameById({
                id: transaction.details.category_id,
                categories: categories.categories,
              });
              const iconPack = findCategoryIconNameById({
                id: transaction.details.category_id,
                categories: categories.categories,
              });
              const categoryName = findCategoryNameById({
                id: transaction.details.category_id,
                categories: categories.categories,
              });
              const foundLogbook = findLogbookById({
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
            }
          });
        });
      });
    }
    if (transactionList.length) {
      for (let i = 0; i < graph.rangeDay; i++) {
        let sumAmount = [];
        let reducedAmount = 0;
        let date = new Date(today - 1000 * 60 * 60 * 24 * i);
        transactionList.forEach((list) => {
          if (
            new Date(list.transaction.details.date).getDate() === date.getDate()
          ) {
            sumAmount.push(list.transaction.details.amount);
          }
        });
        if (sumAmount.length) {
          reducedAmount = sumAmount.reduce((a, b) => a + b, 0);
        }
        unsortedMainGraph.push({
          i: date.getDate(),
          x: date.toLocaleDateString(appSettings.locale, { weekday: "short" }),
          y: reducedAmount,
        });
        unsortedMainGraph = unsortedMainGraph.sort((a, b) => {
          if (a.i < b.i) return -1;
          if (a.i > b.i) return 1;
          return 0;
        });
      }
    }
    if (budgets.budgets.length) {
      budgets.budgets.forEach((budget) => {
        if (budget.start_date <= today && budget.finish_date >= today) {
          const range = budget.finish_date - budget.start_date;
          const rangeDay = range / (1000 * 60 * 60 * 24);
          dailyLimit = parseFloat(budget.limit / rangeDay).toFixed(2);
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
        });
        shadowGraph.push({
          x: data.x,
          y: shadowLimit,
        });
        if (dailyLimit) {
          limitLine.push({
            x: data.x,
            y: dailyLimit,
          });
        }
      });
    }

    setGraph({
      ...graph,
      status: "done",
      graphData: { mainGraph, shadowGraph, limitLine },
    });
  };

  return (
    <>
      <View
        style={{
          paddingHorizontal: 16,
          backgroundColor: appSettings.theme.style.colors.background,
          height: "100%",
          paddingTop: 16,
        }}
      >
        {graph.status === "done" && (
          <CustomBarChart
            //   Graph Data
            mainGraph={graph.graphData.mainGraph}
            shadowGraph={graph.graphData.shadowGraph}
            limitLine={graph.graphData.limitLine}
            symbol={appSettings.currency.symbol}
            //  Graph Style
            mainBarColor={appSettings.theme.style.colors.success}
            overBudgetBarColor={appSettings.theme.style.colors.danger}
            warnBudgetBarColor={appSettings.theme.style.colors.warn}
            shadowBarColor={hexToRgb({
              hex: appSettings.theme.style.colors.background,
              opacity: 0.5,
            })}
            width={Dimensions.get("window").width - 32}
            height={220}
            textColor={appSettings.theme.style.text.textPrimary.color}
            barRadius={5}
            barWidth={20}
          />
        )}
        {/* <ChartComponent /> */}
      </View>
    </>
  );
};

export default AnalyticsScreen;
