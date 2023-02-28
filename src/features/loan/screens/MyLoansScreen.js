import { useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, Dimensions } from "react-native";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import {
  useGlobalAppSettings,
  useGlobalCurrencyRates,
  useGlobalLoan,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import { TextPrimary, TextSecondary } from "../../../components/Text";
import Loading from "../../../components/Loading";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import screenList from "../../../navigations/ScreenList";
import { useIsFocused } from "@react-navigation/native";
import IonIcons from "react-native-vector-icons/Ionicons";
import * as utils from "../../../utils";
import MyLoansHeader from "../components/MyLoansHeader";

const MyLoansScreen = ({ navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const { userAccount } = useGlobalUserAccount();
  const { globalTheme } = useGlobalTheme();
  const { globalLoan } = useGlobalLoan();
  const { globalCurrencyRates } = useGlobalCurrencyRates();
  const { logbooks } = useGlobalLogbooks();
  const { sortedTransactions } = useGlobalSortedTransactions();
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();

  //   useEffect(() => {
  //     console.log(JSON.stringify(globalLoan));
  // }, []);
  useEffect(() => {
    if (isFocused) {
      console.log(JSON.stringify(globalLoan));
      //   setIsLoading(true);
    }
  }, [isFocused]);

  return (
    <CustomScrollView>
      {isLoading && (
        <View
          style={{
            height: "100%",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <Loading />
        </View>
      )}
      {!isLoading && (
        <>
          {/* // TAG : No contacts */}
          {!globalLoan.contacts.length && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(screenList.newLoanContactScreen, {
                  fromScreen: screenList.myLoansScreen,
                  targetScreen: screenList.myLoansScreen,
                })
              }
              style={{
                flex: 1,
                width: "100%",
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IonIcons
                  name="person-add"
                  color={globalTheme.colors.secondary}
                  size={48}
                  style={{
                    paddingBottom: 16,
                  }}
                />
                <TextSecondary
                  label={`No contacts found\nStart adding contacts to create a loan`}
                  style={{ textAlign: "center" }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 16,
                  }}
                >
                  <IonIcons
                    name="add"
                    size={18}
                    color={globalTheme.colors.foreground}
                  />
                  <TextPrimary label="Create new contact" />
                </View>
              </View>
            </TouchableOpacity>
          )}
          {globalLoan.contacts.length > 0 && (
            <>
              <MyLoansHeader
                height={200}
                marginVertical={16}
                width={Dimensions.get("window").width - 32}
                onPress={() => {
                  navigation.navigate(screenList.myLoansScreen);
                }}
              />
              <TextPrimary
                label="Loan contacts"
                style={{
                  alignSelf: "flex-start",
                  padding: 16,
                }}
              />
              <ListSection>
                {/* // TAG : Loan contacts */}
                <FlatList
                  data={globalLoan.contacts}
                  keyExtractor={(item) => item.contact_uid}
                  renderItem={({ item }) => (
                    <>
                      {globalLoan.contacts.length > 0 && (
                        <>
                          <ListItem
                            pressable
                            leftLabel={item.contact_name}
                            iconLeftName="person"
                            iconPack="IonIcons"
                            rightLabelColor={globalTheme.colors.foreground}
                            rightLabel={utils.findTransactionsByIds({
                              transactionIds: item.transactions_id,
                              groupSorted: sortedTransactions.groupSorted,
                              callback: (transactions) => {
                                return (
                                  `${
                                    appSettings.logbookSettings.defaultCurrency
                                      .symbol
                                  } ${utils.getFormattedNumber({
                                    negativeSymbol:
                                      appSettings.logbookSettings
                                        .negativeCurrencySymbol,
                                    currencyIsoCode:
                                      appSettings.logbookSettings
                                        .defaultCurrency.isoCode,
                                    value:
                                      utils.getTotalAmountAndConvertToDefaultCurrency(
                                        {
                                          invertResult: true,
                                          transactions,
                                          logbooks: logbooks.logbooks,
                                          globalCurrencyRates,
                                          targetCurrencyName:
                                            appSettings.logbookSettings
                                              .defaultCurrency.name,
                                        }
                                      ),
                                  })}` || "No active loan"
                                );
                              },
                            })}
                            // rightLabel={
                            //   (item.transactions_id?.length || "No") +
                            //   " transaction(s)"
                            // }
                            onPress={() => {
                              utils.findTransactionsByIds({
                                transactionIds: item.transactions_id,
                                groupSorted: sortedTransactions.groupSorted,
                                callback: (transactions) => {
                                  // console.log(
                                  //   JSON.stringify(item.transactions_id)
                                  // );
                                  // console.log(JSON.stringify(transactions));
                                  navigation.navigate(
                                    screenList.loanContactPreviewScreen,
                                    {
                                      contact: item,
                                      transactionDetails: transactions,
                                    }
                                  );
                                },
                              });
                            }}
                          />
                        </>
                      )}
                    </>
                  )}
                />
              </ListSection>
            </>
          )}
        </>
      )}
    </CustomScrollView>
  );
};

export default MyLoansScreen;
