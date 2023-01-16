import { useEffect, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { globalStyles } from "../../assets/themes/globalStyles";
import { ButtonSecondary } from "../../components/Button";
import { TextPrimary } from "../../components/Text";
import APP_SETTINGS from "../../config/appSettings";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTransactions,
  useGlobalUserAccount,
} from "../../reducers/GlobalContext";
import { ACTIONS } from "../../reducers/GlobalReducer";
import uuid from "react-native-uuid";
import firestore from "../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../api/firebase/firestoreCollectionNames";
import SUBSCRIPTION_LIMIT from "../../features/subscription/model/subscriptionLimit";
import getSubscriptionLimit from "../../features/subscription/logic/getSubscriptionLimit";

const ActionScreen = ({ route, navigation }) => {
  const [selected, setSelected] = useState();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { userAccount } = useGlobalUserAccount();
  const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();

  const styleSelection =
    APP_SETTINGS.THEME.USER == "light" ? globalStyles : globalStyles.darkTheme;

  useEffect(() => {
    // refresh
    // console.log(selected)
  }, [selected]);

  useEffect(() => {
    setSelected(route?.params?.default);
  }, []);

  return (
    <>
      {/* // TAG : Transparent Overlay */}
      <TouchableOpacity
        onPress={() => navigation.pop(1)}
        style={{ flex: 1, backgroundColor: "transparent" }}
      >
        <View style={{ flex: 1, backgroundColor: "transparent" }}></View>
      </TouchableOpacity>

      {/* // TAG : Content card */}
      <View
        style={{
          backgroundColor: appSettings.theme.style.colors.background,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          maxHeight: "50%",
          borderTopRightRadius: 16,
          borderTopLeftRadius: 16,

          // flex:1
        }}
      >
        <View style={{ paddingTop: 16 }}>
          <TextPrimary label="New" style={{ fontSize: 24 }} />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: 300,
            paddingBottom: 16,
          }}
        >
          {/* // TAG : New Transaction */}
          <View
            style={{
              flex: 1,
              borderRadius: 16,
              borderWidth: 0,
              height: 150,
              margin: 8,
              overflow: "hidden",
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() =>
                navigation.navigate(screenList.newTransactionDetailsScreen)
              }
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  padding: 16,
                  margin: 0,
                  // backgroundColor: appSettings.theme.style.colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <IonIcons
                    name="pencil"
                    size={48}
                    color={appSettings.theme.style.colors.primary}
                  />
                </View>
                <TextPrimary label="Transaction" />
              </View>
            </TouchableOpacity>
          </View>

          {/* // TAG : New LogBook */}
          <View
            style={{
              flex: 1,
              borderRadius: 16,
              borderWidth: 0,
              height: 150,
              margin: 8,
              overflow: "hidden",
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                // get logbook limit from subscription plan
                const logbookLimit = getSubscriptionLimit(
                  userAccount.subscription.plan,
                  SUBSCRIPTION_LIMIT.LOGBOOKS
                );

                // check if user has reached the limit
                if (logbookLimit === logbooks.logbooks?.length) {
                  // show alert
                  Alert.alert(
                    "Logbook Limit Reached",
                    `You have reached the limit of ${logbookLimit} logbooks. Please upgrade your subscription to add more logbooks.`
                  );
                }
                // if not, proceed
                if (logbookLimit > logbooks.logbooks?.length) {
                  navigation.navigate(screenList.modalScreen, {
                    modalType: "textInput",
                    title: "Create New Log Book",
                    placeholder: "Enter new log book name ...",
                    selected: (item) => {
                      const newLogbook = {
                        _timestamps: {
                          created_at: Date.now(),
                          created_by: userAccount.uid,
                          updated_at: Date.now(),
                          updated_by: userAccount.uid,
                        },
                        _id: uuid.v4(),
                        uid: userAccount.uid,
                        group_id: null,
                        logbook_currency:
                          appSettings.logbookSettings.defaultCurrency,
                        logbook_type: "basic",
                        logbook_id: uuid.v4(),
                        logbook_name: item,
                        logbook_records: [],
                        logbook_categories: [],
                        __v: 0,
                      };

                      setTimeout(async () => {
                        await firestore.setData(
                          FIRESTORE_COLLECTION_NAMES.LOGBOOKS,
                          newLogbook.logbook_id,
                          newLogbook
                        );
                      }, 1);

                      dispatchLogbooks({
                        type: ACTIONS.LOGBOOKS.INSERT,
                        payload: newLogbook,
                      });

                      dispatchSortedTransactions({
                        type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
                          .INSERT_LOGBOOK,
                        payload: {
                          newLogbook: {
                            logbook_id: newLogbook.logbook_id,
                            transactions: [],
                          },
                          logbookToOpen: {
                            name: newLogbook.logbook_name,
                            logbook_id: newLogbook.logbook_id,
                            logbook_currency: {
                              name: "IDR",
                              symbol: "Rp",
                              isoCode: "id",
                            },
                          },
                        },
                      });

                      navigation.goBack();
                    },
                  });
                }
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  padding: 16,
                  margin: 0,
                  // backgroundColor: appSettings.theme.style.colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <IonIcons
                    name="book"
                    size={48}
                    color={appSettings.theme.style.colors.primary}
                  />
                </View>
                <TextPrimary label="LogBook" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* // TAG : Action Button */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          {/* // TAG : Cancel Button */}
          <View style={{ paddingRight: 0 }}>
            <ButtonSecondary
              label="Cancel"
              width={284}
              onPress={() => navigation.goBack()}
            />
          </View>
        </View>
      </View>
    </>
  );
};

export default ActionScreen;
