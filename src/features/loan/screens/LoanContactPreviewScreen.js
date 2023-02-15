import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  TextInput,
  TouchableNativeFeedback,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import uuid from "react-native-uuid";
import IonIcons from "react-native-vector-icons/Ionicons";
import { TextPrimary, TextSecondary } from "../../../components/Text";
import screenList from "../../../navigations/ScreenList";
import ionIcons from "../../../assets/iconPacks/ionIcons";
import {
  ButtonPrimary,
  ButtonPrimaryIcon,
  ButtonSecondary,
  ButtonSecondaryDanger,
} from "../../../components/Button";
import { ListItem, TransactionListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLoan,
  useGlobalLogbooks,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import LOADING_TYPES from "../../../screens/modal/loading.type";
import * as utils from "../../../utils";
import { TouchableOpacity } from "react-native";
import LoanTransactionItem from "../components/LoanTransactionItem";
import TransactionListSection from "../../../components/List/TransactionListSection";

const LoanContactPreviewScreen = ({ route, navigation }) => {
  const { contact, transactionDetails } = route?.params;
  const { userAccount } = useGlobalUserAccount();
  const { appSettings } = useGlobalAppSettings();
  const { categories } = useGlobalCategories();
  const { logbooks } = useGlobalLogbooks();
  const { globalTheme } = useGlobalTheme();
  const { globalLoan } = useGlobalLoan();
  // const [transactions, setTransactions] = useState(transactionDetails);

  useEffect(() => {
    // console.log(transactionDetails);
  }, []);

  const getTotalAmount = (transactionDetails) => {
    let totalAmount = [];
    transactionDetails?.forEach((transaction) => {
      const categoryId = transaction.details.category_id;
      // switch (true) {
      //   case categoryId === "loan":
      //     totalAmount.push(transaction.details.amount);
      //     break;
      //   case categoryId === "debt_payment":
      //     totalAmount.push(-transaction.details.amount);
      //     break;

      //   default:
      //     break;
      // }
      if (transaction.details.in_out === "expense") {
        totalAmount.push(+transaction.details.amount);
      } else {
        totalAmount.push(-transaction.details.amount);
      }
    });
    return totalAmount.reduce((a, b) => a + b, 0);
  };

  return (
    <>
      {contact && (
        <CustomScrollView contentContainerStyle={{ flex: 1 }}>
          <ListSection marginTop={16}>
            {/* // TAG : Contact Section */}
            <View
              style={{
                height: Dimensions.get("window").height / 3,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                paddingHorizontal: 16,
              }}
            >
              <IonIcons
                name="person"
                size={48}
                style={{ padding: 16 }}
                color={globalTheme.colors.foreground}
              />
              <TextPrimary
                label={contact.contact_name}
                style={{
                  fontSize: 36,
                }}
              />
              <View
                style={{
                  margin: 8,
                  height: 1,
                  width: Dimensions.get("window").width / 3,
                  backgroundColor: globalTheme.colors.secondary,
                }}
              />
              {getTotalAmount(transactionDetails) === 0 && (
                <TextPrimary
                  label={`No active debt or loan between you and ${contact.contact_name}`}
                  style={{
                    textAlign: "center",
                  }}
                />
              )}
              {getTotalAmount(transactionDetails) !== 0 && (
                <>
                  <TextPrimary
                    label={`${
                      appSettings.logbookSettings.defaultCurrency.symbol
                    } ${utils.getFormattedNumber({
                      value: getTotalAmount(transactionDetails),
                      currencyIsoCode:
                        appSettings.logbookSettings.defaultCurrency.isoCode,
                      negativeSymbol:
                        appSettings.logbookSettings.negativeCurrencySymbol,
                    })}`}
                    style={{
                      fontWeight: "bold",
                      fontSize: 36,
                      color:
                        getTotalAmount(transactionDetails) < 0
                          ? globalTheme.colors.danger
                          : globalTheme.text.textPrimary.color,
                    }}
                  />
                  <TextPrimary
                    label={
                      getTotalAmount(transactionDetails) < 0
                        ? "Debt left to pay"
                        : getTotalAmount(transactionDetails) === 0
                        ? "No debt or loan to pay"
                        : "Loan left to receive"
                    }
                    style={{
                      fontSize: 20,
                    }}
                  />
                </>
              )}
            </View>
          </ListSection>

          {/* // TAG : Contact Details */}
          {/* <View
            style={{
              width: "100%",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <TextPrimary label="Contact Details" style={{ fontSize: 24 }} />
          </View> */}
          <ListSection>
            {/* // TAG : Contact Type Section */}
            <ListItem
              iconLeftName="person"
              iconPack="IonIcons"
              leftLabel="Contact type"
              useRightLabelContainer
              rightLabel={
                contact.contact_type[0].toUpperCase() +
                contact.contact_type.substring(1)
              }
              rightLabelContainerStyle={{
                flexDirection: "row",
                maxWidth: "50%",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
                borderRadius: 8,
                backgroundColor: globalTheme.colors.secondary,
              }}
            />
            <ListItem
              leftLabel="Payment due date"
              rightLabel={
                contact.payment_due_date
                  ? new Date(contact.payment_due_date).toDateString()
                  : "Not set yet"
              }
              iconPack="IonIcons"
              iconLeftName="calendar"
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
            />
          </ListSection>
          <View
            style={{
              width: "100%",
              flex: 1,
              alignItems: "center",
            }}
          >
            {!transactionDetails.length && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(screenList.newTransactionDetailsScreen);
                }}
                style={{
                  width: "100%",
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IonIcons
                  name="cash"
                  size={48}
                  color={globalTheme.colors.secondary}
                />
                <TextSecondary
                  label={`No transactions associated with this contact yet`}
                  style={{
                    textAlign: "center",
                    paddingHorizontal: 16,
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <IonIcons
                    name="add"
                    size={18}
                    color={globalTheme.colors.foreground}
                  />
                  <TextPrimary label="Create new transaction" />
                </View>
              </TouchableOpacity>
            )}
            {transactionDetails.length > 0 && (
              <>
                <TextPrimary
                  label="Loan Transactions"
                  style={{
                    // fontSize: 24,
                    alignSelf: "flex-start",
                    paddingHorizontal: 16,
                  }}
                />

                {/* // TAG : Loan transactions */}
                <FlatList
                  data={transactionDetails}
                  keyExtractor={(item) => item.transaction_id}
                  style={{
                    width: "100%",
                    marginTop: 16,
                  }}
                  contentContainerStyle={{
                    alignItems: "center",
                  }}
                  renderItem={({ item, index }) => (
                    <>
                      {transactionDetails.length > 0 && (
                        <>
                          <TransactionListSection
                            marginTop={0}
                            isFirstItem={index === 0}
                            isLastItem={index === transactionDetails.length - 1}
                          >
                            <LoanTransactionItem
                              categoryName={utils.FindById.findCategoryNameById(
                                {
                                  id: item.details.category_id,
                                  categories: categories.categories,
                                }
                              )}
                              isRepeated={item.repeat_id ? true : false}
                              showDate
                              transactionDate={item.details.date}
                              transactionHour={
                                appSettings.logbookSettings
                                  .showTransactionTime && item.details.date
                              }
                              transactionType={item.details.in_out}
                              transactionNotes={
                                appSettings.logbookSettings
                                  .showTransactionNotes && item.details.notes
                              }
                              fromUid={item.details.loan_details.from_uid}
                              toUid={item.details.loan_details.to_uid}
                              iconLeftName={utils.FindById.findCategoryIconNameById(
                                {
                                  id: item.details.category_id,
                                  categories: categories.categories,
                                }
                              )}
                              iconLeftColor={utils.FindById.findCategoryColorById(
                                {
                                  id: item.details.category_id,
                                  categories: categories.categories,
                                  defaultColor: globalTheme.colors.foreground,
                                }
                              )}
                              logbookCurrency={
                                utils.FindById.findLogbookById({
                                  id: item.logbook_id,
                                  logbooks: logbooks.logbooks,
                                }).logbook_currency
                              }
                              secondaryCurrency={
                                appSettings.logbookSettings.secondaryCurrency
                              }
                              showSecondaryCurrency={
                                appSettings.logbookSettings
                                  .showSecondaryCurrency
                              }
                              transactionAmount={item.details.amount}
                              onPress={() => {
                                const selectedLogbook =
                                  utils.FindById.findLogbookById({
                                    id: item.logbook_id,
                                    logbooks: logbooks.logbooks,
                                  });

                                navigation.navigate(
                                  screenList.transactionPreviewScreen,
                                  {
                                    transaction: item,
                                    selectedLogbook: {
                                      ...selectedLogbook,
                                      name: selectedLogbook.logbook_name,
                                    },
                                  }
                                );
                              }}
                            />
                          </TransactionListSection>
                        </>
                      )}
                    </>
                  )}
                />
              </>
            )}
          </View>

          {/* // TAG : Action Button */}
          <View
            style={{
              // backgroundColor: "red",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 8,
              paddingBottom: 24,
              // paddingHorizontal: 48,
            }}
          >
            {/* // TAG : Edit Button */}
            <View style={{ flex: 1, paddingRight: 8 }}>
              <ButtonSecondary
                label="Edit"
                onPress={() =>
                  navigation.navigate(screenList.editLoanContactScreen, {
                    contact: contact,
                    loanContactTransactionDetails: transactionDetails,
                    targetScreen: screenList.loanContactPreviewScreen,
                  })
                }
              />
            </View>

            {/* // TAG : Delete Button */}
            <View style={{ flex: 1, paddingHorizontal: 8 }}>
              <ButtonSecondaryDanger
                label="Delete"
                onPress={() => {
                  Alert.alert(
                    "Delete contact",
                    `Are you sure you want to delete this contact?\nDeleting this contact will also delete all transactions associated with this contact.\nThis action cannot be undone.`,
                    [
                      {
                        text: "Cancel",
                        onPress: () => {},
                        style: "cancel",
                      },
                      {
                        text: "Delete",
                        onPress: () => {
                          navigation.navigate(screenList.loadingScreen, {
                            label: "Deleting contact...",
                            loadingType: LOADING_TYPES.LOAN.DELETE_ONE_CONTACT,
                            deleteLoanContact: contact,
                            deletedTransactions: transactionDetails,
                            reducerUpdatedAt: Date.now(),
                            targetScreen: screenList.myLoansScreen,
                            newGlobalLoanTimestamps: {
                              ...globalLoan._timestamps,
                              updated_at: Date.now(),
                              updated_by: userAccount.uid,
                            },
                          });
                        },
                      },
                    ],
                    { cancelable: true }
                  );
                }}
              />
            </View>
            {/* // TAG : Share Button */}
            <View style={{ flex: 1, paddingLeft: 8 }}>
              <ButtonPrimaryIcon
                label="Share"
                iconName="share-social-outline"
                iconPack="IonIcons"
                onPress={() =>
                  navigation.navigate(screenList.editLoanContactScreen, {
                    contact: contact,
                  })
                }
              />
            </View>
          </View>
        </CustomScrollView>
      )}
    </>
  );
};

export default LoanContactPreviewScreen;
