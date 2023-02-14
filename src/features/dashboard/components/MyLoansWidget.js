import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { TextPrimary, TextSecondary } from "../../../components/Text";
import * as utils from "../../../utils";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalCurrencyRates,
  useGlobalLoan,
  useGlobalSortedTransactions,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import { useIsFocused } from "@react-navigation/native";
import screenList from "../../../navigations/ScreenList";
import Loading from "../../../components/Loading";

const MyLoansWidget = ({ onPress }) => {
  const { globalTheme } = useGlobalTheme();
  const { globalLoan } = useGlobalLoan();
  const { appSettings } = useGlobalAppSettings();
  const { globalCurrencyRates } = useGlobalCurrencyRates();
  const { sortedTransactions } = useGlobalSortedTransactions();
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
    console.log({ transactionsDetails });
  }, [transactionsDetails]);

  const getTotalAmount = (transactionDetails) => {
    let totalAmount = [];
    transactionDetails?.forEach((transaction) => {
      //   const categoryId = transaction.details.category_id;
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
      {isLoading && (
        <View
          style={{
            // flex: 1,
            height: 150,
            width: Dimensions.get("window").width / 2 - 24,
            marginRight: 8,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: globalTheme.colors.secondary,
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
                height: 150,
                width: Dimensions.get("window").width / 2 - 24,
                backgroundColor: "#90CEFF",
                marginRight: 8,
                borderRadius: 16,
                alignItems: "flex-start",
                overflow: "hidden",
              }}
            >
              {getTotalAmount(transactionsDetails) === 0 && (
                <TextPrimary
                  label="My Loans"
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    padding: 16,
                    color: globalTheme.colors.headerText,
                  }}
                />
              )}

              {getTotalAmount(transactionsDetails) !== 0 && (
                <>
                  <View
                    style={{
                      height: "100%",
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TextPrimary
                      label="Active Debt/Loan"
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        padding: 4,
                        color: globalTheme.colors.headerText,
                      }}
                    />
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
                          color: globalTheme.colors.cardText,
                        }}
                      />
                      <TextPrimary
                        style={{
                          fontSize: 32,
                          fontWeight: "bold",
                          color: globalTheme.colors.cardText,
                        }}
                        label={utils.getFormattedNumber({
                          value: getTotalAmount(transactionsDetails),
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
                            color: globalTheme.colors.cardText,
                          }}
                        />
                        <TextPrimary
                          style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            color: globalTheme.colors.cardText,
                          }}
                          label={utils.getFormattedNumber({
                            value: utils.convertCurrency({
                              amount: getTotalAmount(transactionsDetails),
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
                  </View>
                </>
              )}

              <IonIcons
                name="cash"
                color="#48ADFF"
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
