import { useEffect, useState } from "react";
import {
  ScrollView,
  TextInput,
  TouchableNativeFeedback,
  View,
} from "react-native";
// import utils.FormatCurrency from "../../../assets/utils.FormatCurrency";
// import "intl/locale-data/jsonp/en";
import CountryFlag from "react-native-country-flag";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalLogbooks,
  useGlobalSortedTransactions, useGlobalUserAccount
} from "../../reducers/GlobalContext";
import { ButtonPrimary, ButtonSecondary } from "../../components/Button";
import { TextPrimary } from "../../components/Text";
import APP_SETTINGS from "../../config/appSettings";
import * as utils from "../../utils";
import screenList from "../../navigations/ScreenList";
import firestore from "../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../api/firebase/firestoreCollectionNames";

const EditLogbookScreen = ({ route, navigation }) => {
  // TAG : Global State Section //
  const { userAccount } = useGlobalUserAccount();
  // const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();

  // TAG : useState Section //

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

  // TAG : UseEffect Section //

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

  // TAG : Function Section //

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
            {/* // TAG : Logbook Name Section */}
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

            {/* // TAG : Logbook Details */}
            <View style={{ paddingHorizontal: 16 }}>
              <TextPrimary label="Logbook Details" style={{ fontSize: 24 }} />
            </View>

            {/* // TAG : Main Currency Section */}
            <TouchableNativeFeedback
              onPress={() =>
                navigation.navigate(screenList.modalScreen, {
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

                  {/* // TAG : Container */}
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
                    {/* // TAG : Type State */}
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

            {/* // TAG : Balance Section */}
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

              {/* // TAG : Container */}
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
                {/* // TAG : Today Button */}
                <TextPrimary
                  label={`${utils.GetFormattedNumber({
                    value: sumBalance(),
                    currency: appSettings.logbookSettings.defaultCurrency.name,
                  })}`}
                />
              </View>
            </View>

            {/* // TAG : Total Transactions Section */}
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

              {/* // TAG : Right Side */}
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

            {/* // TAG : Line Separator */}
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

            {/* // TAG : Action Button */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
              }}
            >
              {/* // TAG : cancel Button */}
              <View style={{ paddingRight: 8 }}>
                <ButtonSecondary
                  label="Cancel"
                  width={150}
                  onPress={() => navigation.goBack()}
                />
              </View>

              {/* // TAG : Save Button */}
              <View style={{ paddingLeft: 8 }}>
                <ButtonPrimary
                  label="Save"
                  width={150}
                  onPress={() => {
                    const finalLogbook = {
                      ...logbook,
                      _timestamps: {
                        ...logbook._timestamps,
                        updated_at: Date.now(),
                        updated_by: userAccount.uid,
                      },
                    };

                    setTimeout(async () => {
                      await firestore.setData(
                        FIRESTORE_COLLECTION_NAMES.LOGBOOKS,
                        finalLogbook.logbook_id,
                        finalLogbook
                      );
                    }, 1);

                    navigation.navigate(screenList.loadingScreen, {
                      label: "Saving Logbook ...",
                      loadingType: "patchLogbook",
                      logbookToOpen: logbookToOpen,
                      patchLogbook: finalLogbook,
                      reducerUpdatedAt: Date.now(),
                      // initialLogbookPatchCounter: logbooks.logbookPatchCounter,
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
