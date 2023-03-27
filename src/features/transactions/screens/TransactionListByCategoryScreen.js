import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { ListItem, TransactionListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import TransactionListSection from "../../../components/List/TransactionListSection";
import Loading from "../../../components/Loading";
import screenList from "../../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import * as utils from "../../../utils";

const TransactionListByCategoryScreen = ({ route, navigation }) => {
  const { category, startDateInMillis, endDateInMillis } = route.params;
  const { appSettings } = useGlobalAppSettings();
  const { sortedTransactions } = useGlobalSortedTransactions();
  const { globalTheme } = useGlobalTheme();
  const { logbooks } = useGlobalLogbooks();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const categoryIconColor =
    category.icon.color === "default"
      ? globalTheme.colors.primary
      : category.icon.color;

  useEffect(() => {
    filterTransaction();
    setIsLoading(false);
  }, []);

  const filterTransaction = () => {
    let array = [];

    sortedTransactions.groupSorted.forEach((logbook) => {
      logbook.transactions.forEach((section) => {
        section.data.forEach((transaction) => {
          if (transaction.details.category_id === category.id) {
            if (
              transaction.details.date >= startDateInMillis &&
              transaction.details.date <= endDateInMillis
            ) {
              array.push(transaction);
            }
          }
        });
      });
    });
    console.log(JSON.stringify({ array }, null, 2));
    setTransactions(array.sort((a, b) => b.details.date - a.details.date));
    // return !array.length ? "No Transactions" : `${array.length} Transactions`;
  };

  return (
    <CustomScrollView
      contentContainerStyle={{
        justifyContent: isLoading ? "center" : "flex-start",
      }}
    >
      {isLoading && <Loading />}
      {!!transactions.length && (
        <>
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.transaction_id}
            style={{
              width: "100%",
            }}
            contentContainerStyle={{
              paddingTop: 16,
              height: "100%",
              alignItems: "center",
            }}
            renderItem={({ item, index }) => {
              const isFirstItem = index === 0;
              const isLastItem = index === transactions.length - 1;
              const logbook = utils.FindById.findLogbookById({
                id: item.logbook_id,
                logbooks: logbooks.logbooks,
              });
              logbook.name = logbook.logbook_name;
              return (
                <>
                  <TransactionListSection
                    isFirstItem={isFirstItem}
                    isLastItem={isLastItem}
                  >
                    <TransactionListItem
                      categoryName={utils.upperCaseThisFirstLetter(
                        category.name
                      )}
                      isRepeated={item.repeat_id ? true : false}
                      transactionHour={
                        appSettings.logbookSettings.showTransactionTime &&
                        item.details.date
                      }
                      transactionType={item.details.in_out}
                      transactionNotes={
                        appSettings.logbookSettings.showTransactionNotes &&
                        item.details.notes
                      }
                      iconLeftName={category.icon.name}
                      iconLeftColor={categoryIconColor}
                      logbookCurrency={logbook.logbook_currency}
                      secondaryCurrency={
                        appSettings.logbookSettings.secondaryCurrency
                      }
                      showSecondaryCurrency={
                        appSettings.logbookSettings.showSecondaryCurrency
                      }
                      transactionAmount={item.details.amount}
                      onPress={() => {
                        if (
                          !item.details.category_id.includes("initial_balance")
                        )
                          navigation.navigate(
                            screenList.transactionPreviewScreen,
                            {
                              transaction: item,
                              selectedLogbook: logbook,
                            }
                          );
                      }}
                    />
                  </TransactionListSection>
                </>
              );
            }}
          />
        </>
      )}
    </CustomScrollView>
  );
};

export default TransactionListByCategoryScreen;
