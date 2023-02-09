import { useEffect, useState } from "react";
import {
  TextInput, View
} from "react-native";
// import utils.FormatCurrency from "../../../assets/utils.FormatCurrency";
// import "intl/locale-data/jsonp/en";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import { ButtonPrimary, ButtonSecondary } from "../../../components/Button";
import { TextPrimary } from "../../../components/Text";
import APP_SETTINGS from "../../../config/appSettings";
import * as utils from "../../../utils";
import screenList from "../../../navigations/ScreenList";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";

const EditLogbookScreen = ({ route, navigation }) => {
  // TAG : Global State Section //
  const { userAccount } = useGlobalUserAccount();
  // const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();

  // TAG : useState Section //

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
        <CustomScrollView>
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
              color={globalTheme.colors.foreground}
            />
            <TextInput
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
                color={globalTheme.colors.foreground}
              />
            )}
          </View>
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
            {/* // TAG : Main currency */}
            <ListItem
              pressable
              iconLeftName="coins"
              iconPack="FontAwesome5"
              leftLabel="Main currency"
              iconRightName="chevron-forward"
              useRightLabelContainer
              useFlagIcon
              flagIsoCode={logbook.logbook_currency.isoCode}
              flagIconSize={18}
              rightLabel={`${logbook.logbook_currency.name} / ${logbook.logbook_currency.symbol}`}
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
                  defaultOption: selectedCurrency,
                });
              }}
            />

            {/* // TAG : Total balace */}
            <ListItem
              iconLeftName="cash"
              iconPack="IonIcons"
              leftLabel="Total balance"
              rightLabel={`${
                logbook.logbook_currency.symbol
              } ${utils.GetFormattedNumber({
                value: sumBalance(),
                currency: logbook.logbook_currency.name,
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

          {/* // TAG : Action Button */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 8,
              paddingBottom: 24,
              paddingHorizontal: 48,
            }}
          >
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
                  }, 5000);

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
        </CustomScrollView>
      )}
    </>
  );
};

export default EditLogbookScreen;