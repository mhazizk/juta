import { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
// import "intl/locale-data/jsonp/en";
import CountryFlag from "react-native-country-flag";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import { ButtonSecondary } from "../../components/Button";
import { TextPrimary } from "../../components/Text";
import * as utils from "../../utils";
import {
  useGlobalAppSettings,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTransactions,
} from "../../reducers/GlobalContext";
import screenList from "../../navigations/ScreenList";

const LogbookPreviewScren = ({ route, navigation }) => {
  // TAG : Global State Section //
  const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
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
  const [selectedLogbook, setSelectedLogbook] = useState(null);

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
    setLogbook(route?.params?.logbook);
  }, [route?.params?.logbook]);

  useEffect(() => {
    // refresh
    // console.log(transaction.details)
    // findCategoryNameById();
    // findCategoryIconNameById();
    // findLogbookNamebyId();
  }, [logbook]);

  useEffect(() => {
    // refresh
  }, [selectedCategory]);

  useEffect(() => {
    // refresh
  }, [selectedLogbook]);

  useEffect(() => {}, [logbookToOpen]);

  useEffect(() => {}, [sortedTransactions]);

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

  const deleteLogbook = () => {
    switch (true) {
      case countTransactions() > 0:
        Alert.alert(
          "Delete This Logbook ?",
          'Cannot delete logbook with transactions. Please delete all transactions in this logbook first. You can delete all transactions by clicking "Delete All Transactions" button in "Logbook Details" screen',
          [
            {
              text: "OK",
              onPress: () => {},
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
        return;

      case logbooks.logbooks.length === 1:
        Alert.alert(
          "Delete This Logbook ?",
          "Cannot delete last logbook. Please create a new logbook first.",
          [
            {
              text: "OK",
              onPress: () => {},
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
        return;

      case logbooks.logbooks.length > 1 && countTransactions() === 0:
        Alert.alert(
          "Delete This Logbook ?",
          "This action cannot be undone. All transactions in this logbook will be deleted.",
          [
            {
              text: "Cancel",
              onPress: () => {},
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => {
                navigation.navigate(screenList.loadingScreen, {
                  label: "Deleting Logbook ...",
                  loadingType: "deleteOneLogbook",
                  deleteLogbook: logbook,
                  logbookToOpen: null,
                  initialLogbookDeleteCounter: logbooks.logbookDeleteCounter,
                  initialSortedLogbookDeleteCounter:
                    sortedTransactions.sortedLogbookDeleteCounter,
                });
              },
            },
          ],
          { cancelable: false }
        );
        return;
      default:
        break;
    }
  };

  return (
    <>
      {logbook && (
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
              <TextPrimary
                label={
                  route?.params?.logbook.logbook_name[0].toUpperCase() +
                  route?.params?.logbook.logbook_name.substring(1)
                }
                style={{ fontSize: 24 }}
              />
              {/* </View> */}
            </View>
            {/* </ScrollView> */}

            {/* // TAG : Logbook Details */}
            <View style={{ paddingHorizontal: 16 }}>
              <TextPrimary label="Logbook Details" style={{ fontSize: 24 }} />
            </View>

            {/* // TAG : Currency Section */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: 36,
                paddingTop: 8,
                paddingHorizontal: 16,
              }}
            >
              <FontAwesome5
                name="coins"
                size={18}
                style={{ paddingRight: 16 }}
                color={appSettings.theme.style.colors.foreground}
              />
              <TextPrimary label="Main Currency" style={{ flex: 1 }} />

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
                <CountryFlag
                  isoCode={logbook.logbook_currency.isoCode}
                  size={18}
                />
                <TextPrimary
                  label={`${logbook.logbook_currency.name} / ${logbook.logbook_currency.symbol}`}
                  style={{ paddingLeft: 8 }}
                />
              </View>
            </View>

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
                  label={`${utils.GetFormattedNumber({
                    value: sumBalance(),
                    currency: appSettings.logbookSettings.defaultCurrency.name,
                  })}`}
                  style={{ paddingLeft: 8 }}
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
                  label={(countTransactions() || "No") + " Transactions"}
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
              {/* // TAG : Edit Button */}
              <View style={{ paddingRight: 8 }}>
                <ButtonSecondary
                  label="Edit"
                  width={150}
                  onPress={() =>
                    navigation.navigate(screenList.editLogbookScreen, {
                      logbook: logbook,
                      selectedLogbook: selectedLogbook,
                      selectedCategory: selectedCategory,
                    })
                  }
                  theme={theme.theme}
                />
              </View>

              {/* // TAG : Delete Button */}
              <View style={{ paddingLeft: 8 }}>
                <ButtonSecondary
                  label="Delete"
                  type="danger"
                  width={150}
                  theme={theme.theme}
                  onPress={() => {
                    deleteLogbook();
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

export default LogbookPreviewScren;
