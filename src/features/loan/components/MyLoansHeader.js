import { View, TouchableOpacity, Dimensions, FlatList } from "react-native";
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
import Loading from "../../../components/Loading";
import TextTicker from "react-native-text-ticker";

const customDate = utils.getCustomDate(Date.now());

const MyLoansHeader = ({
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

  const isTotalPaidBalanceEachOther =
    utils.getNextLoanPayment({
      getNextAmount: true,
      globalCurrencyRates,
      globalLoan,
      logbooks: logbooks.logbooks,
      targetCurrencyName: appSettings.logbookSettings.defaultCurrency.name,
      groupSorted: sortedTransactions.groupSorted,
    }) === 0;

  const isUnpaidContactMoreThanOne =
    utils.getNextLoanPayment({
      getTotalContactsNotYetPaid: true,
      globalCurrencyRates,
      globalLoan,
      logbooks: logbooks.logbooks,
      targetCurrencyName: appSettings.logbookSettings.defaultCurrency.name,
      groupSorted: sortedTransactions.groupSorted,
    }) > 1;

  const isNoMoreUnpaidContact =
    utils.getNextLoanPayment({
      getTotalContactsNotYetPaid: true,
      globalCurrencyRates,
      globalLoan,
      logbooks: logbooks.logbooks,
      targetCurrencyName: appSettings.logbookSettings.defaultCurrency.name,
      groupSorted: sortedTransactions.groupSorted,
    }) === 0;

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
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  width: "100%",
                  height: "100%",
                }}
              >
                {isTotalPaidBalanceEachOther && isUnpaidContactMoreThanOne && (
                  <>
                    <ShowNextPaymentForManyContacts />
                  </>
                )}
                {!isTotalPaidBalanceEachOther &&
                  !isUnpaidContactMoreThanOne && (
                    <>
                      <ShowNextPaymentForOneContact />
                    </>
                  )}
                {!isTotalPaidBalanceEachOther && isUnpaidContactMoreThanOne && (
                  <>
                    <ShowNextPaymentForOneContact />
                  </>
                )}
                {isNoMoreUnpaidContact && (
                  <>
                    <ShowNoMoreUnpaidContact />
                  </>
                )}
                {!isNoMoreUnpaidContact && <ContactsToBePaid />}
              </View>

              <IonIcons
                name="cash"
                color={utils.hexToRgb({
                  hex: globalTheme.widgets.myLoans.cardTextColor,
                  opacity: 0.2,
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

export default MyLoansHeader;

const ShowNoMoreUnpaidContact = () => {
  const { globalTheme } = useGlobalTheme();
  return (
    <>
      <View
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
          alignItems: "center",
          padding: 16,
          justifyContent: "center",
        }}
      >
        <TextPrimary
          label="No active debt/loan"
          style={{
            // fontWeight: "bold",
            fontSize: 24,
            color: globalTheme.widgets.myLoans.cardTextColor,
          }}
        />
      </View>
    </>
  );
};

const ShowNextPaymentForOneContact = () => {
  const { globalTheme } = useGlobalTheme();
  const { globalLoan } = useGlobalLoan();
  const { appSettings } = useGlobalAppSettings();
  const { globalCurrencyRates } = useGlobalCurrencyRates();
  const { sortedTransactions } = useGlobalSortedTransactions();
  const { logbooks } = useGlobalLogbooks();

  const nearestPaymentDate = utils.getNextLoanPayment({
    getNextCustomDate: true,
    globalCurrencyRates,
    globalLoan,
    logbooks: logbooks.logbooks,
    targetCurrencyName: appSettings.logbookSettings.defaultCurrency.name,
    groupSorted: sortedTransactions.groupSorted,
  });

  const isOverdue = nearestPaymentDate < customDate;

  return (
    <>
      <View
        style={{
          flex: 1,
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
          label={isOverdue ? "Payment" : "Next Payment"}
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
          <TextTicker
            duration={3000}
            loop
            bounce
            repeatSpacer={50}
            marqueeDelay={1000}
            shouldAnimateTreshold={10}
          >
            <TextSecondary
              label={appSettings.logbookSettings.defaultCurrency.symbol}
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
                  utils.getNextLoanPayment({
                    getNextAmount: true,
                    globalLoan,
                    groupSorted: sortedTransactions.groupSorted,
                    globalCurrencyRates,
                    logbooks: logbooks.logbooks,
                    targetCurrencyName:
                      appSettings.logbookSettings.defaultCurrency.name,
                  })
                ),
                currencyCountryName:
                  appSettings.logbookSettings.defaultCurrency.name,
                negativeSymbol:
                  appSettings.logbookSettings.negativeCurrencySymbol,
              })}
            />
          </TextTicker>
        </View>
        {/* // TAG : Secondary currency */}
        {appSettings.logbookSettings.showSecondaryCurrency && (
          <View
            style={{
              // width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: appSettings.logbookSettings.showSecondaryCurrency
                ? "flex-end"
                : "center",
            }}
          >
            <TextSecondary
              label={appSettings.logbookSettings.secondaryCurrency.symbol}
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
                    utils.getNextLoanPayment({
                      getNextAmount: true,
                      globalLoan,
                      groupSorted: sortedTransactions.groupSorted,
                      globalCurrencyRates,
                      logbooks: logbooks.logbooks,
                      targetCurrencyName:
                        appSettings.logbookSettings.defaultCurrency.name,
                    })
                  ),
                  from: appSettings.logbookSettings.defaultCurrency.name,
                  target: appSettings.logbookSettings.secondaryCurrency.name,
                  globalCurrencyRates: globalCurrencyRates,
                }),
                currencyCountryName:
                  appSettings.logbookSettings.secondaryCurrency.name,
                negativeSymbol:
                  appSettings.logbookSettings.negativeCurrencySymbol,
              })}
            />
          </View>
        )}
        <TextPrimary
          label={utils.getNextLoanPayment({
            getNextDate: true,
            globalLoan,
            groupSorted: sortedTransactions.groupSorted,
            globalCurrencyRates,
            logbooks: logbooks.logbooks,
            targetCurrencyName:
              appSettings.logbookSettings.defaultCurrency.name,
          })}
          style={{
            // fontSize: 18,
            textAlign: "center",
            fontWeight: "bold",
            color: globalTheme.widgets.myLoans.cardTextColor,
          }}
        />
      </View>
    </>
  );
};
const ShowNextPaymentForManyContacts = () => {
  const { globalTheme } = useGlobalTheme();
  const { globalLoan } = useGlobalLoan();
  const { appSettings } = useGlobalAppSettings();
  const { globalCurrencyRates } = useGlobalCurrencyRates();
  const { sortedTransactions } = useGlobalSortedTransactions();
  const { logbooks } = useGlobalLogbooks();

  const nearestPaymentDate = utils.getNextLoanPayment({
    getNextCustomDate: true,
    globalCurrencyRates,
    globalLoan,
    logbooks: logbooks.logbooks,
    targetCurrencyName: appSettings.logbookSettings.defaultCurrency.name,
    groupSorted: sortedTransactions.groupSorted,
  });

  const isOverdue = nearestPaymentDate < customDate;

  return (
    <>
      <View
        style={{
          flex: 1,
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
          label={isOverdue ? "Payment" : "Next Payment"}
          style={{
            fontWeight: "bold",
            // fontSize: 18,
            color: globalTheme.widgets.myLoans.cardTextColor,
          }}
        />
        {/* // TAG : Text Ticker */}
        {/* // TAG : Contact counter */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "flex-end",
          }}
        >
          <TextSecondary
            label={utils.getNextLoanPayment({
              getTotalContactsNotYetPaid: true,
              globalLoan,
              groupSorted: sortedTransactions.groupSorted,
              globalCurrencyRates,
              logbooks: logbooks.logbooks,
              targetCurrencyName:
                appSettings.logbookSettings.defaultCurrency.name,
            })}
            style={{
              fontSize: 32,
              fontWeight: "bold",
              paddingRight: 4,
              color: globalTheme.widgets.myLoans.cardTextColor,
            }}
          />
          <TextPrimary
            style={{
              // fontSize: 20,
              fontWeight: "bold",
              color: globalTheme.widgets.myLoans.cardTextColor,
            }}
            label="contacts"
          />
        </View>
        <TextPrimary
          label={utils.getNextLoanPayment({
            getNextDate: true,
            globalLoan,
            groupSorted: sortedTransactions.groupSorted,
            globalCurrencyRates,
            logbooks: logbooks.logbooks,
            targetCurrencyName:
              appSettings.logbookSettings.defaultCurrency.name,
          })}
          style={{
            // fontSize: 18,
            textAlign: "center",
            fontWeight: "bold",
            color: globalTheme.widgets.myLoans.cardTextColor,
          }}
        />
      </View>
    </>
  );
};

const ContactsToBePaid = () => {
  const { globalTheme } = useGlobalTheme();
  const { globalLoan } = useGlobalLoan();
  const { logbooks } = useGlobalLogbooks();
  const { sortedTransactions } = useGlobalSortedTransactions();
  const { globalCurrencyRates } = useGlobalCurrencyRates();
  const { appSettings } = useGlobalAppSettings();
  return (
    <>
      {/* // TAG : Borrower / Loan scheme */}
      <FlatList
        // horizontal
        data={utils
          .getNextLoanPayment({
            getContactNames: true,
            globalLoan,
            logbooks: logbooks.logbooks,
            globalCurrencyRates,
            targetCurrencyName:
              appSettings.logbookSettings.defaultCurrency.name,
            groupSorted: sortedTransactions.groupSorted,
          })
          .slice(0, 5)
          .sort((a, b) => a.localeCompare(b))}
        style={{
          flex: 1,
          width: "100%",
        }}
        contentContainerStyle={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
        renderItem={({ item, index }) => {
          return (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 8,
                  padding: 4,
                  width: "100%",
                  marginHorizontal: 4,
                  paddingHorizontal: 8,
                  borderRadius: 16,
                  backgroundColor: utils.hexToRgb({
                    hex: globalTheme.widgets.myLoans.cardTextColor,
                    opacity: 0.3,
                  }),
                }}
              >
                <IonIcons
                  name="person"
                  size={14}
                  color={globalTheme.colors.foreground}
                  style={{
                    paddingRight: 4,
                  }}
                />
                <TextPrimary
                  label={item}
                  style={{
                    fontSize: 14,
                  }}
                />
              </View>
            </>
          );
        }}
      />
    </>
  );
};
