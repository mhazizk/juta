import { useEffect, useMemo, useState } from "react";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
  useGlobalCategories,
  useGlobalCurrencyRates,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import { TextPrimary, TextSecondary } from "../../../components/Text";
import * as utils from "../../../utils";
import CoinsImg from "../../../assets/img/coins.png";
import { CustomBarChart } from "../../../components/charts/CustomBarChart";
import { useIsFocused } from "@react-navigation/native";
import Loading from "../../../components/Loading";
import Animated from "react-native-reanimated";

const TotalExpenseWidget = ({
  enteringAnimation = null,
  cardHeight,
  onPress,
}) => {
  const { appSettings } = useGlobalAppSettings();
  const { sortedTransactions } = useGlobalSortedTransactions();
  const { budgets } = useGlobalBudgets();
  const { globalCurrencyRates } = useGlobalCurrencyRates();
  const { globalTheme } = useGlobalTheme();
  const { logbooks } = useGlobalLogbooks();
  const { categories } = useGlobalCategories();
  const [activeBudget, setActiveBudget] = useState({
    budget: null,
    spent: null,
    transactionList: [],
  });
  const [widgetLoading, setWidgetLoading] = useState(true);
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
  const isFocused = useIsFocused();

  const findTransactionsToPlot = () => {
    utils.findTransactionsToPlot({
      expenseOnly: true,
      groupSorted: sortedTransactions.groupSorted,
      appSettings,
      globalCurrencyRates,
      logbooks,
      categories,
      budgets,
      graph: graph,
      activeBudget: activeBudget,
      setGraph: (item) => {
        // console.log(JSON.stringify(item, null, 2));
        setGraph(item);
      },
      setActiveBudget: (item) => {
        // console.log(JSON.stringify(item, null, 2));
        setActiveBudget(item);
      },
      setShowGraph: (item) => {
        // console.log(JSON.stringify(item, null, 2));
        setShowGraph(item);
      },
    });

    setWidgetLoading(false);
  };

  const findTransactions = useMemo(() => {
    return () => {
      findTransactionsToPlot();
      setWidgetLoading(false);
    };
  }, [
    sortedTransactions,
    budgets,
    graph.rangeDay,
    activeBudget.spent,
    globalCurrencyRates,
    appSettings,
  ]);

  useEffect(() => {
    setTimeout(() => {
      findTransactionsToPlot();
    }, 1);
  }, []);

  useEffect(() => {
    if (isFocused) {
      setShowGraph(false);
      setWidgetLoading(true);
      setTimeout(() => {
        findTransactionsToPlot();
      }, 1);
    }
  }, [isFocused]);

  useEffect(() => {
    // if (widgetLoading) {
    //   setTimeout(() => {
    //     setWidgetLoading(false);
    //   }, 1);
    // }
  }, [widgetLoading]);

  return (
    <>
      {widgetLoading && (
        <Animated.View
          entering={enteringAnimation}
          style={{
            // flex: 1,
            height: cardHeight,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: globalTheme.colors.secondary,
            marginBottom: 16,
            borderRadius: 16,
          }}
        >
          <Loading />
        </Animated.View>
      )}
      {!widgetLoading && (
        <TouchableOpacity
          onPress={() => onPress()}
          style={{
            shadowColor: globalTheme.widgets.totalExpense.cardBackgroundColor,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 16,
            elevation: 5,
            paddingBottom: 16,
            width: "100%",
          }}
        >
          <Animated.View
            entering={enteringAnimation}
            style={{
              backgroundColor:
                globalTheme.widgets.totalExpense.cardBackgroundColor,
              borderRadius: 16,
              height: cardHeight,
              // width: "100%",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {/* // TAG : No Expense */}
            {!showGraph && (
              <>
                <View
                  style={{
                    height: "100%",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                  }}
                >
                  <TextPrimary
                    style={{
                      zIndex: 1,
                      color: globalTheme.widgets.totalExpense.cardTextColor,
                      alignSelf: "flex-start",
                      justifyContent: "flex-end",
                      paddingLeft: 16,
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                    label="No expenses"
                  />
                  <TextPrimary
                    style={{
                      zIndex: 1,
                      color: globalTheme.widgets.totalExpense.cardTextColor,
                      alignSelf: "flex-start",
                      paddingLeft: 16,
                      fontSize: 20,
                    }}
                    label="in last 7 days"
                  />
                </View>
                <Image
                  source={CoinsImg}
                  style={{
                    position: "absolute",
                    // top: 0,
                    right: -50,
                    bottom: -50,
                    // left: 0,
                    zIndex: 0,
                    width: 250,
                    height: 250,
                    opacity: 0.5,
                    resizeMode: "contain",
                  }}
                />
              </>
            )}

            {/* // TAG : Expense */}
            {showGraph && (
              <>
                <View
                  style={{
                    height: "100%",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                  }}
                >
                  <TextPrimary
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: globalTheme.widgets.totalExpense.cardTextColor,
                      paddingBottom: 4,
                    }}
                    label="Total expense this week"
                  />
                  <View>
                    {/* // TAG : Main currency */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <TextSecondary
                        label={
                          appSettings.logbookSettings.defaultCurrency.symbol
                        }
                        style={{
                          fontSize: 24,
                          paddingRight: 4,
                          color: globalTheme.widgets.totalExpense.cardTextColor,
                        }}
                      />
                      <TextPrimary
                        style={{
                          fontSize: 32,
                          fontWeight: "bold",
                          color: globalTheme.widgets.totalExpense.cardTextColor,
                        }}
                        label={utils.getFormattedNumber({
                          value: activeBudget.spent,
                          currencyIsoCode:
                            appSettings.logbookSettings.defaultCurrency.isoCode,
                          negativeSymbol:
                            appSettings.logbookSettings.negativeCurrencySymbol,
                        })}
                      />
                    </View>
                    {/* // TAG : Secondary currency */}
                    {appSettings.logbookSettings.showSecondaryCurrency && (
                      <View
                        style={{
                          // width: "100%",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: appSettings.logbookSettings
                            .showSecondaryCurrency
                            ? "flex-end"
                            : "center",
                        }}
                      >
                        <TextSecondary
                          label={
                            appSettings.logbookSettings.secondaryCurrency.symbol
                          }
                          style={{
                            paddingRight: 4,
                            color:
                              globalTheme.widgets.totalExpense.cardTextColor,
                          }}
                        />
                        <TextPrimary
                          style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            color:
                              globalTheme.widgets.totalExpense.cardTextColor,
                          }}
                          label={utils.getFormattedNumber({
                            value: utils.convertCurrency({
                              amount: activeBudget.spent,
                              from: appSettings.logbookSettings.defaultCurrency
                                .name,
                              target:
                                appSettings.logbookSettings.secondaryCurrency
                                  .name,
                              globalCurrencyRates: globalCurrencyRates,
                            }),
                            currencyIsoCode:
                              appSettings.logbookSettings.secondaryCurrency
                                .isoCode,
                            negativeSymbol:
                              appSettings.logbookSettings
                                .negativeCurrencySymbol,
                          })}
                        />
                      </View>
                    )}
                  </View>
                </View>

                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    zIndex: 0,
                  }}
                >
                  <CustomBarChart
                    //   Graph Data
                    mainGraph={graph?.graphData?.mainGraph}
                    shadowGraph={graph?.graphData?.shadowGraph}
                    limitLine={
                      graph?.graphData?.limitLine?.length > 0
                        ? graph?.graphData?.limitLine
                        : null
                    }
                    symbol={appSettings.logbookSettings.defaultCurrency.symbol}
                    rangeDay={graph?.rangeDay}
                    //  Graph Style
                    successColor={
                      globalTheme.widgets.totalExpense.cardIconColor
                    }
                    primaryColor={utils.hexToRgb({
                      hex: globalTheme.widgets.totalExpense.cardIconColor,
                      opacity: 0.1,
                    })}
                    overBudgetBarColor={
                      globalTheme.widgets.totalExpense.cardIconColor
                    }
                    warnBudgetBarColor={
                      globalTheme.widgets.totalExpense.cardIconColor
                    }
                    shadowBarColor={utils.hexToRgb({
                      hex: globalTheme.widgets.totalExpense.cardIconColor,
                      opacity: 0,
                    })}
                    width={Dimensions.get("window").width - 32}
                    height={cardHeight - 32}
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
                </View>
              </>
            )}
          </Animated.View>
        </TouchableOpacity>
      )}
    </>
  );
};

export default TotalExpenseWidget;
