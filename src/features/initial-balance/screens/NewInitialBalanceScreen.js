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
import KeyboardViewWrapper from "../../../components/KeyboardWrapper";
import transactionDetailsModel from "../../transactions/models/transactionDetailsModel";

const NewInitialBalanceScreen = ({ route, navigation }) => {
  const { targetScreen } = route.params;
  const repeatId = uuid.v4();
  // TAG : useContext Section //
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { sortedTransactions } = useGlobalSortedTransactions();
  const { categories } = useGlobalCategories();
  const { logbooks } = useGlobalLogbooks();
  const { globalFeatureSwitch } = useGlobalFeatureSwitch();
  const { globalCurrencyRates } = useGlobalCurrencyRates();
  const { userAccount } = useGlobalUserAccount();
  const { globalLoan } = useGlobalLoan();
  const [isLoading, setIsLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return utils.FindById.findCategoryById({
      id: "initial_balance_income",
      categories: categories.categories,
    });
  });
  const [selectedLogbook, setSelectedLogbook] = useState(
    route.params?.selectedLogbook
  );

  // TAG : useEffect Section //

  useEffect(() => {
    const newTransaction = transactionDetailsModel({
      userAccountUid: userAccount.uid,
      logbookId:
        selectedLogbook?.logbook_id || logbooks?.logbooks[0]?.logbook_id,
    });

    setTransaction(route.params?.newTransaction || newTransaction);

    setIsLoading(false);
  }, []);

  useEffect(() => {}, [transaction]);

  useEffect(() => {
    // refresh
    // console.log({ selectedLogbook });
  }, [selectedLogbook]);

  // TAG : useRef State //
  const inputAmount = useRef(null);

  // TAG : Function Section //

  const checkFinalTransaction = () => {
    switch (true) {
      case !transaction.details.amount:
        return alert("Please enter initial balance");
      case !transaction.details.in_out:
        return alert("Please select transaction expense / income");
      case !transaction.details.date:
        return alert("Please select initial balance date");
      case !transaction.logbook_id:
        return alert("Please select logbook");
      case !transaction.details.category_id:
        return alert("Please select initial balance category");

      default:
        break;
    }

    const logbookToModify = {
      ...selectedLogbook,
      logbook_initial_balance_transaction_id: transaction.transaction_id,
      _timestamps: {
        ...selectedLogbook._timestamps,
        updated_at: Date.now(),
        updated_by: userAccount.uid,
      },
    };

    setTimeout(async () => {
      await firestore.setData(
        FIRESTORE_COLLECTION_NAMES.LOGBOOKS,
        logbookToModify.logbook_id,
        logbookToModify
      );
    }, 3000);

    return navigation.navigate(screenList.loadingScreen, {
      isPaid: false,
      label: "Saving...",
      loadingType: LOADING_TYPES.TRANSACTIONS.INSERT_ONE,
      transaction: transaction,
      logbookToOpen: selectedLogbook,
      targetLoanContactUid: null,
      insertTransactionToLoanContact: null,
      newGlobalLoanTimestamps: {
        ...globalLoan._timestamps,
        updated_at: Date.now(),
        updated_by: userAccount.uid,
      },
      reducerUpdatedAt: Date.now(),
      targetScreen: targetScreen || screenList.bottomTabNavigator,
    });
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
                      const foundCategory = utils.FindById.findCategoryById({
                        id:
                          item.name === "expense"
                            ? "initial_balance_expense"
                            : "initial_balance_income",
                        categories: categories.categories,
                      });

                      setSelectedCategory(foundCategory);

                      setTransaction({
                        ...transaction,
                        details: {
                          ...transaction.details,
                          in_out: item.name,
                          category_id:
                            item.name === "expense"
                              ? "initial_balance_expense"
                              : "initial_balance_income",
                          loan_details: {
                            from_uid: null,
                            to_uid: null,
                          },
                        },
                      });
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
                leftLabel="Logbook"
                rightLabel={utils.upperCaseThisFirstLetter(
                  selectedLogbook?.logbook_name
                )}
                iconPack="IonIcons"
                iconLeftName="book"
                useRightLabelContainer
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
                onPress={() => {}}
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
                onPress={() => {}}
              />
            </ListSection>

            {/* // TAG : Action Button */}
            <ActionButtonWrapper>
              {/* // TAG : Cancel Button */}
              <View style={{ flex: 1, paddingRight: 8 }}>
                <ButtonSecondary
                  label="Cancel"
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
              </View>

              {/* // TAG : Save Button */}
              <View style={{ flex: 2, paddingLeft: 8 }}>
                <ButtonPrimary
                  label="Save"
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

export default NewInitialBalanceScreen;
