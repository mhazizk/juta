import { useEffect, useRef, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
// import utils.FormatCurrency from "../../../assets/utils.FormatCurrency";
// import "intl/locale-data/jsonp/en";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalCurrencyRates,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import { ButtonPrimary, ButtonSecondary } from "../../../components/Button";
import { TextPrimary } from "../../../components/Text";
import * as utils from "../../../utils";
import screenList from "../../../navigations/ScreenList";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import CURRENCY_CONSTANTS from "../../../constants/currencyConstants";
import CheckList from "../../../components/CheckList";
import LOADING_TYPES from "../../../screens/modal/loading.type";
import ActionButtonWrapper from "../../../components/ActionButtonWrapper";
import MODAL_TYPE_CONSTANTS from "../../../constants/modalTypeConstants";

const EditLogbookScreen = ({ route, navigation }) => {
  // TAG : Global State Section //
  const { userAccount } = useGlobalUserAccount();
  // const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { globalCurrencyRates } = useGlobalCurrencyRates();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();

  // TAG : useState Section //

  const [originalLogbook, setOriginalLogbook] = useState(null);
  const [logbook, setLogbook] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [logbookToOpen, setLogbookToOpen] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isConvertCurrency, setIsConvertCurrency] = useState(false);

  const inputRef = useRef(null);

  // TAG : UseEffect Section //

  useEffect(() => {
    setLogbook(route?.params?.logbook);
    setOriginalLogbook(route?.params?.logbook);
    getTransactions();
  }, []);

  useEffect(() => {
    // refresh
    // console.log(transaction.details)
    // findCategoryNameById();
    // findCategoryIconNameById();
    // findLogbookNamebyId();

    if (!selectedCurrency && logbook) {
      setSelectedCurrency(logbook.logbook_currency);
    }

    console.log(logbook);
  }, [logbook]);

  useEffect(() => {
    // refresh
  }, [selectedCategory]);

  useEffect(() => {
    // refresh
    console.log(selectedCurrency);
  }, [selectedCurrency]);

  useEffect(() => {}, [logbookToOpen]);

  // TAG : Function Section //

  const getTransactions = () => {
    let array = [];
    sortedTransactions.groupSorted.forEach((logbook) => {
      logbook.transactions.forEach((section) => {
        section.data.forEach((transaction) => {
          if (transaction.logbook_id === route?.params?.logbook.logbook_id) {
            array.push(transaction);
          }
        });
      });
    });
    setTransactions(array);
  };

  const countTransactions = () => {
    let array = [];
    const filtered = sortedTransactions.groupSorted.filter(
      (logbook) => logbook.logbook_id === route?.params?.logbook.logbook_id
    );
    if (filtered.length) {
      filtered[0].transactions.forEach((section) =>
        section.data.forEach((transaction) =>
          array.push(transaction.transaction_id)
        )
      );
    }
    return array.length;
  };

  const handleSave = () => {
    const finalLogbook = {
      ...logbook,
      _timestamps: {
        ...logbook._timestamps,
        updated_at: Date.now(),
        updated_by: userAccount.uid,
      },
    };

    if (isConvertCurrency) {
      // Convert all currency in this logbook
      const allTransactions = [];
      sortedTransactions.groupSorted.forEach((logbook) => {
        if (logbook.logbook_id === finalLogbook.logbook_id) {
          logbook.transactions.forEach((section) => {
            section.data.forEach((transaction) => {
              allTransactions.push(transaction);
            });
          });
        }
      });

      const convertedTransactions = allTransactions.map((transaction) => {
        return {
          ...transaction,
          details: {
            ...transaction.details,
            amount: utils.convertCurrency({
              amount: transaction.details.amount,
              from: originalLogbook.logbook_currency.name,
              target: finalLogbook.logbook_currency.name,
              globalCurrencyRates,
            }),
          },
          _timestamps: {
            ...transaction._timestamps,
            updated_at: Date.now(),
            updated_by: userAccount.uid,
          },
        };
      });

      navigation.navigate(screenList.loadingScreen, {
        label: "Saving Logbook...",
        loadingType: LOADING_TYPES.LOGBOOKS.PATCH_ONE,
        logbookToOpen: logbookToOpen,
        patchLogbook: finalLogbook,
        patchedTransactions: convertedTransactions,
        reducerUpdatedAt: Date.now(),
      });
    } else {
      navigation.navigate(screenList.loadingScreen, {
        label: "Saving Logbook...",
        loadingType: LOADING_TYPES.LOGBOOKS.PATCH_ONE,
        logbookToOpen: logbookToOpen,
        patchLogbook: finalLogbook,
        reducerUpdatedAt: Date.now(),
      });
    }
  };

  return (
    <>
      {logbook && selectedCurrency && (
        <CustomScrollView>
          <IonIcons
            name="book"
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

          {/* // TAG : Logbook Name Section */}
          <TouchableOpacity
            onPress={() => inputRef.current.focus()}
            style={{
              width: "100%",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              paddingHorizontal: 16,
            }}
          >
            <IonIcons
              name="book"
              size={48}
              style={{ padding: 16 }}
              color={globalTheme.colors.foreground}
            />
            <TextInput
              ref={inputRef}
              maxLength={30}
              textAlign="center"
              returnKeyType="done"
              placeholder="Type logbook name ..."
              placeholderTextColor={globalTheme.text.textSecondary.color}
              style={[
                {
                  ...globalTheme.text.textPrimary,
                  paddingLeft: 0,
                  paddingVertical: 16,
                  minHeight: 24,
                  fontSize: 24,
                },
                {},
              ]}
              onChangeText={(string) => {
                setLogbook({
                  ...logbook,
                  logbook_name: string,
                });
              }}
              clearButtonMode="never"
              defaultValue={logbook.logbook_name}
              value={logbook.logbook_name}
            />
            {logbook.logbook_name && (
              <IonIcons
                onPress={() => setLogbook({ ...logbook, logbook_name: "" })}
                name="close-circle"
                size={20}
                style={{ padding: 16 }}
                color={globalTheme.colors.foreground}
              />
            )}
          </TouchableOpacity>
          {/* </ScrollView> */}

          {/* // TAG : Logbook Details */}
          <View
            style={{
              width: "100%",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <TextPrimary label="Logbook Details" style={{ fontSize: 24 }} />
          </View>

          <ListSection>
            {/* // TAG : Logbook currency */}
            <ListItem
              pressable
              iconLeftName="coins"
              iconPack="FontAwesome5"
              leftLabel="Currency"
              rightIconPack="IonIcons"
              iconRightName="chevron-forward"
              useRightLabelContainer
              useFlagIcon
              flagIsoCode={logbook.logbook_currency.isoCode}
              flagIconSize={18}
              rightLabel={`${logbook.logbook_currency.currencyCode} / ${logbook.logbook_currency.symbol}`}
              rightLabelContainerStyle={{
                flexDirection: "row",
                maxWidth: "50%",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
                borderRadius: 8,
                backgroundColor: globalTheme.colors.secondary,
              }}
              onPress={() => {
                navigation.navigate(screenList.modalScreen, {
                  title: "Select logbook currency",
                  modalType: MODAL_TYPE_CONSTANTS.CURRENCY_LIST,
                  props: CURRENCY_CONSTANTS.OPTIONS.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                  }),
                  selected: (item) => {
                    setSelectedCurrency(item);
                    setLogbook({
                      ...logbook,
                      logbook_currency: item,
                    });
                  },
                  defaultOption: selectedCurrency,
                });
              }}
            />
            {/* // TAG : Initial balance */}
            <ListItem
              pressable
              iconLeftName="duplicate"
              iconPack="IonIcons"
              leftLabel="Initial balance"
              iconRightName="chevron-forward"
              rightLabel={
                !logbook.logbook_initial_balance_transaction_id
                  ? "Not set"
                  : utils.findTransactionsByIds({
                      transactionIds: [
                        logbook.logbook_initial_balance_transaction_id,
                      ],
                      groupSorted: sortedTransactions.groupSorted,
                      callback: (transactionList) => {
                        const transaction = transactionList[0];
                        return `${
                          logbook.logbook_currency.symbol
                        } ${utils.getFormattedNumber({
                          value: utils.convertCurrency({
                            amount: transaction.details.amount,
                            from: logbook.logbook_currency.name,
                            target: logbook.logbook_currency.name,
                            globalCurrencyRates,
                          }),
                          currencyCountryName: logbook.logbook_currency.name,
                          negativeSymbol:
                            appSettings.logbookSettings.negativeCurrencySymbol,
                        })}`;
                      },
                    })
              }
              onPress={() => {
                // TODO : continue here
              }}
            />

            {/* // TAG : Total balance */}
            <ListItem
              iconLeftName="cash"
              iconPack="IonIcons"
              leftLabel="Total balance"
              rightLabel={`${
                logbook.logbook_currency.symbol
              } ${utils.getFormattedNumber({
                value: utils.getTotalAmountAndConvertToDefaultCurrency({
                  transactions,
                  logbooks: logbooks.logbooks,
                  globalCurrencyRates,
                  targetCurrencyName: logbook.logbook_currency.name,
                }),
                currencyCountryName: logbook.logbook_currency.name,
                negativeSymbol:
                  appSettings.logbookSettings.negativeCurrencySymbol,
              })}`}
            />
            {/* // TAG : Total transactions */}
            <ListItem
              iconLeftName="book"
              iconPack="IonIcons"
              leftLabel="Total transactions"
              rightLabel={(countTransactions() || "No") + " Transactions"}
            />
          </ListSection>

          <ListSection>
            {/* // TAG : Convert all transactions */}
            <CheckList
              pressable
              primaryLabel="Convert all existing transactions"
              secondaryLabel="Convert all existing transactions in this logbook to the new currency"
              item={true}
              selected={isConvertCurrency}
              onPress={() => {
                setIsConvertCurrency(!isConvertCurrency);
              }}
            />
          </ListSection>

          {/* // TAG : Action Button */}
          <ActionButtonWrapper>
            {/* // TAG : Cancel Button */}
            <View style={{ flex: 1, paddingRight: 8 }}>
              <ButtonSecondary
                label="Cancel"
                onPress={() => navigation.goBack()}
              />
            </View>

            {/* // TAG : Save Button */}
            <View style={{ flex: 2, paddingLeft: 8 }}>
              <ButtonPrimary
                label="Save"
                onPress={() => {
                  handleSave();
                }}
              />
            </View>
          </ActionButtonWrapper>
        </CustomScrollView>
      )}
    </>
  );
};

export default EditLogbookScreen;
