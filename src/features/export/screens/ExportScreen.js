import { useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { ButtonDisabled, ButtonPrimary } from "../../../components/Button";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalCurrencyRates,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import * as utils from "../../../utils";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import ListSection from "../../../components/List/ListSection";
import { ListItem } from "../../../components/List";
import { TextPrimary } from "../../../components/Text";
import Loading from "../../../components/Loading";
import screenList from "../../../navigations/ScreenList";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import MODAL_TYPE_CONSTANTS from "../../../constants/modalTypeConstants";

const ExportScreen = ({ navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const { userAccount } = useGlobalUserAccount();
  const { logbooks } = useGlobalLogbooks();
  const { categories } = useGlobalCategories();
  const { sortedTransactions } = useGlobalSortedTransactions();
  const { globalCurrencyRates } = useGlobalCurrencyRates();

  const [selectedLogbook, setSelectedLogbook] = useState(logbooks.logbooks[0]);
  //   const [transactionData, setTransactionData] = useState([]);
  const [startDate, setStartDate] = useState(+new Date().setHours(0, 0, 0, 0));
  const [finishDate, setFinishDate] = useState(
    new Date(startDate + 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0)
  );
  const [showButton, setShowButton] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);

  useEffect(() => {}, []);
  useEffect(() => {
    finishDate < startDate
      ? setFinishDate(
          new Date(startDate + 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0)
        )
      : null;
    if (selectedLogbook && startDate && finishDate) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [selectedLogbook, startDate, finishDate]);

  // Set Date in Date Picker
  const onChangeStart = (event, selectedDate) => {
    const currentDate = selectedDate;
    setStartDate(new Date(currentDate).getTime());
  };

  // Set Date in Date Picker
  const onChangeFinish = (event, selectedDate) => {
    const currentDate = selectedDate;
    setFinishDate(new Date(currentDate).getTime());
  };

  // Date Picker
  const showMode = ({ currentMode, mode }) => {
    DateTimePickerAndroid.open({
      value: mode === "start" ? new Date(startDate) : new Date(finishDate),
      onChange: mode === "start" ? onChangeStart : onChangeFinish,
      mode: currentMode,
      is24Hour: true,
      minimumDate:
        mode === "start"
          ? //   ? new Date().setHours(0, 0, 0, 0)
            null
          : new Date(startDate + 1000 * 60 * 60 * 24),
    });
  };

  // Date Picker
  const showDatePicker = ({ mode }) => {
    showMode({ currentMode: "date", mode: mode });
  };

  const getTransactionData = ({
    startDate,
    finishDate,
    selectedLogbook,
    groupSorted,
  }) => {
    const array = [];

    // get all transactions from selected logbook
    const transactions = groupSorted.find(
      (logbook) => logbook.logbook_id === selectedLogbook.logbook_id
    ).transactions;

    // get transactions between start date and finish date
    transactions.forEach((section) =>
      section.data.forEach((transaction) => {
        if (
          startDate <= transaction.details.date &&
          transaction.details.date <= finishDate
        ) {
          array.push(transaction);
        }
      })
    );

    array.sort((a, b) => a.details.date - b.details.date);
    const obj = {
      transactions: array,
      transactionsLength: array.length,
    };
    return obj;
    // if (getTransactionData) {
    //   return array.sort((a, b) => a.details.date - b.details.date);
    // }
    // if (getTransactionLength) {
    //   return array.length;
    // }
    // return setTransactionData(array);
  };

  return (
    <>
      <CustomScrollView>
        {!screenLoading && (
          <>
            {/* // TAG : Logbook Selection */}
            <TextPrimary
              label="Select Logbook"
              style={{
                alignSelf: "flex-start",
                paddingVertical: 16,
                paddingHorizontal: 16,
              }}
            />
            <ListSection>
              <ListItem
                pressable
                iconPack="IonIcons"
                iconLeftName="book"
                iconRightName="chevron-forward"
                leftLabel="Logbook"
                rightLabel={selectedLogbook?.logbook_name}
                onPress={() =>
                  navigation.navigate(screenList.modalScreen, {
                    title: "Select Logbook",
                    modalType: MODAL_TYPE_CONSTANTS.LIST,
                    props: logbooks?.logbooks?.map((logbook) => {
                      return {
                        ...logbook,
                        name: logbook.logbook_name,
                      };
                    }),
                    iconProps: {
                      name: "book",
                      pack: "IonIcons",
                    },
                    selected: (item) => {
                      //   console.log(item);
                      setSelectedLogbook(item);
                    },
                    defaultOption: {
                      ...selectedLogbook,
                      name: selectedLogbook.logbook_name,
                    },
                  })
                }
              />
            </ListSection>
            {/* // TAG : Date Selection */}
            <TextPrimary
              label="Select Date Range"
              style={{
                alignSelf: "flex-start",
                paddingVertical: 16,
                paddingHorizontal: 16,
              }}
            />
            <ListSection>
              <ListItem
                pressable
                iconPack="IonIcons"
                iconLeftName="calendar"
                iconRightName="chevron-forward"
                leftLabel="Start Date"
                rightLabel={new Date(startDate).toDateString()}
                onPress={() => showDatePicker({ mode: "start" })}
              />
              <ListItem
                pressable
                iconPack="IonIcons"
                iconLeftName="calendar"
                iconRightName="chevron-forward"
                leftLabel="Finish Date"
                rightLabel={new Date(finishDate).toDateString()}
                onPress={() => showDatePicker({ mode: "finish" })}
              />
            </ListSection>
            <View
              style={{
                alignItems: "center",
              }}
            >
              <TextPrimary
                label={`${
                  getTransactionData({
                    startDate: new Date(startDate).getTime(),
                    finishDate: new Date(finishDate).getTime(),
                    selectedLogbook,
                    groupSorted: sortedTransactions.groupSorted,
                  }).transactionsLength || "No"
                } transaction(s) found`}
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 32,
                }}
              />

              {/* // TAG : Button Active */}
              {getTransactionData({
                startDate: new Date(startDate).getTime(),
                finishDate: new Date(finishDate).getTime(),
                selectedLogbook,
                groupSorted: sortedTransactions.groupSorted,
              }).transactionsLength !== 0 && (
                <ButtonPrimary
                  style={{ marginVertical: 16 }}
                  width={Dimensions.get("window").width - 32}
                  label="Export as PDF"
                  onPress={async () => {
                    setScreenLoading(true);
                    const fileName = `${
                      selectedLogbook.logbook_name
                    } - ${new Date(startDate).toDateString()} - ${new Date(
                      finishDate
                    ).toDateString()}.pdf`;

                    const totalBalance =
                      utils.getTotalAmountAndConvertToDefaultCurrency({
                        transactions: getTransactionData({
                          getTransactionData: true,
                          startDate: 0,
                          finishDate: Date.now(),
                          selectedLogbook,
                          groupSorted: sortedTransactions.groupSorted,
                        }).transactions,
                        logbooks: logbooks.logbooks,
                        targetCurrencyName:
                          selectedLogbook.logbook_currency.name,
                        globalCurrencyRates,
                      });

                    const totalBalanceInRange =
                      utils.getTotalAmountAndConvertToDefaultCurrency({
                        transactions: getTransactionData({
                          getTransactionData: true,
                          startDate: new Date(startDate).getTime(),
                          finishDate: new Date(finishDate).getTime(),
                          selectedLogbook,
                          groupSorted: sortedTransactions.groupSorted,
                        }).transactions,
                        logbooks: logbooks.logbooks,
                        targetCurrencyName:
                          selectedLogbook.logbook_currency.name,
                        globalCurrencyRates,
                      });

                    const openingBalance = utils.getFormattedNumber({
                      value: totalBalance - totalBalanceInRange,
                      currencyCountryName:
                        selectedLogbook.logbook_currency.name,
                      negativeSymbol:
                        appSettings.logbookSettings.negativeCurrencySymbol,
                    });

                    const printPDF = await utils.createPDF({
                      appSettings,
                      displayName: userAccount.displayName,
                      uid: userAccount.uid,
                      logbook: selectedLogbook,
                      categories: categories.categories,
                      transactionData: getTransactionData({
                        getTransactionData: true,
                        startDate: new Date(startDate).getTime(),
                        finishDate: new Date(finishDate).getTime(),
                        selectedLogbook,
                        groupSorted: sortedTransactions.groupSorted,
                      }).transactions,
                      openingBalance: openingBalance,
                      finalBalance: utils.getFormattedNumber({
                        value: totalBalance,
                        currencyCountryName:
                          selectedLogbook.logbook_currency.name,
                        negativeSymbol:
                          appSettings.logbookSettings.negativeCurrencySymbol,
                      }),
                      startDate: new Date(startDate).getTime(),
                      finishDate: new Date(finishDate).getTime(),
                      fileName,
                    });
                    await utils.shareData(printPDF);
                    setScreenLoading(false);
                  }}
                />
              )}
              {/* // TAG : Button Disabled */}
              {getTransactionData({
                startDate: new Date(startDate).getTime(),
                finishDate: new Date(finishDate).getTime(),
                selectedLogbook,
                groupSorted: sortedTransactions.groupSorted,
              }).transactionsLength === 0 && (
                <ButtonDisabled
                  style={{ marginVertical: 16 }}
                  width={Dimensions.get("window").width - 32}
                  label="Export as PDF"
                />
              )}
            </View>
          </>
        )}
        {screenLoading && (
          <>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Loading size={48} />
              <TextPrimary label="Exporting..." />
            </View>
          </>
        )}
      </CustomScrollView>
    </>
  );
};

export default ExportScreen;
