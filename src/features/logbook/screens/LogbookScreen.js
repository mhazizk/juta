import { useIsFocused } from "@react-navigation/native";
// import "intl/locale-data/jsonp/en";
import { useEffect, useState } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import Loading from "../../../components/Loading";
import { TextButtonPrimary, TextPrimary } from "../../../components/Text";
import screenList from "../../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalBadgeCounter,
  useGlobalCategories,
  useGlobalCurrencyRates,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import REDUCER_ACTIONS from "../../../reducers/reducer.action";
// import Swipeable from 'react-native-gesture-handler/Swipeable';
import TransactionList from "../../../features/transactions/components/TransactionList";
import * as utils from "../../../utils";
import TextTicker from "react-native-text-ticker";
import MODAL_TYPE_CONSTANTS from "../../../constants/modalTypeConstants";
import { LogbookButton } from "../../../components/Button";
const { width, height } = Dimensions.get("screen");

const LogbookScreen = ({ route, navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { globalCurrencyRates } = useGlobalCurrencyRates();
  // const [logbooks, setLogbooks] = useState(null);
  // const [categories, setCategories] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [selectedLogbook, setSelectedLogbook] = useState(null);
  const [targetLogbook, setTargetLogbook] = useState(null);
  const [selectedLogbooksCurrency, setSelectedLogbookCurrency] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState(null);
  const [checkListMode, setCheckListMode] = useState({
    mode: false,
    length: 0,
  });
  const [screenLoading, setScreenLoading] = useState(false);
  const [componentLoading, setComponentLoading] = useState(false);
  const { badgeCounter, dispatchBadgeCounter } = useGlobalBadgeCounter();
  const isFocused = useIsFocused();

  // TAG : useEffect Section //
  useEffect(() => {
    logbookToBeSelected();
    filterTransactions();
  }, []);

  useEffect(() => {
    logbookToBeSelected();
    filterTransactions();
  }, [sortedTransactions.groupSorted]);

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        dispatchBadgeCounter({
          type: REDUCER_ACTIONS.BADGE_COUNTER.TAB.SET_BADGE_IN_LOGBOOK_TAB,
          payload: "0",
        });
      }, 1);
      setScreenLoading(true);
    }
  }, [isFocused]);

  useEffect(() => {
    if (screenLoading) {
      setTimeout(() => {
        logbookToBeSelected();
        filterTransactions();
        setScreenLoading(false);
      }, 1);
    }
  }, [screenLoading]);

  useEffect(() => {
    // if (filteredTransactions) {
    //   // console.log(filtered)
    //   let sum = [];
    //   filteredTransactions.transactions.forEach((section) =>
    //     section.data.forEach((transaction) => {
    //       if (transaction.details.in_out === "expense") {
    //         sum.push(-transaction.details.amount);
    //       }
    //       if (transaction.details.in_out === "income") {
    //         sum.push(transaction.details.amount);
    //       }
    //     })
    //   );
    //   const totalSum = sum.reduce((prev, curr) => prev + curr, 0) || 0;
    //   setTotalBalance(totalSum);
    // }
  }, [filteredTransactions]);
  const logbookToBeSelected = (logbook) => {
    setFilteredTransactions(null);
    if (
      categories.categories &&
      sortedTransactions.groupSorted.length &&
      logbooks.logbooks.length
    ) {
      if (targetLogbook) {
        setSelectedLogbook(targetLogbook);
        setTargetLogbook(null);
      } else {
        switch (true) {
          case logbook:
            setSelectedLogbook(logbook);
            break;

          case !selectedLogbook || !sortedTransactions?.logbookToOpen:
            setSelectedLogbook({
              name: logbooks.logbooks[0].logbook_name,
              logbook_id: logbooks.logbooks[0].logbook_id,
              logbook_currency: logbooks.logbooks[0].logbook_currency,
              key: logbooks.logbooks[0].logbook_id,
            });
            break;

          case selectedLogbook:
            break;

          case sortedTransactions?.logbookToOpen:
            setSelectedLogbook(sortedTransactions.logbookToOpen);
            break;

          default:
            setSelectedLogbook({
              name: logbooks.logbooks[0].logbook_name,
              logbook_id: logbooks.logbooks[0].logbook_id,
              logbook_currency: logbooks.logbooks[0].logbook_currency,
              key: logbooks.logbooks[0].logbook_id,
            });
            break;
        }
      }
    }

    // setCounter({
    //   logbookDeleteCounter: logbooks.logbookDeleteCounter,
    //   logbookPatchCounter: logbooks.logbookPatchCounter,
    // });
  };

  const filterTransactions = () => {
    if (selectedLogbook) {
      const filtered = sortedTransactions.groupSorted.find((logbook) => {
        return logbook.logbook_id === selectedLogbook.logbook_id;
      });
      // console.log(filtered)
      setFilteredTransactions(filtered.transactions?.map((section) => section));
    }

    // if (selectedLogbook && sortedTransactions) {
    //   const filtered = sortedTransactions.groupSorted.filter((logbook) => {
    //     return logbook.logbook_id === selectedLogbook.logbook_id;
    //   });
    //   setFilteredTransactions(
    //     filtered[0].transactions.map((transaction) => transaction)
    //   );
    // }
  };

  // const filterTransactions = useMemo(() => {
  //   return () => {
  //     if (selectedLogbook && sortedTransactions) {
  //       const filtered = sortedTransactions.groupSorted.filter((logbook) => {
  //         return logbook.logbook_id === selectedLogbook.logbook_id;
  //       });
  //       setFilteredTransactions(
  //         filtered[0].transactions.map((transaction) => transaction)
  //       );
  //     }
  //   };
  // }, [selectedLogbook, sortedTransactions.logbookToOpen]);

  const countTransactions = (selectedLogbook) => {
    if (selectedLogbook) {
      const filtered = sortedTransactions?.groupSorted?.find((logbook) => {
        return logbook.logbook_id === selectedLogbook.logbook_id;
      });
      let array = [];
      filtered?.transactions?.forEach((section) =>
        section.data.forEach((transaction) =>
          array.push(transaction.transaction_id)
        )
      );
      return array.length;
    }
  };

  const totalBalance = (selectedLogbook) => {
    if (selectedLogbook) {
      const filtered = sortedTransactions?.groupSorted?.find((logbook) => {
        return logbook.logbook_id === selectedLogbook.logbook_id;
      });
      let sum = [];
      filtered?.transactions?.forEach((section) =>
        section.data.forEach((transaction) => {
          if (transaction.details.in_out === "expense") {
            sum.push(-transaction.details.amount);
          }
          if (transaction.details.in_out === "income") {
            sum.push(transaction.details.amount);
          }
        })
      );
      return sum.reduce((prev, curr) => prev + curr, 0) || 0;
    }
  };

  return (
    <>
      {!screenLoading && (
        <View
          style={{
            height: "100%",
            backgroundColor: globalTheme.colors.background,
          }}
        >
          {/* Header */}
          {/* {!isLoading.status && filteredTransactions && ( */}
          {!screenLoading && !componentLoading && selectedLogbook && (
            <View
              style={[
                {
                  backgroundColor: globalTheme.colors.header,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 16,
                  zIndex: 1,
                },
              ]}
            >
              <View
                style={{
                  flex: 1.5,
                }}
              >
                <LogbookButton
                  width="100%"
                  selectedLogbookName={selectedLogbook?.name}
                  onPress={() => {
                    navigation.navigate(screenList.modalScreen, {
                      title: "Logbooks",
                      mainButtonLabel: "Select",
                      iconProps: {
                        name: "book",
                        pack: "IonIcons",
                      },
                      props: logbooks.logbooks
                        .sort((a, b) => {
                          return a.logbook_name.localeCompare(b.logbook_name);
                        })
                        .map((logbook) => {
                          return {
                            ...logbook,
                            name: logbook.logbook_name,
                            key: logbook.logbook_id,
                          };
                        }),
                      modalType: MODAL_TYPE_CONSTANTS.LIST,
                      selected: (item) => {
                        setTargetLogbook(item);
                      },
                      defaultOption: {
                        ...selectedLogbook,
                        name: selectedLogbook?.name,
                      },
                    });
                  }}
                />
              </View>

              {/* Number of Transactions */}
              <View
                style={{
                  flex: 1,
                  alignItems: "flex-end",
                }}
              >
                <TextPrimary
                  label={
                    (countTransactions(selectedLogbook) || "No") +
                    " Transactions"
                  }
                  style={{
                    color: globalTheme.colors.textHeader,
                  }}
                />
                {/* // TAG : Total main balance */}
                <TextPrimary
                  style={{
                    color: totalBalance(selectedLogbook)
                      .toString()
                      .includes("-")
                      ? globalTheme.colors.danger
                      : totalBalance(selectedLogbook) === 0
                      ? globalTheme.colors.textHeader
                      : globalTheme.colors.incomeAmount,
                  }}
                  label={`${
                    selectedLogbook?.logbook_currency?.symbol
                  } ${utils.getFormattedNumber({
                    value: totalBalance(selectedLogbook),
                    currencyCountryName: selectedLogbook.logbook_currency.name,
                    negativeSymbol:
                      appSettings.logbookSettings.negativeCurrencySymbol,
                  })}`}
                />
                {/* // TAG : Total secondary balance */}
                {appSettings.logbookSettings.showSecondaryCurrency && (
                  <TextPrimary
                    style={{
                      color: totalBalance(selectedLogbook)
                        .toString()
                        .includes("-")
                        ? globalTheme.colors.danger
                        : totalBalance(selectedLogbook) === 0
                        ? globalTheme.colors.textHeader
                        : globalTheme.colors.incomeAmount,
                    }}
                    label={`${
                      appSettings.logbookSettings.secondaryCurrency.symbol
                    } ${utils.getFormattedNumber({
                      value: utils.convertCurrency({
                        amount: totalBalance(selectedLogbook),
                        from: selectedLogbook.logbook_currency.name,
                        target:
                          appSettings.logbookSettings.secondaryCurrency.name,
                        globalCurrencyRates: globalCurrencyRates,
                      }),
                      currencyCountryName:
                        appSettings.logbookSettings.secondaryCurrency.name,
                      negativeSymbol:
                        appSettings.logbookSettings.negativeCurrencySymbol,
                    })}`}
                  />
                )}
                {/* <Text numberOfLines={1} style={{ ...globalStyles.lightTheme.textSecondary }}>
                                {!filteredTransactions.length ? 'No' : countTransactions(filteredTransactions)} Transactions
                            </Text> */}
              </View>
            </View>
          )}

          {/* CheckList Mode */}
          {/* {checkListMode.mode &&
                    <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 8 }]}>
                        <Text style={{ ...globalStyles.lightTheme.textSecondary }}>{checkListMode.length} selected</Text>
                    </View>} */}

          {/* Transaction Render */}
          {/* {!isLoading.status && filteredTransactions && ( */}
          {!screenLoading && !componentLoading && selectedLogbook && (
            <TransactionList
              selectedLogbook={selectedLogbook}
              // transactions={filteredTransactions}
              categories={categories.categories}
              onPress={(item) =>
                navigation.navigate(screenList.transactionPreviewScreen, {
                  transaction: item,
                  selectedLogbook: selectedLogbook,
                })
              }
              checkListMode={(item) => setCheckListMode(item)}
            />
          )}
        </View>
      )}
      {/* Loading data indicator */}
      {/* {isLoading.status && ( */}
      {screenLoading && (
        <View
          style={{
            backgroundColor: globalTheme.colors.background,
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loading />
        </View>
      )}
    </>
  );
};

export default LogbookScreen;
