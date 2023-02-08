import { useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { ListItem, TransactionListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import { TextPrimary, TextSecondary } from "../../../components/Text";
import screenList from "../../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalRepeatedTransactions,
  useGlobalSortedTransactions,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import * as utils from "../../../utils";
import RepeatedTransactionHeader from "../components/RepeatedTransactionHeader";
import IonIcons from "react-native-vector-icons/Ionicons";
import CustomScrollView from "../../../shared-components/CustomScrollView";

const RepeatedTransactionsDetailsScreen = ({ route, navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
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
      <View
        style={{
          alignItems: "center",
          paddingTop: 16,
          paddingHorizontal: 16,
          backgroundColor: globalTheme.colors.background,
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
      </View>
      <CustomScrollView
        contentContainerStyle={{
          // height: "100%",
          flex: !transactionsInRepeat.length ? 1 : 0,
          justifyContent: "flex-start",
        }}
      >
        {transactionsInRepeat.length > 0 && (
          <>
            <ListSection>
              {transactionsInRepeat
                .sort((a, b) => {
                  return b.details.date - a.details.date;
                })
                .map((item) => {
                  return (
                    <>
                      <TransactionListItem
                        key={item.transaction_id}
                        showDate
                        transactionDate={item.details.date}
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
                          defaultColor: globalTheme.colors.foreground,
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

        {transactionsInRepeat.length === 0 && (
          <View
            style={{
              // height: Dimensions.get("window").height - 0,
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: globalTheme.colors.background,
            }}
          >
            <IonIcons
              name="repeat"
              color={globalTheme.colors.secondary}
              size={36}
              style={{
                // transform: [{ scaleX: -1 }],
                paddingBottom: 8,
              }}
            />
            <TextSecondary
              label="No transactions yet in this repeat."
              style={{ textAlign: "center", paddingBottom: 0 }}
            />
            <TextSecondary
              label={`Next repeat in ${new Date(
                route.params.repeatSection.next_repeat_date
              ).toDateString()}`}
              style={{ textAlign: "center" }}
            />
          </View>
        )}
      </CustomScrollView>
    </>
  );
};

export default RepeatedTransactionsDetailsScreen;
