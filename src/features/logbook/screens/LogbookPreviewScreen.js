import { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
// import "intl/locale-data/jsonp/en";
import CountryFlag from "react-native-country-flag";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  ButtonSecondary,
  ButtonSecondaryDanger,
  ButtonSecondaryDisabled,
} from "../../../components/Button";
import { TextPrimary } from "../../../components/Text";
import * as utils from "../../../utils";
import {
  useGlobalAppSettings,
  useGlobalCurrencyRates,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import screenList from "../../../navigations/ScreenList";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import firestore from "../../../api/firebase/firestore";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import ListSection from "../../../components/List/ListSection";
import { ListItem } from "../../../components/List";
import { useIsFocused } from "@react-navigation/native";
import ActionButtonWrapper from "../../../components/ActionButtonWrapper";

const LogbookPreviewScren = ({ route, navigation }) => {
  // TAG : Global State Section //
  const { globalTheme } = useGlobalTheme();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { appSettings } = useGlobalAppSettings();
  const { globalCurrencyRates } = useGlobalCurrencyRates();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const [transactions, setTransactions] = useState([]);

  const isFocused = useIsFocused();

  // TAG : useState Section //

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
    if (isFocused) {
      setLogbook(route?.params?.logbook);
      setTransactions(
        utils.getTransactionsByLogbookId({
          groupSorted: sortedTransactions.groupSorted,
          logbookId: route?.params?.logbook.logbook_id,
        })
      );
    }
  }, [isFocused]);

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

  const deleteLogbook = () => {
    switch (true) {
      case countTransactions() > 0:
        Alert.alert(
          "Delete This Logbook ?",
          "Cannot delete logbook with transactions. Please delete all transactions in this logbook first.",
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
                setTimeout(async () => {
                  await firestore.deleteData(
                    FIRESTORE_COLLECTION_NAMES.LOGBOOKS,
                    logbook.logbook_id
                  );
                }, 5000);

                navigation.navigate(screenList.loadingScreen, {
                  label: "Deleting Logbook ...",
                  loadingType: "deleteOneLogbook",
                  deleteLogbook: logbook,
                  logbookToOpen: null,
                  reducerUpdatedAt: Date.now(),
                  // initialLogbookDeleteCounter: logbooks.logbookDeleteCounter,
                  // initialSortedLogbookDeleteCounter:
                  //   sortedTransactions.sortedLogbookDeleteCounter,
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
        <CustomScrollView>
          <IonIcons
            name="book"
            size={400}
            style={{
              position: "absolute",
              top: "10%",
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
              iconLeftName="coins"
              rightIconPack="IonIcons"
              iconPack="FontAwesome5"
              leftLabel="Currency"
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
            />

            {/* // TAG : Total balance */}
            <ListItem
              iconLeftName="cash"
              iconPack="IonIcons"
              leftLabel="Total balance"
              rightLabelColor={globalTheme.colors.foreground}
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
              rightLabelColor={globalTheme.colors.foreground}
              leftLabel="Total transactions"
              rightLabel={(countTransactions() || "No") + " Transactions"}
            />
          </ListSection>

          {/* // TAG : Action Button */}
          <ActionButtonWrapper>
            {/* // TAG : Edit Button */}
            <View style={{ flex: 1, paddingRight: 8 }}>
              <ButtonSecondary
                label="Edit"
                onPress={() =>
                  navigation.navigate(screenList.editLogbookScreen, {
                    logbook: logbook,
                    selectedLogbook: selectedLogbook,
                    selectedCategory: selectedCategory,
                  })
                }
              />
            </View>

            {/* // TAG : Delete Button */}
            <View style={{ flex: 1, paddingLeft: 8 }}>
              {logbooks.logbooks.length <= 1 && (
                <ButtonSecondaryDisabled label="Delete" type="danger" />
              )}
              {logbooks.logbooks.length > 1 && (
                <ButtonSecondaryDanger
                  label="Delete"
                  type="danger"
                  onPress={() => {
                    deleteLogbook();
                  }}
                />
              )}
            </View>
          </ActionButtonWrapper>
        </CustomScrollView>
      )}
    </>
  );
};

export default LogbookPreviewScren;
