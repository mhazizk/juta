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
import CustomPieChart from "../../reports/components/CustomPieChart";
import getReportSectionProps from "../../reports/model/getReportSectionProps";
import IncomeExpenseDeviation from "../../reports/components/IncomeExpenseDeviation";
import Animated, { BounceIn, PinwheelIn } from "react-native-reanimated";
import BUDGET_SETTINGS_CONSTANTS from "../../../constants/budgetSettingsConstants";

const MyReportsWidget = ({ enteringAnimation = null, cardHeight, onPress }) => {
  const { appSettings } = useGlobalAppSettings();
  const { sortedTransactions } = useGlobalSortedTransactions();
  const { budgets } = useGlobalBudgets();
  const { globalCurrencyRates } = useGlobalCurrencyRates();
  const { globalTheme } = useGlobalTheme();
  const { logbooks } = useGlobalLogbooks();
  const { categories } = useGlobalCategories();
  const [widgetLoading, setWidgetLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const isFocused = useIsFocused();

  const thisMonthName = utils.upperCaseThisFirstLetter(
    BUDGET_SETTINGS_CONSTANTS.FIRST_MONTH_OF_THE_YEAR.OPTIONS.find(
      (month, index) => {
        if (index === new Date().getMonth()) return month;
      }
    )
  );

  const thisYear = new Date().getFullYear();

  useEffect(() => {
    setTimeout(() => {}, 1);
  }, []);

  useEffect(() => {
    if (isFocused) {
      setWidgetLoading(true);
      setTimeout(() => {
        getTransactionListAndGraphData(getReportSectionProps("thisMonth"));
        setWidgetLoading(false);
      }, 1);
    }
  }, [isFocused]);

  useEffect(() => {}, [widgetLoading]);

  useEffect(() => {
    if (sections.length > 0) {
      setTimeout(() => {
        setWidgetLoading(false);
      }, 1);
    }
  }, [sections]);

  const isIncomeOrExpenseDataAvailable =
    sections[0]?.data?.totalIncome > 0 || sections[0]?.data?.totalExpense > 0;

  const getTransactionListAndGraphData = (sections) => {
    if (sections.length > 0) {
      const newSections = [];
      sections.forEach((section) => {
        const newData = {
          ...section.data,
        };
        utils.getTopCategoryListInRange({
          appSettings,
          globalCurrencyRates,
          logbooks: logbooks.logbooks,
          categories: categories.categories,
          groupSorted: sortedTransactions.groupSorted,
          transactionTypeToGet: "all",
          startDateInMillis: section.startDateInMillis,
          endDateInMillis: section.endDateInMillis,
          callback: ({
            allCategoryList,
            expenseCategoryList,
            incomeCategoryList,
          }) => {
            const totalIncome = incomeCategoryList.reduce((total, category) => {
              return total + category.totalAmount;
            }, 0);
            const totalExpense = expenseCategoryList.reduce(
              (total, category) => {
                return total + category.totalAmount;
              },
              0
            );

            newData.expenseCategoryList = expenseCategoryList;
            newData.incomeCategoryList = incomeCategoryList;
            newData.totalIncome = totalIncome;
            newData.totalExpense = totalExpense;
            newData.incomeGraph = incomeCategoryList.map((item) => {
              return {
                x: item.category.name,
                y: item.totalAmount,
                iconPack: item.category.icon.pack,
                iconName: item.category.icon.name,
                categoryName: item.category.name,
              };
            });
            newData.expenseGraph = expenseCategoryList.map((item) => {
              return {
                x: item.category.name,
                y: item.totalAmount,
                iconPack: item.category.icon.pack,
                iconName: item.category.icon.name,
                categoryName: item.category.name,
              };
            });
          },
        });
        newSections.push({
          ...section,
          data: newData,
        });
      });
      return setSections(newSections);
    }
  };

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
        <>
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
              height: "100%",
              zIndex: 1,
            }}
          >
            <Animated.View
              entering={enteringAnimation}
              style={{
                // backgroundColor:
                //   globalTheme.widgets.totalExpense.cardBackgroundColor,
                borderRadius: 16,
                width: "100%",
                height: cardHeight,
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  justifyContent: "center",
                  width: "50%",
                  top: 0,
                  bottom: 0,
                  right: 0,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 16,
                  }}
                >
                  {!isIncomeOrExpenseDataAvailable && (
                    <TextPrimary
                      label="My Reports"
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                        padding: 16,
                        color: globalTheme.widgets.totalExpense.cardTextColor,
                      }}
                    />
                  )}
                  {isIncomeOrExpenseDataAvailable && (
                    <>
                      <TextPrimary
                        label={`${thisMonthName} ${thisYear}`}
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          textAlign: "center",
                          padding: 8,
                          color: globalTheme.widgets.totalExpense.cardTextColor,
                        }}
                      />
                      <IncomeExpenseDeviation
                        useWidgetStyle={true}
                        backgroundColor={
                          globalTheme.widgets.totalExpense.cardTextColor
                        }
                        totalExpense={sections[0]?.data.totalExpense}
                        totalIncome={sections[0]?.data.totalIncome}
                        defaultTextColor={
                          globalTheme.widgets.totalExpense.cardTextColor
                        }
                      />
                    </>
                  )}
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>

          <Animated.View
            entering={enteringAnimation}
            style={{
              backgroundColor:
                globalTheme.widgets.totalExpense.cardBackgroundColor,
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              height: "100%",
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <CustomPieChart
              useDarkGraphColorShades={globalTheme.identifier.id.includes(
                "cream"
              )}
              mode="expense"
              graphHeightAndWidth={Dimensions.get("window").width * 0.18}
              enteringAnimation={PinwheelIn.duration(1000)}
              animateGraph={true}
              adjustLeft={-82}
              data={sections[0]?.data.expenseGraph}
              zIndex={3}
              iconColor={globalTheme.widgets.totalExpense.cardIconColor}
            />
          </Animated.View>
        </>
      )}
    </>
  );
};

export default MyReportsWidget;
