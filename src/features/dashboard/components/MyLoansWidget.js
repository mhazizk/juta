import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { TextPrimary, TextSecondary } from "../../../components/Text";
import * as utils from "../../../utils";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalCurrencyRates,
  useGlobalLoan,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import { useIsFocused } from "@react-navigation/native";
import screenList from "../../../navigations/ScreenList";
import Loading from "../../../components/Loading";
import TextTicker from "react-native-text-ticker";

const MyLoansWidget = ({
  height = 150,
  marginRight = 0,
  marginHorizontal = 0,
  marginVertical = 0,
  width = Dimensions.get("window").width / 2 - 24,
  onPress,
}) => {
  const { globalTheme } = useGlobalTheme();
  const { globalLoan } = useGlobalLoan();
  const { appSettings } = useGlobalAppSettings();
  const { globalCurrencyRates } = useGlobalCurrencyRates();
  const { sortedTransactions } = useGlobalSortedTransactions();
  const { logbooks } = useGlobalLogbooks();
  const [transactionsDetails, setTransactionsDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setIsLoading(true);
      setTimeout(() => {
        const allTransactionsDetails = [];
        globalLoan.contacts.forEach((contact) => {
          utils.findTransactionsByIds({
            transactionIds: contact.transactions_id,
            groupSorted: sortedTransactions.groupSorted,
            callback: (transactions) => {
              console.log({ transactions });
              transactions.forEach((transaction) => {
                allTransactionsDetails.push(transaction);
              });
            },
          });
        });
        setTransactionsDetails(allTransactionsDetails);
        setIsLoading(false);
      }, 1);
    }
  }, [isFocused]);

  useEffect(() => {
    // console.log({ transactionsDetails });
  }, [transactionsDetails]);

  // const getTotalAmount = ({ transactionDetails, logbooks }) => {
  //   let totalAmount = [];
  //   transactionDetails?.forEach((transaction) => {
  //     const logbookCurrencyName = utils.FindById.findLogbookById({
  //       id: transaction.logbook_id,
  //       logbooks: logbooks,
  //     }).logbook_currency.name;
  //     let amount = 0;
  //     if (transaction.details.in_out === "expense") {
  //       amount = +transaction.details.amount;
  //     } else {
  //       amount = -transaction.details.amount;
  //     }
  //     const convertedAmount = utils.convertCurrency({
  //       amount,
  //       from: logbookCurrencyName,
  //       target: appSettings.logbookSettings.defaultCurrency.name,
  //       globalCurrencyRates,
  //     });
  //     totalAmount.push(convertedAmount);
  //   });
  //   return totalAmount.reduce((a, b) => a + b, 0);
  // };

  const getNextPayment = ({
    getNextAmount = false,
    getNextDate = false,
    globalLoan,
    groupSorted,
  }) => {
    // get all the transactions that are not paid
    const contactsNotYetPaid = globalLoan.contacts.filter((contact) => {
      return contact.is_paid === false;
    });

    // get neareast payment due date
    const nearestPaymentDueInMillis = contactsNotYetPaid.sort((a, b) => {
      return a.payment_due_date - b.payment_due_date;
    });
    //   get nearest payment due date in date
    const nearestPaymentDueInDate = new Date(
      nearestPaymentDueInMillis[0]?.payment_due_date
    ).getDate();

    // get transactions id from contacts that have the nearest payment due date
    const transactionIdsToFind = [];
    contactsNotYetPaid.forEach((contact) => {
      if (
        new Date(contact.payment_due_date).getDate() === nearestPaymentDueInDate
      ) {
        transactionIdsToFind.push(...contact.transactions_id);
      }
    });

    switch (true) {
      case getNextAmount:
        // get transactions details from transaction ids
        return utils.findTransactionsByIds({
          transactionIds: transactionIdsToFind,
          groupSorted: groupSorted,
          callback: (transactions) => {
            return utils.getTotalAmountAndConvertToDefaultCurrency({
              transactions,
              logbooks: logbooks.logbooks,
              globalCurrencyRates,
              targetCurrencyName:
                appSettings.logbookSettings.defaultCurrency.name,
            });
          },
        });
      case getNextDate:
        return nearestPaymentDueInDate - new Date().getDate();

      default:
        break;
    }
  };
  return (
    <>
      {isLoading && (
        <View
          style={{
            // flex: 1,
            height: height,
            width: width,
            marginRight: marginRight,
            marginHorizontal,
            marginVertical,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: globalTheme.widgets.myLoans.cardBackgroundColor,
            marginBottom: 16,
            borderRadius: 16,
          }}
        >
          <Loading />
        </View>
      )}
      {!isLoading && (
        <>
          <TouchableOpacity onPress={() => onPress()}>
            <View
              style={{
                height: height,
                width: width,
                backgroundColor:
                  globalTheme.widgets.myLoans.cardBackgroundColor,
                marginRight: marginRight,
                marginHorizontal,
                marginVertical,
                borderRadius: 16,
                alignItems: "flex-start",
                overflow: "hidden",
              }}
            >
              {utils.getTotalAmountAndConvertToDefaultCurrency({
                transactions: transactionsDetails,
                logbooks: logbooks.logbooks,
                globalCurrencyRates,
                targetCurrencyName:
                  appSettings.logbookSettings.defaultCurrency.name,
              }) === 0 && (
                <TextPrimary
                  label="My Loans"
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    padding: 16,
                    color: globalTheme.widgets.myLoans.cardTextColor,
                  }}
                />
              )}
              {utils.getTotalAmountAndConvertToDefaultCurrency({
                transactions: transactionsDetails,
                logbooks: logbooks.logbooks,
                globalCurrencyRates,
                targetCurrencyName:
                  appSettings.logbookSettings.defaultCurrency.name,
              }) !== 0 && (
                <>
                  <View
                    style={{
                      height: "100%",
                      width: "100%",
                      alignItems: "flex-start",
                      padding: 16,
                      justifyContent: "center",
                    }}
                  >
                    <TextPrimary
                      label="My Loans"
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        flex: 1,
                        color: globalTheme.widgets.myLoans.cardTextColor,
                      }}
                    />

                    <TextPrimary
                      label="Next payment"
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        color: globalTheme.widgets.myLoans.cardTextColor,
                      }}
                    />
                    {/* // TAG : Text Ticker */}
                    {/* // TAG : Main currency */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <TextSecondary
                        label={
                          appSettings.logbookSettings.defaultCurrency.symbol
                        }
                        style={{
                          fontSize: 24,
                          paddingRight: 4,
                          color: globalTheme.widgets.myLoans.cardTextColor,
                        }}
                      />
                      <TextPrimary
                        style={{
                          fontSize: 32,
                          fontWeight: "bold",
                          color: globalTheme.widgets.myLoans.cardTextColor,
                        }}
                        label={utils.getFormattedNumber({
                          value: Math.abs(
                            getNextPayment({
                              getNextAmount: true,
                              globalLoan,
                              groupSorted: sortedTransactions.groupSorted,
                            })
                          ),
                          currencyIsoCode:
                            appSettings.logbookSettings.defaultCurrency.isoCode,
                          negativeSymbol:
                            appSettings.logbookSettings.negativeCurrencySymbol,
                        })}
                      />
                    </View>
                    {/* // TAG : Secondary currency */}
                    {appSettings.logbookSettings.showSecondaryCurrency && (
                      <View
                        style={{
                          // width: "100%",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: appSettings.logbookSettings
                            .showSecondaryCurrency
                            ? "flex-end"
                            : "center",
                        }}
                      >
                        <TextSecondary
                          label={
                            appSettings.logbookSettings.secondaryCurrency.symbol
                          }
                          style={{
                            paddingRight: 4,
                            color: globalTheme.widgets.myLoans.cardTextColor,
                          }}
                        />
                        <TextPrimary
                          style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            color: globalTheme.widgets.myLoans.cardTextColor,
                          }}
                          label={utils.getFormattedNumber({
                            value: utils.convertCurrency({
                              amount: Math.abs(
                                getNextPayment({
                                  getNextAmount: true,
                                  globalLoan,
                                  groupSorted: sortedTransactions.groupSorted,
                                })
                              ),
                              from: appSettings.logbookSettings.defaultCurrency
                                .name,
                              target:
                                appSettings.logbookSettings.secondaryCurrency
                                  .name,
                              globalCurrencyRates: globalCurrencyRates,
                            }),
                            currencyIsoCode:
                              appSettings.logbookSettings.secondaryCurrency
                                .isoCode,
                            negativeSymbol:
                              appSettings.logbookSettings
                                .negativeCurrencySymbol,
                          })}
                        />
                      </View>
                    )}
                    <TextPrimary
                      label={`in ${getNextPayment({
                        getNextDate: true,
                        globalLoan,
                        groupSorted: sortedTransactions.groupSorted,
                      })} days`}
                      style={{
                        fontSize: 18,
                        textAlign: "center",
                        fontWeight: "bold",
                        color: globalTheme.widgets.myLoans.cardTextColor,
                      }}
                    />
                  </View>
                </>
              )}
              <IonIcons
                name="cash"
                color={utils.hexToRgb({
                  hex: globalTheme.widgets.myLoans.cardTextColor,
                  opacity: 0.3,
                })}
                size={100}
                style={{
                  zIndex: -1,
                  position: "absolute",
                  bottom: -10,
                  right: -0,
                }}
              />
            </View>
          </TouchableOpacity>
        </>
      )}
    </>
  );
};

export default MyLoansWidget;
