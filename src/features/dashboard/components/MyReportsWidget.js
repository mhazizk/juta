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

const MyReportsWidget = ({
  // graph,
  // showGraph,
  // activeBudget,
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
          <View
            style={{
              backgroundColor:
                globalTheme.widgets.totalExpense.cardBackgroundColor,
              borderRadius: 16,
              height: cardHeight,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <TextPrimary label="My Reports" />
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

export default MyReportsWidget;
