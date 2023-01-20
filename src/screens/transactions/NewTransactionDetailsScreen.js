import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
// import Intl from "intl";
// import "intl/locale-data/jsonp/en";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert, ScrollView,
  Text,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { globalStyles } from "../../assets/themes/globalStyles";
import { ButtonPrimary, ButtonSecondary } from "../../components/Button";
import { TextPrimary } from "../../components/Text";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalCategories, useGlobalLogbooks,
  useGlobalRepeatedTransactions,
  useGlobalSortedTransactions, useGlobalUserAccount
} from "../../reducers/GlobalContext";
import * as utils from "../../utils";
import uuid from "react-native-uuid";
import firestore from "../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../api/firebase/firestoreCollectionNames";
import { ListItem } from "../../components/List";
import ListSection from "../../components/List/ListSection";
import REDUCER_ACTIONS from "../../reducers/reducer.action";
import SUBSCRIPTION_LIMIT from "../../features/subscription/model/subscriptionLimit";
import getSubscriptionLimit from "../../features/subscription/logic/getSubscriptionLimit";

const NewTransactionDetailsScreen = ({ route, navigation }) => {
  const repeatId = uuid.v4();
  // TAG : useContext Section //
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  // const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { sortedTransactions } = useGlobalSortedTransactions();
  const { categories } = useGlobalCategories();
  const { logbooks } = useGlobalLogbooks();
  const { repeatedTransactions, dispatchRepeatedTransactions } =
    useGlobalRepeatedTransactions();
  const { userAccount } = useGlobalUserAccount();

  // TAG : useState Section //

  // Loading State
  const [isLoading, setIsLoading] = useState(true);

  // Repated Transaction State
  const [localRepeatedTransactions, setLocalRepeatedTransactions] = useState({
    uid: null,
    repeat_id: null,
    repeat_status: "active",
    repeat_amount: 0,
    repeat_in_out: "expense",
    repeat_category_id: null,
    repeat_logbook_id: null,
    repeat_start_date: null,
    repeat_finish_date: null,
    next_repeat_date: null,
    repeat_notes: null,
    repeat_type: {
      name: "no repeat",
      id: "no_repeat",
      range: 0,
    },
    transactions: [],
    _timestamps: {
      created_at: Date.now(),
      created_by: userAccount.uid,
      updated_at: Date.now(),
      updated_by: userAccount.uid,
    },
  });

  // Transaction State
  const [transaction, setTransaction] = useState(null);

  // Logbook State
  const [selectedLogbook, setSelectedLogbook] = useState(null);

  // Category State
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Loaded User Logbooks
  const [loadedLogbooks, setLoadedLogbooks] = useState(null);

  // Transactions Length State
  // const [rawTransactionsLength, setRawTransactionsLength] = useState(null)

  // TAG : useEffect Section //

  useEffect(() => {
    getFirstLogbook();

    insertNameInUserLogBook();

    setTransaction({
      details: {
        in_out: "expense",
        amount: 0,
        type: "cash",
        date: Date.now(),
        notes: null,
        category_id: null,
      },
      _timestamps: {
        created_at: Date.now(),
        created_by: userAccount.uid,
        updated_at: Date.now(),
        updated_by: userAccount.uid,
      },
      _id: Date.now(),
      repeat_id: null,
      logbook_id: logbooks.logbooks[0].logbook_id,
      transaction_id: uuid.v4(),
      uid: userAccount.uid,
    });

    setIsLoading(false);

    // setRawTransactionsLength(null)
  }, []);

  useEffect(() => {
    // refresh
    // console.log(transaction);
    if (localRepeatedTransactions.repeat_id && transaction.repeat_id) {
      console.log(localRepeatedTransactions.repeat_id);
      console.log(transaction.repeat_id);
    }
    console.log(localRepeatedTransactions);
  }, [transaction, localRepeatedTransactions]);

  useEffect(() => {
    // refresh
    // console.log(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    // refresh
    // console.log({ selectedLogbook });
  }, [selectedLogbook]);

  useEffect(() => {
    // console.log(loadedLogbooks)
  }, [loadedLogbooks]);

  // useEffect(() => {

  // }, [rawTransactionsLength])

  // useEffect(() => {

  //     if (!rawTransactionsLength) {
  //         setRawTransactionsLength(rawTransactions.transactions.length)
  //     }

  // if (rawTransactionsLength && rawTransactionsLength < rawTransactions.transactions.length) {

  //     setRawTransactionsLength(null);

  //     saveFile();

  // }

  // }, [rawTransactions.transactions])

  // TAG : useRef State //
  const inputNotes = useRef(null);
  const inputAmount = useRef(null);

  // TAG : Function Section //

  // Set Date in Date Picker
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    event.type === "set" && showMode("time", currentDate);
    event.type === "dismissed";
  };
  const onChangeTime = (event, selectedDate) => {
    const currentDate = selectedDate;
    switch (event.type) {
      case "dismissed":
        break;

      case "set":
        setTransaction({
          ...transaction,
          details: {
            ...transaction.details,
            date: new Date(currentDate).getTime(),
          },
        });
        setLocalRepeatedTransactions({
          ...localRepeatedTransactions,
          repeat_start_date: new Date(currentDate).getTime(),
        });
        break;

      default:
        break;
    }
  };

  // Date Picker
  const showMode = (currentMode, selectedDate) => {
    if (currentMode === "date") {
      DateTimePickerAndroid.open({
        positiveButtonLabel: "Set",
        value: selectedDate,
        onChange: onChangeDate,
        mode: currentMode,
        is24Hour: true,
      });
    }
    if (currentMode === "time") {
      DateTimePickerAndroid.open({
        positiveButtonLabel: "Set",
        value: selectedDate,
        onChange: onChangeTime,
        mode: currentMode,
        is24Hour: true,
      });
    }
  };

  // Date Picker
  const showDatePicker = () => {
    showMode("date", new Date(transaction.details.date));
  };

  // Insert 'name' variable into User Logbooks
  const insertNameInUserLogBook = () => {
    const inserted = logbooks.logbooks.map((logbook) => ({
      ...logbook,
      name: logbook.logbook_name,
    }));
    setLoadedLogbooks(inserted);
  };

  const checkFinalTransaction = () => {
    switch (true) {
      case !transaction.details.amount:
        return alert("Please enter transaction amount");
      case !transaction.details.in_out:
        return alert("Please select transaction expense / income");
      case !transaction.details.type:
        return alert("Please select transaction type");
      case !transaction.details.date:
        return alert("Please select transaction date");
      case !transaction.logbook_id:
        return alert("Please select logbook");
      case !transaction.details.category_id:
        return alert("Please select transaction category");
      default:
        setTimeout(() => {
          if (transaction.repeat_id && localRepeatedTransactions.uid) {
            dispatchRepeatedTransactions({
              type: REDUCER_ACTIONS.REPEATED_TRANSACTIONS.INSERT,
              payload: {
                repeatedTransaction: localRepeatedTransactions,
                reducerUpdatedAt: Date.now(),
              },
            });
            setTimeout(async () => {
              await firestore.setData(
                FIRESTORE_COLLECTION_NAMES.REPEATED_TRANSACTIONS,
                localRepeatedTransactions.repeat_id,
                localRepeatedTransactions
              );
            }, 5000);
          }
        }, 1);
        setTimeout(async () => {
          await firestore.setData(
            FIRESTORE_COLLECTION_NAMES.TRANSACTIONS,
            transaction.transaction_id,
            transaction
          );
        }, 5000);
        return navigation.navigate(screenList.loadingScreen, {
          label: "Saving ...",
          loadingType: "insertTransaction",
          transaction: transaction,
          logbookToOpen: selectedLogbook,
          reducerUpdatedAt: Date.now(),
          // initialSortedTransactionsInsertCounter:
          //   sortedTransactions.sortedTransactionsInsertCounter,
        });
    }
  };

  const getFirstLogbook = () => {
    if (logbooks.logbooks.length > 0) {
      setSelectedLogbook({
        name: logbooks.logbooks[0].logbook_name,
        logbook_id: logbooks.logbooks[0].logbook_id,
        logbook_currency: logbooks.logbooks[0].logbook_currency,
      });

      // setTransaction({
      //   ...transaction,
      //   logbook_id: logbooks.logbooks[0].logbook_id,
      // });
    }
  };

  return (
    <>
      {!isLoading.status && transaction && (
        <View
          style={[
            {
              backgroundColor: appSettings.theme.style.colors.background,
              height: "100%",
            },
          ]}
        >
          <ScrollView
            contentContainerStyle={{
              minHeight: "100%",
              justifyContent: "center",
            }}
          >
            {/* // TAG : Amount Section */}
            <TouchableOpacity
              onPress={() => inputAmount.current.focus()}
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                // minHeight: Dimensions.get("window").height / 3,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <TextPrimary
                  label={
                    selectedLogbook?.logbook_currency?.symbol ||
                    appSettings.logbookSettings.defaultCurrency.symbol
                  }
                  style={{
                    paddingRight: 8,
                    color:
                      transaction.details.in_out === "income"
                        ? appSettings.theme.style.colors.incomeSymbol
                        : appSettings.theme.style.text.textSecondary.color,
                  }}
                />
                <TextInput
                  ref={inputAmount}
                  keyboardAppearance={
                    appSettings.theme.id === "dark" ? "dark" : "default"
                  }
                  maxLength={20}
                  textAlign="center"
                  returnKeyType="done"
                  keyboardType="number-pad"
                  // placeholder={utils.GetFormattedNumber({
                  //   value: transaction.details.amount,
                  //   currency: appSettings.logbookSettings.defaultCurrency.name,
                  // })}
                  placeholderTextColor={
                    appSettings.theme.style.text.textSecondary.color
                  }
                  style={[
                    {
                      ...appSettings.theme.style.text.textPrimary,
                      height: 36,
                      fontSize: 36,
                    },
                    {
                      color:
                        transaction.details.in_out === "income"
                          ? appSettings.theme.style.colors.incomeSymbol
                          : appSettings.theme.style.text.textPrimary.color,
                    },
                  ]}
                  onChangeText={(string) => {
                    let float = 0;
                    if (string) {
                      console.log({ string });
                      float = utils.RemoveNumberSeparator({
                        value: string,
                        currency: selectedLogbook.logbook_currency.name,
                      });
                    }
                    setTransaction({
                      ...transaction,
                      details: {
                        ...transaction.details,
                        amount: float,
                      },
                    });
                  }}
                  clearButtonMode="while-editing"
                  defaultValue={utils.GetFormattedNumber({
                    value: transaction.details.amount,
                    currency: selectedLogbook.logbook_currency.name,
                  })}
                  value={utils.GetFormattedNumber({
                    value: transaction.details.amount,
                    currency: selectedLogbook.logbook_currency.name,
                  })}
                />
              </View>
              {transaction?.details?.amount !== 0 && (
                <IonIcons
                  onPress={() =>
                    setTransaction({
                      ...transaction,
                      details: { ...transaction?.details, amount: 0 },
                    })
                  }
                  name="close-circle"
                  size={20}
                  style={{ padding: 16 }}
                  color={appSettings.theme.style.colors.foreground}
                />
              )}
            </TouchableOpacity>
            {/* </ScrollView> */}

            {/* // TAG : Details Section */}
            <View
              style={[
                {
                  ...appSettings.theme.style.list.listContainer,
                  justifyContent: "space-between",
                },
              ]}
            >
              <TextPrimary
                label={`${
                  transaction.details.in_out[0].toUpperCase() +
                  transaction.details.in_out.substring(1)
                } Details`}
                style={{
                  fontSize: 24,
                  paddingHorizontal: 16,
                }}
              />
            </View>

            <ListSection>
              {/* // TAG : Transaction */}
              <ListItem
                pressable
                leftLabel="Transaction"
                rightLabel={
                  transaction.details.in_out[0].toUpperCase() +
                  transaction.details.in_out.substring(1)
                }
                iconPack="IonIcons"
                iconLeftName="swap-horizontal"
                iconRightName="chevron-forward"
                useRightLabelContainer
                // iconInRightContainerName='book'
                rightLabelContainerStyle={{
                  flexDirection: "row",
                  maxWidth: "50%",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor:
                    transaction.details.in_out === "income"
                      ? "#c3f4f4"
                      : appSettings.theme.style.colors.secondary,
                }}
                rightLabelStyle={{
                  color:
                    transaction.details.in_out === "income"
                      ? "#00695c"
                      : appSettings.theme.style.text.textPrimary.color,
                }}
                onPress={() =>
                  navigation.navigate(screenList.modalScreen, {
                    title: "Transaction",
                    props: [{ name: "expense" }, { name: "income" }],
                    modalType: "list",
                    selected: (item) => {
                      setTransaction({
                        ...transaction,
                        details: {
                          ...transaction.details,
                          in_out: item.name,
                          type: null,
                        },
                      });
                      setSelectedCategory({});
                    },
                    default: { name: transaction.details.in_out },
                  })
                }
              />
              {/* // TAG : Type */}
              <ListItem
                pressable
                leftLabel="Type"
                rightLabel={
                  !transaction?.details?.type
                    ? "Pick type"
                    : transaction?.details?.type[0].toUpperCase() +
                      transaction?.details?.type?.substring(1)
                }
                iconPack="FontAwesome5"
                iconLeftName="coins"
                iconRightName="chevron-forward"
                useRightLabelContainer
                // iconInRightContainerName='book'
                rightLabelContainerStyle={{
                  flexDirection: "row",
                  maxWidth: "50%",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor:
                    transaction.details.in_out === "income"
                      ? "#c3f4f4"
                      : appSettings.theme.style.colors.secondary,
                }}
                rightLabelStyle={{
                  color:
                    transaction.details.in_out === "income"
                      ? "#00695c"
                      : appSettings.theme.style.text.textPrimary.color,
                }}
                onPress={() =>
                  navigation.navigate(screenList.modalScreen, {
                    title: "Type",
                    modalType: "list",
                    props:
                      transaction?.details?.in_out === "expense"
                        ? [{ name: "cash" }, { name: "loan" }]
                        : [{ name: "cash" }],
                    selected: (item) => {
                      setTransaction({
                        ...transaction,
                        details: { ...transaction.details, type: item.name },
                      });
                    },
                    default: { name: transaction.details.type },
                  })
                }
              />
              {/* // TAG : Date */}
              <ListItem
                pressable
                leftLabel="Date"
                rightLabel={`${
                  !transaction?.details?.date
                    ? "Pick date"
                    : new Date(transaction.details.date).toDateString()
                }, ${
                  !transaction?.details?.date
                    ? "Pick date"
                    : new Date(transaction.details.date)
                        .getHours()
                        .toString()
                        .padStart(2, "0") +
                      ":" +
                      new Date(transaction.details.date)
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")
                }`}
                iconPack="IonIcons"
                iconLeftName="calendar"
                iconRightName="chevron-forward"
                useRightLabelContainer
                // iconInRightContainerName='book'
                rightLabelContainerStyle={{
                  flexDirection: "row",
                  maxWidth: "50%",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor:
                    transaction.details.in_out === "income"
                      ? "#c3f4f4"
                      : appSettings.theme.style.colors.secondary,
                }}
                rightLabelStyle={{
                  color:
                    transaction.details.in_out === "income"
                      ? "#00695c"
                      : appSettings.theme.style.text.textPrimary.color,
                }}
                onPress={showDatePicker}
              />
              {/* // TAG : From Logbook */}
              <ListItem
                pressable
                leftLabel="From Logbook"
                rightLabel={
                  !selectedLogbook?.name
                    ? "Pick Logbook"
                    : selectedLogbook?.name[0].toUpperCase() +
                      selectedLogbook?.name?.substring(1)
                }
                iconPack="IonIcons"
                iconLeftName="book"
                iconRightName="chevron-forward"
                useRightLabelContainer
                // iconInRightContainerName='book'
                rightLabelContainerStyle={{
                  flexDirection: "row",
                  maxWidth: "50%",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor:
                    transaction.details.in_out === "income"
                      ? "#c3f4f4"
                      : appSettings.theme.style.colors.secondary,
                }}
                rightLabelStyle={{
                  color:
                    transaction.details.in_out === "income"
                      ? "#00695c"
                      : appSettings.theme.style.text.textPrimary.color,
                }}
                onPress={() =>
                  navigation.navigate(screenList.modalScreen, {
                    title: "Logbooks",
                    modalType: "list",
                    props: loadedLogbooks,
                    iconProps: {
                      name: "book",
                      pack: "IonIcons",
                    },
                    selected: (item) => {
                      setSelectedLogbook({
                        name: item.name,
                        logbook_id: item.logbook_id,
                        logbook_currency: item.logbook_currency,
                      });
                      setTransaction({
                        ...transaction,
                        logbook_id: item.logbook_id,
                      });
                    },
                    default: { name: selectedLogbook?.name },
                  })
                }
              />
              {/* // TAG : Category */}
              <ListItem
                pressable
                leftLabel="Category"
                rightLabel={
                  selectedCategory?.name
                    ? selectedCategory?.name[0].toUpperCase() +
                      selectedCategory?.name.substring(1)
                    : "Pick Category"
                }
                iconPack="IonIcons"
                iconLeftName="pricetags"
                iconRightName="chevron-forward"
                useRightLabelContainer
                iconInRightContainerName={selectedCategory?.icon?.name}
                rightLabelContainerStyle={{
                  flexDirection: "row",
                  maxWidth: "50%",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor:
                    transaction.details.in_out === "income"
                      ? "#c3f4f4"
                      : appSettings.theme.style.colors.secondary,
                }}
                iconColorInContainer={
                  selectedCategory?.icon?.color === "default"
                    ? appSettings.theme.style.colors.foreground
                    : selectedCategory?.icon?.color
                  // transaction.details.in_out === "income"
                  //   ? "#00695c"
                  //   : appSettings.theme.style.text.textPrimary.color
                }
                rightLabelStyle={{
                  color:
                    transaction.details.in_out === "income"
                      ? "#00695c"
                      : appSettings.theme.style.text.textPrimary.color,
                }}
                onPress={() =>
                  navigation.navigate(screenList.modalScreen, {
                    title: "Category",
                    modalType: "list",
                    props:
                      transaction.details.in_out === "expense"
                        ? categories.categories.expense
                        : categories.categories.income,
                    selected: (item) => {
                      setSelectedCategory(item);
                      setTransaction({
                        ...transaction,
                        details: {
                          ...transaction.details,
                          category_id: item.id,
                        },
                      });
                    },
                    default: selectedCategory,
                  })
                }
              />
            </ListSection>
            <ListSection>
              {/* // TAG : Notes Section */}
              <TouchableNativeFeedback
                onPress={() => inputNotes.current.focus()}
              >
                <View style={appSettings.theme.style.list.listContainer}>
                  <IonIcons
                    name="document-text"
                    size={18}
                    style={{ paddingRight: 16 }}
                    color={appSettings.theme.style.colors.foreground}
                  />
                  <View
                    style={{
                      ...appSettings.theme.style.list.listItem,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <TextPrimary label="Notes" style={{ flex: 1 }} />

                    {/* // TAG : Container */}
                    {/* <View style={[globalStyles.lightTheme.view, { flexDirection: 'row', flex: 3, alignItems: 'center', justifyContent: 'center' }]}> */}

                    {/* <View style={{ backgroundColor: '#eee', borderRadius: 8, height: 48, justifyContent: 'center', paddingHorizontal: 16 }}> */}
                    {/* // TAG : Notes Input */}
                    <TextInput
                      ref={inputNotes}
                      textAlign="right"
                      returnKeyType="done"
                      keyboardType="default"
                      placeholder="Add additional notes ..."
                      placeholderTextColor={
                        appSettings.theme.style.text.textSecondary.color
                      }
                      style={{
                        ...appSettings.theme.style.text.textPrimary,
                        flex: 5,
                        height: 48,
                        borderRadius: 8,
                        fontSize: 16,
                      }}
                      onChangeText={(string) => {
                        setTransaction({
                          ...transaction,
                          details: {
                            ...transaction.details,
                            notes: string,
                          },
                        });
                      }}
                      clearButtonMode="while-editing"
                      defaultValue={transaction.details.notes}
                      value={transaction.details.notes}
                    />
                  </View>
                  {transaction.details.notes && (
                    <IonIcons
                      onPress={() => {
                        setTransaction({
                          ...transaction,
                          details: {
                            ...transaction.details,
                            notes: "",
                          },
                        });
                      }}
                      name="close-circle"
                      size={18}
                      style={{ paddingLeft: 16 }}
                      color={appSettings.theme.style.colors.foreground}
                    />
                  )}

                  {/* </View> */}
                  {/* <IonIcons name='pencil' size={18} style={{ paddingLeft: 16 }} /> */}
                </View>
              </TouchableNativeFeedback>
            </ListSection>
            <ListSection>
              {/* // TAG : Repeat */}
              <ListItem
                pressable
                leftLabel="Repeat"
                rightLabel={
                  !localRepeatedTransactions.repeat_type?.name
                    ? "None"
                    : localRepeatedTransactions.repeat_type.name[0].toUpperCase() +
                      localRepeatedTransactions.repeat_type.name.substring(1)
                }
                disabled={
                  !getSubscriptionLimit(
                    userAccount.subscription.plan,
                    SUBSCRIPTION_LIMIT.RECURRING_TRANSACTIONS
                  )
                }
                iconPack="IonIcons"
                iconLeftName="repeat"
                iconRightName="chevron-forward"
                useRightLabelContainer
                // iconInRightContainerName="repeat"
                rightLabelContainerStyle={{
                  flexDirection: "row",
                  maxWidth: "50%",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor:
                    transaction.details.in_out === "income"
                      ? "#c3f4f4"
                      : appSettings.theme.style.colors.secondary,
                }}
                iconColorInContainer={
                  transaction.details.in_out === "income"
                    ? "#00695c"
                    : appSettings.theme.style.text.textPrimary.color
                }
                rightLabelStyle={{
                  color:
                    transaction.details.in_out === "income"
                      ? "#00695c"
                      : appSettings.theme.style.text.textPrimary.color,
                }}
                onPress={() => {
                  if (
                    getSubscriptionLimit(
                      userAccount.subscription.plan,
                      SUBSCRIPTION_LIMIT.RECURRING_TRANSACTIONS
                    )
                  ) {
                    navigation.navigate(screenList.modalScreen, {
                      title: "Repeat Transaction",
                      modalType: "list",
                      iconProps: {
                        name: "repeat",
                        pack: "IonIcons",
                      },
                      props: [
                        {
                          name: "no repeat",
                          id: "no_repeat",
                          range: 0,
                        },
                        {
                          name: "every day",
                          id: "every_day",
                          range: 60 * 60 * 24 * 1000,
                        },
                        {
                          name: "every week",
                          id: "every_week",
                          range: 60 * 60 * 24 * 7 * 1000,
                        },
                        {
                          name: "every 2 weeks",
                          id: "every_2_weeks",
                          range: 60 * 60 * 24 * 14 * 1000,
                        },
                        {
                          name: "every month",
                          id: "every_month",
                          range: 60 * 60 * 24 * 30 * 1000,
                        },
                        {
                          name: "every year",
                          id: "every_year",
                          range: 60 * 60 * 24 * 365 * 1000,
                        },
                      ],
                      selected: (item) => {
                        if (item.id === "no_repeat") {
                          setLocalRepeatedTransactions({
                            uid: userAccount.uid,
                            repeat_id: null,
                            repeat_type: item,
                            transactions: [],
                          });
                          setTransaction({
                            ...transaction,
                            repeat_id: null,
                          });
                        } else {
                          const repeat_id = uuid.v4();

                          setLocalRepeatedTransactions({
                            ...localRepeatedTransactions,
                            uid: userAccount.uid,
                            repeat_id: repeat_id,
                            repeat_amount: transaction.details.amount,
                            repeat_in_out: transaction.details.in_out,
                            repeat_category_id: transaction.details.category_id,
                            repeat_status: "active",
                            repeat_logbook_id: transaction.logbook_id,
                            repeat_notes: transaction.details.notes,
                            repeat_start_date: transaction.details.date,
                            repeat_finish_date: null,
                            next_repeat_date:
                              transaction.details.date + item.range,
                            repeat_type: item,
                            transactions: [transaction.transaction_id],
                          });
                          setTransaction({
                            ...transaction,
                            repeat_id: repeat_id,
                          });
                        }
                      },
                      default: localRepeatedTransactions.repeat_type,
                    });
                  } else {
                    Alert.alert(
                      "Upgrade Subscription",
                      "Upgrade your subscription to use repeating transactions"
                    );
                  }
                }}
              />
              {localRepeatedTransactions.repeat_type.id !== "no_repeat" && (
                <TextPrimary
                  label={
                    "Next repeat in " +
                    new Date(
                      localRepeatedTransactions.next_repeat_date
                    ).toDateString()
                  }
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 50,
                  }}
                />
              )}
            </ListSection>

            {/* // TAG : Line Separator */}
            {/* <View
              style={{
                borderColor: "#bbb",
                borderBottomWidth: 1,
                height: 0,
                width: "80%",
                alignSelf: "center",
                paddingTop: 16,
              }}
            ></View> */}

            {/* // TAG : Action Button */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 8,
                paddingBottom: 24,
                paddingHorizontal: 48,
              }}
            >
              {/* // TAG : Cancel Button */}
              <View style={{ flex: 1, paddingRight: 8 }}>
                <ButtonSecondary
                  label="Cancel"
                  // width={150}
                  theme={appSettings.theme}
                  onPress={() => {
                    // setRawTransactionsLength(null)
                    navigation.navigate(screenList.bottomTabNavigator);
                  }}
                />
              </View>

              {/* // TAG : Save Button */}
              <View style={{ flex: 2, paddingLeft: 8 }}>
                <ButtonPrimary
                  label="Save"
                  theme={appSettings.theme}
                  // width={150}
                  onPress={() => {
                    checkFinalTransaction();
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      )}

      {/* Loading data indicator */}
      {isLoading.status && !transaction && (
        <View
          style={{
            backgroundColor: "#fff",
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
          }}
        >
          <ActivityIndicator size={48} color="#000" style={{ padding: 16 }} />
          <Text style={{ ...globalStyles.darkTheme.textPrimary }}>
            Loading ...
          </Text>
        </View>
      )}

      {/* Saving data indicator */}
      {isLoading.status && transaction && (
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
          }}
        >
          <ActivityIndicator size={48} color="#fff" style={{ padding: 16 }} />
          <Text style={{ ...globalStyles.darkTheme.textPrimary }}>
            Saving ...
          </Text>
        </View>
      )}
    </>
  );
};

export default NewTransactionDetailsScreen;
