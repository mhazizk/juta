// import Intl from "intl";
// import "intl/locale-data/jsonp/en";
import { useEffect, useState } from "react";
import {
  Alert, ScrollView, View
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import firestore from "../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../api/firebase/firestoreCollectionNames";
import {
  ButtonSecondary,
  ButtonSecondaryDanger
} from "../../components/Button";
import { TextPrimary, TextSecondary } from "../../components/Text";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalRepeatedTransactions,
  useGlobalSortedTransactions
} from "../../reducers/GlobalContext";
import * as utils from "../../utils";

const TransactionPreviewScreen = ({ route, navigation }) => {
  // TAG : Global State Section //
  // const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { repeatedTransactions } = useGlobalRepeatedTransactions();
  const [category, setCategory] = useState();

  // TAG : useState Section //

  // Theme State
  const [theme, setTheme] = useState({
    theme: "lightTheme",
    fontSize: "medium",
  });

  // Transaction State
  const [transaction, setTransaction] = useState(null);

  // Selected Logbook State
  const [selectedLogbook, setSelectedLogbook] = useState(null);

  const [logbookToOpen, setLogbookToOpen] = useState(null);

  const [selectedRepeatSection, setSelectedRepeatSection] = useState(null);

  // logbook_id : null
  // logbook_name: null

  // Selected Category State
  const [selectedCategory, setSelectedCategory] = useState(null);

  // TAG : UseEffect Section //

  useEffect(() => {
    setTransaction(route?.params?.transaction);
    setSelectedLogbook(route?.params?.selectedLogbook);
    if (route?.params?.repeat_id) {
      setSelectedRepeatSection(
        utils.findRepeatedTransactionSectionById({
          repeatID: route?.params?.repeat_id,
          repeatedTransactions: repeatedTransactions,
        })
      );
    }
  }, []);

  useEffect(() => {
    setSelectedCategory(
      utils.FindById.findCategoryById({
        id: transaction?.details.category_id,
        categories: categories.categories,
        transaction: transaction,
      })
    );
    // findLogbookNamebyId();
  }, [transaction]);

  useEffect(() => {
    // refresh
  }, [selectedCategory]);

  useEffect(() => {
    // refresh
  }, [selectedLogbook]);

  useEffect(() => {}, [logbookToOpen]);

  useEffect(() => {}, [category]);

  useEffect(() => {}, [categories]);

  // TAG : Function Section //

  return (
    <>
      {transaction && selectedCategory && (
        <View
          style={{
            backgroundColor: appSettings.theme.style.colors.background,
            height: "100%",
          }}
        >
          <ScrollView
            contentContainerStyle={{ flex: 1, justifyContent: "center" }}
          >
            {/* // TAG : Amount Section */}
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <View
                style={{
                  flex: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <TextSecondary
                  label={
                    route?.params?.selectedLogbook?.logbook_currency.symbol
                  }
                  style={{
                    paddingRight: 8,
                    color:
                      transaction.details.in_out === "income"
                        ? appSettings.theme.style.colors.incomeSymbol
                        : appSettings.theme.style.text.textSecondary.color,
                  }}
                />
                <TextPrimary
                  label={utils.GetFormattedNumber({
                    value: transaction.details.amount,
                    currency: selectedLogbook.logbook_currency.name,
                  })}
                  style={{
                    height: 36,
                    fontSize: 36,
                    color:
                      transaction.details.in_out === "income"
                        ? appSettings.theme.style.colors.incomeAmount
                        : appSettings.theme.style.text.textPrimary.color,
                  }}
                />
              </View>
              {/* <View style={{ flex: 0, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                <TextSecondary
                                    label={transaction.details.in_out === 1 ? 'Income' : 'Expense'}
                                    style={{ paddingTop: 8 }}
                                />
                            </View> */}
            </View>
            {/* </ScrollView> */}

            {/* // TAG : Details */}
            <View style={{ paddingHorizontal: 16 }}>
              <TextPrimary
                label={`${
                  transaction.details.in_out[0].toUpperCase() +
                  transaction.details.in_out.substring(1)
                } Details`}
                style={{ fontSize: 24 }}
              />
            </View>

            {/* // TAG : Type Section */}
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
              <TextPrimary label="Type" style={{ flex: 1 }} />

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
                {/* // TAG : Type State */}
                <TextPrimary
                  label={
                    transaction.details.type[0].toUpperCase() +
                    transaction.details.type.substring(1)
                  }
                />
              </View>
            </View>

            {/* // TAG : Date Section */}
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
                name="calendar"
                size={18}
                style={{ paddingRight: 16 }}
                color={appSettings.theme.style.colors.foreground}
              />
              {/* <FontAwesome5 name='calendar-alt' size={18} style={{ paddingRight: 16 }} /> */}
              <TextPrimary label="Date" style={{ flex: 1 }} />

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
                  label={new Date(transaction.details.date).toDateString()}
                />
              </View>
            </View>

            {/* // TAG : Log Book Section */}
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
              <TextPrimary label="From Book" style={{ flex: 1 }} />

              {/* // TAG : Container */}
              {/* <View style={[globalStyles.lightTheme.view, { flexDirection: 'row', flex: 2, alignItems: 'center', justifyContent: 'center' }]}> */}

              {/* // TAG : Book Picker */}
              <TextPrimary
                label={
                  route?.params?.selectedLogbook?.name[0]?.toUpperCase() +
                  route?.params?.selectedLogbook?.name?.substring(1)
                }
                style={{ flex: 2, textAlign: "right" }}
                numberOfLines={1}
              />
              {/* </View> */}
            </View>

            {/* // TAG : Category Section */}
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
                name="pricetags"
                size={18}
                style={{ paddingRight: 16 }}
                color={appSettings.theme.style.colors.foreground}
              />
              <TextPrimary label="Category" style={{ flex: 1 }} />

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
                {/* // TAG : Category Picker */}
                <IonIcons
                  name={selectedCategory?.icon?.name}
                  size={18}
                  style={{
                    display:
                      selectedCategory?.icon?.pack === "IonIcons"
                        ? "flex"
                        : "none",
                    paddingRight: 8,
                  }}
                  color={
                    selectedCategory?.icon?.color === "default"
                      ? appSettings.theme.style.colors.foreground
                      : selectedCategory?.icon?.color
                  }
                />
                <TextPrimary
                  label={
                    selectedCategory.name[0].toUpperCase() +
                    selectedCategory.name.substring(1)
                  }
                />
              </View>
            </View>

            {/* // TAG : Notes Section */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                minHeight: 36,
                paddingTop: 8,
                paddingHorizontal: 16,
              }}
            >
              <IonIcons
                name="document-text"
                size={18}
                style={{ paddingRight: 16 }}
                color={appSettings.theme.style.colors.foreground}
              />
              <TextPrimary label="Notes" style={{ flex: 1 }} />

              {/* // TAG : Container */}
              {/* <View style={[globalStyles.lightTheme.view, { flexDirection: 'row', flex: 3, alignItems: 'center', justifyContent: 'center' }]}> */}

              {/* <View style={{ backgroundColor: '#eee', borderRadius: 8, height: 48, justifyContent: 'center', paddingHorizontal: 16 }}> */}
              {/* // TAG : Notes Input */}
              <TextPrimary
                label={
                  transaction.details.notes
                    ? transaction.details.notes
                    : "No notes"
                }
                style={{ flex: 1, textAlign: "right" }}
              />
              {/* </View> */}
            </View>

            {/* // TAG : Line Separator */}
            <View
              style={{
                borderColor: "#bbb",
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
                    navigation.navigate(screenList.transactionDetailsScreen, {
                      transaction: transaction,
                      selectedLogbook: route?.params?.selectedLogbook,
                      selectedCategory: selectedCategory,
                      selectedRepeatSection: selectedRepeatSection,
                    })
                  }
                  theme={theme.theme}
                />
              </View>

              {/* // TAG : Delete Button */}
              <View style={{ paddingLeft: 8 }}>
                <ButtonSecondaryDanger
                  label="Delete"
                  type="danger"
                  width={150}
                  theme={theme.theme}
                  onPress={() =>
                    Alert.alert(
                      "Delete Transaction",
                      "Are you sure you want to delete this transaction ?",
                      [
                        {
                          text: "No",
                          onPress: () => {},
                          style: "cancel",
                        },
                        {
                          text: "Yes",
                          onPress: () => {
                            // navigation.navigate('Loading Screen', {
                            //     label: 'Deleting Transaction ...',
                            //     loadingType: 'deleteOneTransaction',
                            //     transaction_id: transaction?.transaction_id,
                            //     initialTransactionsDeleteCounter: rawTransactions.transactionsDeleteCounter,
                            //     initialSortedTransactionsDeleteCounter: sortedTransactions.sortedTransactionsDeleteCounter
                            // })

                            setTimeout(async () => {
                              await firestore.deleteData(
                                FIRESTORE_COLLECTION_NAMES.TRANSACTIONS,
                                transaction.transaction_id
                              );
                            }, 5000);
                            navigation.navigate(screenList.loadingScreen, {
                              label: "Deleting Transaction ...",
                              loadingType: "deleteOneTransaction",
                              deleteTransaction: transaction,
                              logbookToOpen: selectedLogbook,
                              reducerUpdatedAt: Date.now(),
                              // initialSortedTransactionsDeleteCounter:
                              //   sortedTransactions.sortedTransactionsDeleteCounter,
                            });
                          },
                        },
                      ],
                      { cancelable: false }
                    )
                  }
                />
              </View>

              {/* // TAG : Save Button */}
              {/* <View style={{ paddingLeft: 8 }}>
                            <ButtonPrimary label='Save' width={150} onPress={() => navigation.goBack()} theme={theme.theme} />
                        </View> */}
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default TransactionPreviewScreen;
