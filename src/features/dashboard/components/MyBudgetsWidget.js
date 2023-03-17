import { useEffect, useState } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
  useGlobalCurrencyRates,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import { TextButtonPrimary, TextPrimary } from "../../../components/Text";
import { RoundProgressBar } from "../../../components/charts/RoundProgressBar";
import * as utils from "../../../utils";
import TextTicker from "react-native-text-ticker";
import Animated from "react-native-reanimated";

// TODO : fix budget showing warning with cost to go, not cost to date
export const MyBudgetsWidget = ({
  enteringAnimation = null,
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
  const { budgets } = useGlobalBudgets();
  const { logbooks } = useGlobalLogbooks();
  const { globalCurrencyRates } = useGlobalCurrencyRates();
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

  useEffect(() => {
    // ShowMyBudgetContent();
  }, [activeBudget]);

  // TAG : Function Section
  const findActiveBudget = () => {
    let spentList = [];
    let transactionList = [];

    if (budgets.budgets?.length > 0) {
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

      const spent = utils.getTotalAmountAndConvertToDefaultCurrency({
        invertResult: true,
        transactions: transactionList,
        logbooks: logbooks.logbooks,
        globalCurrencyRates,
        targetCurrencyName: appSettings.logbookSettings.defaultCurrency.name,
      });
      transactionList.sort((a, b) => b.details.date - a.details.date);
      return setActiveBudget({ budget: activeBudget, spent, transactionList });
    }
    return setActiveBudget({ budget: null, spent: null, transactionList: [] });
  };

  return (
    <>
      <TouchableOpacity onPress={() => onPress()}>
        <Animated.View
          entering={enteringAnimation}
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
          <ShowMyBudgetContent activeBudget={activeBudget} />
        </Animated.View>
      </TouchableOpacity>
    </>
  );
};

const ShowMyBudgetContent = ({ activeBudget }) => {
  const { spent, budget } = activeBudget;
  const budgetRatio = spent / budget?.limit;
  switch (true) {
    case budgetRatio < 0.8:
      return <ShowOnTrack activeBudget={activeBudget} />;
    case budgetRatio >= 0.8 && budgetRatio < 1:
      return <ShowWarning activeBudget={activeBudget} />;
    case budgetRatio >= 1:
      return <ShowOverBudget activeBudget={activeBudget} />;
    case !activeBudget.budget:
      return <ShowNoBudget activeBudget={activeBudget} />;
  }
};

const ShowOnTrack = ({ activeBudget }) => {
  const { spent, budget } = activeBudget;
  const { globalTheme } = useGlobalTheme();
  const { appSettings } = useGlobalAppSettings();
  return (
    <>
      <View
        style={{
          alignItems: "flex-start",
          justifyContent: "flex-start",
          flex: 1,
          width: "100%",
          padding: 16,
        }}
      >
        <View
          style={{
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <RoundProgressBar
            // Styling
            showPercentage={false}
            fontSize={20}
            fontColor={globalTheme.widgets.myBudgets.cardTextColor}
            radius={26}
            strokeWidth={10}
            width={64}
            height={64}
            color={globalTheme.widgets.myBudgets.cardTextColor}
            // Data
            spent={spent}
            limit={budget?.limit}
            data={{
              labels: ["Active"],
              data: [
                (spent > budget?.limit ? budget?.limit : spent) / budget?.limit,
              ],
            }}
          />
        </View>
        <View
          style={{
            alignItems: "flex-start",
            width: "100%",
            height: "100%",
            paddingVertical: 8,
          }}
        >
          <TextPrimary
            label={`Budget\nOn Track`}
            style={{
              paddingBottom: 4,
              fontSize: 18,
              fontWeight: "bold",
              color: globalTheme.widgets.myBudgets.cardTextColor,
            }}
          />
          <TextTicker
            style={{
              alignItems: "flex-start",
              flex: 1,
              width: "100%",
            }}
            duration={3000}
            loop
            bounce
            repeatSpacer={50}
            marqueeDelay={1000}
            shouldAnimateTreshold={10}
          >
            <TextPrimary
              label={`Limit: ${
                appSettings.logbookSettings.defaultCurrency.symbol
              } ${utils.getFormattedNumber({
                value: utils.dailyLimit({
                  limit: budget?.limit,
                  spent: spent,
                  startDate: budget?.start_date,
                  finishDate: budget?.finish_date,
                }),
                negativeSymbol:
                  appSettings.logbookSettings.negativeCurrencySymbol,
                currencyCountryName:
                  appSettings.logbookSettings.defaultCurrency.name,
              })}/day`}
              style={{
                // flex: 1,
                textAlign: "center",
                fontSize: 16,
                fontWeight: "bold",
                color: globalTheme.widgets.myBudgets.cardTextColor,
              }}
            />
          </TextTicker>
        </View>
      </View>
      {/* <FontAwesome5Icon
        name="piggy-bank"
        color="#3ed7b1"
        size={100}
        style={{
          transform: [{ rotate: "-0deg" }, { scaleX: -1 }],
          zIndex: -1,
          position: "absolute",
          bottom: -0,
          right: -0,
        }}
      /> */}
    </>
  );
};

const ShowWarning = ({ activeBudget }) => {
  const { spent, budget } = activeBudget;
  const { globalTheme } = useGlobalTheme();
  const { appSettings } = useGlobalAppSettings();
  return (
    <>
      <View
        style={{
          alignItems: "flex-start",
          justifyContent: "flex-start",
          flex: 1,
          width: "100%",
          padding: 16,
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <RoundProgressBar
            // Styling
            showPercentage={false}
            fontSize={20}
            fontColor={globalTheme.widgets.myBudgets.cardTextColor}
            radius={26}
            strokeWidth={10}
            width={64}
            height={64}
            color={globalTheme.widgets.myBudgets.cardTextColor}
            // Data
            spent={spent}
            limit={budget?.limit}
            data={{
              labels: ["Active"],
              data: [
                (spent > budget?.limit ? budget?.limit : spent) / budget?.limit,
              ],
            }}
          />
          <IonIcons
            name="warning"
            size={28}
            color={globalTheme.widgets.myBudgets.cardTextColor}
            style={{
              position: "absolute",
              top: 16,
            }}
          />
        </View>
        <View
          style={{
            alignItems: "flex-start",
            width: "100%",
            height: "100%",
            paddingVertical: 8,
          }}
        >
          <TextPrimary
            label={`Budget\nWarning`}
            style={{
              paddingBottom: 4,
              fontSize: 18,
              fontWeight: "bold",
              color: globalTheme.widgets.myBudgets.cardTextColor,
            }}
          />
          <TextTicker
            style={{
              alignItems: "flex-start",
              flex: 1,
            }}
            duration={3000}
            loop
            bounce
            repeatSpacer={50}
            marqueeDelay={1000}
            shouldAnimateTreshold={10}
          >
            <TextPrimary
              label={`Limit: ${
                appSettings.logbookSettings.defaultCurrency.symbol
              } ${utils.getFormattedNumber({
                value: utils.dailyLimit({
                  limit: budget?.limit,
                  spent: spent,
                  startDate: budget?.start_date,
                  finishDate: budget?.finish_date,
                }),
                negativeSymbol:
                  appSettings.logbookSettings.negativeCurrencySymbol,
                currencyCountryName:
                  appSettings.logbookSettings.defaultCurrency.name,
              })}/day`}
              style={{
                // flex: 1,
                textAlign: "center",
                fontSize: 16,
                fontWeight: "bold",
                color: globalTheme.widgets.myBudgets.cardTextColor,
              }}
            />
          </TextTicker>
        </View>
      </View>
      <FontAwesome5Icon
        name="piggy-bank"
        color="#f6b148"
        size={100}
        style={{
          transform: [{ rotate: "-0deg" }, { scaleX: -1 }],
          zIndex: -1,
          position: "absolute",
          bottom: -0,
          right: -0,
        }}
      />
    </>
  );
};

const ShowOverBudget = ({ activeBudget }) => {
  const { spent, budget } = activeBudget;
  const { globalTheme } = useGlobalTheme();
  const { appSettings } = useGlobalAppSettings();
  return (
    <>
      <View
        style={{
          width: "100%",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          flex: 1,
          padding: 16,
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <RoundProgressBar
            // Styling
            showPercentage={false}
            fontSize={20}
            fontColor={globalTheme.widgets.myBudgets.cardTextColor}
            radius={26}
            strokeWidth={10}
            width={64}
            height={64}
            color={globalTheme.widgets.myBudgets.cardTextColor}
            // Data
            spent={spent}
            limit={budget?.limit}
            data={{
              labels: ["Active"],
              data: [
                (spent > budget?.limit ? budget?.limit : spent) / budget?.limit,
              ],
            }}
          />
          <IonIcons
            name="warning"
            size={28}
            color={globalTheme.widgets.myBudgets.cardTextColor}
            style={{
              position: "absolute",
              top: 16,
            }}
          />
        </View>
        <View
          style={{
            alignItems: "flex-start",
            width: "100%",
            height: "100%",
            paddingVertical: 8,
          }}
        >
          <TextPrimary
            label={`Over\nBudget`}
            style={{
              paddingBottom: 4,
              fontSize: 18,
              fontWeight: "bold",
              color: globalTheme.widgets.myBudgets.cardTextColor,
            }}
          />
          <TextTicker
            style={{
              alignItems: "flex-start",
              flex: 1,
            }}
            duration={3000}
            loop
            bounce
            repeatSpacer={50}
            marqueeDelay={1000}
            shouldAnimateTreshold={10}
          >
            <TextPrimary
              label={`Limit: ${
                appSettings.logbookSettings.defaultCurrency.symbol
              } ${utils.getFormattedNumber({
                value: utils.dailyLimit({
                  limit: budget?.limit,
                  spent: spent,
                  startDate: budget?.start_date,
                  finishDate: budget?.finish_date,
                }),
                negativeSymbol:
                  appSettings.logbookSettings.negativeCurrencySymbol,
                currencyCountryName:
                  appSettings.logbookSettings.defaultCurrency.name,
              })}/day`}
              style={{
                // flex: 1,
                textAlign: "center",
                fontSize: 16,
                fontWeight: "bold",
                color: globalTheme.widgets.myBudgets.cardTextColor,
              }}
            />
          </TextTicker>
        </View>
      </View>
      <FontAwesome5Icon
        name="piggy-bank"
        color="#dc5690"
        size={100}
        style={{
          transform: [{ rotate: "-0deg" }, { scaleX: -1 }],
          zIndex: -1,
          position: "absolute",
          bottom: -0,
          right: -0,
        }}
      />
    </>
  );
};

const ShowNoBudget = () => {
  const { globalTheme } = useGlobalTheme();
  const { appSettings } = useGlobalAppSettings();

  return (
    <>
      <View
        style={{
          alignItems: "flex-start",
          justifyContent: "flex-start",
          flex: 1,
          padding: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <TextPrimary
            label="My Budgets"
            style={{
              paddingBottom: 4,
              fontSize: 18,
              fontWeight: "bold",
              color: globalTheme.widgets.myBudgets.cardTextColor,
            }}
          />
        </View>
      </View>
      <FontAwesome5Icon
        name="piggy-bank"
        color={utils.hexToRgb({
          hex: globalTheme.widgets.myBudgets.cardTextColor,
          opacity: 0.3,
        })}
        size={100}
        style={{
          transform: [{ rotate: "-0deg" }, { scaleX: -1 }],
          zIndex: -1,
          position: "absolute",
          bottom: -0,
          right: -0,
        }}
      />
    </>
  );
};
