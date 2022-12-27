import { useEffect, useState } from "react";
import {
    Text,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableOpacity,
    View
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { globalStyles, globalTheme } from "../../assets/themes/globalStyles";
import { ButtonPrimary, ButtonSecondary } from "../../components/Button";
import { TextButtonPrimary, TextPrimary } from "../../components/Text";
import APP_SETTINGS from "../../config/appSettings";
import {
    useGlobalAppSettings,
    useGlobalLogbooks,
    useGlobalSortedTransactions,
    useGlobalTransactions,
    useGlobalUserAccount
} from "../../reducers/GlobalContext";
import { ACTIONS } from "../../reducers/GlobalReducer";

const ActionScreen = ({ route, navigation }) => {
  const [selected, setSelected] = useState();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
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
      {/* // ! Transparent Overlay */}
      <TouchableOpacity
        onPress={() => navigation.pop(1)}
        style={{ flex: 1, backgroundColor: "transparent" }}
      >
        <View style={{ flex: 1, backgroundColor: "transparent" }}></View>
      </TouchableOpacity>

      {/* // ! Content card */}
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
        <View style={{ padding: 16 }}>
          <TextPrimary label="New" style={{ fontSize: 24 }} />
        </View>

        <View
          style={{ flexDirection: "row", alignItems: "center", width: 300 }}
        >
          {/* // ! New Transaction */}
          <View
            style={{
              flex: 1,
              borderRadius: 8,
              borderWidth: 0,
              height: 150,
              margin: 8,
              overflow: "hidden",
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() =>
                navigation.navigate("New Transaction Details Screen")
              }
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  padding: 16,
                  margin: 0,
                  backgroundColor: appSettings.theme.style.colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <IonIcons
                    name="pencil"
                    size={48}
                    color={appSettings.theme.style.colors.background}
                  />
                </View>
                <TextButtonPrimary label="Transaction" />
              </View>
            </TouchableOpacity>
          </View>

          {/* // ! New LogBook */}
          <View
            style={{
              flex: 1,
              borderRadius: 8,
              borderWidth: 0,
              height: 150,
              margin: 8,
              overflow: "hidden",
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() =>
                navigation.navigate("Modal Screen", {
                  modalType: "textInput",
                  title: "Create New Log Book",
                  placeholder: "Enter new log book name ...",
                  selected: (item) => {
                    const newLogbook = {
                      _timestamps: {
                        created_at: Date.now(),
                        updated_at: Date.now(),
                      },
                      _id: Math.random * 10000,
                      user_id: userAccount.account.user_id,
                      username: null,
                      logbook_currency: appSettings.currency,
                      logbook_type: "basic",
                      logbook_id: Math.random() * 10000,
                      logbook_name: item,
                      logbook_records: [],
                      logbook_categories: [],
                      __v: 0,
                    };

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
                })
              }
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  padding: 16,
                  margin: 0,
                  backgroundColor: appSettings.theme.style.colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <IonIcons
                    name="book"
                    size={48}
                    color={appSettings.theme.style.colors.background}
                  />
                </View>
                <TextButtonPrimary label="LogBook" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* // ! Action Button */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          {/* // ! Cancel Button */}
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
