import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  Text,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
// import formatCurrency from "../../../assets/formatCurrency";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import Intl from "intl";
import "intl/locale-data/jsonp/en";
import CountryFlag from "react-native-country-flag";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTransactions,
} from "../../reducers/GlobalContext";
import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonSwitch,
} from "../../components/Button";
import { TextPrimary } from "../../components/Text";
import APP_SETTINGS from "../../config/appSettings";
import categories from "../../database/userCategories";
import formatCurrency from "../../utils/FormatCurrency";

const EditLogbookScreen = ({ route, navigation }) => {
  // ! Global State Section //
  const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();

  // ! useState Section //

  // Theme State
  const [theme, setTheme] = useState({
    theme: "lightTheme",
    fontSize: "medium",
  });

  // Transaction State
  const [logbook, setLogbook] = useState(null);

  // Selected Logbook State
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const [logbookToOpen, setLogbookToOpen] = useState(null);

  // logbook_id : null
  // logbook_name: null

  // Selected Category State
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ! UseEffect Section //

  useEffect(() => {
    setLogbook(route?.params?.logbook);
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

  // ! Function Section //
  // Find Category Name by Id
  const findCategoryNameById = useMemo(() => {
    return () => {
      if (logbook) {
        const id = logbook.details.category_id;
        const foundExpenseCategory = categories.expense.filter((category) => {
          return category.id === id;
        });
        const foundIncomeCategory = categories.income.filter((category) => {
          return category.id === id;
        });

        if (foundExpenseCategory.length) {
          setSelectedCategory(foundExpenseCategory[0]);
        } else {
          setSelectedCategory(foundIncomeCategory[0]);
        }
      }
    };
  }, [logbook]);

  // Find Category Icon Name by Id
  const findCategoryIconNameById = useMemo(() => {
    return () => {
      if (logbook) {
        const filteredExpenseCategory = categories.expense.filter(
          (category) => {
            return category.id === logbook.details.category_id;
          }
        );
        const filteredIncomeCategory = categories.income.filter((category) => {
          return category.id === logbook.details.category_id;
        });

        if (filteredExpenseCategory.length) {
          return setSelectedCategory(filteredExpenseCategory[0]);
          // return filteredExpenseCategory.map((item => item.icon.name));
        } else {
          return setSelectedCategory(filteredIncomeCategory[0]);
          // return filteredIncomeCategory.map((item) => item.icon.name);
        }
      }
    };
  }, [logbook]);

  // Find Log Book Name by Id
  const findLogbookNamebyId = useMemo(() => {
    return () => {
      if (logbook) {
        const found = logbooks.filter((logbook) => {
          return logbook.logbook_id === logbook.logbook_id;
        });
        setSelectedCurrency({
          logbook_id: found[0].logbook_id,
          name: found[0].logbook_name,
        });
        // setLogbookToOpen({ logbook_id: found[0].logbook_id, name: found[0].logbook_name })
      }
    };
  });

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

  const sumBalance = () => {
    let sum = [];
    const filtered = sortedTransactions.groupSorted.filter(
      (logbook) => logbook.logbook_id === route?.params?.logbook.logbook_id
    );
    // console.log(filtered)
    if (filtered.length) {
      filtered[0].transactions.forEach((section) =>
        section.data.forEach((transaction) => {
          if (transaction.details.in_out === "expense") {
            sum.push(-transaction.details.amount);
          }
          if (transaction.details.in_out === "income") {
            sum.push(transaction.details.amount);
          }
        })
      );
    }
    return sum.reduce((prev, curr) => prev + curr, 0);
  };

  return (
    <>
      {logbook && selectedCurrency && (
        <View
          style={{
            backgroundColor: appSettings.theme.style.colors.background,
            height: "100%",
          }}
        >
          <ScrollView
            contentContainerStyle={{ flex: 1, justifyContent: "center" }}
          >
            {/* // ! Logbook Name Section */}
            <View
              style={{
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
                color={appSettings.theme.style.colors.foreground}
              />
              {/* <View style={{ ...globalStyles.lightTheme.view, flex: 0, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}> */}
              {/* <Text style={{ ...globalStyles.lightTheme.textPrimary, fontSize: 24, textAlign: 'center' }}>{route?.params?.logbook.logbook_name[0].toUpperCase() + route?.params?.logbook.logbook_name.substring(1)}</Text> */}
              {/* </View> */}
              <TextInput
                maxLength={30}
                textAlign="center"
                returnKeyType="done"
                placeholder="Type logbook name ..."
                placeholderTextColor={
                  appSettings.theme.style.text.textSecondary.color
                }
                style={[
                  {
                    ...appSettings.theme.style.text.textPrimary,
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
                clearButtonMode="while-editing"
                defaultValue={logbook.logbook_name}
                value={logbook.logbook_name}
              />
              {logbook.logbook_name && (
                <IonIcons
                  onPress={() => setLogbook({ ...logbook, logbook_name: "" })}
                  name="close-circle"
                  size={20}
                  style={{ padding: 16 }}
                  color={appSettings.theme.style.colors.foreground}
                />
              )}
            </View>
            {/* </ScrollView> */}

            {/* // ! Logbook Details */}
            <View style={{ paddingHorizontal: 16 }}>
              <TextPrimary label="Logbook Details" style={{ fontSize: 24 }} />
            </View>

            {/* // ! Main Currency Section */}
            <TouchableNativeFeedback
              onPress={() =>
                navigation.navigate("Modal Screen", {
                  title: "Main Currency",
                  modalType: "currencyList",
                  props: APP_SETTINGS.CURRENCY.OPTIONS,
                  selected: (item) => {
                    const currency = {
                      name: item.name,
                      isoCode: item.isoCode,
                      symbol: item.symbol,
                    };
                    setSelectedCurrency(currency);
                    setLogbook({
                      ...logbook,
                      logbook_currency: currency,
                    });
                  },
                  default: selectedCurrency,
                })
              }
            >
              <View style={appSettings.theme.style.list.listContainer}>
                <View
                  style={{
                    ...appSettings.theme.style.list.listItem,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome5
                    name="coins"
                    size={18}
                    style={{ paddingRight: 16 }}
                    color={appSettings.theme.style.colors.foreground}
                  />
                  <TextPrimary label="Main Currency" style={{ flex: 1 }} />

                  {/* // ! Container */}
                  <View
                    style={[
                      {
                        flexDirection: "row",
                        maxWidth: "50%",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 8,
                        borderRadius: 8,
                      },
                      {
                        backgroundColor:
                          appSettings.theme.style.colors.secondary,
                      },
                    ]}
                  >
                    {/* // ! Type State */}
                    <CountryFlag isoCode={selectedCurrency.isoCode} size={18} />
                    <TextPrimary
                      label={`${logbook.logbook_currency.name} / ${logbook.logbook_currency.symbol}`}
                      style={{ paddingLeft: 8 }}
                    />
                  </View>
                  <IonIcons
                    name="chevron-forward"
                    size={18}
                    style={{ paddingLeft: 16 }}
                    color={appSettings.theme.style.colors.foreground}
                  />
                </View>
              </View>
            </TouchableNativeFeedback>

            {/* // ! Balance Section */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: 36,
                paddingTop: 8,
                paddingHorizontal: 16,
              }}
            >
              <IonIcons
                name="cash"
                size={18}
                style={{ paddingRight: 16 }}
                color={appSettings.theme.style.colors.foreground}
              />
              {/* <FontAwesome5 name='calendar-alt' size={18} style={{ paddingRight: 16 }} /> */}
              <TextPrimary label="Total Balance" style={{ flex: 1 }} />

              {/* // ! Container */}
              <View
                style={[
                  {
                    flexDirection: "row",
                    flex: 0,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                {/* // ! Today Button */}
                <TextPrimary
                  label={`${formatCurrency({
                    amount: sumBalance(),
                    currency: appSettings.currency.name,
                  })}`}
                />
              </View>
            </View>

            {/* // ! Total Transactions Section */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: 36,
                paddingTop: 8,
                paddingHorizontal: 16,
              }}
            >
              <IonIcons
                name="book"
                size={18}
                style={{ paddingRight: 16 }}
                color={appSettings.theme.style.colors.foreground}
              />
              <TextPrimary label="Total Transactions" style={{ flex: 1 }} />

              {/* // ! Right Side */}
              <View
                style={[
                  {
                    flexDirection: "row",
                    flex: 0,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <TextPrimary
                  label={`${
                    !countTransactions() ? "No" : countTransactions()
                  } transactions`}
                  style={{ flex: 0 }}
                  numberOfLines={1}
                />
              </View>
            </View>

            {/* // ! Line Separator */}
            <View
              style={{
                borderColor: appSettings.theme.style.colors.secondary,
                borderBottomWidth: 1,
                height: 0,
                width: "80%",
                alignSelf: "center",
                paddingTop: 16,
              }}
            ></View>

            {/* // ! Action Button */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
              }}
            >
              {/* // ! cancel Button */}
              <View style={{ paddingRight: 8 }}>
                <ButtonSecondary
                  label="Cancel"
                  width={150}
                  onPress={() => navigation.goBack()}
                />
              </View>

              {/* // ! Save Button */}
              <View style={{ paddingLeft: 8 }}>
                <ButtonPrimary
                  label="Save"
                  width={150}
                  onPress={() => {
                    setLogbook({
                      ...logbook,
                      _timestamps: {
                        ...logbook._timestamps,
                        updated_at: Date.now(),
                      },
                    });

                    navigation.navigate("Loading Screen", {
                      label: "Saving Logbook ...",
                      loadingType: "patchLogbook",
                      logbookToOpen: logbookToOpen,
                      patchLogbook: logbook,
                      initialLogbookPatchCounter: logbooks.logbookPatchCounter,
                      // initialSortedLogbookPatchCounter: sortedTransactions.sortedLogbookPatchCounter
                    });
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default EditLogbookScreen;
