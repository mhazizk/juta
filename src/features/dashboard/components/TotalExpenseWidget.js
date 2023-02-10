import { useEffect, useMemo, useState } from "react";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
  useGlobalCategories,
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

const TotalExpenseWidget = ({
  // graph,
  // showGraph,
  // activeBudget,
  cardHeight,
  onPress,
}) => {
  const { appSettings } = useGlobalAppSettings();
  const { sortedTransactions } = useGlobalSortedTransactions();
  const { budgets } = useGlobalBudgets();
  const { globalCurrencyRates } = useGlobalAppSettings();
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

  const findTransactions = useMemo(() => {
    return () => {
      // console.log("findTransactions");
      utils.FindTransactionsToPlot({
        expenseOnly: true,
        groupSorted: sortedTransactions.groupSorted,
        appSettings,
        logbooks,
        categories,
        budgets,
        graph: graph,
        activeBudget: activeBudget,
        setGraph: (item) => {
          // TODO : try run in device and see the logs
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
    // }, [sortedTransactions, budgets, graph, activeBudget]);
  }, [sortedTransactions, budgets, graph, activeBudget]);
  useEffect(() => {
    findTransactions();
  }, []);

  useEffect(() => {
    if (isFocused) {
      setShowGraph(false);
      setWidgetLoading(true);
      setTimeout(() => {
        findTransactions();
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
        <View
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
        </View>
      )}
      {!widgetLoading && (
        <TouchableOpacity
          onPress={() => onPress()}
          style={{
            shadowColor: globalTheme.colors.foreground,
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
          <View
            style={{
              backgroundColor: globalTheme.colors.cardBackground,
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
                      color: globalTheme.colors.cardText,
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
                      color: globalTheme.colors.cardText,
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
                      fontStyle: "bold",
                      color: globalTheme.colors.cardText,
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
                          paddingRight: 4,
                          color: globalTheme.colors.cardText,
                        }}
                      />
                      <TextPrimary
                        style={{
                          fontSize: 32,
                          fontWeight: "bold",
                          color: globalTheme.colors.cardText,
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
                          color: globalTheme.colors.cardText,
                        }}
                      />
                      <TextPrimary
                        style={{
                          fontSize: 24,
                          fontWeight: "bold",
                          color: globalTheme.colors.cardText,
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
                            appSettings.logbookSettings.secondaryCurrency.isoCode,
                          negativeSymbol:
                            appSettings.logbookSettings.negativeCurrencySymbol,
                        })}
                      />
                    </View>
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
                  {/* <CustomBarChart
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
                    successColor={globalTheme.colors.success}
                    primaryColor={utils.HexToRgb({
                      hex: globalTheme.colors.cardText,
                      opacity: 0.1,
                    })}
                    overBudgetBarColor={globalTheme.colors.danger}
                    warnBudgetBarColor={globalTheme.colors.warn}
                    shadowBarColor={utils.HexToRgb({
                      hex: globalTheme.colors.success,
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
                  /> */}
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

export default TotalExpenseWidget;
