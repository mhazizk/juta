import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTheme,
} from "../reducers/GlobalContext";
import { ListItem, SearchResultListItem, TransactionListItem } from "./List";
import { TextPrimary, TextSecondary } from "./Text";
import * as utils from "../utils";
import ListSection from "./List/ListSection";
import Animated, { BounceIn } from "react-native-reanimated";

const RecentTransactions = ({
  enteringAnimation = null,
  route,
  navigation,
  expenseOnly,
  onPress,
  startDate,
  finishDate,
  title,
}) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const [showList, setShowList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    setShowList(false);
    setIsLoading(true);
    getRecentTransactions();
  }, []);

  useEffect(() => {
    setShowList(false);
    setIsLoading(true);
    getRecentTransactions();
  }, [sortedTransactions]);

  useEffect(() => {
    // console.log(JSON.stringify(recentTransactions));
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
          // if (startDate && finishDate) {
          // if (expenseOnly) {
          logbook.transactions.forEach((section) =>
            section.data.forEach((transaction) => {
              const iconColor = utils.FindById.findCategoryColorById({
                id: transaction.details.category_id,
                categories: categories.categories,
                defaultColor: globalTheme.colors.foreground,
              });
              const iconName = utils.FindById.findCategoryIconNameById({
                id: transaction.details.category_id,
                categories: categories.categories,
              });
              const iconPack = utils.FindById.findCategoryIconPackById({
                id: transaction.details.category_id,
                categories: categories.categories,
              });
              const categoryName = utils.FindById.findCategoryNameById({
                id: transaction.details.category_id,
                categories: categories.categories,
              });
              const foundLogbook = utils.FindById.findLogbookById({
                id: logbook?.logbook_id,
                logbooks: logbooks.logbooks,
              });

              if (
                expenseOnly &&
                transaction.details.in_out === "expense" &&
                transaction.details.date >= startDate &&
                transaction.details.date <= finishDate
              ) {
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

              if (
                !startDate &&
                !finishDate &&
                transaction._timestamps.updated_at >=
                  Date.now() - 1000 * 60 * 60 * 24 * 365 &&
                transaction._timestamps.updated_at <= Date.now()
              ) {
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
          // }
        }
      });
      finalArray.sort((a, b) => {
        if (
          a.transaction._timestamps.updated_at <
          b.transaction._timestamps.updated_at
        ) {
          return 1;
        }
        if (
          a.transaction._timestamps.updated_at >
          b.transaction._timestamps.updated_at
        ) {
          return -1;
        }
        return 0;
      });

      finalArray.length > 5
        ? (finalArray = finalArray.slice(0, 5))
        : (finalArray = finalArray);

      if (finalArray.length) {
        setRecentTransactions(finalArray);
        setIsLoading(false);
        setShowList(true);
      } else {
        setRecentTransactions([]);
        setIsLoading(false);
        setShowList(false);
      }
    }
  };

  return (
    <>
      <Animated.View
        entering={enteringAnimation}
        style={{
          width: "100%",
          alignItems: "flex-start",
          paddingBottom: 16,
        }}
      >
        <TextPrimary
          label={title || "Recent Transactions"}
          style={{
            paddingHorizontal: 16,
            alignSelf: "flex-start",
            fontSize: 18,
            fontWeight: "bold",
          }}
        />
        {!showList && (
          <TextSecondary
            label={`No ${title || "Recent Transactions"}`}
            style={{
              paddingHorizontal: 16,
              alignSelf: "flex-start",
            }}
          />
        )}
      </Animated.View>
      <ListSection enteringAnimation={enteringAnimation}>
        {!isLoading && (
          <Animated.FlatList
            entering={enteringAnimation}
            nestedScrollEnabled
            data={recentTransactions}
            keyExtractor={(item) => item.transaction.transaction_id}
            renderItem={({ item }) => (
              <>
                {showList && (
                  <SearchResultListItem
                    pressable
                    // transactionType={findCategoryTypeById(
                    //   item.category.categoryId
                    // )}
                    repeatId={item.transaction.repeat_id}
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
                    // transactionDate={item.transaction.details.date}
                    // transactionNotes={item.transaction.details.notes}
                    //   Right
                    logbookCurrency={item.logbook.logbookCurrency}
                    secondaryCurrency={
                      appSettings.logbookSettings.secondaryCurrency
                    }
                    showSecondaryCurrency={
                      appSettings.logbookSettings.showSecondaryCurrency
                    }
                    transactionAmount={
                      item.transaction.details.amount ||
                      item.transaction.details.amount.toString()
                    }
                  />
                )}
              </>
            )}
          />
        )}
      </ListSection>
    </>
  );
};

export default RecentTransactions;
