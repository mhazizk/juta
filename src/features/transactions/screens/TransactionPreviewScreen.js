// import Intl from "intl";
// import "intl/locale-data/jsonp/en";
import { useEffect, useState } from "react";
import { Dimensions, FlatList } from "react-native";
import { TouchableNativeFeedback } from "react-native";
import { Image } from "react-native";
import { Alert, ScrollView, View } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import { deleteAttachmentImage } from "../../../api/firebase/cloudStorage";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import {
  ButtonSecondary,
  ButtonSecondaryDanger,
} from "../../../components/Button";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import Loading from "../../../components/Loading";
import { TextPrimary, TextSecondary } from "../../../components/Text";
import screenList from "../../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalRepeatedTransactions,
  useGlobalSortedTransactions,
  useGlobalTheme,
} from "../../../reducers/GlobalContext";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import * as utils from "../../../utils";
import ImageViewer from "../../image-viewer/components/ImageViewer";

const TransactionPreviewScreen = ({ route, navigation }) => {
  // TAG : Global State Section //
  const { globalTheme } = useGlobalTheme();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { appSettings } = useGlobalAppSettings();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { repeatedTransactions } = useGlobalRepeatedTransactions();
  const [category, setCategory] = useState();

  // TAG : useState Section //

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
        <CustomScrollView>
          {/* // TAG : Amount Section */}
          <View
            style={{
              flex: 1,
              width: "100%",
              minHeight: Dimensions.get("window").height * 0.3,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "flex-end",
                flexDirection: "column",
              }}
            >
              {/* // TAG : Primary Currency */}
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
                        ? globalTheme.colors.incomeSymbol
                        : globalTheme.text.textSecondary.color,
                  }}
                />
                <TextPrimary
                  label={utils.GetFormattedNumber({
                    value: transaction.details.amount,
                    currency: selectedLogbook.logbook_currency.name,
                  })}
                  style={{
                    fontSize: 36,
                    color:
                      transaction.details.in_out === "income"
                        ? globalTheme.colors.incomeAmount
                        : globalTheme.text.textPrimary.color,
                  }}
                />
              </View>
              {/* // TAG : Secondary Currency */}
              <View
                style={{
                  display: appSettings.logbookSettings.showSecondaryCurrency
                    ? "flex"
                    : "none",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <TextSecondary
                  label={
                    appSettings?.logbookSettings?.secondaryCurrency?.symbol
                  }
                  style={{
                    paddingRight: 8,
                    color:
                      transaction.details.in_out === "income"
                        ? globalTheme.colors.incomeSymbol
                        : globalTheme.text.textSecondary.color,
                  }}
                />
                <TextPrimary
                  label={utils.GetFormattedNumber({
                    value: utils.ConvertCurrency({
                      amount: transaction.details.amount,
                      from: selectedLogbook.logbook_currency.name,
                      target:
                        appSettings.logbookSettings.secondaryCurrency.name,
                    }),
                    currency:
                      appSettings.logbookSettings.secondaryCurrency.name,
                  })}
                  style={{
                    fontSize: 24,
                    color:
                      transaction.details.in_out === "income"
                        ? globalTheme.colors.incomeAmount
                        : globalTheme.text.textPrimary.color,
                  }}
                />
              </View>
            </View>
          </View>

          {/* // TAG : Details Section */}
          <View
            style={[
              {
                justifyContent: "flex-start",
                paddingBottom: 16,
                paddingLeft: 16,
                width: "100%",
              },
            ]}
          >
            <TextPrimary
              label={`${
                transaction.details.in_out[0].toUpperCase() +
                transaction.details.in_out.substring(1)
              } Details`}
              style={{
                fontSize: 24,
              }}
            />
          </View>

          <ListSection>
            {/* // TAG : Type */}
            <ListItem
              leftLabel="Type"
              iconLeftName="coins"
              iconPack="FontAwesome5"
              rightLabelColor={globalTheme.colors.foreground}
              rightLabel={
                !transaction?.details?.type
                  ? "Pick type"
                  : transaction?.details?.type[0].toUpperCase() +
                    transaction?.details?.type?.substring(1)
              }
            />
            {/* // TAG : Date */}
            <ListItem
              leftLabel="Date"
              iconLeftName="calendar"
              iconPack="IonIcons"
              rightLabelColor={globalTheme.colors.foreground}
              rightLabel={
                new Date(transaction?.details?.date).toDateString() +
                " " +
                new Date(transaction?.details?.date).toLocaleTimeString()
              }
            />
            {/* // TAG : Logbook */}
            <ListItem
              leftLabel="Logbook"
              iconLeftName="book"
              iconPack="IonIcons"
              rightLabelColor={globalTheme.colors.foreground}
              rightLabel={
                route?.params?.selectedLogbook?.name[0]?.toUpperCase() +
                route?.params?.selectedLogbook?.name?.substring(1)
              }
            />
            {/* // TAG : Category */}
            <ListItem
              leftLabel="Category"
              rightLabel={
                selectedCategory?.name
                  ? selectedCategory?.name[0].toUpperCase() +
                    selectedCategory?.name.substring(1)
                  : "Pick Category"
              }
              rightLabelColor={globalTheme.colors.foreground}
              iconPack="IonIcons"
              iconLeftName="pricetags"
              useRightLabelContainer
              iconInRightContainerName={selectedCategory?.icon?.name}
              rightLabelContainerStyle={{
                flexDirection: "row",
                maxWidth: "50%",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
                borderRadius: 8,
                backgroundColor: globalTheme.colors.secondary,
              }}
              iconColorInContainer={
                selectedCategory?.icon?.color === "default"
                  ? globalTheme.colors.foreground
                  : selectedCategory?.icon?.color
              }
              rightLabelStyle={{
                color: globalTheme.text.textPrimary.color,
              }}
            />
          </ListSection>
          {/* // TAG : Notes */}
          <ListSection>
            <ListItem
              leftLabel="Notes"
              iconLeftName="document-text"
              iconPack="IonIcons"
              rightLabelColor={globalTheme.colors.foreground}
              rightLabel={
                transaction?.details?.notes
                  ? transaction?.details?.notes
                  : "No notes"
              }
            />
          </ListSection>
          {/* // TAG : Attachment */}
          <ListSection>
            <ListItem
              // pressable
              leftLabel="Attachment Images"
              iconLeftName="image"
              iconPack="IonIcons"
              rightLabel={
                transaction?.details?.attachment_URL?.length
                  ? transaction?.details?.attachment_URL?.length + " image(s)"
                  : "No attachment"
              }
            />
            <FlatList
              horizontal
              data={transaction?.details?.attachment_URL}
              contentContainerStyle={{
                alignItems: "center",
                padding:
                  transaction?.details?.attachment_URL?.length > 0 ? 8 : 0,
                justifyContent: "center",
                minWidth: "100%",
              }}
              renderItem={({ item }) => (
                <>
                  {item && (
                    <>
                      <ImageViewer
                        uri={item}
                        onPress={(uri) => {
                          navigation.navigate(screenList.imageViewerScreen, {
                            uri,
                            uriList: transaction?.details?.attachment_URL,
                          });
                        }}
                      />
                    </>
                  )}
                </>
              )}
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
            {/* // TAG : Edit Button */}
            <View style={{ flex: 1, paddingRight: 8 }}>
              <ButtonSecondary
                label="Edit"
                // width={150}
                onPress={() =>
                  navigation.navigate(screenList.transactionDetailsScreen, {
                    transaction: transaction,
                    selectedLogbook: route?.params?.selectedLogbook,
                    selectedCategory: selectedCategory,
                    selectedRepeatSection: selectedRepeatSection,
                  })
                }
              />
            </View>

            {/* // TAG : Delete Button */}
            <View style={{ flex: 1, paddingLeft: 8 }}>
              <ButtonSecondaryDanger
                label="Delete"
                type="danger"
                // width={150}
                onPress={() =>
                  Alert.alert(
                    "Delete Transaction",
                    `Are you sure you want to delete this transaction ?\nThis action cannot be undone.`,
                    [
                      {
                        text: "No",
                        onPress: () => {},
                        style: "cancel",
                      },
                      {
                        text: "Yes",
                        onPress: () => {
                          setTimeout(async () => {
                            await firestore.deleteData(
                              FIRESTORE_COLLECTION_NAMES.TRANSACTIONS,
                              transaction.transaction_id
                            );
                            if (transaction.details.attachment_URL.length > 0) {
                              transaction.details.attachment_URL.forEach(
                                async (url) => {
                                  await deleteAttachmentImage(url);
                                }
                              );
                            }
                          }, 5000);
                          navigation.navigate(screenList.loadingScreen, {
                            label: "Deleting Transaction ...",
                            loadingType: "deleteOneTransaction",
                            deleteTransaction: transaction,
                            logbookToOpen: selectedLogbook,
                            reducerUpdatedAt: Date.now(),
                          });
                        },
                      },
                    ],
                    { cancelable: false }
                  )
                }
              />
            </View>
          </View>
        </CustomScrollView>
      )}
    </>
  );
};

export default TransactionPreviewScreen;
