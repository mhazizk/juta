import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ListItem, SearchResultListItem, TransactionListItem } from "./List";
import { TextPrimary, TextSecondary } from "./Text";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
} from "../modules/GlobalContext";

const RecentTransactions = ({
  route,
  navigation,
  onPress,
  startDate,
  finishDate,
  title,
}) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();

  const [recentTransactions, setRecentTransactions] = useState({
    status: "initial",
    result: [],
  });

  useEffect(() => {
    setRecentTransactions({
      status: "loading",
      result: [],
    });
    getRecentTransactions();
  }, []);

  useEffect(() => {
    setRecentTransactions({
      status: "loading",
      result: [],
    });
    getRecentTransactions();
  }, [sortedTransactions]);

  useEffect(() => {
    console.log(JSON.stringify(recentTransactions));
  }, [recentTransactions]);

  const getRecentTransactions = () => {
    // setRecentTransactions({
    //   status: "loading",
    //   result: [],
    // });
    let finalArray = [];

    if (sortedTransactions.groupSorted?.length) {
      sortedTransactions.groupSorted.forEach((logbook) => {
        if (logbook.transactions.length) {
          if (startDate && finishDate) {
            logbook.transactions.forEach((section) =>
              section.data.forEach((transaction) => {
                if (
                  transaction.details.date >= startDate &&
                  transaction.details.date <= finishDate
                ) {
                  const iconColor = findCategoryColorById(
                    transaction.details.category_id
                  );
                  const iconName = findCategoryIconNameById(
                    transaction.details.category_id
                  );
                  const iconPack = findCategoryIconPackById(
                    transaction.details.category_id
                  );
                  const categoryName = findCategoryNameById(
                    transaction.details.category_id
                  );
                  const foundLogbook = findLogbookById(logbook.logbook_id);
                  finalArray.push({
                    transaction: transaction,
                    category: {
                      categoryName,
                      categoryId: transaction.details.category_id,
                      icon: { iconPack, iconColor, iconName },
                    },
                    logbook: {
                      logbookName: foundLogbook.logbook_name,
                      logbookId: logbook.logbook_id,
                      logbookCurrency: foundLogbook.logbook_currency,
                    },
                  });
                }
              })
            );
          }

          if (!startDate && !finishDate) {
            logbook.transactions.forEach((section) => {
              section.data.forEach((transaction) => {
                if (
                  transaction._timestamps.updated_at >=
                    Date.now() - 1000 * 60 * 60 * 24 * 7 &&
                  transaction._timestamps.updated_at <= Date.now()
                ) {
                  const iconColor = findCategoryColorById(
                    transaction.details.category_id
                  );
                  const iconName = findCategoryIconNameById(
                    transaction.details.category_id
                  );
                  const iconPack = findCategoryIconPackById(
                    transaction.details.category_id
                  );
                  const categoryName = findCategoryNameById(
                    transaction.details.category_id
                  );
                  const foundLogbook = findLogbookById(logbook.logbook_id);
                  finalArray.push({
                    transaction: transaction,
                    category: {
                      categoryName,
                      categoryId: transaction.details.category_id,
                      icon: { iconPack, iconColor, iconName },
                    },
                    logbook: {
                      logbookName: foundLogbook.logbook_name,
                      logbookId: logbook.logbook_id,
                      logbookCurrency: foundLogbook.logbook_currency,
                    },
                  });
                }
              });
            });
          }
        }
      });
      finalArray.sort((a, b) => {
        if (a.transaction._timestamps.updated_at < b.transaction._timestamps.updated_at) {
          return 1;
        }
        if (a.transaction._timestamps.updated_at > b.transaction._timestamps.updated_at) {
          return -1;
        }
        return 0;
      });

      finalArray.length > 5
        ? (finalArray = finalArray.slice(0, 5))
        : (finalArray = finalArray);

      if (finalArray.length) {
        setRecentTransactions({
          status: "done",
          result: finalArray,
        });
      } else {
        setRecentTransactions({
          status: "done",
          result: [],
        });
      }
    }
  };

  // Find Logbook By Id
  const findLogbookById = useMemo(() => {
    return (id) => {
      const filteredLogbook = logbooks.logbooks.filter((logbook) => {
        if (logbook.logbook_id === id) {
          return logbook;
        }
      });
      if (filteredLogbook.length) {
        return filteredLogbook.map((item) => item)[0];
      }
    };
  }, [logbooks]);

  // Find Category Icon Name by Id
  const findCategoryIconNameById = useMemo(() => {
    return (id) => {
      const filteredExpenseCategory = categories.categories.expense.filter(
        (category) => {
          return category.id === id;
        }
      );
      const filteredIncomeCategory = categories.categories.income.filter(
        (category) => {
          return category.id === id;
        }
      );

      if (filteredExpenseCategory.length) {
        return filteredExpenseCategory.map((item) => item.icon.name)[0];
      } else {
        return filteredIncomeCategory.map((item) => item.icon.name)[0];
      }
    };
  }, [categories]);

  // Find Category Name by Id
  const findCategoryNameById = useMemo(() => {
    return (id) => {
      const filteredExpenseCategory = categories.categories.expense.filter(
        (category) => {
          return category.id === id;
        }
      );
      const filteredIncomeCategory = categories.categories.income.filter(
        (category) => {
          return category.id === id;
        }
      );

      if (filteredExpenseCategory.length) {
        const mapped = filteredExpenseCategory.map((item) => item.name);
        // console.log(mapped[0])
        return mapped[0][0].toUpperCase() + mapped[0].substring(1);
      } else {
        const mapped = filteredIncomeCategory.map((item) => item.name);
        return mapped[0][0].toUpperCase() + mapped[0].substring(1);
      }
    };
  }, [categories]);

  // Find Category Color by Id
  const findCategoryColorById = useMemo(() => {
    return (id) => {
      const filteredExpenseCategory = categories.categories.expense.filter(
        (category) => {
          return category.id === id;
        }
      );
      const filteredIncomeCategory = categories.categories.income.filter(
        (category) => {
          return category.id === id;
        }
      );

      if (filteredExpenseCategory.length) {
        const mapped = filteredExpenseCategory.map((item) => item.icon.color);
        return mapped[0] === "default"
          ? appSettings.theme.style.colors.foreground
          : mapped[0];
      } else {
        const mapped = filteredIncomeCategory.map((item) => item.icon.color);
        return mapped[0] === "default"
          ? appSettings.theme.style.colors.foreground
          : mapped[0];
      }
    };
  }, [categories]);

  // Find Category Icon Pack by Id
  const findCategoryIconPackById = useMemo(() => {
    return (id) => {
      const filteredExpenseCategory = categories.categories.expense.filter(
        (category) => {
          return category.id === id;
        }
      );
      const filteredIncomeCategory = categories.categories.income.filter(
        (category) => {
          return category.id === id;
        }
      );

      if (filteredExpenseCategory.length) {
        const mapped = filteredExpenseCategory.map((item) => item.icon.pack);
        return mapped[0];
      } else {
        const mapped = filteredIncomeCategory.map((item) => item.icon.pack);
        return mapped[0];
      }
    };
  }, [categories]);

  const findCategoryTypeById = useMemo(() => {
    return (id) => {
      const filteredExpenseCategory = categories.categories.expense.filter(
        (category) => {
          return category.id === id;
        }
      );
      const filteredIncomeCategory = categories.categories.income.filter(
        (category) => {
          return category.id === id;
        }
      );

      if (filteredExpenseCategory.length) {
        return "expense";
      } else {
        return "income";
      }
    };
  }, [categories]);

  return (
    <>
      <TextPrimary
        label={title || "Recent Transactions"}
        style={{ fontSize: 18, fontWeight: "bold", paddingHorizontal: 16 }}
      />
      <View
        style={{
          flex: 0,
          flexDirection: "column",
          paddingTop: 8,
        }}
      >
        <FlatList
          data={recentTransactions.result}
          keyExtractor={(item) => item.transaction.transaction_id}
          renderItem={({ item }) => (
            <>
              {recentTransactions.status === "done" &&
                recentTransactions.result.length && (
                  <SearchResultListItem
                    pressable
                    transactionType={findCategoryTypeById(
                      item.category.categoryId
                    )}
                    transaction={item.transaction}
                    logbook={item.logbook}
                    onPress={() => {
                      onPress({
                        transaction: item.transaction,
                        selectedLogbook: {
                          name: item.logbook.logbookName,
                          logbook_id: item.logbook.logbookId,
                          logbook_currency: item.logbook.logbookCurrency,
                        },
                      });
                    }}
                    //   Left
                    iconLeftName={item.category.icon.iconName}
                    iconLeftPack={item.category.icon.iconPack}
                    iconLeftColor={item.category.icon.iconColor}
                    categoryName={item.category.categoryName}
                    logbookName={item.logbook.logbookName}
                    // transactionDate={item.transaction.details.date}
                    // transactionNotes={item.transaction.details.notes}
                    //   Right
                    currency={item.logbook.logbookCurrency}
                    transactionAmount={
                      item.transaction.details.amount ||
                      item.transaction.details.amount.toString()
                    }
                  />
                )}
            </>
          )}
        />
        {!recentTransactions.result.length && (
          <TextSecondary
            label={`No ${title || "Recent Transactions"}`}
            style={{ paddingHorizontal: 16 }}
          />
        )}
      </View>
    </>
  );
};

export default RecentTransactions;
