import { useIsFocused } from "@react-navigation/native";
// import "intl/locale-data/jsonp/en";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, SectionList, TouchableOpacity, View } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import IonIcons from "react-native-vector-icons/Ionicons";
import { TransactionListItem } from "../../components/List";
import Loading from "../../components/Loading";
import {
  TextButtonPrimary,
  TextPrimary,
  TextSecondary,
} from "../../components/Text";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLoading,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTransactions,
} from "../../reducers/GlobalContext";
// import Swipeable from 'react-native-gesture-handler/Swipeable';
import * as utils from "../../utils";
const { width, height } = Dimensions.get("screen");

const Transactions = ({
  logbook,
  transactions,
  categories,
  onPress,
  checkListMode,
}) => {
  // ! useState Section //
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { appSettings, setAppSettings } = useGlobalAppSettings();
  const [transactionsDate, setTransactionsDate] = useState(null);
  const [groupSortedTransactions, setGroupSortedTransactions] = useState(null);
  const [date, setDate] = useState(null);
  const [checkList, setCheckList] = useState(null);
  const [enableChecklistMode, setEnableCheckListMode] = useState(false);

  // ! useEffect Section //
  useEffect(() => {
    // if (transactions) {
    // }
    setDate(new Date().toLocaleDateString());
    // console.log(sortedTransactions)
  }, []);

  useEffect(() => {
    // if (transactions) {
    //     setSortedTransactions(transactions.sort(sortTransactions))
    // }
  }, [transactions]);

  useEffect(() => {
    // if (sortedTransactions) {
    //     groupSorted()
    // }
    // console.log(sortedTransactions)
  }, [sortedTransactions]);

  useEffect(() => {
    // refresh
  }, [transactionsDate]);

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

  // ! Function Section //

  // // Find Category Icon Name by Id
  // const findCategoryIconNameById = useMemo(() => {
  //   return (id) => {
  //     const filteredExpenseCategory = categories.expense.filter((category) => {
  //       return category.id === id;
  //     });
  //     const filteredIncomeCategory = categories.income.filter((category) => {
  //       return category.id === id;
  //     });

  //     if (filteredExpenseCategory.length) {
  //       return filteredExpenseCategory.map((item) => item.icon.name);
  //     } else {
  //       return filteredIncomeCategory.map((item) => item.icon.name);
  //     }
  //   };
  // }, [categories, transactions]);

  // // Find Category Name by Id
  // const findCategoryNameById = useMemo(() => {
  //   return (id) => {
  //     const filteredExpenseCategory = categories.expense.filter((category) => {
  //       return category.id === id;
  //     });
  //     const filteredIncomeCategory = categories.income.filter((category) => {
  //       return category.id === id;
  //     });

  //     if (filteredExpenseCategory.length) {
  //       const mapped = filteredExpenseCategory.map((item) => item.name);
  //       // console.log(mapped[0])
  //       return mapped[0][0].toUpperCase() + mapped[0].substring(1);
  //     } else {
  //       const mapped = filteredIncomeCategory.map((item) => item.name);
  //       return mapped[0][0].toUpperCase() + mapped[0].substring(1);
  //     }
  //   };
  // }, [categories, transactions]);

  // // Find Category Color by Id
  // const findCategoryColorById = useMemo(() => {
  //   return (id) => {
  //     const filteredExpenseCategory = categories.expense.filter((category) => {
  //       return category.id === id;
  //     });
  //     const filteredIncomeCategory = categories.income.filter((category) => {
  //       return category.id === id;
  //     });

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
  // }, [categories, transactions]);

  // // Find Category Icon Pack by Id
  // const findCategoryIconPackById = useMemo(() => {
  //   return (id) => {
  //     const filteredExpenseCategory = categories.expense.filter((category) => {
  //       return category.id === id;
  //     });
  //     const filteredIncomeCategory = categories.income.filter((category) => {
  //       return category.id === id;
  //     });

  //     if (filteredExpenseCategory.length) {
  //       const mapped = filteredExpenseCategory.map((item) => item.icon.pack);
  //       return mapped[0];
  //     } else {
  //       const mapped = filteredIncomeCategory.map((item) => item.icon.pack);
  //       return mapped[0];
  //     }
  //   };
  // }, [categories, transactions]);

  // const findCategoryTypeById = useMemo(() => {
  //   return (id) => {
  //     const filteredExpenseCategory = categories.expense.filter((category) => {
  //       return category.id === id;
  //     });
  //     const filteredIncomeCategory = categories.income.filter((category) => {
  //       return category.id === id;
  //     });

  //     if (filteredExpenseCategory.length) {
  //       return "expense";
  //     } else {
  //       return "income";
  //     }
  //   };
  // }, [categories, transactions]);

  // Sum Amount in Section
  const sumAmount = useMemo(() => {
    return (data) => {
      if (data) {
        let sum = [];
        data.forEach((transaction) => sum.push(transaction.details.amount));
        return sum.reduce((prev, curr) => prev + curr, 0);
      }
    };
  }, [transactions]);

  // Relative Date
  // const checkDate = useMemo(() => {
  //   return (data) => {
  //     const todayYear = new Date(date).getFullYear();
  //     const transactionsYear = new Date(data).getFullYear();
  //     const todayDate = new Date(date).getDate();
  //     const todayMonth = new Date(date).getMonth();
  //     const transactionDate = new Date(data).getDate();
  //     const transactionMonth = new Date(data).getMonth();

  //     switch (true) {
  //       case todayYear === transactionsYear &&
  //         todayMonth === transactionMonth &&
  //         todayDate - transactionDate === 0:
  //         return "Today";
  //       case todayYear === transactionsYear &&
  //         todayMonth === transactionMonth &&
  //         todayDate - transactionDate === 1:
  //         return "Yesterday";
  //       case todayYear === transactionsYear &&
  //         todayMonth === transactionMonth &&
  //         todayDate - transactionDate === 2:
  //         return new Date(data).toLocaleDateString(appSettings.locale, {
  //           weekday: "long",
  //         });
  //       case todayYear === transactionsYear &&
  //         todayMonth === transactionMonth &&
  //         todayDate - transactionDate === 3:
  //         return new Date(data).toLocaleDateString(appSettings.locale, {
  //           weekday: "long",
  //         });
  //       case todayYear === transactionsYear &&
  //         todayMonth === transactionMonth &&
  //         todayDate - transactionDate === 4:
  //         return new Date(data).toLocaleDateString(appSettings.locale, {
  //           weekday: "long",
  //         });
  //       case todayYear === transactionsYear &&
  //         todayMonth === transactionMonth &&
  //         todayDate - transactionDate === 5:
  //         return new Date(data).toLocaleDateString(appSettings.locale, {
  //           weekday: "long",
  //         });
  //       case todayYear === transactionsYear &&
  //         todayMonth === transactionMonth &&
  //         todayDate - transactionDate === 6:
  //         return new Date(data).toLocaleDateString(appSettings.locale, {
  //           weekday: "long",
  //         });
  //       case todayYear === transactionsYear &&
  //         todayMonth === transactionMonth &&
  //         todayDate - transactionDate === 7:
  //         return new Date(data).toLocaleDateString(appSettings.locale, {
  //           weekday: "long",
  //         });
  //       case todayYear === transactionsYear &&
  //         todayMonth === transactionMonth &&
  //         todayDate - transactionDate > 7 &&
  //         todayDate - transactionDate <= 31:
  //         return `${new Date(data).toLocaleDateString(appSettings.locale, {
  //           month: "long",
  //         })} ${new Date(data).getDate()}`;
  //       default:
  //         return `${new Date(data).toLocaleDateString(appSettings.locale, {
  //           month: "long",
  //         })}, ${new Date(data).toLocaleDateString(appSettings.locale, {
  //           day: "2-digit",
  //           year: "numeric",
  //         })}`;
  //     }
  //   };
  // }, [date, transactions]);

  // console.log(groupByCategory)

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
            { backgroundColor: appSettings.theme.style.colors.background },
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
            {/* // ! Clear Selection */}
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
                  color={appSettings.theme.style.colors.foreground}
                  style={{ paddingRight: 8 }}
                />
                <TextPrimary label="Clear Selection" />
              </View>
            </TouchableOpacity>

            {/* // ! Delete Selection */}
            {/* <TouchableOpacity
                            onPress={() => setEnableCheckListMode(!enableChecklistMode)}
                        >
                            <View style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <IonIcons name="trash" size={20} style={{ paddingRight: 8 }} />
                                <Text style={{ ...globalStyles.lightTheme.textPrimary }}>Delete Selection</Text>
                            </View>
                        </TouchableOpacity> */}

            {/* // ! Move Selection */}
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

      {transactions && (
        <SectionList
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={7}
          updateCellsBatchingPeriod={1000}
          contentContainerStyle={{ paddingBottom: 16 }}
          // removeClippedSubviews
          sections={transactions}
          keyExtractor={(item, index) => index.toString()}
          stickySectionHeadersEnabled
          renderSectionHeader={({ section }) => (
            <>
              {transactions && (
                <View
                  style={[
                    {
                      paddingTop: 16,
                      paddingBottom: 8,
                      paddingHorizontal: 16,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    },
                    {
                      backgroundColor:
                        appSettings.theme.style.colors.background,
                    },
                  ]}
                >
                  {/* Date Title */}
                  <TextSecondary
                    // label={checkDate(section.title)}
                    label={utils.RelativeDate({
                      dateToCheck: section.title,
                      currentDate: date,
                      locale: appSettings.locale,
                    })}
                  />

                  {/* Sum Amount */}
                  <View
                    style={[
                      {
                        padding: 8,
                        borderRadius: 8,
                        flexDirection: "row",
                        justifyContent: "space-between",
                      },
                      {
                        backgroundColor:
                          appSettings.theme.style.colors.secondary,
                      },
                    ]}
                  >
                    <TextButtonPrimary
                      label={logbook.logbook_currency.symbol}
                      style={{ paddingRight: 8 }}
                    />
                    <TextButtonPrimary
                      label={utils.GetFormattedNumber({
                        value: sumAmount(section.data),
                        currency: appSettings.currency.name,
                      })}
                    />
                  </View>
                </View>
              )}
            </>
          )}
          renderItem={({ item }) => {
            return (
              <>
                {/* <Text>{item.details.amount}</Text> */}
                {transactions && (
                  <TransactionListItem
                    categoryName={utils.FindById.findCategoryNameById({
                      id: item.details.category_id,
                      categories: categories,
                    })}
                    // categoryType={findCategoryTypeById(
                    //   item.details.category_id
                    // )}
                    transactionHour={item.details.date}
                    transactionType={item.details.in_out}
                    transactionNotes={item.details.notes}
                    iconLeftName={utils.FindById.findCategoryIconNameById({
                      id: item.details.category_id,
                      categories: categories,
                    })}
                    iconLeftColor={utils.FindById.findCategoryColorById({
                      id: item.details.category_id,
                      categories: categories,
                      defaultColor: appSettings.theme.style.colors.foreground,
                    })}
                    currency={logbook.logbook_currency}
                    transactionAmount={item.details.amount}
                    onPress={() => onPress(item)}
                  />
                )}
              </>
            );
          }}
        />
      )}

      {!transactions.length && (
        <View
          style={{
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Entypo
            name="documents"
            size={48}
            color={appSettings.theme.style.colors.secondary}
            style={{ padding: 16 }}
          />
          <TextSecondary label="No Transactions" />
        </View>
      )}
    </>
  );
};

const LogBookScreen = ({ route, navigation }) => {
  // ! useState Section //
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { isLoading, dispatchLoading } = useGlobalLoading();
  const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();

  // const [logbooks, setLogbooks] = useState(null);
  // const [categories, setCategories] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [data, setData] = useState(null);
  const [selectedLogbook, setSelectedLogbooks] = useState(null);
  const [selectedLogbooksCurrency, setSelectedLogbookCurrency] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState(null);
  const [checkListMode, setCheckListMode] = useState({
    mode: false,
    length: 0,
  });
  const [counter, setCounter] = useState({
    logbookDeleteCounter: 0,
    logbookPatchCounter: 0,
  });
  const [screenLoading, setScreenLoading] = useState(false);
  const [componentLoading, setComponentLoading] = useState(false);
  const isFocused = useIsFocused();

  // ! useEffect Section //
  useEffect(() => {
    if (isFocused) {
      setScreenLoading(true);
    }
  }, [isFocused]);

  useEffect(() => {
    if (screenLoading) {
      setTimeout(() => {
        logbooksToBeSelected();
        filterTransactions();
        setScreenLoading(false);
      }, 1);
    }
  }, [screenLoading]);

  // ! Function Section //
  const logbooksToBeSelected = useMemo(() => {
    return () => {
      try {
        if (categories.categories && sortedTransactions && logbooks.logbooks) {
          if (!selectedLogbook) {
            !sortedTransactions?.logbookToOpen
              ? setSelectedLogbooks({
                  name: logbooks.logbooks[0].logbook_name,
                  logbook_id: logbooks.logbooks[0].logbook_id,
                  logbook_currency: logbooks.logbooks[0].logbook_currency,
                  key: logbooks.logbooks[0].logbook_id,
                })
              : // set initial selected logbook
                setSelectedLogbooks(sortedTransactions.logbookToOpen);
          }
          if (
            selectedLogbook.logbook_id ===
            sortedTransactions.logbookToOpen.logbook_id
          ) {
            setSelectedLogbooks(sortedTransactions.logbookToOpen);
          }

          // set data to be passed in modal
          setData(
            logbooks.logbooks.map((logbook) => ({
              name: logbook.logbook_name,
              logbook_id: logbook.logbook_id,
              logbook_currency: logbook.logbook_currency,
              key: logbook.logbook_id,
            }))
          );

          setCounter({
            logbookDeleteCounter: logbooks.logbookDeleteCounter,
            logbookPatchCounter: logbooks.logbookPatchCounter,
          });

          // set initial selected logbook
        }
      } catch (error) {
        console.log(error);
      }
    };
  });

  const filterTransactions = useMemo(() => {
    return () => {
      if (selectedLogbook && sortedTransactions) {
        const filtered = sortedTransactions.groupSorted.filter((logbook) => {
          return logbook.logbook_id === selectedLogbook.logbook_id;
        });
        setFilteredTransactions(
          filtered[0].transactions.map((transaction) => transaction)
        );
      }
    };
  }, [selectedLogbook, sortedTransactions.logbookToOpen]);

  const countTransactions = (filtered) => {
    let array = [];
    filtered.forEach((section) =>
      section.data.forEach((transaction) =>
        array.push(transaction.transaction_id)
      )
    );
    return array.length;
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
          {!screenLoading && !componentLoading && filteredTransactions && (
            <View
              style={[
                {
                  backgroundColor: appSettings.theme.style.colors.header,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 16,
                  paddingBottom: 8,
                },
              ]}
            >
              <TouchableOpacity
                style={{ flexShrink: 1, flexGrow: 1, maxWidth: "70%" }}
                onPress={() =>
                  navigation.navigate("Modal Screen", {
                    title: "Log Books",
                    props: data,
                    modalType: "list",
                    selected: (item) => {
                      // navigation.navigate('Loading Screen', {
                      //     loadingType: 'switchLogBook'
                      // })
                      setSelectedLogbooks(item);
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
                      borderRadius: 8,
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
                  {/* <Text
                                    numberOfLines={1}
                                    style={{ ...globalStyles.lightTheme.textPrimary, flex: 1 }}>
                                    {selectedLogbook?.name[0].toUpperCase() + selectedLogbook?.name.substring(1)}
                                </Text> */}
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
                  label={`${
                    !filteredTransactions.length
                      ? "No"
                      : countTransactions(filteredTransactions)
                  } Transactions`}
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
          {!screenLoading && !componentLoading && filteredTransactions && (
            <Transactions
              logbook={selectedLogbook}
              transactions={filteredTransactions}
              categories={categories.categories}
              onPress={(item) =>
                navigation.navigate("Transaction Preview Screen", {
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

export default LogBookScreen;
