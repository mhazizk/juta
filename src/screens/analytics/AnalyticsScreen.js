import { useIsFocused } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, FlatList, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { ButtonSwitch } from "../../components/Button";
import { CustomBarChart } from "../../components/charts/CustomBarChart";
import { TransactionListItem } from "../../components/List";
import Loading from "../../components/Loading";
import { TextPrimary, TextSecondary } from "../../components/Text";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
} from "../../reducers/GlobalContext";
import * as utils from "../../utils";

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
  const [spentList, setSpentList] = useState([]);

  const isFocus = useIsFocused();

  const findTransactions = useMemo(() => {
    return () => {
      utils.FindTransactionsToPlot({
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
      // setComponentLoading(false);
    };
  }, [graph, budgets, activeBudget]);

  const categorizeSpentList = useMemo(() => {
    return () => {
      utils.GetSpentList({
        expenseOnly: true,
        groupSorted: sortedTransactions.groupSorted,
        categories: categories.categories,
        rangeDay: graph.rangeDay,
        setSpentList: (item) => setSpentList(item),
      });
      setScreenLoading(false);
      setComponentLoading(false);
    };
  }, [graph.rangeDay, graph.status]);

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
        categorizeSpentList();
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
        categorizeSpentList();
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

  useEffect(() => {
    console.log(JSON.stringify(spentList));
  }, [spentList]);

  // TAG : Function Section

  return (
    <>
      {!screenLoading && (
        <View
          style={{
            // paddingHorizontal: 16,
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
              {!componentLoading && graph.status === "done" && (
                <>
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
                        label={appSettings.logbookSettings.defaultCurrency.symbol}
                        style={{ paddingRight: 8 }}
                      />
                      <TextPrimary
                        style={{ fontSize: 36, fontWeight: "bold" }}
                        label={utils.GetFormattedNumber({
                          value: activeBudget.spent,
                          currency: appSettings.logbookSettings.defaultCurrency.name,
                        })}
                      />
                    </View>
                    <TextSecondary
                      label={`Total expense in the last ${graph.rangeDay} days`}
                      style={{ paddingRight: 8 }}
                    />
                  </View>
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
                    symbol={appSettings.logbookSettings.defaultCurrency.symbol}
                    rangeDay={graph.rangeDay}
                    //  Graph Style
                    successColor={appSettings.theme.style.colors.success}
                    primaryColor={appSettings.theme.style.colors.foreground}
                    overBudgetBarColor={appSettings.theme.style.colors.danger}
                    warnBudgetBarColor={appSettings.theme.style.colors.warn}
                    shadowBarColor={utils.HexToRgb({
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

          {/* // TODO add average spent amount  */}
          {/* {graph.status === "loading" && (
            <ActivityIndicator
              size={50}
              color={appSettings.theme.style.colors.primary}
            />
          )} */}
          {graph.status === "done" && !componentLoading && (
            <TextPrimary
              label="Expense by category"
              style={{
                paddingVertical: 16,
                paddingHorizontal: 16,
                fontSize: 18,
              }}
            />
          )}
          <FlatList
            data={spentList}
            nestedScrollEnabled={true}
            keyExtractor={(item) => item?.category.id}
            renderItem={({ item }) => (
              <>
                {componentLoading && (
                  <View
                    style={{
                      height: 345,
                      backgroundColor:
                        appSettings.theme.style.colors.background,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Loading />
                  </View>
                )}
                {spentList.length && !componentLoading && (
                  <TransactionListItem
                    onPress={() => {}}
                    categoryName={
                      item?.category.name[0].toUpperCase() +
                      item?.category.name.slice(1)
                    }
                    rightLabel={utils.GetFormattedNumber({
                      value: item?.totalSpent,
                      currency: appSettings.logbookSettings.defaultCurrency.name,
                    })}
                    iconLeftColor={
                      item?.category.icon.color === "default"
                        ? appSettings.theme.style.colors.primary
                        : item?.category.icon.color
                    }
                    iconLeftName={item?.category.icon.name}
                    // iconLeftColor={item?.category.icon.color}
                    currency={appSettings.logbookSettings.defaultCurrency}
                    transactionAmount={item?.totalSpent}
                  />
                )}
              </>
            )}
          />
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
