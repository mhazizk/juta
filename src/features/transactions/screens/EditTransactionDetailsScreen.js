import RNDateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
// import Intl from "intl";
// import { getLocales } from 'expo-localization';
// import "intl/locale-data/jsonp/en";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import { ButtonPrimary, ButtonSecondary } from "../../../components/Button";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import { TextPrimary, TextSecondary } from "../../../components/Text";
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
import getFeatureLimit from "../../subscription/logic/getFeatureLimit";
import FEATURE_NAME from "../../subscription/model/featureName";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";
import {
  deleteAttachmentImage,
  uploadAndGetAttachmentImageURL,
} from "../../../api/firebase/cloudStorage";
import LOADING_TYPES from "../../../screens/modal/loading.type";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import ActionButtonWrapper from "../../../components/ActionButtonWrapper";
import MODAL_TYPE_CONSTANTS from "../../../constants/modalTypeConstants";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import ImageViewer from "../../image-viewer/components/ImageViewer";

const EditTransactionDetailsScreen = ({ route, navigation }) => {
  // TAG : useContext Section //
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { globalLoan } = useGlobalLoan();
  const { userAccount } = useGlobalUserAccount();
  const { globalFeatureSwitch } = useGlobalFeatureSwitch();
  const { globalCurrencyRates } = useGlobalCurrencyRates();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { categories, dispathCategories } = useGlobalCategories();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { repeatedTransactions, dispatchRepeatedTransactions } =
    useGlobalRepeatedTransactions();
  const [logbookToOpen, setLogbookToOpen] = useState(null);

  // TAG : useState Section //
  const [localRepeatedTransaction, setLocalRepeatedTransaction] =
    useState(null);
  const [transaction, setTransaction] = useState(null);
  const [prevTransaction, setPrevTransaction] = useState(null);
  const [selectedLogbook, setSelectedLogbook] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [prevLoanContact, setPrevLoanContact] = useState(null);
  const [selectedLoanContact, setSelectedLoanContact] = useState(null);
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

  // Insert 'name' variable into User Logbooks
  const insertNameInUserLogBook = () => {
    const logbooksWithName = logbooks.logbooks.map((logbook) => ({
      ...logbook,
      name: logbook.logbook_name,
    }));
    setLoadedLogbooks(logbooksWithName);
  };

  // Check Initial Transaction from Preview Screen
  const checkInitialTransaction = () => {
    setPrevTransaction(route?.params?.transaction);
    setTransaction(route?.params?.transaction);
    setSelectedCategory(route?.params?.selectedCategory);
    setSelectedLogbook(() => {
      const logbookFromRoute = route?.params?.selectedLogbook;
      return {
        ...logbookFromRoute,
        name: logbookFromRoute.logbook_name,
      };
    });
    setSelectedLoanContact(route?.params?.selectedLoanContact);
    setPrevLoanContact(route?.params?.selectedLoanContact);
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
        !transaction.details.loan_details.from_uid:
        return alert("Please enter lender name");
      case transaction.details.category_id.includes("loan") &&
        !transaction.details.loan_details.to_uid:
        break;

      default:
        break;
    }

    // if choosing other loan contact
    const willPrevLoanContactBePaid = utils.findTransactionsByIds({
      transactionIds: prevLoanContact?.transactions_id,
      groupSorted: sortedTransactions.groupSorted,
      callback: (transactionDetailsList) => {
        return utils.checkIfLoanContactWillBePaid({
          deleteTransaction: prevTransaction,
          transactionDetailsList,
          globalCurrencyRates,
          groupSorted: sortedTransactions.groupSorted,
          logbooks: logbooks.logbooks,
          targetCurrencyName: selectedLogbook?.logbook_currency.name,
        });
      },
    });
    // if choosing other loan contact
    const willTargetLoanContactBePaid = utils.findTransactionsByIds({
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
    // if patching transaction amount only
    const isPaid = utils.findTransactionsByIds({
      transactionIds: selectedLoanContact?.transactions_id,
      groupSorted: sortedTransactions.groupSorted,
      callback: (transactionDetailsList) => {
        return utils.checkIfLoanContactWillBePaid({
          deleteTransaction: prevTransaction,
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
      label: "Saving Transaction...",
      loadingType: LOADING_TYPES.TRANSACTIONS.PATCH_ONE,
      logbookToOpen: logbookToOpen,
      isPaid,
      willPrevLoanContactBePaid,
      willTargetLoanContactBePaid,
      targetLoanContactUid: selectedLoanContact?.contact_uid || null,
      patchTransaction: transaction,
      prevTransaction: prevTransaction,
      reducerUpdatedAt: Date.now(),
      targetScreen: screenList.bottomTabNavigator,
      newGlobalLoanTimestamps: {
        ...globalLoan._timestamps,
        updated_at: Date.now(),
        updated_by: userAccount.uid,
      },
    });
  };

  return (
    <>
      {transaction && selectedCategory && selectedLogbook && (
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
              <TextSecondary
                label={selectedLogbook.logbook_currency.symbol}
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
                maxLength={20}
                textAlign="center"
                returnKeyType="done"
                keyboardType="number-pad"
                placeholder={utils.getFormattedNumber({
                  value: transaction.details.amount,
                  currencyCountryName:
                    appSettings.logbookSettings.defaultCurrency.name,
                  negativeSymbol:
                    appSettings.logbookSettings.negativeCurrencySymbol,
                })}
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
                        ? globalTheme.colors.incomeAmount
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
                style={{ padding: 16 }}
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
                        type: null,
                      },
                    });
                    setSelectedCategory({});
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
                    setSelectedLogbook(item);
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
          {(transaction.details.category_id?.includes("loan") ||
            transaction.details.category_id?.includes("debt")) && (
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
            </ListSection>
          )}
          <ListSection>
            {/* // TAG : Notes Section */}
            <TouchableNativeFeedback onPress={() => inputNotes.current.focus()}>
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
                    placeholder="Add additional notes ..."
                    placeholderTextColor={globalTheme.text.textSecondary.color}
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
                  ? transaction?.details?.attachment_URL?.length + " image(s) "
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
                    allowsEditing: true,
                    allowsMultipleSelection: true,
                    quality: 0.3,
                  });

                  const { canceled, assets } = result;
                  const uri = assets?.map((asset) => asset.uri);
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
                          navigation.navigate(screenList.mySubscriptionScreen);
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
            {transaction?.details?.attachment_URL?.length !== 0 && (
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
          <ActionButtonWrapper>
            {/* // TAG : Cancel Button */}
            <View style={{ flex: 1, paddingRight: 8 }}>
              <ButtonSecondary
                label="Cancel"
                // width={150}
                theme={appSettings.theme}
                onPress={() => {
                  // setRawTransactionsLength(null)
                  navigation.goBack();
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
          </ActionButtonWrapper>
        </CustomScrollView>
      )}
    </>
  );
};

export default EditTransactionDetailsScreen;
