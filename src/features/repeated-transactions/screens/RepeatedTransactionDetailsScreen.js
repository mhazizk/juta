import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { ListItem, TransactionListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import { TextPrimary } from "../../../components/Text";
import screenList from "../../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalRepeatedTransactions,
  useGlobalSortedTransactions,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import * as utils from "../../../utils";
import RepeatedTransactionHeader from "../components/RepeatedTransactionHeader";

const RepeatedTransactionsDetailsScreen = ({ route, navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { categories } = useGlobalCategories();
  const { logbooks } = useGlobalLogbooks();
  const { repeatedTransactions } = useGlobalRepeatedTransactions();
  const { userAccount } = useGlobalUserAccount();
  const [transactionsInRepeat, setTransactionsInRepeat] = useState([]);

  useEffect(() => {
    console.log(route.params.repeatSection);
    findTransactionsInRepeat();
  }, []);
  useEffect(() => {
    console.log(transactionsInRepeat);
  }, [transactionsInRepeat]);

  const findTransactionsInRepeat = () => {
    const transactionList = route.params.repeatSection.transactions;
    const transactionsInRepeat = [];
    transactionList.forEach((transaction_id) => {
      sortedTransactions.groupSorted.forEach((logbook) =>
        logbook.transactions.forEach((section) => {
          section.data.forEach((transaction) => {
            if (transaction.transaction_id === transaction_id) {
              transactionsInRepeat.push(transaction);
            }
          });
        })
      );
    });
    console.log(transactionList);
    console.log(transactionsInRepeat);
    return setTransactionsInRepeat(transactionsInRepeat);
  };

  return (
    <>
      <ScrollView
        style={{
          minHeight: "100%",
          backgroundColor: appSettings.theme.style.colors.background,
        }}
      >
        <RepeatedTransactionHeader
          repeatSection={route.params.repeatSection}
          onPress={() => {
              navigation.navigate(screenList.editRepeatedTransactionScreen, {
                repeatSection: route.params.repeatSection,
            });
          }}
        />
        {transactionsInRepeat.length > 0 && (
          <>
            <ListSection>
              {transactionsInRepeat.map((item) => {
                return (
                  <>
                    <TransactionListItem
                      key={item.transaction_id}
                      // transactionId={item.transaction_id}
                      categoryName={utils.FindById.findCategoryNameById({
                        id: item.details.category_id,
                        categories: categories.categories,
                      })}
                      isRepeated={item.repeat_id ? true : false}
                      // categoryType={findCategoryTypeById(
                      //   item.details.category_id
                      // )}
                      transactionHour={
                        appSettings.logbookSettings.showTransactionTime &&
                        item.details.date
                      }
                      transactionType={item.details.in_out}
                      transactionNotes={
                        appSettings.logbookSettings.showTransactionNotes &&
                        item.details.notes
                      }
                      iconLeftName={utils.FindById.findCategoryIconNameById({
                        id: item.details.category_id,
                        categories: categories.categories,
                      })}
                      iconLeftColor={utils.FindById.findCategoryColorById({
                        id: item.details.category_id,
                        categories: categories.categories,
                        defaultColor: appSettings.theme.style.colors.foreground,
                      })}
                      logbookCurrency={
                        utils.FindById.findLogbookById({
                          id: route.params.repeatSection.repeat_logbook_id,
                          logbooks: logbooks.logbooks,
                        }).logbook_currency
                      }
                      secondaryCurrency={
                        appSettings.logbookSettings.secondaryCurrency
                      }
                      showSecondaryCurrency={
                        appSettings.logbookSettings.showSecondaryCurrency
                      }
                      transactionAmount={item.details.amount}
                      onPress={() => {
                        // console.log(item);
                        const foundLogbook = utils.FindById.findLogbookById({
                          id: route.params.repeatSection.repeat_logbook_id,
                          logbooks: logbooks.logbooks,
                        });
                        const selectedLogbook = {
                          ...foundLogbook,
                          name: foundLogbook.logbook_name,
                        };
                        navigation.navigate(
                          screenList.transactionPreviewScreen,
                          {
                            transaction: item,
                            selectedLogbook: selectedLogbook,
                          }
                        );
                      }}
                    />
                  </>
                );
              })}
            </ListSection>
          </>
        )}
      </ScrollView>
    </>
  );
};

export default RepeatedTransactionsDetailsScreen;
