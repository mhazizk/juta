import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
// import Intl from "intl";
// import { getLocales } from 'expo-localization';
// import "intl/locale-data/jsonp/en";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
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
  useGlobalLogbooks,
  useGlobalRepeatedTransactions,
  useGlobalSortedTransactions,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import * as utils from "../../../utils";
import getSubscriptionLimit from "../../subscription/logic/getSubscriptionLimit";
import SUBSCRIPTION_LIMIT from "../../subscription/model/subscriptionLimit";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";
import {
  deleteAttachmentImage,
  uploadAndGetAttachmentImageURL,
} from "../../../api/firebase/cloudStorage";
import LOADING_TYPES from "../../../screens/modal/loading.type";
import CustomScrollView from "../../../shared-components/CustomScrollView";

const EditTransactionDetailsScreen = ({ route, navigation }) => {
  // TAG : useContext Section //
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { userAccount } = useGlobalUserAccount();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { categories, dispathCategories } = useGlobalCategories();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { repeatedTransactions, dispatchRepeatedTransactions } =
    useGlobalRepeatedTransactions();
  const [logbookToOpen, setLogbookToOpen] = useState(null);

  // TAG : useState Section //

  // Loading State

  // Local repeated transaction
  const [localRepeatedTransaction, setLocalRepeatedTransaction] =
    useState(null);

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
        defaultOption: break;
    }

    return navigation.navigate(screenList.loadingScreen, {
      label: "Saving Transaction ...",
      loadingType: LOADING_TYPES.TRANSACTIONS.PATCH_ONE,
      logbookToOpen: logbookToOpen,
      patchTransaction: transaction,
      prevTransaction: prevTransaction,
      reducerUpdatedAt: Date.now(),
    });
  };

  return (
    <>
      {transaction && selectedCategory && selectedLogbook && (
        <CustomScrollView>
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
                flex: 1,
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
                  currencyIsoCode:
                    appSettings.logbookSettings.defaultCurrency.isoCode,
                  negativeSymbol:
                    appSettings.logbookSettings.negativeCurrencySymbol,
                })}
                placeholderTextColor={globalTheme.text.textSecondary.color}
                style={[
                  {
                    ...globalTheme.text.textPrimary,
                    paddingLeft: 0,
                    paddingVertical: 16,
                    paddingRight: 16,
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
                clearButtonMode="while-editing"
                defaultValue={utils.getFormattedNumber({
                  value: transaction.details.amount,
                  currencyIsoCode: selectedLogbook.logbook_currency.isoCode,
                  negativeSymbol:
                    appSettings.logbookSettings.negativeCurrencySymbol,
                })}
                value={utils.getFormattedNumber({
                  value: transaction.details.amount,
                  currencyIsoCode: selectedLogbook.logbook_currency.isoCode,
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
              label={`${
                transaction.details.in_out[0].toUpperCase() +
                transaction.details.in_out.substring(1)
              } Details`}
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
                    : globalTheme.colors.secondary,
              }}
              rightLabelStyle={{
                color:
                  transaction.details.in_out === "income"
                    ? "#00695c"
                    : globalTheme.text.textPrimary.color,
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
                  defaultOption: { name: transaction.details.in_out },
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
                    : globalTheme.colors.secondary,
              }}
              rightLabelStyle={{
                color:
                  transaction.details.in_out === "income"
                    ? "#00695c"
                    : globalTheme.text.textPrimary.color,
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
                  defaultOption: { name: transaction.details.type },
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
                    : globalTheme.colors.secondary,
              }}
              rightLabelStyle={{
                color:
                  transaction.details.in_out === "income"
                    ? "#00695c"
                    : globalTheme.text.textPrimary.color,
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
                    : globalTheme.colors.secondary,
              }}
              rightLabelStyle={{
                color:
                  transaction.details.in_out === "income"
                    ? "#00695c"
                    : globalTheme.text.textPrimary.color,
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
                    : globalTheme.colors.secondary,
              }}
              iconColorInContainer={
                selectedCategory?.icon?.color === "default"
                  ? globalTheme.colors.foreground
                  : selectedCategory?.icon?.color
                // transaction.details.in_out === "income"
                //   ? "#00695c"
                //   : globalTheme.text.textPrimary.color
              }
              rightLabelStyle={{
                color:
                  transaction.details.in_out === "income"
                    ? "#00695c"
                    : globalTheme.text.textPrimary.color,
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
                  defaultOption: selectedCategory,
                })
              }
            />
          </ListSection>

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
          {/* <ListSection>
            <ListItem
              pressable
              disabled={
                !getSubscriptionLimit(
                  userAccount.subscription.plan,
                  SUBSCRIPTION_LIMIT.ATTACHMENT_IMAGES
                )
              }
              leftLabel="Attachment Images"
              iconLeftName="image"
              iconPack="IonIcons"
              rightLabel={
                transaction?.details?.attachment_URL?.length
                  ? transaction?.details?.attachment_URL?.length + " image(s)"
                  : "Add attachment"
              }
              iconRightName="add"
              onPress={async () => {
                if (
                  getSubscriptionLimit(
                    userAccount.subscription.plan,
                    SUBSCRIPTION_LIMIT.ATTACHMENT_IMAGES
                  )
                ) {
                  // No permissions request is necessary for launching the image library
                  let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    allowsMultipleSelection: true,
                    quality: 1,
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
                          navigation.navigate(screenList.mySubscriptionScreen);
                        },
                      },
                    ]
                  );
                  return;
                }
              }}
            />
            <FlatList
              horizontal
              data={transaction?.details?.attachment_URL}
              contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center",
                minWidth: "100%",
              }}
              renderItem={({ item }) => (
                <>
                  {item && (
                    <>
                      <TouchableOpacity
                        style={{
                          zIndex: 1,
                          padding: 8,
                          position: "absolute",
                          top: 0,
                          right: 0,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onPress={() =>
                          setTransaction({
                            ...transaction,
                            details: {
                              ...transaction?.details,
                              attachment_URL: [
                                ...transaction.details.attachment_URL?.filter(
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
                          style={{ padding: 16 }}
                          color={globalTheme.colors.foreground}
                        />
                      </TouchableOpacity>

                      <TouchableNativeFeedback
                        onPress={() => {
                          navigation.navigate(screenList.imageViewerScreen, {
                            uri: item,
                            uriList: transaction?.details?.attachment_URL,
                          });
                        }}
                      >
                        <Image
                          source={{ uri: item }}
                          style={{
                            margin: 8,
                            alignSelf: "center",
                            borderRadius: 16,
                            width: 200,
                            height: 200,
                          }}
                        />
                      </TouchableNativeFeedback>
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
                    style={{ padding: 16 }}
                    color={globalTheme.colors.foreground}
                  />
                  <TextPrimary label="Clear all" />
                </TouchableOpacity>
              </>
            )}
          </ListSection> */}

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
          </View>
        </CustomScrollView>
      )}
    </>
  );
};

export default EditTransactionDetailsScreen;
