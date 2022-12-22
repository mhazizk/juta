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
import { TextPrimary, TextSecondary } from "../../../components/Text";
import formatCurrency from "../../../modules/formatCurrency";
import { ButtonSwitch } from "../../../components/Button";

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
    findTransactions();
  }, [budgets]);

  useEffect(() => {
    // console.log(JSON.stringify(graph));
  }, [graph]);

  useEffect(() => {
    setGraph({
      ...graph,
      status: "loading",
    });
    findTransactions();
  }, [sortedTransactions.groupSorted]);

  useEffect(() => {
    console.log(activeBudget);
  }, [activeBudget]);

  // ! Function Section

  // Find transactions within range
  const findTransactions = () => {
    // setGraph({
    //   ...graph,
    //   status: "loading",
    // });

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

    if (sortedTransactions.groupSorted.length) {
      if (
        sortedTransactions.groupSorted.some(
          (logbook) => logbook.transactions.length
        )
      ) {
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
        if (transactionList.length) {
          transactionList.forEach((list) => {
            totalSpent += list.transaction.details.amount;
          });
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
            unsortedMainGraph.push({
              i: date.getDate(),
              x: date.toLocaleDateString(appSettings.locale, {
                weekday: "short",
              }),
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
            });
            shadowGraph.push({
              x: data.x,
              y: dailyLimit > shadowLimit ? dailyLimit : shadowLimit,
            });
            if (dailyLimit && dailyLimit < shadowLimit) {
              limitLine.push({
                x: data.x,
                y: dailyLimit,
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
          status: "done",
          graphData: { mainGraph, shadowGraph, limitLine },
        });
      }
    }
  };

  return (
    <>
      <View
        style={{
          paddingHorizontal: 16,
          backgroundColor: appSettings.theme.style.colors.background,
          height: "100%",
        }}
      >
        {activeBudget.spent && (
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TextSecondary
                label={appSettings.currency.symbol}
                style={{ paddingRight: 8 }}
              />
              <TextPrimary
                style={{ fontSize: 36, fontWeight: "bold" }}
                label={formatCurrency({
                  amount: activeBudget.spent,
                  currency: appSettings.currency.name,
                })}
              />
            </View>
            <TextSecondary
              label={`Total expense in the last ${graph.rangeDay} days`}
              style={{ paddingRight: 8 }}
            />
          </View>
        )}
        {graph.status === "done" && (
          <CustomBarChart
            //   Graph Data
            mainGraph={
              graph.graphData.mainGraph.length
                ? graph.graphData.mainGraph
                : null
            }
            shadowGraph={
              graph.graphData.shadowGraph.length
                ? graph.graphData.shadowGraph
                : null
            }
            limitLine={
              graph.graphData.limitLine.length
                ? graph.graphData.limitLine
                : null
            }
            symbol={appSettings.currency.symbol}
            //  Graph Style
            successColor={appSettings.theme.style.colors.success}
            primaryColor={appSettings.theme.style.colors.foreground}
            overBudgetBarColor={appSettings.theme.style.colors.danger}
            warnBudgetBarColor={appSettings.theme.style.colors.warn}
            shadowBarColor={hexToRgb({
              hex: appSettings.theme.style.colors.secondary,
              opacity: 0.5,
            })}
            width={Dimensions.get("window").width}
            height={220}
            textColor={appSettings.theme.style.text.textSecondary.color}
            barRadius={10}
            barWidth={28}
          />
        )}
        {/* // TODO add 30 days graph option  */}
        {/* // TODO add time range button switch  */}
        {/* // TODO add average spent amount  */}
      </View>
    </>
  );
};

export default AnalyticsScreen;
