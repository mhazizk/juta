import { useIsFocused } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, FlatList, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { ButtonSwitch } from "../../components/Button";
import { CustomBarChart } from "../../components/charts/CustomBarChart";
import { TransactionListItem } from "../../components/List";
import TransactionListSection from "../../components/List/TransactionListSection";
import Loading from "../../components/Loading";
import { TextPrimary, TextSecondary } from "../../components/Text";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
  useGlobalCategories,
  useGlobalCurrencyRates,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTheme,
} from "../../reducers/GlobalContext";
import * as utils from "../../utils";

const AnalyticsScreen = () => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { globalCurrencyRates } = useGlobalCurrencyRates();
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
  const [showGraph, setShowGraph] = useState(false);

  const [graph, setGraph] = useState({
    // status: "empty",
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

  // const findTransactions = useMemo(() => {
  //   return () => {
  //     utils.FindTransactionsToPlot({
  //       expenseOnly: true,
  //       appSettings: appSettings,
  //       groupSorted: sortedTransactions?.groupSorted,
  //       logbooks: logbooks,
  //       categories: categories,
  //       budgets: budgets,
  //       graph: graph,
  //       activeBudget: activeBudget,
  //       setGraph: (item) => setGraph(item),
  //       setActiveBudget: (item) => setActiveBudget(item),
  //     });
  //     setScreenLoading(false);
  //     // setComponentLoading(false);
  //   };
  // }, [graph, budgets, activeBudget]);
  const findTransactions = () => {
    utils.findTransactionsToPlot({
      expenseOnly: true,
      groupSorted: sortedTransactions?.groupSorted,
      appSettings,
      logbooks,
      categories,
      globalCurrencyRates,
      budgets,
      graph,
      activeBudget,
      setGraph: (item) => setGraph(item),
      setActiveBudget: (item) => setActiveBudget(item),
      setShowGraph: (item) => setShowGraph(item),
    });
    setScreenLoading(false);
    // setComponentLoading(false);
  };
  const categorizeSpentList = () => {
    utils.getSpentList({
      expenseOnly: true,
      groupSorted: sortedTransactions.groupSorted,
      logbooks: logbooks.logbooks,
      globalCurrencyRates,
      targetCurrencyName: appSettings.logbookSettings.defaultCurrency.name,
      categories: categories.categories,
      rangeDay: graph?.rangeDay,
      setSpentList: (item) => setSpentList(item),
    });
    setScreenLoading(false);
    setComponentLoading(false);
  };

  useEffect(() => {
    let isUnmounted = false;

    // if (!loading) {
    //   findTransactions();
    //   setTimeout(() => {
    //   }, 10);
    // }
    // console.log("Mounted");
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
  }, [screenLoading]);

  useEffect(() => {
    setTimeout(() => {
      findTransactions();
      categorizeSpentList();
    }, 1);
  }, [componentLoading]);

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
    setShowGraph(false);
    if (!showGraph) {
      setTimeout(() => {
        findTransactions();
        categorizeSpentList();
      }, 1);
    }
  }, [graph?.rangeDay]);

  useEffect(() => {
    console.log({ graph });
  }, [graph]);

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
            backgroundColor: globalTheme.colors.background,
            height: "100%",
          }}
        >
          {componentLoading && (
            <View
              style={{
                height: 345,
                backgroundColor: globalTheme.colors.background,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Loading />
            </View>
          )}

          {activeBudget?.spent && (
            <>
              {!componentLoading && showGraph && (
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
                        label={
                          appSettings.logbookSettings.defaultCurrency.symbol
                        }
                        style={{
                          fontSize: 24,
                          paddingRight: 8,
                        }}
                      />
                      <TextPrimary
                        style={{ fontSize: 36, fontWeight: "bold" }}
                        label={utils.getFormattedNumber({
                          value: activeBudget?.spent,
                          currencyIsoCode:
                            appSettings.logbookSettings.defaultCurrency.isoCode,
                          negativeSymbol:
                            appSettings.logbookSettings.negativeCurrencySymbol,
                        })}
                      />
                    </View>
                    <TextSecondary
                      label={`Total expense in the last ${graph?.rangeDay} days`}
                      style={{ paddingRight: 8 }}
                    />
                  </View>
                  <CustomBarChart
                    //   Graph Data
                    mainGraph={showGraph ? graph?.graphData.mainGraph : null}
                    shadowGraph={
                      showGraph ? graph?.graphData.shadowGraph : null
                    }
                    limitLine={
                      showGraph && graph?.graphData.limitLine.length
                        ? graph?.graphData.limitLine
                        : null
                    }
                    symbol={appSettings.logbookSettings.defaultCurrency.symbol}
                    rangeDay={graph?.rangeDay}
                    //  Graph Style
                    successColor={globalTheme.colors.success}
                    primaryColor={globalTheme.colors.foreground}
                    overBudgetBarColor={globalTheme.colors.danger}
                    warnBudgetBarColor={globalTheme.colors.warn}
                    shadowBarColor={utils.hexToRgb({
                      hex: globalTheme.colors.secondary,
                      opacity: 0.5,
                    })}
                    width={Dimensions.get("window").width}
                    height={220}
                    showAxisLabels
                    textColor={globalTheme.text.textSecondary.color}
                    barRadius={8}
                    barWidth={
                      graph?.rangeDay === 7
                        ? 28
                        : graph?.rangeDay === 30
                        ? 8
                        : 16
                    }
                  />
                </>
              )}

              {/* // TAG : Range selector */}
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
                    if (componentLoading) {
                      return;
                    }
                    if (graph?.rangeDay !== 7) {
                      setShowGraph(false);
                      setGraph({ ...graph, rangeDay: 7 });
                    }
                  }}
                  condition={graph?.rangeDay === 7}
                  label="Last week"
                />
                <ButtonSwitch
                  onPress={() => {
                    if (componentLoading) {
                      return;
                    }

                    if (graph?.rangeDay !== 30) {
                      setShowGraph(false);
                      setGraph({ ...graph, rangeDay: 30 });
                    }
                  }}
                  condition={graph?.rangeDay === 30}
                  label="Last month"
                />
                <ButtonSwitch
                  onPress={() => {
                    if (componentLoading) {
                      return;
                    }

                    if (graph?.rangeDay !== 365) {
                      setShowGraph(false);
                      setGraph({ ...graph, rangeDay: 365 });
                    }
                  }}
                  condition={graph?.rangeDay === 365}
                  label="Last year"
                />
              </View>
            </>
          )}

          {/* // TODO add average spent amount  */}
          {showGraph && (
            <TextPrimary
              label="Expense by category"
              style={{
                paddingVertical: 16,
                paddingHorizontal: 32,
                fontSize: 18,
              }}
            />
          )}
          {componentLoading && (
            <View
              style={{
                height: (Dimensions.get("window").height - 220) / 2,
                // flex: 1,
                backgroundColor: globalTheme.colors.background,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Loading />
            </View>
          )}
          <FlatList
            data={spentList}
            nestedScrollEnabled={true}
            keyExtractor={(item) => item?.category.id}
            contentContainerStyle={{
              paddingBottom: 16,
              paddingHorizontal: 16,
              alignItems: "center",
            }}
            renderItem={({ item, index }) => (
              <>
                <TransactionListSection
                  isFirstItem={index === 0}
                  isLastItem={index === spentList.length - 1}
                >
                  {spentList.length && !componentLoading && (
                    <TransactionListItem
                      onPress={() => {}}
                      categoryName={
                        item?.category.name[0].toUpperCase() +
                        item?.category.name.slice(1)
                      }
                      rightLabel={utils.getFormattedNumber({
                        value: item?.totalSpent,
                        currencyIsoCode:
                          appSettings.logbookSettings.defaultCurrency.isoCode,
                        negativeSymbol:
                          appSettings.logbookSettings.negativeCurrencySymbol,
                      })}
                      iconLeftColor={
                        item?.category.icon.color === "default"
                          ? globalTheme.colors.primary
                          : item?.category.icon.color
                      }
                      iconLeftName={item?.category.icon.name}
                      // iconLeftColor={item?.category.icon.color}
                      logbookCurrency={
                        appSettings.logbookSettings.defaultCurrency
                      }
                      transactionAmount={item?.totalSpent}
                    />
                  )}
                </TransactionListSection>
              </>
            )}
          />
          {!showGraph && (
            <View
              style={{
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IonIcons
                name="analytics"
                color={globalTheme.colors.secondary}
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
            flex: 1,
            backgroundColor: globalTheme.colors.background,
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
