import { useEffect, useMemo, useState } from "react";
import { Dimensions, SectionList, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TransactionListItem } from "../../../components/List";
import {
  TextButtonPrimary,
  TextPrimary,
  TextSecondary,
} from "../../../components/Text";
import {
  useGlobalAppSettings,
  useGlobalSortedTransactions,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import IonIcons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import * as utils from "../../../utils";
import ListSection from "../../../components/List/ListSection";
import TransactionListSection from "../../../components/List/TransactionListSection";

const TransactionList = ({
  selectedLogbook,
  // transactions,
  categories,
  onPress,
  checkListMode,
}) => {
  // TAG : useState Section //
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const [transactionsDate, setTransactionsDate] = useState(null);
  const [groupSortedTransactions, setGroupSortedTransactions] = useState(null);
  const [mappedTransactions, setMappedTransactions] = useState([]);
  const [date, setDate] = useState(null);
  const [checkList, setCheckList] = useState(null);
  const [enableChecklistMode, setEnableCheckListMode] = useState(false);

  // TAG : useEffect Section //
  useEffect(() => {
    // if (transactions) {
    // }
    setDate(new Date().toLocaleDateString());
    mapTransactions();
    // console.log(sortedTransactions)
  }, []);

  useEffect(() => {
    setMappedTransactions(null);
    mapTransactions();
    // if (transactions) {
    //     setSortedTransactions(transactions.sort(sortTransactions))
    // }
  }, [selectedLogbook]);

  useEffect(() => {
    // if (sortedTransactions) {
    //     groupSorted()
    // }
    console.log(mappedTransactions);
  }, [mappedTransactions]);

  // useEffect(() => {
  //   // refresh
  // }, [selectedLogbook]);

  useEffect(() => {
    // refresh
  }, [date]);

  useEffect(() => {
    // refresh
    // console.log(groupSortedTransactions)
  }, [groupSortedTransactions]);

  useEffect(() => {
    // checkListMode({ mode: enableChecklistMode, length: 0 })
  }, [enableChecklistMode]);

  useEffect(() => {
    // console.log(checkList)
    // if (checkList) {
    //     checkListMode({ mode: enableChecklistMode, length: checkList.length })
    // }
  }, [checkList]);

  // TAG : Function Section //

  // Sum Amount in Section
  const sumAmount = useMemo(() => {
    return (data) => {
      if (data) {
        let sum = [];
        switch (appSettings.logbookSettings.dailySummary) {
          case "expense-only":
            data.forEach((transaction) => {
              if (transaction.details.in_out === "expense") {
                sum.push(transaction.details.amount);
              }
            });
            break;
          case "income-only":
            data.forEach((transaction) => {
              if (transaction.details.in_out === "income") {
                sum.push(transaction.details.amount);
              }
            });
            break;
          case "expense-income":
            data.forEach((transaction) => {
              if (transaction.details.in_out === "expense") {
                sum.push(+transaction.details.amount);
              }
              if (transaction.details.in_out === "income") {
                sum.push(-transaction.details.amount);
              }
            });
            break;
          case "income-expense":
            data.forEach((transaction) => {
              if (transaction.details.in_out === "expense") {
                sum.push(-transaction.details.amount);
              }
              if (transaction.details.in_out === "income") {
                sum.push(+transaction.details.amount);
              }
            });
            break;

          default:
            data.forEach((transaction) => {
              if (transaction.details.in_out === "expense") {
                sum.push(transaction.details.amount);
              }
            });
            break;
        }
        return sum.reduce((prev, curr) => prev + curr, 0);
      }
    };
  }, [sortedTransactions.groupSorted]);

  const mapTransactions = () => {
    if (selectedLogbook) {
      const filtered = sortedTransactions.groupSorted.find((logbook) => {
        return logbook.logbook_id === selectedLogbook.logbook_id;
      });
      setMappedTransactions(
        filtered.transactions.map((transaction) => transaction)
      );
    }
  };

  return (
    <>
      {/* CheckList Mode */}
      {enableChecklistMode && (
        <View
          style={[
            {
              zIndex: 1000,
              position: "absolute",
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingVertical: 0,
            },
            { backgroundColor: globalTheme.colors.background },
          ]}
        >
          <TextPrimary
            label={`${
              !checkList || !checkList.length
                ? "Nothing"
                : `${checkList.length} item(s)`
            } selected`}
          />
          {/* <Text style={{ ...globalStyles.lightTheme.textPrimary }}>{!checkList || !checkList.length ? 'Nothing' : `${checkList.length} item(s)`} selected</Text> */}

          <View
            style={{
              minHeight: 48,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* // TAG : Clear Selection */}
            <TouchableOpacity
              onPress={() => setEnableCheckListMode(!enableChecklistMode)}
            >
              <View
                style={{
                  minHeight: 48,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IonIcons
                  name="close-circle"
                  size={20}
                  color={globalTheme.colors.foreground}
                  style={{ paddingRight: 8 }}
                />
                <TextPrimary label="Clear Selection" />
              </View>
            </TouchableOpacity>

            {/* // TAG : Delete Selection */}
            {/* <TouchableOpacity
                              onPress={() => setEnableCheckListMode(!enableChecklistMode)}
                          >
                              <View style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                  <IonIcons name="trash" size={20} style={{ paddingRight: 8 }} />
                                  <Text style={{ ...globalStyles.lightTheme.textPrimary }}>Delete Selection</Text>
                              </View>
                          </TouchableOpacity> */}

            {/* // TAG : Move Selection */}
            {/* <TouchableOpacity
                              onPress={() => setEnableCheckListMode(!enableChecklistMode)}
                          >
                              <View style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                  <IonIcons name="book" size={20} style={{ paddingRight: 8 }} />
                                  <Text style={{ ...globalStyles.lightTheme.textPrimary }}>Move To Book</Text>
                              </View>
                          </TouchableOpacity> */}
          </View>
        </View>
      )}
      {/* // TAG : Transaction List */}
      {mappedTransactions && (
        <SectionList
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={7}
          scrollsToTop
          updateCellsBatchingPeriod={1000}
          contentContainerStyle={{
            width: "100%",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingBottom: 16,
          }}
          // removeClippedSubviews
          sections={mappedTransactions}
          keyExtractor={(item, index) => index.toString()}
          stickySectionHeadersEnabled
          renderSectionHeader={({ section }) => (
            <>
              {mappedTransactions && (
                // TAG : Header container
                <View
                  style={[
                    {
                      width: Dimensions.get("window").width - 32,
                      paddingTop: 16,
                      paddingBottom: 16,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: globalTheme.colors.background,
                    },
                  ]}
                >
                  {/* // TAG : Date Title */}
                  <TextSecondary
                    // label={checkDate(section.title)}
                    label={utils.RelativeDate({
                      dateToCheck: section.title,
                      currentDate: date,
                      locale: appSettings.locale,
                    })}
                    style={{
                      paddingLeft: 16,
                      flex: 1,
                    }}
                  />

                  {/* // TAG : Sum Amount */}
                  <View
                    style={{
                      backgroundColor: globalTheme.colors.secondary,
                      padding: 8,
                      borderRadius: 8,
                      alignItems: "flex-end",
                    }}
                  >
                    {/* // TAG : Main Currency */}
                    <View
                      style={[
                        {
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        },
                      ]}
                    >
                      <TextPrimary
                        label={selectedLogbook.logbook_currency.symbol}
                        style={{ paddingRight: 8 }}
                      />
                      <TextPrimary
                        label={utils.getFormattedNumber({
                          value: sumAmount(section.data),
                          currencyIsoCode: selectedLogbook.logbook_currency.isoCode,
                          negativeSymbol:
                            appSettings.logbookSettings.negativeCurrencySymbol,
                        })}
                      />
                    </View>
                  </View>
                </View>
              )}
            </>
          )}
          renderItem={({ item, index, section }) => {
            return (
              <>
                <TransactionListSection
                  isFirstItem={index === 0}
                  isLastItem={index === section.data.length - 1}
                >
                  {mappedTransactions && (
                    <TransactionListItem
                      // transactionId={item.transaction_id}
                      categoryName={utils.FindById.findCategoryNameById({
                        id: item.details.category_id,
                        categories: categories,
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
                        categories: categories,
                      })}
                      iconLeftColor={utils.FindById.findCategoryColorById({
                        id: item.details.category_id,
                        categories: categories,
                        defaultColor: globalTheme.colors.foreground,
                      })}
                      logbookCurrency={selectedLogbook.logbook_currency}
                      secondaryCurrency={
                        appSettings.logbookSettings.secondaryCurrency
                      }
                      showSecondaryCurrency={
                        appSettings.logbookSettings.showSecondaryCurrency
                      }
                      transactionAmount={item.details.amount}
                      onPress={() => onPress(item)}
                    />
                  )}
                </TransactionListSection>
              </>
            );
          }}
        />
      )}

      {!mappedTransactions.length && (
        <View
          style={{
            height: "100%",
            top: -48,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Entypo
            name="documents"
            size={48}
            color={globalTheme.colors.secondary}
            style={{ padding: 16 }}
          />
          <TextSecondary label="No Transactions" />
        </View>
      )}
    </>
  );
};

export default TransactionList;
