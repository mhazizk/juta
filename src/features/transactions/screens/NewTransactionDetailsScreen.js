import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
// import Intl from "intl";
// import "intl/locale-data/jsonp/en";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { ButtonPrimary, ButtonSecondary } from "../../../components/Button";
import { TextPrimary } from "../../../components/Text";
import screenList from "../../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalCurrencyRates,
  useGlobalLoan,
  useGlobalLogbooks,
  useGlobalRepeatedTransactions,
  useGlobalSortedTransactions,
  useGlobalFeatureSwitch,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import * as utils from "../../../utils";
import uuid from "react-native-uuid";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import REDUCER_ACTIONS from "../../../reducers/reducer.action";
import FEATURE_NAME from "../../../features/subscription/model/featureName";
import getFeatureLimit from "../../../features/subscription/logic/getFeatureLimit";
import { uploadAndGetAttachmentImageURL } from "../../../api/firebase/cloudStorage";
import * as ImagePicker from "expo-image-picker";
import LOADING_TYPES from "../../../screens/modal/loading.type";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import transactionDetailsModel from "../models/transactionDetailsModel";
import ActionButtonWrapper from "../../../components/ActionButtonWrapper";
import MODAL_TYPE_CONSTANTS from "../../../constants/modalTypeConstants";
import Animated, {
  BounceIn,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import ImageViewer from "../../image-viewer/components/ImageViewer";

const NewTransactionDetailsScreen = ({ route, navigation }) => {
  const repeatId = uuid.v4();
  // TAG : useContext Section //
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { sortedTransactions } = useGlobalSortedTransactions();
  const { categories } = useGlobalCategories();
  const { logbooks } = useGlobalLogbooks();
  const { globalFeatureSwitch } = useGlobalFeatureSwitch();
  const { globalCurrencyRates } = useGlobalCurrencyRates();
  const { repeatedTransactions, dispatchRepeatedTransactions } =
    useGlobalRepeatedTransactions();
  const { userAccount } = useGlobalUserAccount();
  const { globalLoan } = useGlobalLoan();
  const [selectedLoanContact, setSelectedLoanContact] = useState(
    route.params?.selectedLoanContact || null
  );
  const [image, setImage] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loanContacts, setLoanContacts] = useState(globalLoan?.contacts);
  const [transaction, setTransaction] = useState(null);
  const [selectedLogbook, setSelectedLogbook] = useState(
    route.params?.selectedLogbook || null
  );
  const [selectedCategory, setSelectedCategory] = useState(
    route.params?.selectedCategory || null
  );
  const [loadedLogbooks, setLoadedLogbooks] = useState(null);
  const [loanDetails, setLoanDetails] = useState(null);
  const [localRepeatedTransactions, setLocalRepeatedTransactions] = useState({
    uid: null,
    repeat_id: null,
    repeat_transaction_type: "cash",
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

  // TAG : useEffect Section //

  useEffect(() => {
    getFirstLogbook();

    insertNameInUserLogBook();

    // const transaction_id = uuid.v4();

    const newTransaction = transactionDetailsModel({
      userAccountUid: userAccount.uid,
      logbookId:
        selectedLogbook?.logbook_id || logbooks?.logbooks[0]?.logbook_id,
    });

    setTransaction(route.params?.newTransaction || newTransaction);

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (transaction) {
      setLocalRepeatedTransactions({
        ...localRepeatedTransactions,
        uid: userAccount.uid,
        repeat_amount: transaction.details.amount,
        repeat_in_out: transaction.details.in_out,
        repeat_transaction_type: transaction.details.type,
        repeat_category_id: transaction.details.category_id,
        repeat_logbook_id: transaction.logbook_id,
        repeat_notes: transaction.details.notes,
        repeat_start_date: transaction.details.date,
        repeat_finish_date: null,
      });
    }
  }, [transaction]);

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
  const inputLenderName = useRef(null);
  const inputAmount = useRef(null);

  // TAG : Function Section //

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
      case !transaction.details.date:
        return alert("Please select transaction date");
      case !transaction.logbook_id:
        return alert("Please select logbook");
      case !transaction.details.category_id:
        return alert("Please select transaction category");
      case transaction.details.category_id.includes("debt") &&
        (!transaction.details.loan_details.from_uid ||
          !transaction.details.loan_details.to_uid):
        return alert("Please enter lender name");
      case transaction.details.category_id.includes("loan") &&
        (!transaction.details.loan_details.from_uid ||
          !transaction.details.loan_details.to_uid):
        return alert("Please enter borrower name");

      default:
        break;
    }

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

    // const finalPatchLoanContact = {
    //   ...selectedLoanContact,
    //   transactions_id: [
    //     ...selectedLoanContact.transactions_id,
    //     transaction.transaction_id,
    //   ],
    // };

    // check if selected contact will be paid off by this transaction
    const isPaid = utils.findTransactionsByIds({
      transactionIds: selectedLoanContact?.transactions_id,
      groupSorted: sortedTransactions.groupSorted,
      callback: (transactionDetailsList) => {
        return utils.checkIfLoanContactWillBePaid({
          newTransaction: transaction,
          transactionDetailsList,
          globalCurrencyRates,
          groupSorted: sortedTransactions.groupSorted,
          logbooks: logbooks.logbooks,
          targetCurrencyName: selectedLogbook?.logbook_currency.name,
        });
      },
    });

    return navigation.navigate(screenList.loadingScreen, {
      isPaid,
      label: "Saving...",
      loadingType: LOADING_TYPES.TRANSACTIONS.INSERT_ONE,
      transaction: transaction,
      logbookToOpen: selectedLogbook,
      targetLoanContactUid: selectedLoanContact?.contact_uid || null,
      insertTransactionToLoanContact: selectedLoanContact?.contact_uid
        ? transaction.transaction_id
        : null,
      newGlobalLoanTimestamps: {
        ...globalLoan._timestamps,
        updated_at: Date.now(),
        updated_by: userAccount.uid,
      },
      reducerUpdatedAt: Date.now(),
      targetScreen: screenList.bottomTabNavigator,
    });
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
              backgroundColor: globalTheme.colors.background,
              height: "100%",
            },
          ]}
        >
          <CustomScrollView>
            <IonIcons
              name={selectedCategory?.icon?.name}
              size={400}
              style={{
                position: "absolute",
                top: "0%",
                bottom: 0,
                right: "-30%",
                zIndex: -1,
              }}
              color={utils.hexToRgb({
                hex: globalTheme.colors.secondary,
                opacity: 0.3,
              })}
            />

            {/* // TAG : Amount Section */}
            <TouchableOpacity
              onPress={() => inputAmount.current.focus()}
              style={{
                minHeight: Dimensions.get("window").height / 3,
                minWidth: "100%",
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
                <TextPrimary
                  label={
                    selectedLogbook?.logbook_currency?.symbol ||
                    appSettings.logbookSettings.defaultCurrency.symbol
                  }
                  style={{
                    fontSize: 24,
                    paddingRight: 8,
                    color:
                      transaction.details.in_out === "income"
                        ? globalTheme.colors.incomeSymbol
                        : globalTheme.text.textSecondary.color,
                  }}
                />
                <TextInput
                  ref={inputAmount}
                  keyboardAppearance={
                    appSettings.theme_id.includes("dark") ? "dark" : "default"
                  }
                  maxLength={20}
                  textAlign="center"
                  returnKeyType="done"
                  keyboardType="number-pad"
                  placeholderTextColor={globalTheme.text.textSecondary.color}
                  style={[
                    {
                      ...globalTheme.text.textPrimary,
                      paddingVertical: 16,
                      minHeight: 36,
                      fontSize: 36,
                    },
                    {
                      color:
                        transaction.details.in_out === "income"
                          ? globalTheme.colors.incomeSymbol
                          : globalTheme.text.textPrimary.color,
                    },
                  ]}
                  onChangeText={(string) => {
                    let float = 0;
                    if (string) {
                      console.log({ string });
                      float = utils.removeNumberSeparator({
                        value: string,
                        currency: selectedLogbook.logbook_currency.name,
                      });
                    }
                    console.log({ float });
                    setTransaction({
                      ...transaction,
                      details: {
                        ...transaction.details,
                        amount: float,
                      },
                    });
                  }}
                  clearButtonMode="never"
                  defaultValue={utils.getFormattedNumber({
                    value: transaction.details.amount,
                    currencyCountryName: selectedLogbook.logbook_currency.name,
                    negativeSymbol:
                      appSettings.logbookSettings.negativeCurrencySymbol,
                  })}
                  value={utils.getFormattedNumber({
                    value: transaction.details.amount,
                    currencyCountryName: selectedLogbook.logbook_currency.name,
                    negativeSymbol:
                      appSettings.logbookSettings.negativeCurrencySymbol,
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
                  style={{
                    padding: 16,
                  }}
                  color={globalTheme.colors.foreground}
                />
              )}
            </TouchableOpacity>
            {/* </ScrollView> */}

            {/* // TAG : Details Section */}
            <View
              style={[
                {
                  justifyContent: "flex-start",
                  paddingBottom: 16,
                  paddingLeft: 16,
                  width: "100%",
                },
              ]}
            >
              <TextPrimary
                label={`${utils.upperCaseThisFirstLetter(
                  transaction.details.in_out
                )} Details`}
                style={{
                  fontSize: 24,
                }}
              />
            </View>

            <ListSection>
              {/* // TAG : Transaction */}
              <ListItem
                pressable
                leftLabel="Transaction"
                rightLabel={utils.upperCaseThisFirstLetter(
                  transaction.details.in_out
                )}
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
                      ? globalTheme.list.incomeContainer.backgroundColor
                      : globalTheme.colors.secondary,
                }}
                rightLabelStyle={{
                  color:
                    transaction.details.in_out === "income"
                      ? globalTheme.list.incomeContainer.color
                      : globalTheme.text.textPrimary.color,
                }}
                onPress={() =>
                  navigation.navigate(screenList.modalScreen, {
                    title: "Transaction",
                    props: [{ name: "expense" }, { name: "income" }],
                    modalType: MODAL_TYPE_CONSTANTS.LIST,
                    selected: (item) => {
                      setTransaction({
                        ...transaction,
                        details: {
                          ...transaction.details,
                          in_out: item.name,
                          category_id: null,
                          loan_details: {
                            from_uid: null,
                            to_uid: null,
                          },
                        },
                      });
                      setSelectedCategory(null);
                      setSelectedLoanContact(null);
                    },
                    defaultOption: { name: transaction.details.in_out },
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
                    : new Date(transaction?.details?.date).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
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
                      ? globalTheme.list.incomeContainer.backgroundColor
                      : globalTheme.colors.secondary,
                }}
                rightLabelStyle={{
                  color:
                    transaction.details.in_out === "income"
                      ? globalTheme.list.incomeContainer.color
                      : globalTheme.text.textPrimary.color,
                }}
                onPress={() => {
                  switch (Platform.OS) {
                    case "android":
                      return utils.datePicker({
                        initialDateInMillis: transaction?.details?.date,
                        pickerStyle: "dateAndTime",
                        callback: (dateInMillis) => {
                          setTransaction({
                            ...transaction,
                            details: {
                              ...transaction.details,
                              date: dateInMillis,
                            },
                          });
                          setLocalRepeatedTransactions({
                            ...localRepeatedTransactions,
                            repeat_start_date: dateInMillis,
                          });
                        },
                      });

                    case "ios":
                      return navigation.navigate(screenList.modalScreen, {
                        title: "Select date",
                        modalType: MODAL_TYPE_CONSTANTS.DATE_AND_TIME_PICKER,
                        defaultOption: transaction?.details?.date,
                        selected: (dateInMillis) => {
                          setTransaction({
                            ...transaction,
                            details: {
                              ...transaction.details,
                              date: dateInMillis,
                            },
                          });
                          setLocalRepeatedTransactions({
                            ...localRepeatedTransactions,
                            repeat_start_date: dateInMillis,
                          });
                        },
                      });

                    default:
                      return;
                  }
                }}
              />
              {/* // TAG : From Logbook */}
              <ListItem
                pressable
                leftLabel="From Logbook"
                rightLabel={
                  !selectedLogbook?.name
                    ? "Pick Logbook"
                    : utils.upperCaseThisFirstLetter(selectedLogbook?.name)
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
                      ? globalTheme.list.incomeContainer.backgroundColor
                      : globalTheme.colors.secondary,
                }}
                rightLabelStyle={{
                  color:
                    transaction.details.in_out === "income"
                      ? globalTheme.list.incomeContainer.color
                      : globalTheme.text.textPrimary.color,
                }}
                onPress={() =>
                  navigation.navigate(screenList.modalScreen, {
                    title: "Logbooks",
                    modalType: MODAL_TYPE_CONSTANTS.LIST,
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
                    defaultOption: { name: selectedLogbook?.name },
                  })
                }
              />
              {/* // TAG : Category */}
              <ListItem
                pressable
                leftLabel="Category"
                rightLabel={
                  selectedCategory?.name
                    ? utils.upperCaseThisFirstLetter(selectedCategory?.name)
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
                      ? globalTheme.list.incomeContainer.backgroundColor
                      : globalTheme.colors.secondary,
                }}
                iconColorInContainer={
                  selectedCategory?.icon?.color === "default" &&
                  transaction.details.in_out === "income"
                    ? globalTheme.list.incomeContainer.color
                    : selectedCategory?.icon?.color === "default"
                    ? globalTheme.colors.foreground
                    : selectedCategory?.icon?.color
                }
                rightLabelStyle={{
                  color:
                    transaction.details.in_out === "income"
                      ? globalTheme.list.incomeContainer.color
                      : globalTheme.text.textPrimary.color,
                }}
                onPress={() =>
                  navigation.navigate(screenList.modalScreen, {
                    title: "Select category",
                    modalType: MODAL_TYPE_CONSTANTS.LIST,
                    props:
                      transaction.details.in_out === "expense"
                        ? categories.categories.expense.sort((a, b) => {
                            return a.name.localeCompare(b.name);
                          })
                        : categories.categories.income.sort((a, b) => {
                            return a.name.localeCompare(b.name);
                          }),
                    selected: (item) => {
                      setSelectedCategory(item);
                      setSelectedLoanContact(null);
                      const itemId = item.id;
                      switch (true) {
                        case itemId === "debt" || itemId === "loan_collection":
                          setTransaction({
                            ...transaction,
                            details: {
                              ...transaction.details,
                              category_id: item.id,
                              loan_details: {
                                ...transaction.details.loan_details,
                                to_uid: userAccount.uid,
                                from_uid: null,
                              },
                            },
                          });

                          break;
                        case itemId === "loan" || itemId === "debt_payment":
                          setTransaction({
                            ...transaction,
                            details: {
                              ...transaction.details,
                              category_id: item.id,
                              loan_details: {
                                ...transaction.details.loan_details,
                                from_uid: userAccount.uid,
                                to_uid: null,
                              },
                            },
                          });

                          break;

                        default:
                          setTransaction({
                            ...transaction,
                            details: {
                              ...transaction.details,
                              category_id: item.id,
                              loan_details: {
                                ...transaction.details.loan_details,
                                from_uid: null,
                                to_uid: null,
                              },
                            },
                          });
                          break;
                      }
                    },
                    defaultOption: selectedCategory,
                  })
                }
              />
            </ListSection>
            {(transaction.details.category_id?.toLowerCase().includes("loan") ||
              transaction.details.category_id
                ?.toLowerCase()
                .includes("debt")) && (
              <ListSection>
                {/* // TAG : Lender / Borrower name */}
                <ListItem
                  pressable
                  leftLabel={
                    transaction.details.category_id.includes("loan")
                      ? "Borrower name"
                      : "Lender name"
                  }
                  rightLabel={
                    selectedLoanContact?.contact_name
                      ? utils.upperCaseThisFirstLetter(
                          selectedLoanContact?.contact_name
                        )
                      : transaction.details.category_id.includes("loan")
                      ? "Add"
                      : "Add"
                  }
                  iconPack="IonIcons"
                  iconLeftName="person"
                  iconRightName="chevron-forward"
                  useRightLabelContainer={
                    selectedLoanContact?.contact_name ? true : false
                  }
                  iconInRightContainerName="person"
                  rightLabelContainerStyle={{
                    flexDirection: "row",
                    maxWidth: "50%",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor:
                      transaction.details.in_out === "income"
                        ? globalTheme.list.incomeContainer.backgroundColor
                        : globalTheme.colors.secondary,
                  }}
                  iconColorInContainer={
                    transaction.details.in_out === "income"
                      ? globalTheme.list.incomeContainer.color
                      : globalTheme.colors.foreground
                  }
                  rightLabelStyle={{
                    color:
                      transaction.details.in_out === "income"
                        ? globalTheme.list.incomeContainer.color
                        : globalTheme.text.textPrimary.color,
                  }}
                  onPress={() =>
                    navigation.navigate(screenList.loanContactSelectorScreen, {
                      defaultOption: selectedLoanContact?.contact_uid,
                      selected: (contact) => {
                        console.log(contact);
                        const categoryId = transaction.details.category_id;
                        setSelectedLoanContact(contact);
                        switch (true) {
                          case categoryId === "debt" ||
                            categoryId === "loan_collection":
                            setTransaction({
                              ...transaction,
                              details: {
                                ...transaction.details,
                                loan_details: {
                                  ...transaction.details.loan_details,
                                  from_uid: contact.contact_uid,
                                },
                              },
                            });

                            break;
                          case categoryId === "loan" ||
                            categoryId === "debt_payment":
                            setTransaction({
                              ...transaction,
                              details: {
                                ...transaction.details,
                                loan_details: {
                                  ...transaction.details.loan_details,
                                  to_uid: contact.contact_uid,
                                },
                              },
                            });

                            break;

                          default:
                            break;
                        }
                      },
                    })
                  }
                />
                {/* // TAG : Payment due date section */}
                {/* <ListItem
                  pressable
                  leftLabel="Payment due date"
                  rightLabel={
                    !selectedLoanContact
                      ? "Add lender name first"
                      : !selectedLoanContact.payment_due_date
                      ? "Pick date"
                      : new Date(
                          selectedLoanContact.payment_due_date
                        ).toDateString()
                  }
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
                    backgroundColor: globalTheme.colors.secondary,
                  }}
                  rightLabelStyle={{
                    color: globalTheme.text.textPrimary.color,
                  }}
                  onPress={() =>
                    utils.datePicker({
                      minimumDateInMillis:
                        transaction?.details?.date + 1 * 24 * 60 * 60 * 1000,
                      initialDateInMillis:
                        transaction.details.loan_details.payment_due_date ||
                        transaction?.details?.date + 7 * 24 * 60 * 60 * 1000,
                      pickerStyle: "dateOnly",
                      callback: (dateInMillis) => {
                        setTransaction({
                          ...transaction,
                          details: {
                            ...transaction.details,
                            loan_details: {
                              ...transaction.details.loan_details,
                              payment_due_date: dateInMillis,
                            },
                          },
                        });
                      },
                    })
                  }
                /> */}
              </ListSection>
            )}
            <ListSection>
              {/* // TAG : Notes Section */}
              <TouchableNativeFeedback
                onPress={() => inputNotes.current.focus()}
              >
                <View style={globalTheme.list.listContainer}>
                  <IonIcons
                    name="document-text"
                    size={18}
                    style={{ paddingRight: 16 }}
                    color={globalTheme.colors.foreground}
                  />
                  <View
                    style={{
                      ...globalTheme.list.listItem,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <TextPrimary label="Notes" style={{ flex: 1 }} />

                    {/* // TAG : Notes Input */}
                    <TextInput
                      ref={inputNotes}
                      textAlign="right"
                      returnKeyType="done"
                      keyboardType="default"
                      placeholder="Add notes..."
                      placeholderTextColor={
                        globalTheme.text.textSecondary.color
                      }
                      style={{
                        ...globalTheme.text.textPrimary,
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
                      clearButtonMode="never"
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
                      color={globalTheme.colors.foreground}
                    />
                  )}

                  {/* </View> */}
                  {/* <IonIcons name='pencil' size={18} style={{ paddingLeft: 16 }} /> */}
                </View>
              </TouchableNativeFeedback>
            </ListSection>
            {/* // TAG : Repeat */}
            {/* // TODO : hold the release of repeat */}
            {/* <ListSection>
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
                  !getFeatureLimit(
                    {
                      globalFeatureSwitch,
                     subscriptionPlan:
                      userAccount.subscription.plan,
                      featureName:
                    FEATURE_NAME.RECURRING_TRANSACTIONS}
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
                      ? globalTheme.list.incomeContainer.backgroundColor
                      : globalTheme.colors.secondary,
                }}
                iconColorInContainer={
                  transaction.details.in_out === "income"
                    ? globalTheme.list.incomeContainer.color
                    : globalTheme.text.textPrimary.color
                }
                rightLabelStyle={{
                  color:
                    transaction.details.in_out === "income"
                      ? globalTheme.list.incomeContainer.color
                      : globalTheme.text.textPrimary.color,
                }}
                onPress={() => {
                  if (
                  getFeatureLimit(
                    {
                      globalFeatureSwitch,
                     subscriptionPlan:
                      userAccount.subscription.plan,
                      featureName:
                    FEATURE_NAME.RECURRING_TRANSACTIONS}
                  )
                  ) {
                    navigation.navigate(screenList.modalScreen, {
                      title: "Repeat Transaction",
                      modalType: MODAL_TYPE_CONSTANTS.LIST,
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
                      defaultOption: localRepeatedTransactions.repeat_type,
                    });
                  } else {
                    Alert.alert(
                      "Upgrade to Premium",
                      "Upgrade to premium to create repeating transactions",
                      [
                        { text: "Cancel" },
                        {
                          text: "Upgrade",
                          onPress: () =>
                            navigation.navigate(
                              screenList.mySubscriptionScreen
                            ),
                        },
                      ]
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
            </ListSection> */}
            {/* // TAG : Attachment Image */}
            {/* // TODO : hold the release of attachments */}
            <ListSection>
              <ListItem
                pressable
                disabled={
                  !getFeatureLimit({
                    globalFeatureSwitch,
                    subscriptionPlan: userAccount.subscription.plan,
                    featureName: FEATURE_NAME.ATTACHMENT_IMAGES,
                  })
                }
                leftLabel="Attachment Images"
                iconLeftName="image"
                iconPack="IonIcons"
                rightLabel={
                  transaction?.details?.attachment_URL?.length
                    ? transaction?.details?.attachment_URL?.length +
                      " image(s) "
                    : "Add "
                }
                iconRightName="add"
                onPress={async () => {
                  if (
                    getFeatureLimit({
                      globalFeatureSwitch,
                      subscriptionPlan: userAccount.subscription.plan,
                      featureName: FEATURE_NAME.ATTACHMENT_IMAGES,
                    })
                  ) {
                    // No permissions request is necessary for launching the image library
                    let result = await ImagePicker.launchImageLibraryAsync({
                      mediaTypes: ImagePicker.MediaTypeOptions.Images,
                      // allowsEditing: true,
                      allowsMultipleSelection: true,
                      quality: 0.3,
                    });

                    const { canceled, assets } = result;
                    const uri = assets.map((asset) => asset.uri);
                    if (!result.canceled) {
                      setTransaction({
                        ...transaction,
                        details: {
                          ...transaction.details,
                          attachment_URL: [
                            ...transaction.details.attachment_URL,
                            ...uri,
                          ],
                        },
                      });
                    }
                  } else {
                    Alert.alert(
                      "Upgrade to Premium",
                      "Upgrade to premium to use attachment images",
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "Upgrade",
                          onPress: () => {
                            navigation.navigate(
                              screenList.mySubscriptionScreen
                            );
                          },
                        },
                      ]
                    );
                    return;
                  }
                }}
              />
              <Animated.FlatList
                entering={SlideInDown.duration(500)}
                exiting={SlideOutDown.duration(500)}
                horizontal
                data={transaction?.details?.attachment_URL}
                contentContainerStyle={{
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "100%",
                }}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <>
                    {item && (
                      <>
                        <TouchableOpacity
                          style={{
                            zIndex: 1,
                            padding: 16,
                            position: "absolute",
                            top: 8,
                            right: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            borderBottomLeftRadius: 16,
                            backgroundColor: utils.hexToRgb({
                              hex: globalTheme.colors.secondary,
                              opacity: 0.3,
                            }),
                          }}
                          onPress={() =>
                            setTransaction({
                              ...transaction,
                              details: {
                                ...transaction?.details,
                                attachment_URL: [
                                  ...transaction.details.attachment_URL.filter(
                                    (url) => url !== item
                                  ),
                                ],
                              },
                            })
                          }
                        >
                          <IonIcons
                            name="close-circle"
                            size={20}
                            color={globalTheme.colors.foreground}
                          />
                        </TouchableOpacity>

                        <ImageViewer
                          uri={item}
                          onPress={(uri) => {
                            navigation.navigate(screenList.imageViewerScreen, {
                              uri,
                              uriList: transaction?.details?.attachment_URL,
                              defaultUri: item,
                            });
                          }}
                        />
                      </>
                    )}
                  </>
                )}
              />
              {transaction?.details?.attachment_URL.length !== 0 && (
                <>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: globalTheme.colors.secondary,
                    }}
                    onPress={() =>
                      setTransaction({
                        ...transaction,
                        details: {
                          ...transaction?.details,
                          attachment_URL: [],
                        },
                      })
                    }
                  >
                    <IonIcons
                      name="close-circle"
                      size={20}
                      style={{ paddingVertical: 16, paddingRight: 8 }}
                      color={globalTheme.colors.foreground}
                    />
                    <TextPrimary label="Clear all" />
                  </TouchableOpacity>
                </>
              )}
            </ListSection>

            {/* // TAG : Action Button */}
            <ActionButtonWrapper>
              {/* // TAG : Cancel Button */}
              <View style={{ flex: 1, paddingRight: 8 }}>
                <ButtonSecondary
                  label="Cancel"
                  theme={appSettings.theme}
                  onPress={() => {
                    navigation.navigate(screenList.bottomTabNavigator);
                  }}
                />
              </View>

              {/* // TAG : Save Button */}
              <View style={{ flex: 2, paddingLeft: 8 }}>
                <ButtonPrimary
                  label="Save"
                  theme={appSettings.theme}
                  onPress={() => {
                    checkFinalTransaction();
                  }}
                />
              </View>
            </ActionButtonWrapper>
          </CustomScrollView>
        </View>
      )}
    </>
  );
};

export default NewTransactionDetailsScreen;
