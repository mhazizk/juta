import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
// import Intl from "intl";
// import { getLocales } from 'expo-localization';
// import "intl/locale-data/jsonp/en";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";
import firestore from "../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../api/firebase/firestoreCollectionNames";
import { globalStyles, globalTheme } from "../../assets/themes/globalStyles";
import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonSwitch,
} from "../../components/Button";
import DatePicker from "../../components/DatePicker";
import { TextPrimary, TextSecondary } from "../../components/Text";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLoading,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTransactions,
} from "../../reducers/GlobalContext";
import * as utils from "../../utils";

const EditTransactionDetailsScreen = ({ route, navigation }) => {
  // TAG : useContext Section //
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { isLoading, dispatchLoading } = useGlobalLoading();
  // const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { categories, dispathCategories } = useGlobalCategories();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const [logbookToOpen, setLogbookToOpen] = useState(null);

  // TAG : useState Section //

  // Loading State

  // Transaction State
  const [transaction, setTransaction] = useState(null);

  // Previous Transaction State
  const [prevTransaction, setPrevTransaction] = useState(null);

  // Logbook State
  const [selectedLogbook, setSelectedLogbook] = useState(null);

  // Category State
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Loaded User Logbooks
  const [loadedLogbooks, setLoadedLogbooks] = useState(null);

  // TAG : useEffect Section //

  useEffect(() => {
    // setLoading(true);
    // getFile();
    checkInitialTransaction();
    insertNameInUserLogBook();

    // console.log(transaction)
  }, []);

  useEffect(() => {
    // refresh
    // console.log(transaction)
    // findCategoryNameById();
    // findCategoryNameById();
  }, [transaction]);

  useEffect(() => {
    console.log(prevTransaction);
  }, [prevTransaction]);

  useEffect(() => {
    // refresh
    // console.log('rendered')
    console.log(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    // refresh
    console.log(selectedLogbook);
    if (selectedLogbook) {
      setLogbookToOpen({
        name: selectedLogbook.name,
        logbook_id: transaction?.logbook_id,
        logbook_currency: selectedLogbook.logbook_currency,
        key: transaction.logbook_id,
      });
    }
  }, [selectedLogbook]);

  useEffect(() => {
    // console.log(loadedLogbooks)
  }, [loadedLogbooks]);

  useEffect(() => {
    console.log(logbookToOpen);
  }, [logbookToOpen]);

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
    event.type === "dismissed";
    event.type === "set" &&
      setTransaction({
        ...transaction,
        details: {
          ...transaction.details,
          date: new Date(currentDate).getTime(),
        },
      });
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

  // Check Initial Transaction from Preview Screen
  const checkInitialTransaction = useMemo(() => {
    return () => {
      setPrevTransaction(route?.params?.transaction);
      setTransaction(route?.params?.transaction);
      setSelectedCategory(route?.params?.selectedCategory);
      setSelectedLogbook(route?.params?.selectedLogbook);
    };
  });

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
        const finalTransaction = {
          ...transaction,
          _timestamps: { ...transaction._timestamps, updated_at: Date.now() },
        };

        setTimeout(async () => {
          await firestore.setData(
            FIRESTORE_COLLECTION_NAMES.TRANSACTIONS,
            finalTransaction.transaction_id,
            finalTransaction
          );
        }, 1);

        return navigation.navigate(screenList.loadingScreen, {
          label: "Saving Transction ...",
          loadingType: "patchTransaction",
          logbookToOpen: logbookToOpen,
          patchTransaction: finalTransaction,
          prevTransaction: prevTransaction,
          initialSortedTransactionsPatchCounter:
            sortedTransactions.sortedTransactionsPatchCounter,
        });
    }
  };

  return (
    <>
      {transaction && selectedCategory && selectedLogbook && (
        <View
          style={[
            {
              backgroundColor: appSettings.theme.style.colors.background,
              height: "100%",
            },
          ]}
        >
          <ScrollView
            contentContainerStyle={{ flex: 1, justifyContent: "center" }}
          >
            {/* // TAG : Amount Section */}
            <TouchableOpacity
              onPress={() => inputAmount.current.focus()}
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <TextSecondary
                  label={selectedLogbook.logbook_currency.symbol}
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
                  maxLength={20}
                  textAlign="center"
                  returnKeyType="done"
                  keyboardType="number-pad"
                  // placeholder={Intl.NumberFormat("en-US", {
                  //   style: "decimal",
                  //   minimumFractionDigits: 2,
                  //   maximumFractionDigits: 2,
                  // }).format(transaction.details.amount)}
                  // placeholderTextColor={
                  //   appSettings.theme.style.text.textSecondary.color
                  // }
                  placeholder={utils.GetFormattedNumber({
                    value: transaction.details.amount,
                    currency: appSettings.logbookSettings.defaultCurrency.name,
                  })}
                  placeholderTextColor={
                    appSettings.theme.style.text.textSecondary.color
                  }
                  style={[
                    {
                      ...appSettings.theme.style.text.textPrimary,
                      paddingLeft: 0,
                      paddingVertical: 16,
                      paddingRight: 16,
                      minHeight: 36,
                      fontSize: 36,
                    },
                    {
                      color:
                        transaction.details.in_out === "income"
                          ? appSettings.theme.style.colors.incomeAmount
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
                style={{ fontSize: 24 }}
              />
            </View>

            {/* // TAG : Transaction Type Section */}
            <TouchableNativeFeedback
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
            >
              <View style={appSettings.theme.style.list.listContainer}>
                <View
                  style={{
                    ...appSettings.theme.style.list.listItem,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <IonIcons
                    name="swap-horizontal-sharp"
                    size={18}
                    style={{ paddingRight: 16 }}
                    color={appSettings.theme.style.colors.foreground}
                  />
                  <TextPrimary label="Transaction" style={{ flex: 1 }} />

                  {/* // TAG : Container */}
                  <View
                    style={[
                      {
                        flexDirection: "row",
                        flex: 0,
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 8,
                        borderRadius: 8,
                      },
                      {
                        backgroundColor:
                          transaction.details.in_out === "income"
                            ? "#c3f4f4"
                            : appSettings.theme.style.colors.secondary,
                      },
                    ]}
                  >
                    {/* // TAG : Transaction Picker */}
                    <TextPrimary
                      label={
                        transaction.details.in_out[0].toUpperCase() +
                        transaction.details.in_out.substring(1)
                      }
                      style={{
                        color:
                          transaction.details.in_out === "income"
                            ? "#00695c"
                            : appSettings.theme.style.text.textPrimary.color,
                      }}
                    />
                  </View>
                  <IonIcons
                    name="chevron-forward"
                    size={18}
                    style={{ paddingLeft: 16 }}
                    color={appSettings.theme.style.colors.foreground}
                  />
                </View>
              </View>
            </TouchableNativeFeedback>

            {/* // TAG : Type Section */}
            <TouchableNativeFeedback
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
            >
              <View style={appSettings.theme.style.list.listContainer}>
                <View
                  style={{
                    ...appSettings.theme.style.list.listItem,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome5
                    name="coins"
                    size={18}
                    style={{ paddingRight: 16 }}
                    color={appSettings.theme.style.colors.foreground}
                  />
                  <TextPrimary label="Type" style={{ flex: 1 }} />

                  {/* // TAG : Container */}
                  <View
                    style={[
                      {
                        flexDirection: "row",
                        flex: 0,
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 8,
                        borderRadius: 8,
                      },
                      {
                        backgroundColor:
                          transaction.details.in_out === "income"
                            ? "#c3f4f4"
                            : appSettings.theme.style.colors.secondary,
                      },
                    ]}
                  >
                    {/* // TAG : Type Picker */}
                    <TextPrimary
                      label={
                        !transaction?.details?.type
                          ? "Pick type"
                          : transaction?.details?.type[0].toUpperCase() +
                            transaction?.details?.type?.substring(1)
                      }
                      style={{
                        color:
                          transaction.details.in_out === "income"
                            ? "#00695c"
                            : appSettings.theme.style.text.textPrimary.color,
                      }}
                    />
                  </View>
                  <IonIcons
                    name="chevron-forward"
                    size={18}
                    style={{ paddingLeft: 16 }}
                    color={appSettings.theme.style.colors.foreground}
                  />
                </View>
              </View>
            </TouchableNativeFeedback>

            {/* // TAG : Date Section */}
            <TouchableNativeFeedback onPress={showDatePicker}>
              <View style={appSettings.theme.style.list.listContainer}>
                <View
                  style={{
                    ...appSettings.theme.style.list.listItem,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <IonIcons
                    name="calendar"
                    size={18}
                    style={{ paddingRight: 16 }}
                    color={appSettings.theme.style.colors.foreground}
                  />
                  {/* <FontAwesome5 name='calendar-alt' size={18} style={{ paddingRight: 16 }} /> */}
                  <TextPrimary label="Date" style={{ flex: 1 }} />

                  {/* // TAG : Container */}
                  <View
                    style={[
                      {
                        flexDirection: "row",
                        flex: 0,
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 8,
                        borderRadius: 8,
                      },
                      {
                        backgroundColor:
                          transaction.details.in_out === "income"
                            ? "#c3f4f4"
                            : appSettings.theme.style.colors.secondary,
                      },
                    ]}
                  >
                    {/* // TAG : Date Picker */}
                    <TextPrimary
                      label={
                        !transaction?.details?.date
                          ? "Pick date"
                          : new Date(transaction.details.date).toDateString()
                      }
                      style={{
                        color:
                          transaction.details.in_out === "income"
                            ? "#00695c"
                            : appSettings.theme.style.text.textPrimary.color,
                      }}
                    />
                  </View>
                  {transaction.details.date && (
                    <View
                      style={[
                        {
                          flexDirection: "row",
                          flex: 0,
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 8,
                          marginLeft: 8,
                          borderRadius: 8,
                        },
                        {
                          backgroundColor:
                            transaction.details.in_out === "income"
                              ? "#c3f4f4"
                              : appSettings.theme.style.colors.secondary,
                        },
                      ]}
                    >
                      <TextPrimary
                        label={
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
                        }
                        style={{
                          color:
                            transaction.details.in_out === "income"
                              ? "#00695c"
                              : appSettings.theme.style.text.textPrimary.color,
                        }}
                      />
                    </View>
                  )}
                  <IonIcons
                    name="chevron-forward"
                    size={18}
                    style={{ paddingLeft: 16 }}
                    color={appSettings.theme.style.colors.foreground}
                  />
                </View>
              </View>
            </TouchableNativeFeedback>

            {/* // TAG : Log Book Section */}
            <TouchableNativeFeedback
              onPress={() =>
                navigation.navigate(screenList.modalScreen, {
                  title: "Log Books",
                  modalType: "list",
                  props: loadedLogbooks,
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
            >
              <View style={appSettings.theme.style.list.listContainer}>
                <View
                  style={{
                    ...appSettings.theme.style.list.listItem,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <IonIcons
                    name="book"
                    size={18}
                    style={{ paddingRight: 16 }}
                    color={appSettings.theme.style.colors.foreground}
                  />
                  <TextPrimary label="From Book" style={{ flex: 1 }} />

                  {/* // TAG : Container */}
                  <View
                    style={[
                      {
                        flexDirection: "row",
                        flex: 0,
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 8,
                        borderRadius: 8,
                      },
                      {
                        backgroundColor:
                          transaction.details.in_out === "income"
                            ? "#c3f4f4"
                            : appSettings.theme.style.colors.secondary,
                      },
                    ]}
                  >
                    {/* // TAG : Book Picker */}
                    <TextPrimary
                      label={
                        !selectedLogbook?.name
                          ? "Pick Logbook"
                          : selectedLogbook?.name[0].toUpperCase() +
                            selectedLogbook?.name?.substring(1)
                      }
                      style={{
                        color:
                          transaction.details.in_out === "income"
                            ? "#00695c"
                            : appSettings.theme.style.text.textPrimary.color,
                      }}
                    />
                  </View>
                  <IonIcons
                    name="chevron-forward"
                    size={18}
                    style={{ paddingLeft: 16 }}
                    color={appSettings.theme.style.colors.foreground}
                  />
                </View>
              </View>
            </TouchableNativeFeedback>

            {/* // TAG : Category Section */}
            <TouchableNativeFeedback
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
            >
              <View style={appSettings.theme.style.list.listContainer}>
                <View
                  style={{
                    ...appSettings.theme.style.list.listItem,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <IonIcons
                    name="pricetags"
                    size={18}
                    style={{ paddingRight: 16 }}
                    color={appSettings.theme.style.colors.foreground}
                  />
                  <TextPrimary label="Category" style={{ flex: 1 }} />

                  {/* // TAG : Container */}
                  <View
                    style={[
                      {
                        flexDirection: "row",
                        flex: 0,
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 8,
                        borderRadius: 8,
                      },
                      {
                        backgroundColor:
                          transaction.details.in_out === "income"
                            ? "#c3f4f4"
                            : appSettings.theme.style.colors.secondary,
                      },
                    ]}
                  >
                    {/* // TAG : Category Picker */}
                    <IonIcons
                      name={selectedCategory?.icon?.name}
                      size={18}
                      style={{
                        display:
                          selectedCategory?.icon?.pack === "IonIcons"
                            ? "flex"
                            : "none",
                        paddingRight: 8,
                      }}
                      color={
                        selectedCategory?.icon?.color === "default"
                          ? appSettings.theme.style.colors.foreground
                          : selectedCategory?.icon?.color
                      }
                    />
                    <TextPrimary
                      label={
                        selectedCategory?.name
                          ? selectedCategory?.name[0].toUpperCase() +
                            selectedCategory?.name.substring(1)
                          : "Pick category"
                      }
                      style={{
                        color:
                          transaction.details.in_out === "income"
                            ? "#00695c"
                            : appSettings.theme.style.text.textPrimary.color,
                      }}
                    />
                  </View>
                  <IonIcons
                    name="chevron-forward"
                    size={18}
                    style={{ paddingLeft: 16 }}
                    color={appSettings.theme.style.colors.foreground}
                  />
                </View>
              </View>
            </TouchableNativeFeedback>

            {/* // TAG : Notes Section */}
            <TouchableNativeFeedback onPress={() => inputNotes.current.focus()}>
              <View style={appSettings.theme.style.list.listContainer}>
                <View
                  style={{
                    ...appSettings.theme.style.list.listItem,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <IonIcons
                    name="document-text"
                    size={18}
                    style={{ paddingRight: 16 }}
                    color={appSettings.theme.style.colors.foreground}
                  />
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
          </ScrollView>

          {/* // TAG : Line Separator */}
          <View
            style={{
              borderColor: "#bbb",
              borderBottomWidth: 1,
              height: 0,
              width: "80%",
              alignSelf: "center",
              paddingTop: 16,
            }}
          ></View>

          {/* // TAG : Action Button */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
          >
            {/* // TAG : Cancel Button */}
            <View style={{ paddingRight: 8 }}>
              <ButtonSecondary
                label="Cancel"
                width={150}
                theme={appSettings.theme}
                onPress={() => {
                  // setRawTransactionsLength(null)
                  navigation.goBack();
                }}
              />
            </View>

            {/* // TAG : Save Button */}
            <View style={{ paddingLeft: 8 }}>
              <ButtonPrimary
                label="Save"
                theme={appSettings.theme}
                width={150}
                onPress={() => {
                  checkFinalTransaction();
                }}
              />
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default EditTransactionDetailsScreen;
