import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Text,
  TouchableNativeFeedback,
  TouchableHighlight,
  View,
  TouchableOpacity,
  ActivityIndicator,
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
import { ButtonSwitch, oldButtonSwitch } from "../../../components/Button";
import { findTransactionsToPlot } from "../../../modules/FindTransactionsToPlot";
import { useIsFocused } from "@react-navigation/native";
import Loading from "../../../components/Loading";

const AnalyticsScreen = () => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { budgets, dispatchBudgets } = useGlobalBudgets();
  const [activeBudget, setActiveBudget] = useState({
    budget: null,
    spent: null,
    transactionList: [],
  });

  const [graph, setGraph] = useState({
    status: "empty",
    rangeDay: 7,
    graphData: {
      mainGraph: [],
      shadowGraph: [],
      limitLine: [],
    },
  });

  const [componentLoading, setComponentLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);

  const isFocus = useIsFocused();

  const findTransactions = useMemo(() => {
    return () => {
      findTransactionsToPlot({
        expenseOnly: true,
        appSettings: appSettings,
        groupSorted: sortedTransactions.groupSorted,
        logbooks: logbooks,
        categories: categories,
        budgets: budgets,
        graph: graph,
        activeBudget: activeBudget,
        setGraph: (item) => setGraph(item),
        setActiveBudget: (item) => setActiveBudget(item),
      });
      setScreenLoading(false);
      setComponentLoading(false);
    };
  }, [graph.rangeDay]);

  useEffect(() => {
    let isUnmounted = false;

    // if (!loading) {
    //   findTransactions();
    //   setTimeout(() => {
    //   }, 10);
    // }
    // console.log("Mounted");

    return () => {
      // isUnmounted = true;
      console.log("Unmounted");
    };
  }, []);

  useEffect(() => {
    if (isFocus) {
      setScreenLoading(true);
      console.log("Focused");
    }
  }, [isFocus]);

  useEffect(() => {
    if (screenLoading) {
      setTimeout(() => {
        findTransactions();
      }, 1);
    }
  }, [screenLoading, componentLoading]);

  // useEffect(() => {
  //   setGraph({
  //     ...graph,
  //     status: "loading",
  //   });
  //   findTransactions();
  // }, [budgets]);

  useEffect(() => {
    // console.log(JSON.stringify(graph));
    setComponentLoading(true);
    if (graph.status === "loading") {
      setTimeout(() => {
        findTransactions();
      }, 1);
    }
  }, [graph.rangeDay, graph.status]);

  // useEffect(() => {
  //   setGraph({
  //     ...graph,
  //     status: "loading",
  //   });
  //   findTransactions();
  // }, [sortedTransactions.groupSorted]);

  useEffect(() => {
    console.log(activeBudget);
  }, [activeBudget]);

  // ! Function Section

  return (
    <>
      {!screenLoading && (
        <View
          style={{
            paddingHorizontal: 16,
            backgroundColor: appSettings.theme.style.colors.background,
            height: "100%",
          }}
        >
          {componentLoading && (
            <View
              style={{
                height: 345,
                backgroundColor: appSettings.theme.style.colors.background,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Loading />
            </View>
          )}

          {activeBudget.spent && (
            <>
              {!componentLoading && (
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
              {/* {graph.status === "done" && ( */}
              {!componentLoading && graph.status === "done" && (
                <>
                  <CustomBarChart
                    //   Graph Data
                    mainGraph={
                      graph.status === "done" ? graph.graphData.mainGraph : null
                    }
                    shadowGraph={
                      graph.status === "done"
                        ? graph.graphData.shadowGraph
                        : null
                    }
                    limitLine={
                      graph.status === "done" &&
                      graph.graphData.limitLine.length
                        ? graph.graphData.limitLine
                        : null
                    }
                    symbol={appSettings.currency.symbol}
                    rangeDay={graph.rangeDay}
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
                    showAxisLabels
                    textColor={appSettings.theme.style.text.textSecondary.color}
                    barRadius={8}
                    barWidth={
                      graph.rangeDay === 7 ? 28 : graph.rangeDay === 30 ? 8 : 16
                    }
                  />
                </>
              )}

              {/* // TODO add 30 days graph option  */}
              {/* Range selector */}
              <View
                style={{
                  flexDirection: "row",
                  padding: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ButtonSwitch
                  onPress={() => {
                    setGraph({ ...graph, rangeDay: 7, status: "loading" });
                  }}
                  condition={graph.rangeDay === 7}
                  label="Last week"
                />
                <ButtonSwitch
                  onPress={() => {
                    setGraph({ ...graph, rangeDay: 30, status: "loading" });
                  }}
                  condition={graph.rangeDay === 30}
                  label="Last month"
                />
                <ButtonSwitch
                  onPress={() => {
                    setGraph({ ...graph, rangeDay: 365, status: "loading" });
                  }}
                  condition={graph.rangeDay === 365}
                  label="Last year"
                />
              </View>
            </>
          )}

          {/* // TODO add time range button switch  */}
          {/* // TODO add average spent amount  */}
          {/* {graph.status === "loading" && (
            <ActivityIndicator
              size={50}
              color={appSettings.theme.style.colors.primary}
            />
          )} */}
          {graph.status === "empty" && (
            <View
              style={{
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IonIcons
                name="analytics"
                color={appSettings.theme.style.colors.secondary}
                size={48}
                style={{
                  paddingBottom: 16,
                }}
              />
              <TextSecondary
                label={`You don't have transaction yet. \n Start adding transaction to see your analytics.`}
                style={{ textAlign: "center" }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 16,
                }}
              ></View>
            </View>
          )}
          {/* Loading */}
        </View>
      )}
      {screenLoading && (
        <View
          style={{
            height: "100%",
            backgroundColor: appSettings.theme.style.colors.background,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loading />
        </View>
      )}
    </>
  );
};

export default AnalyticsScreen;
