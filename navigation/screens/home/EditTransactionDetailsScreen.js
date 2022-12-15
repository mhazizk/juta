import { useEffect, useRef, useState, useMemo } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import formatCurrency from "../../../assets/formatCurrency";
import { globalStyles, globalTheme } from "../../../assets/themes/globalStyles";
import Intl from "intl";
import "intl/locale-data/jsonp/en";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonSwitch,
} from "../../../components/Button";
import IonIcons from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import categories from "../../../database/userCategories";
import logbooks from "../../../database/userLogBooks";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLoading,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTransactions,
} from "../../../modules/GlobalContext";
import userTransactions from "../../../database/userTransactions";
import { ACTIONS } from "../../../modules/GlobalReducer";
import { setSortedTransactions } from "../../../modules/FetchData";
import { TextPrimary, TextSecondary } from "../../../components/Text";

const EditTransactionDetailsScreen = ({ route, navigation }) => {
  // ! useContext Section //
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { isLoading, dispatchLoading } = useGlobalLoading();
  // const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { categories, dispathCategories } = useGlobalCategories();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const [logbookToOpen, setLogbookToOpen] = useState(null);

  // ! useState Section //

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

  // Date State for Date Picker
  const [date, setDate] = useState(new Date());

  // ! useEffect Section //

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
        logbook_id: transaction.logbook_id,
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

  // ! useRef State //
  const inputNotes = useRef(null);

  // ! Function Section //

  // Set Date in Date Picker
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setTransaction({
      ...transaction,
      details: {
        ...transaction.details,
        date: new Date(currentDate).getTime(),
      },
    });
  };

  // Date Picker
  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  // Date Picker
  const showDatepicker = () => {
    showMode("date");
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
        return navigation.navigate("Loading Screen", {
          label: "Saving Transction ...",
          loadingType: "patchTransaction",
          logbookToOpen: logbookToOpen,
          patchTransaction: transaction,
          prevTransaction: prevTransaction,
          logbookToOpen: logbookToOpen,
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
            {/* // ! Amount Section */}
            <View
              style={{
                flex: 1,
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
                maxLength={20}
                textAlign="center"
                returnKeyType="done"
                keyboardType="number-pad"
                placeholder={Intl.NumberFormat("en-US", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(transaction.details.amount)}
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
                  const float = string
                    ? parseFloat(
                        parseFloat(string.replace(/,/g, "")).toFixed(2)
                      )
                    : 0;
                  setTransaction({
                    ...transaction,
                    details: {
                      ...transaction.details,
                      amount: float,
                    },
                  });
                }}
                clearButtonMode="while-editing"
                defaultValue={Intl.NumberFormat("en-US", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(transaction.details.amount)}
                value={Intl.NumberFormat("en-US", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(transaction.details.amount)}
              />
            </View>
            {/* </ScrollView> */}

            {/* // ! Details Section */}
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

            {/* // ! Transaction Type Section */}
            <TouchableNativeFeedback
              onPress={() =>
                navigation.navigate("Modal Screen", {
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

                  {/* // ! Container */}
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
                    {/* // ! Transaction Picker */}
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

            {/* // ! Type Section */}
            <TouchableNativeFeedback
              onPress={() =>
                navigation.navigate("Modal Screen", {
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

                  {/* // ! Container */}
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
                    {/* // ! Type Picker */}
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

            {/* // ! Date Section */}
            <TouchableNativeFeedback onPress={showDatepicker}>
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

                  {/* // ! Container */}
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
                    {/* // ! Date Picker */}
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
                  <IonIcons
                    name="chevron-forward"
                    size={18}
                    style={{ paddingLeft: 16 }}
                    color={appSettings.theme.style.colors.foreground}
                  />
                </View>
              </View>
            </TouchableNativeFeedback>

            {/* // ! Log Book Section */}
            <TouchableNativeFeedback
              onPress={() =>
                navigation.navigate("Modal Screen", {
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

                  {/* // ! Container */}
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
                    {/* // ! Book Picker */}
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

            {/* // ! Category Section */}
            <TouchableNativeFeedback
              onPress={() =>
                navigation.navigate("Modal Screen", {
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

                  {/* // ! Container */}
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
                    {/* // ! Category Picker */}
                    <IonIcons
                      name={selectedCategory?.icon?.name}
                      size={18}
                      style={{
                        display:
                          selectedCategory?.icon?.pack === "ion_icons"
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

            {/* // ! Notes Section */}
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

                  {/* // ! Container */}
                  {/* <View style={[globalStyles.lightTheme.view, { flexDirection: 'row', flex: 3, alignItems: 'center', justifyContent: 'center' }]}> */}

                  {/* <View style={{ backgroundColor: '#eee', borderRadius: 8, height: 48, justifyContent: 'center', paddingHorizontal: 16 }}> */}
                  {/* // ! Notes Input */}
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

          {/* // ! Line Separator */}
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

          {/* // ! Action Button */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
          >
            {/* // ! Cancel Button */}
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

            {/* // ! Save Button */}
            <View style={{ paddingLeft: 8 }}>
              <ButtonPrimary
                label="Save"
                theme={appSettings.theme}
                width={150}
                onPress={() => {
                  setTransaction({
                    ...transaction,
                    _timestamps: {
                      ...transaction._timestamps,
                      updated_at: Date.now(),
                    },
                  });
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
