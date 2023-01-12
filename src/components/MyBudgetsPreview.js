import { useEffect, useState } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
  useGlobalSortedTransactions,
} from "../reducers/GlobalContext";
import { RoundProgressBar } from "./charts/RoundProgressBar";
import { TextButtonPrimary, TextPrimary } from "./Text";

export const MyBudgetsPreview = ({
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
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
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
                ? appSettings.theme.style.colors.danger
                : activeBudget.spent / activeBudget.budget.limit >= 0.8
                ? appSettings.theme.style.colors.warn
                : appSettings.theme.style.colors.success
              : "#FFE088",
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
                color={
                  appSettings.theme.style.button.buttonPrimary.textStyle.color
                }
                style={{ paddingRight: 8 }}
              />
            )}

            <TextPrimary
              label="My Budget"
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: appSettings.theme.style.colors.black,
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
                  fontColor={appSettings.theme.style.colors.background}
                  radius={32}
                  strokeWidth={10}
                  width={74}
                  height={74}
                  color={appSettings.theme.style.colors.background}
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
                    <TextButtonPrimary
                      label="On Track"
                      style={{ fontSize: 14, fontWeight: "bold" }}
                    />
                  )}
                  {activeBudget.spent / activeBudget.budget.limit > 0.8 &&
                    activeBudget.spent / activeBudget.budget.limit < 1 && (
                      <TextButtonPrimary
                        label="Almost There"
                        style={{ fontSize: 14, fontWeight: "bold" }}
                      />
                    )}
                  {activeBudget.spent / activeBudget.budget.limit > 1 && (
                    <TextButtonPrimary
                      label="Over budget"
                      style={{ fontSize: 14, fontWeight: "bold" }}
                    />
                  )}

                  <View
                    style={{
                      marginVertical: 4,
                      height: 1,
                      width: "100%",
                      backgroundColor:
                        appSettings.theme.style.button.buttonPrimary.textStyle
                          .color,
                    }}
                  />
                  <TextButtonPrimary
                    label={`${(
                      (activeBudget.spent / activeBudget.budget.limit) *
                      100
                    ).toFixed(0)}% spent`}
                    style={{ fontSize: 14 }}
                  />
                  {activeBudget.spent / activeBudget.budget.limit < 1 && (
                    <TextButtonPrimary
                      label={`${(
                        ((activeBudget.budget.limit - activeBudget.spent) /
                          activeBudget.budget.limit) *
                        100
                      ).toFixed(0)}% left`}
                      style={{ fontSize: 14 }}
                    />
                  )}
                </View>
              </View>
            </>
          )}
          {!activeBudget.budget && (
            <FontAwesome5Icon
              name="piggy-bank"
              color="#FFC727"
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
