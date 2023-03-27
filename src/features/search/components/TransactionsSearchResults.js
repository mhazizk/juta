import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { SearchResultListItem } from "../../../components/List";
import { TextPrimary, TextSecondary } from "../../../components/Text";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import * as utils from "../../../utils";

import Entypo from "react-native-vector-icons/Entypo";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import TransactionListSection from "../../../components/List/TransactionListSection";

const TransactionsSearchResults = ({
  route,
  navigation,
  searchQuery,
  onPress,
}) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { sortedTransactions, dispatchSortedTransctions } =
    useGlobalSortedTransactions();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();

  const [searchResult, setSearchResult] = useState({
    status: "initial",
    result: [],
  });

  useEffect(() => {
    setTimeout(() => {
      search();
    }, 500);
  }, []);

  useEffect(() => {
    setSearchResult({
      status: "loading",
      result: [],
    });
    setTimeout(() => {
      search();
    }, 500);
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
                defaultColor: globalTheme.colors.foreground,
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

  return (
    <>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 16,
          // minHeight: Dimensions.get("window").height - 120,
        }}
      >
        {/* // TAG : Loading */}
        {searchResult.status === "loading" && (
          <>
            <CustomScrollView
              contentContainerStyle={{
                // marginTop: -64,
                flex: 1,
                justifyContent: "center",
              }}
            >
              <ActivityIndicator
                size={48}
                color={globalTheme.colors.foreground}
                style={{ paddingBottom: 16 }}
              />
              <TextPrimary
                label="Searching..."
                style={{ textAlign: "center" }}
              />
            </CustomScrollView>
          </>
        )}

        {/* // TAG : No result */}
        {searchResult.status === "done" && !searchResult.result.length && (
          <>
            <CustomScrollView
              contentContainerStyle={{
                justifyContent: "center",
              }}
            >
              <Entypo
                name="emoji-sad"
                size={48}
                color={globalTheme.colors.secondary}
                style={{ padding: 16 }}
              />
              <TextSecondary label="Nothing Found" />
            </CustomScrollView>
          </>
        )}
        {searchResult.status === "done" && searchResult.result.length > 0 && (
          <>
            <TextSecondary
              label={`Found ${searchResult.result.length} result(s)`}
              style={{ alignSelf: "flex-start", paddingVertical: 8 }}
            />
            <FlatList
              data={searchResult.result}
              style={
                {
                  // minHeight: "100%",
                  // display: searchResult.result.length ? "flex" : "none",
                }
              }
              keyExtractor={(item) => item.transaction.transaction_id}
              contentContainerStyle={{
                alignItems: "center",
                width: "100%",
              }}
              ListHeaderComponent={() => <></>}
              ListFooterComponent={() => (
                <>
                  <View
                    style={{
                      padding: 8,
                    }}
                  />
                </>
              )}
              renderItem={({ item, index }) => (
                <>
                  <TransactionListSection
                    isFirstItem={index === 0}
                    isLastItem={index === searchResult.result.length - 1}
                  >
                    {searchResult.status === "done" &&
                      searchResult.result.length && (
                        <SearchResultListItem
                          pressable
                          repeatId={item.transaction.repeat_id}
                          transactionType={item.transaction.details.in_out}
                          transaction={item.transaction}
                          logbook={item.logbook}
                          onPress={() => {
                            if (
                              !item.transaction.details.category_id.includes(
                                "initial_balance"
                              )
                            )
                              onPress({
                                transaction: item.transaction,
                                selectedLogbook: {
                                  name: item.logbook.logbookName,
                                  logbook_id: item.logbook.logbookId,
                                  logbook_currency:
                                    item.logbook.logbookCurrency,
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
                          logbookCurrency={item.logbook.logbookCurrency}
                          showSecondaryCurrency={
                            appSettings.logbookSettings.showSecondaryCurrency
                          }
                          secondaryCurrency={
                            appSettings.logbookSettings.secondaryCurrency
                          }
                          transactionAmount={
                            item.transaction.details.amount ||
                            item.transaction.details.amount.toString()
                          }
                        />
                      )}
                  </TransactionListSection>
                </>
              )}
            />
          </>
        )}
      </View>
    </>
  );
};

export default TransactionsSearchResults;
