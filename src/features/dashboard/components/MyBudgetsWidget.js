import { useEffect, useState } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
  useGlobalSortedTransactions,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import { TextButtonPrimary, TextPrimary } from "../../../components/Text";
import { RoundProgressBar } from "../../../components/charts/RoundProgressBar";

export const MyBudgetsWidget = ({
  label,
  props,
  onPress,
  boxColor,
  boxHeight,
  boxWidth,
  boxMarginLeft,
  boxMarginRight,
  boxMarginTop,
  boxMarginBottom,
  iconColor,
  iconName,
  textColor,
  isFocused,
}) => {
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { budgets, dispatchBudgets } = useGlobalBudgets();
  const [activeBudget, setActiveBudget] = useState({
    budget: null,
    spent: null,
    transactionList: [],
  });

  useEffect(() => {
    findActiveBudget();
  }, []);

  useEffect(() => {
    if (isFocused) {
      findActiveBudget();
    }
  }, [budgets, isFocused]);

  useEffect(() => {
    findActiveBudget();
  }, [sortedTransactions.groupSorted]);

  useEffect(() => {}, [activeBudget]);

  // TAG : Function Section
  const findActiveBudget = () => {
    let spentList = [];
    let transactionList = [];
    let spent = 0;

    if (budgets.budgets?.length) {
      const activeBudget = budgets.budgets.find(
        (budget) => Date.now() <= budget?.finish_date
      );
      const startDate = activeBudget?.start_date;
      const finishDate = activeBudget?.finish_date;

      // Find all transactions that are within the active budget
      if (sortedTransactions.groupSorted.length) {
        sortedTransactions.groupSorted.forEach((logbook) =>
          logbook.transactions.forEach((section) =>
            section.data.forEach((transaction) => {
              if (
                transaction.details.in_out === "expense" &&
                transaction.details.date >= startDate &&
                transaction.details.date <= finishDate
              ) {
                spentList.push(transaction.details.amount);
                transactionList.push(transaction);
              }
            })
          )
        );
      }

      spent = spentList.reduce((a, b) => a + b, 0);
      transactionList.sort((a, b) => b.details.date - a.details.date);
      return setActiveBudget({ budget: activeBudget, spent, transactionList });
    }
    return setActiveBudget({ budget: null, spent: null, transactionList: [] });
  };

  return (
    <>
      <TouchableOpacity onPress={() => onPress()}>
        <View
          style={{
            height: boxHeight || 150,
            width: boxWidth || 150,
            backgroundColor: activeBudget.budget
              ? activeBudget.spent / activeBudget.budget.limit >= 1
                ? globalTheme.colors.danger
                : activeBudget.spent / activeBudget.budget.limit >= 0.8
                ? globalTheme.colors.warn
                : globalTheme.colors.success
              : globalTheme.widgets.myBudgets.cardBackgroundColor,
            marginTop: boxMarginTop || 0,
            marginBottom: boxMarginBottom || 0,
            marginLeft: boxMarginLeft || 0,
            marginRight: boxMarginRight || 0,
            borderRadius: 16,
            alignItems: "flex-start",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
            }}
          >
            {activeBudget.spent / activeBudget?.budget?.limit > 0.8 && (
              <IonIcons
                name="warning"
                size={18}
                color={globalTheme.widgets.myBudgets.cardTextColor}
                style={{ paddingRight: 8 }}
              />
            )}

            <TextPrimary
              label="My Budgets"
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: globalTheme.widgets.myBudgets.cardTextColor,
              }}
            />
          </View>
          {activeBudget.budget && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 16,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <RoundProgressBar
                  // Styling
                  fontSize={24}
                  fontColor={globalTheme.widgets.myBudgets.cardTextColor}
                  radius={32}
                  strokeWidth={10}
                  width={74}
                  height={74}
                  color={globalTheme.widgets.myBudgets.cardTextColor}
                  // Data
                  spent={activeBudget.spent}
                  limit={activeBudget.budget.limit}
                  data={{
                    labels: ["Active"],
                    data: [
                      (activeBudget.spent > activeBudget.budget.limit
                        ? activeBudget.budget.limit
                        : activeBudget.spent) / activeBudget.budget.limit,
                    ],
                  }}
                />
                <View style={{ flex: 1, paddingLeft: 8 }}>
                  {activeBudget.spent / activeBudget.budget.limit <= 0.8 && (
                    <TextPrimary
                      label="On Track"
                      style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: globalTheme.widgets.myBudgets.cardTextColor,
                      }}
                    />
                  )}
                  {activeBudget.spent / activeBudget.budget.limit > 0.8 &&
                    activeBudget.spent / activeBudget.budget.limit < 1 && (
                      <TextPrimary
                        label="Almost There"
                        style={{
                          fontSize: 14,
                          fontWeight: "bold",
                          color: globalTheme.widgets.myBudgets.cardTextColor,
                        }}
                      />
                    )}
                  {activeBudget.spent / activeBudget.budget.limit >= 1 && (
                    <TextPrimary
                      label="Over budget"
                      style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: globalTheme.widgets.myBudgets.cardTextColor,
                      }}
                    />
                  )}

                  <View
                    style={{
                      marginVertical: 4,
                      height: 1,
                      width: "100%",
                      backgroundColor:
                        globalTheme.widgets.myBudgets.cardTextColor,
                    }}
                  />
                  <TextPrimary
                    label={`${(
                      (activeBudget.spent / activeBudget.budget.limit) *
                      100
                    ).toFixed(0)}% spent`}
                    style={{
                      fontSize: 14,
                      color: globalTheme.widgets.myBudgets.cardTextColor,
                    }}
                  />
                  {activeBudget.spent / activeBudget.budget.limit < 1 && (
                    <TextPrimary
                      label={`${(
                        ((activeBudget.budget.limit - activeBudget.spent) /
                          activeBudget.budget.limit) *
                        100
                      ).toFixed(0)}% left`}
                      style={{
                        fontSize: 14,
                        color: globalTheme.widgets.myBudgets.cardTextColor,
                      }}
                    />
                  )}
                </View>
              </View>
            </>
          )}
          {!activeBudget.budget && (
            <FontAwesome5Icon
              name="piggy-bank"
              color={globalTheme.widgets.myBudgets.cardIconColor}
              size={100}
              style={{
                transform: [{ rotate: "-0deg" }, { scaleX: -1 }],
                zIndex: -1,
                position: "absolute",
                bottom: -10,
                right: -10,
              }}
            />
          )}
        </View>
      </TouchableOpacity>
    </>
  );
};
