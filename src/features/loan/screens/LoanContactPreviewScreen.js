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
  ButtonDisabled,
  ButtonPrimary,
  ButtonPrimaryIcon,
  ButtonPrimaryIconDisabled,
  ButtonSecondary,
  ButtonSecondaryDanger,
  ButtonSecondaryDisabled,
  ButtonSecondaryIcon,
  ButtonSecondaryIconDisabled,
} from "../../../components/Button";
import { ListItem, TransactionListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalCurrencyRates,
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
import transactionDetailsModel from "../../transactions/models/transactionDetailsModel";
import ActionButtonWrapper from "../../../components/ActionButtonWrapper";

const LoanContactPreviewScreen = ({ route, navigation }) => {
  const { contact, transactionDetails } = route?.params;
  const { userAccount } = useGlobalUserAccount();
  const { appSettings } = useGlobalAppSettings();
  const { categories } = useGlobalCategories();
  const { logbooks } = useGlobalLogbooks();
  const { globalTheme } = useGlobalTheme();
  const { globalLoan } = useGlobalLoan();
  const { globalCurrencyRates } = useGlobalCurrencyRates();
  // const [transactions, setTransactions] = useState(transactionDetails);

  useEffect(() => {
    // console.log(transactionDetails);
    navigation.setParams({
      contact: contact,
      loanContactTransactionDetails: transactionDetails,
      targetScreen: screenList.loanContactPreviewScreen,
    });
  }, []);

  const canBeMarkedAsPaid =
    utils.getTotalAmountAndConvertToDefaultCurrency({
      invertResult: true,
      globalCurrencyRates,
      transactions: transactionDetails,
      logbooks: logbooks.logbooks,
      targetCurrencyName: appSettings.logbookSettings.defaultCurrency.name,
    }) !== 0 && transactionDetails.length > 0;

  return (
    <>
      {contact && (
        <CustomScrollView contentContainerStyle={{ flex: 1 }}>
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
            {utils.getTotalAmountAndConvertToDefaultCurrency({
              invertResult: true,
              globalCurrencyRates,
              transactions: transactionDetails,
              logbooks: logbooks.logbooks,
              targetCurrencyName:
                appSettings.logbookSettings.defaultCurrency.name,
            }) === 0 && (
              <TextPrimary
                label={`No active debt or loan between you and ${contact.contact_name}`}
                style={{
                  textAlign: "center",
                }}
              />
            )}
            {utils.getTotalAmountAndConvertToDefaultCurrency({
              invertResult: true,
              globalCurrencyRates,
              transactions: transactionDetails,
              logbooks: logbooks.logbooks,
              targetCurrencyName:
                appSettings.logbookSettings.defaultCurrency.name,
            }) !== 0 && (
              <>
                <TextPrimary
                  label={`${
                    appSettings.logbookSettings.defaultCurrency.symbol
                  } ${utils.getFormattedNumber({
                    absolute: true,
                    value: utils.getTotalAmountAndConvertToDefaultCurrency({
                      invertResult: true,
                      globalCurrencyRates,
                      transactions: transactionDetails,
                      logbooks: logbooks.logbooks,
                      targetCurrencyName:
                        appSettings.logbookSettings.defaultCurrency.name,
                    }),
                    currencyIsoCode:
                      appSettings.logbookSettings.defaultCurrency.isoCode,
                    negativeSymbol:
                      appSettings.logbookSettings.negativeCurrencySymbol,
                  })}`}
                  style={{
                    fontWeight: "bold",
                    fontSize: 36,
                    color:
                      utils.getTotalAmountAndConvertToDefaultCurrency({
                        invertResult: true,
                        globalCurrencyRates,
                        transactions: transactionDetails,
                        logbooks: logbooks.logbooks,
                        targetCurrencyName:
                          appSettings.logbookSettings.defaultCurrency.name,
                      }) < 0
                        ? globalTheme.colors.danger
                        : globalTheme.text.textPrimary.color,
                  }}
                />
                <TextPrimary
                  label={
                    utils.getTotalAmountAndConvertToDefaultCurrency({
                      invertResult: true,
                      globalCurrencyRates,
                      transactions: transactionDetails,
                      logbooks: logbooks.logbooks,
                      targetCurrencyName:
                        appSettings.logbookSettings.defaultCurrency.name,
                    }) < 0
                      ? `left to pay to ${contact.contact_name}`
                      : utils.getTotalAmountAndConvertToDefaultCurrency({
                          invertResult: true,
                          globalCurrencyRates,
                          transactions: transactionDetails,
                          logbooks: logbooks.logbooks,
                          targetCurrencyName:
                            appSettings.logbookSettings.defaultCurrency.name,
                        }) === 0
                      ? "No debt or loan to pay"
                      : `left to receive from ${contact.contact_name}`
                  }
                  style={{
                    fontSize: 20,
                  }}
                />
              </>
            )}
          </View>

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
                              logbookName={
                                utils.FindById.findLogbookById({
                                  id: item.logbook_id,
                                  logbooks: logbooks.logbooks,
                                }).logbook_name
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
          <ActionButtonWrapper>
            {/* // TAG : Edit Button */}
            <View style={{ flex: 1, paddingRight: 8 }}>
              <ButtonSecondary
                label="Edit"
                onPress={() => {
                  navigation.navigate(screenList.editLoanContactScreen, {
                    contact: contact,
                    loanContactTransactionDetails: transactionDetails,
                    targetScreen: screenList.loanContactPreviewScreen,
                  });
                }}
              />
            </View>
            {/* // TAG : Share Button */}
            {/* <View style={{ flex: 1, paddingRight: 8 }}>
              {!canBeMarkedAsPaid && (
                <ButtonSecondaryIconDisabled
                  label="Share"
                  iconName="share-social-outline"
                  iconPack="IonIcons"
                />
              )}
              {canBeMarkedAsPaid && (
                <ButtonSecondaryIcon
                  label="Share"
                  iconName="share-social-outline"
                  iconPack="IonIcons"
                  onPress={() =>
                    navigation.navigate(screenList.editLoanContactScreen, {
                      contact: contact,
                    })
                  }
                />
              )}
            </View> */}

            {/* // TAG : Mark as complete button */}
            <View style={{ flex: 2, paddingLeft: 8 }}>
              {!canBeMarkedAsPaid && (
                <ButtonPrimaryIconDisabled
                  iconName="checkmark-circle"
                  iconPack="IonIcons"
                  label="Mark as paid"
                />
              )}
              {canBeMarkedAsPaid && (
                <ButtonPrimaryIcon
                  iconName="checkmark-circle"
                  iconPack="IonIcons"
                  label="Mark as paid"
                  // style={{
                  //   backgroundColor: globalTheme.colors.success,
                  // }}
                  onPress={
                    () => {
                      const selectedLogbook = utils.FindById.findLogbookById({
                        id: transactionDetails[0].logbook_id,
                        logbooks: logbooks.logbooks,
                      });

                      const totalAmount =
                        utils.getTotalAmountAndConvertToDefaultCurrency({
                          invertResult: true,
                          transactions: transactionDetails,
                          logbooks: logbooks.logbooks,
                          targetCurrencyName:
                            appSettings.logbookSettings.defaultCurrency.name,
                          globalCurrencyRates,
                        });

                      const amount = Math.abs(0 - totalAmount);
                      let category_id;
                      let in_out = "expense";
                      const loan_details = {
                        from_uid: null,
                        to_uid: null,
                      };
                      switch (true) {
                        case totalAmount > 0:
                          category_id = "loan_collection";
                          in_out = "income";
                          loan_details.from_uid = contact.contact_uid;
                          loan_details.to_uid = userAccount.uid;
                          break;
                        case totalAmount < 0:
                          category_id = "debt_payment";
                          in_out = "expense";
                          loan_details.from_uid = userAccount.uid;
                          loan_details.to_uid = contact.contact_uid;
                          break;

                        default:
                          break;
                      }

                      const transactionModel = transactionDetailsModel({
                        userAccountUid: userAccount.uid,
                        logbookId: selectedLogbook.logbook_id,
                      });

                      const newTransaction = {
                        ...transactionModel,
                        details: {
                          ...transactionModel.details,
                          in_out,
                          amount,
                          loan_details,
                          category_id,
                        },
                      };

                      navigation.navigate(
                        screenList.newTransactionDetailsScreen,
                        {
                          selectedLogbook: {
                            ...selectedLogbook,
                            name: selectedLogbook.logbook_name,
                          },
                          selectedCategory: utils.FindById.findCategoryById({
                            id: category_id,
                            categories: categories.categories,
                          }),
                          selectedLoanContact: contact,
                          newTransaction,
                        }
                      );
                    }
                    // navigation.navigate(screenList.loadingScreen, {
                    //   label: "Marking as paid...",
                    //   loadingType: LOADING_TYPES.LOAN.PATCH_ONE_CONTACT,
                    //   loanContactTransactionDetails: transactionDetails,
                    //   targetScreen: screenList.loanContactPreviewScreen,
                    //   patchLoanContact: {
                    //     ...contact,
                    //     is_paid: true,
                    //   },
                    //   newGlobalLoanTimestamps: {
                    //     ...globalLoan._timestamps,
                    //     updated_at: Date.now(),
                    //     updated_by: userAccount.uid,
                    //   },
                    // })
                  }
                />
              )}
            </View>
          </ActionButtonWrapper>
        </CustomScrollView>
      )}
    </>
  );
};

export default LoanContactPreviewScreen;
