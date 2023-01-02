import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, View } from "react-native";
import { SearchResultListItem } from "../../components/List";
import { TextPrimary, TextSecondary } from "../../components/Text";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
} from "../../reducers/GlobalContext";
import * as utils from "../../utils";

import Entypo from "react-native-vector-icons/Entypo";

const GlobalSearchResultsScreen = ({
  route,
  navigation,
  searchQuery,
  onPress,
}) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { sortedTransactions, dispatchSortedTransctions } =
    useGlobalSortedTransactions();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();

  const [searchResult, setSearchResult] = useState({
    status: "initial",
    result: [],
  });

  useEffect(() => {
    search();
  }, []);

  useEffect(() => {
    setSearchResult({
      status: "loading",
      result: [],
    });

    search();
  }, [searchQuery]);

  useEffect(() => {
    // console.log(JSON.stringify(searchResult));
  }, [searchResult]);

  // TAG : Function Section
  const search = () => {
    let finalArray = [];
    let categoryId = [];
    // Search Transctions
    if (searchQuery) {
      // Search Categories
      const searchCategory = () => {
        categories.categories.expense.forEach((category) => {
          if (category.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            categoryId.push(category.id);
          }
        });

        categories.categories.income.forEach((category) => {
          if (category.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            categoryId.push(category.id);
          }
        });
      };

      searchCategory();
      console.log({ categoryId });

      // Search Transactions
      const searchResult = sortedTransactions.groupSorted.forEach((logbook) =>
        logbook.transactions.forEach((section) =>
          section.data.forEach((transaction) => {
            if (
              categoryId.some((id) => id === transaction.details.category_id) ||
              transaction.details?.notes
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              transaction.details.amount
                ?.toString()
                .includes(searchQuery.toString())
            ) {
              const iconColor = utils.FindById.findCategoryColorById({
                id: transaction?.details.category_id,
                categories: categories.categories,
                defaultColor: appSettings.theme.style.colors.foreground,
              });
              const iconName = utils.FindById.findCategoryIconNameById({
                id: transaction?.details.category_id,
                categories: categories.categories,
              });
              const iconPack = utils.FindById.findCategoryIconPackById({
                id: transaction?.details.category_id,
                categories: categories.categories,
              });
              const categoryName = utils.FindById.findCategoryNameById({
                id: transaction?.details.category_id,
                categories: categories.categories,
              });

              const foundLogbook = utils.FindById.findLogbookById({
                id: logbook.logbook_id,
                logbooks: logbooks.logbooks,
              });
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
        )
      );
      if (finalArray.length) {
        setSearchResult({ status: "done", result: finalArray });
      } else {
        setSearchResult({ status: "done", result: [] });
      }
    }
  };

  // // Find Logbook By Id
  // const findLogbookById = useMemo(() => {
  //   return (id) => {
  //     const filteredLogbook = logbooks.logbooks.filter((logbook) => {
  //       if (logbook.logbook_id === id) {
  //         return logbook;
  //       }
  //     });
  //     if (filteredLogbook.length) {
  //       return filteredLogbook.map((item) => item)[0];
  //     }
  //   };
  // }, [searchQuery, logbooks]);

  // // Find Category Icon Name by Id
  // const findCategoryIconNameById = useMemo(() => {
  //   return (id) => {
  //     const filteredExpenseCategory = categories.categories.expense.filter(
  //       (category) => {
  //         return category.id === id;
  //       }
  //     );
  //     const filteredIncomeCategory = categories.categories.income.filter(
  //       (category) => {
  //         return category.id === id;
  //       }
  //     );

  //     if (filteredExpenseCategory.length) {
  //       return filteredExpenseCategory.map((item) => item.icon.name)[0];
  //     } else {
  //       return filteredIncomeCategory.map((item) => item.icon.name)[0];
  //     }
  //   };
  // }, [searchQuery, categories]);

  // // Find Category Name by Id
  // const findCategoryNameById = useMemo(() => {
  //   return (id) => {
  //     const filteredExpenseCategory = categories.categories.expense.filter(
  //       (category) => {
  //         return category.id === id;
  //       }
  //     );
  //     const filteredIncomeCategory = categories.categories.income.filter(
  //       (category) => {
  //         return category.id === id;
  //       }
  //     );

  //     if (filteredExpenseCategory.length) {
  //       const mapped = filteredExpenseCategory.map((item) => item.name);
  //       // console.log(mapped[0])
  //       return mapped[0][0].toUpperCase() + mapped[0].substring(1);
  //     } else {
  //       const mapped = filteredIncomeCategory.map((item) => item.name);
  //       return mapped[0][0].toUpperCase() + mapped[0].substring(1);
  //     }
  //   };
  // }, [searchQuery, categories]);

  // // Find Category Color by Id
  // const findCategoryColorById = useMemo(() => {
  //   return (id) => {
  //     const filteredExpenseCategory = categories.categories.expense.filter(
  //       (category) => {
  //         return category.id === id;
  //       }
  //     );
  //     const filteredIncomeCategory = categories.categories.income.filter(
  //       (category) => {
  //         return category.id === id;
  //       }
  //     );

  //     if (filteredExpenseCategory.length) {
  //       const mapped = filteredExpenseCategory.map((item) => item.icon.color);
  //       return mapped[0] === "default"
  //         ? appSettings.theme.style.colors.foreground
  //         : mapped[0];
  //     } else {
  //       const mapped = filteredIncomeCategory.map((item) => item.icon.color);
  //       return mapped[0] === "default"
  //         ? appSettings.theme.style.colors.foreground
  //         : mapped[0];
  //     }
  //   };
  // }, [searchQuery, categories]);

  // // Find Category Icon Pack by Id
  // const findCategoryIconPackById = useMemo(() => {
  //   return (id) => {
  //     const filteredExpenseCategory = categories.categories.expense.filter(
  //       (category) => {
  //         return category.id === id;
  //       }
  //     );
  //     const filteredIncomeCategory = categories.categories.income.filter(
  //       (category) => {
  //         return category.id === id;
  //       }
  //     );

  //     if (filteredExpenseCategory.length) {
  //       const mapped = filteredExpenseCategory.map((item) => item.icon.pack);
  //       return mapped[0];
  //     } else {
  //       const mapped = filteredIncomeCategory.map((item) => item.icon.pack);
  //       return mapped[0];
  //     }
  //   };
  // }, [searchQuery, categories]);

  return (
    <>
      <View
        style={{
          height: "100%",
          backgroundColor: appSettings.theme.style.colors.background,
        }}
      >
        {searchResult.status === "loading" && (
          <>
            <View
              style={{
                height: "100%",
                backgroundColor: appSettings.theme.style.colors.background,
                justifyContent: "center",
              }}
            >
              <ActivityIndicator
                size={48}
                color={appSettings.theme.style.colors.foreground}
                style={{ paddingBottom: 16 }}
              />
              <TextPrimary
                label="Searching..."
                style={{ textAlign: "center" }}
              />
            </View>
          </>
        )}

        {searchResult.status === "done" && !searchResult.result.length && (
          <>
            <ScrollView
              contentContainerStyle={{
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Entypo
                name="emoji-sad"
                size={48}
                color={appSettings.theme.style.colors.secondary}
                style={{ padding: 16 }}
              />
              <TextSecondary label="Nothing Found" />
            </ScrollView>
          </>
        )}

        <FlatList
          data={searchResult.result}
          style={{
            height: "100%",
            display: searchResult.result.length ? "flex" : "none",
          }}
          keyExtractor={(item) => item.transaction.transaction_id}
          ListHeaderComponent={() => (
            <>
              <TextSecondary
                label="Found Transactions"
                style={{ padding: 16 }}
              />
            </>
          )}
          renderItem={({ item }) => (
            <>
              {/* {console.log(item.logbook)} */}
              {searchResult.status === "done" && searchResult.result.length && (
                <SearchResultListItem
                  pressable
                  transactionType={item.transaction.details.in_out}
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
                  transactionDate={item.transaction.details.date}
                  transactionNotes={item.transaction.details.notes}
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
      </View>
    </>
  );
};

export default GlobalSearchResultsScreen;
