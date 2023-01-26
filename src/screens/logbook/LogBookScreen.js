import { useIsFocused } from "@react-navigation/native";
// import "intl/locale-data/jsonp/en";
import { useEffect, useState } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import Loading from "../../components/Loading";
import { TextButtonPrimary, TextSecondary } from "../../components/Text";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalBadgeCounter,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
} from "../../reducers/GlobalContext";
import REDUCER_ACTIONS from "../../reducers/reducer.action";
// import Swipeable from 'react-native-gesture-handler/Swipeable';
import TransactionList from "../../features/transactions/components/TransactionList";
const { width, height } = Dimensions.get("screen");

const LogbookScreen = ({ route, navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  // const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();

  // const [logbooks, setLogbooks] = useState(null);
  // const [categories, setCategories] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [selectedLogbook, setSelectedLogbooks] = useState(null);
  const [targetLogbook, setTargetLogbook] = useState(null);
  const [selectedLogbooksCurrency, setSelectedLogbookCurrency] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState(null);
  const [checkListMode, setCheckListMode] = useState({
    mode: false,
    length: 0,
  });
  // const [counter, setCounter] = useState({
  //   logbookDeleteCounter: 0,
  //   logbookPatchCounter: 0,
  // });
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
    // setTimeout(() => {
    //   dispatchBadgeCounter({
    //     type: REDUCER_ACTIONS.BADGE_COUNTER.TAB.SET_BADGE_IN_LOGBOOK_TAB,
    //     payload: "0",
    //   });
    // }, 1);
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

  const logbookToBeSelected = (logbook) => {
    setFilteredTransactions(null);
    if (
      categories.categories &&
      sortedTransactions.groupSorted.length &&
      logbooks.logbooks.length
    ) {
      if (targetLogbook) {
        setSelectedLogbooks(targetLogbook);
        setTargetLogbook(null);
      } else {
        switch (true) {
          case logbook:
            setSelectedLogbooks(logbook);
            break;

          case !selectedLogbook || !sortedTransactions?.logbookToOpen:
            setSelectedLogbooks({
              name: logbooks.logbooks[0].logbook_name,
              logbook_id: logbooks.logbooks[0].logbook_id,
              logbook_currency: logbooks.logbooks[0].logbook_currency,
              key: logbooks.logbooks[0].logbook_id,
            });
            break;

          case selectedLogbook:
            break;

          case sortedTransactions?.logbookToOpen:
            setSelectedLogbooks(sortedTransactions.logbookToOpen);
            break;

          default:
            setSelectedLogbooks({
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
      setFilteredTransactions(
        filtered.transactions.map((transaction) => transaction)
      );
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

  const countTransactions = () => {
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

  return (
    <>
      {!screenLoading && (
        <View
          style={{
            height: "100%",
            backgroundColor: appSettings.theme.style.colors.background,
          }}
        >
          {/* Header */}
          {/* {!isLoading.status && filteredTransactions && ( */}
          {!screenLoading && !componentLoading && selectedLogbook && (
            <View
              style={[
                {
                  backgroundColor: appSettings.theme.style.colors.header,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 16,
                },
              ]}
            >
              <TouchableOpacity
                style={{ flexShrink: 1, flexGrow: 1, maxWidth: "70%" }}
                onPress={() =>
                  navigation.navigate(screenList.modalScreen, {
                    title: "Logbooks",
                    mainButtonLabel: "Select",
                    iconProps: {
                      name: "book",
                      pack: "IonIcons",
                    },
                    props: logbooks.logbooks.map((logbook) => {
                      return {
                        ...logbook,
                        name: logbook.logbook_name,
                        key: logbook.logbook_id,
                      };
                    }),
                    modalType: "list",
                    selected: (item) => {
                      setTargetLogbook(item);
                    },
                    default: { name: selectedLogbook?.name },
                  })
                }
              >
                <View
                  style={[
                    {
                      height: 48,
                      paddingLeft: 16,
                      flexDirection: "row",
                      borderRadius: 16,
                      justifyContent: "space-between",
                      alignItems: "center",
                    },
                    {
                      backgroundColor:
                        appSettings.theme.style.colors.foreground,
                    },
                  ]}
                >
                  <TextButtonPrimary
                    label={
                      selectedLogbook?.name[0].toUpperCase() +
                      selectedLogbook?.name.substring(1)
                    }
                    style={{ flex: 1 }}
                    numberOfLines={1}
                  />
                  <IonIcons
                    name="chevron-down"
                    size={18}
                    color={appSettings.theme.style.colors.background}
                    style={{ flexShrink: 0, paddingHorizontal: 16 }}
                  />
                </View>
              </TouchableOpacity>

              {/* Number of Transactions */}
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <TextSecondary
                  label={(countTransactions() || "No") + " Transactions"}
                />
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
            backgroundColor: appSettings.theme.style.colors.background,
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
