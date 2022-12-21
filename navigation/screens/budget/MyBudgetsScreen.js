import { useEffect, useState } from "react";
import { Dimensions, FlatList, TouchableOpacity, View } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { TextPrimary, TextSecondary } from "../../../components/Text";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
  useGlobalSortedTransactions,
} from "../../../modules/GlobalContext";
import IonIcons from "react-native-vector-icons/Ionicons";
import { ProgressChart } from "react-native-chart-kit";
import RecentTransactions from "../../../components/RecentTransactions";
import { useIsFocused } from "@react-navigation/native";
import { ActiveBudget } from "../../../components/ActiveBudget";

const MyBudgetsScreen = ({ route, navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { budgets, dispatchBudgets } = useGlobalBudgets();
  const [activeBudget, setActiveBudget] = useState({
    budget: null,
    spent: null,
    transactionList: [],
  });
  const [inactiveBudgets, setInactiveBudgets] = useState([]);
  const isFocus = useIsFocused();

  useEffect(() => {
    findActiveBudget();
    findInactiveBudget();
  }, []);

  useEffect(() => {
    if (isFocus) {
      findActiveBudget();
      findInactiveBudget();
    }
  }, [budgets, isFocus]);

  useEffect(() => {
    findActiveBudget();
    findInactiveBudget();
  }, [sortedTransactions.groupSorted]);

  useEffect(() => {
    console.log(activeBudget);
  }, [activeBudget]);

  // ! Function Section
  const findActiveBudget = () => {
    let spentList = [];
    let transactionList = [];
    let spent = 0;

    if (budgets.budgets.length) {
      const activeBudget = budgets.budgets.find(
        (budget) => Date.now() <= budget.finish_date
      );
      console.log(activeBudget);
      const startDate = activeBudget.start_date;
      const finishDate = activeBudget.finish_date;

      // Find all transactions that are within the active budget
      if (sortedTransactions.groupSorted.length) {
        sortedTransactions.groupSorted.forEach((logbook) =>
          logbook.transactions.forEach((section) =>
            section.data.forEach((transaction) => {
              if (
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

  const findInactiveBudget = () => {
    if (budgets.budgets.length) {
      const inactiveBudget = budgets.budgets.filter(
        (budget) => Date.now() > budget.finish_date
      );
      return setInactiveBudgets(inactiveBudget);
    }
  };

  return (
    <>
      <View
        style={{
          height: "100%",
          backgroundColor: appSettings.theme.style.colors.background,
        }}
      >
        {/* Active Budget */}
        {activeBudget.budget && (
          <>
            <ActiveBudget
              // Card Props
              onPress={() => {
                navigation.navigate("Edit Budget Screen", {
                  budget: activeBudget.budget,
                });
              }}
              title={activeBudget.budget.budget_name}
              iconPack="FontAwesome5"
              iconLeftName="piggy-bank"
              rightLabel="Edit"
              repeat={activeBudget.budget.repeat}
              // Limit Props
              limit={activeBudget.budget.limit}
              // spent={activeBudget.spent}
              spent={activeBudget.spent}
              // Transactions Props
              transactionList={activeBudget.transactionList}
              // Chart Props
              width={Dimensions.get("window").width - 32}
              startDate={activeBudget.budget.start_date}
              finishDate={activeBudget.budget.finish_date}
              data={{
                labels: ["Active"],
                // data: [activeBudget.spent / activeBudget.budget.limit],
                data: [
                  (activeBudget.spent > activeBudget.budget.limit
                    ? activeBudget.budget.limit
                    : activeBudget.spent) / activeBudget.budget.limit,
                ],
              }}
            />
            <RecentTransactions
              title="Transactions in Range"
              startDate={activeBudget.budget?.start_date || null}
              finishDate={activeBudget.budget?.finish_date || null}
              onPress={({ transaction, selectedLogbook }) => {
                navigation.navigate("Transaction Preview Screen", {
                  transaction: transaction,
                  selectedLogbook: selectedLogbook,
                });
              }}
            />
          </>
        )}
        {/* )} */}

        {/* Previous Budget */}
        {/* <FlatList
          data={inactiveBudgets}
          keyExtractor={(item) => item.budget_id}
          renderItem={({ item }) => (
            <>
              {inactiveBudgets.length && (
                <CardList
                  title={item.budget_name}
                  iconPack="FontAwesome5"
                  limit={item.limit}
                  spent={2_000_000}
                  // daysLeft={item.days_left}
                  iconLeftName="piggy-bank"
                  startDate={item.start_date}
                  finishDate={item.finish_date}
                />
              )}
            </>
          )}
        /> */}
        {!budgets.budgets.length && (
          <TouchableOpacity
            onPress={() => navigation.navigate("New Budget Screen")}
          >
            <View
              style={{
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesome5Icon
                name="piggy-bank"
                color={appSettings.theme.style.colors.secondary}
                size={48}
                style={{
                  transform: [{ scaleX: -1 }],
                  paddingBottom: 16,
                }}
              />
              <TextSecondary
                label={`You don't have budget planning yet.\n Start creating one`}
                style={{ textAlign: "center" }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 16,
                }}
              >
                <IonIcons
                  name="add"
                  size={18}
                  color={appSettings.theme.style.colors.foreground}
                />
                <TextPrimary label="Create New Budget" />
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default MyBudgetsScreen;
