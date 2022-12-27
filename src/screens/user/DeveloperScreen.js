import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
    Image, StyleSheet, Text,
    TouchableNativeFeedback, View
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
    globalStyles,
    globalTheme
} from "../../../src/assets/themes/globalStyles";
import UserHeaderComponent from "../../components/UserHeader";
import APP_SETTINGS from "../../config/appSettings";
import LargeJSONTransactions from "../../database/largeTransactions.json";
import userCategories from "../../database/userCategories";
import userLogBooks from "../../database/userLogBooks";
import userTransactions from "../../database/userTransactions";
import { setSortedTransactions } from "../../utils/FetchData";
import { asyncSecureStorage, STORAGE_ACTIONS } from "../../utils/Storage";
import {
    useGlobalAppSettings,
    useGlobalSortedTransactions,
    useGlobalTransactions,
    useGlobalUserAccount
} from "../../reducers/GlobalContext";
import { ACTIONS } from "../../reducers/GlobalReducer";
import ModalScreen from "../ModalScreen";

const DeveloperScreen = ({ item, navigation }) => {
  const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const [loaded, setLoaded] = useState(null);

  useEffect(() => {
    // refresh
  }, []);

  useEffect(() => {
    console.log(loaded);
  }, [loaded]);

  // Save Transaction File to storage
  const saveLargeJSONTransactions = async () => {
    try {
      await AsyncStorage.setItem(
        "transactions",
        JSON.stringify(LargeJSONTransactions)
      ).then(() => console.log("saved"));
    } catch (error) {
      alert(error);
    }
  };
  // Save Transaction File to storage
  const saveTransactions = async () => {
    try {
      await AsyncStorage.setItem(
        "transactions",
        JSON.stringify(userTransactions)
      ).then(() => console.log("saved"));
    } catch (error) {
      alert(error);
    }
  };
  // Save Transaction File to storage
  const saveLogbooks = async () => {
    try {
      await AsyncStorage.setItem("logbooks", JSON.stringify(userLogBooks)).then(
        () => console.log("saved")
      );
    } catch (error) {
      alert(error);
    }
  };
  // Save Transaction File to storage
  const saveCategories = async () => {
    try {
      await AsyncStorage.setItem(
        "categories",
        JSON.stringify(userCategories)
      ).then(() => console.log("saved"));
    } catch (error) {
      alert(error);
    }
  };

  // Get Transaction File from storage
  const getTransactionsFromStorage = async () => {
    try {
      const json = await AsyncStorage.getItem("transactions");
      if (json != null) {
        const parsed = JSON.parse(json);
        return setLoaded(parsed);
      }
    } catch (error) {
      alert(error);
    }
  };

  // Get Categories File from Storage
  const getCategoriesFromStorage = async () => {
    try {
      const json = await AsyncStorage.getItem("categories");
      if (json != null) {
        const parsed = JSON.parse(json);
        return setLoaded(parsed);
      }
    } catch (error) {
      alert(error);
    }
  };

  // Get Logbooks File from Storage
  const getLogbooksFromStorage = async () => {
    try {
      const json = await AsyncStorage.getItem("logbooks");
      if (json != null) {
        const parsed = JSON.parse(json);
        return setLoaded(parsed);
      }
    } catch (error) {
      alert(error);
    }
  };

  // Get Logbooks File from Storage
  const deleteAll = async () => {
    try {
      await AsyncStorage.multiRemove([
        "transactions",
        "logbooks",
        "categories",
      ]).then(console.log("deleted"));
      // console.log('deleted')
    } catch (error) {
      alert(error);
    }
  };

  const countGlobalSortedTransactions = () => {
    if (sortedTransactions.groupSorted) {
      let array = [];
      const count = sortedTransactions?.groupSorted?.forEach((logbook) =>
        logbook.transactions.forEach((section) =>
          section.data.forEach((transaction) => {
            return array.push(transaction.transaction_id);
          })
        )
      );
      return array.length;
    }
    return "No";
  };

  return (
    <>
      {appSettings && (
        <ScrollView style={{ height: "100%", backgroundColor: "#fff" }}>
          {/* <UserHeaderComponent /> */}
          <View style={{ backgroundColor: "#fff", padding: 16 }}>
            <Text style={{ fontSize: 32, color: "#bbb" }}>Developer</Text>
          </View>

          {/* // ! Save Large Transactions to Storage */}
          <TouchableNativeFeedback onPress={() => saveLargeJSONTransactions()}>
            <View style={styles.flatListView}>
              <IonIcons
                name="download"
                size={18}
                style={{ paddingRight: 16 }}
              />
              <View style={globalStyles.lightTheme.listItem}>
                <Text style={globalStyles.lightTheme.textPrimary}>
                  Save 1000 Transactions JSON to AsyncStorage
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // ! Save Transactions to Storage */}
          <TouchableNativeFeedback onPress={() => saveTransactions()}>
            <View style={styles.flatListView}>
              <IonIcons
                name="download"
                size={18}
                style={{ paddingRight: 16 }}
              />
              <View style={globalStyles.lightTheme.listItem}>
                <Text style={globalStyles.lightTheme.textPrimary}>
                  Save Transactions to Device
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // ! Save Logbooks to Storage */}
          <TouchableNativeFeedback onPress={() => saveLogbooks()}>
            <View style={styles.flatListView}>
              <IonIcons
                name="download"
                size={18}
                style={{ paddingRight: 16 }}
              />
              <View style={globalStyles.lightTheme.listItem}>
                <Text style={globalStyles.lightTheme.textPrimary}>
                  Save Logbooks to Device
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // ! Save Categories to Storage */}
          <TouchableNativeFeedback onPress={() => saveCategories()}>
            <View style={styles.flatListView}>
              <IonIcons
                name="download"
                size={18}
                style={{ paddingRight: 16 }}
              />
              <View style={globalStyles.lightTheme.listItem}>
                <Text style={globalStyles.lightTheme.textPrimary}>
                  Save Categories to Device
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // ! Save Account to Storage */}
          <TouchableNativeFeedback
            onPress={() =>
              asyncSecureStorage({
                action: STORAGE_ACTIONS.SET,
                key: "account",
                rawValue: {
                  profile: {
                    nickname: "Haziz",
                    avatar: null,
                  },
                  account: {
                    verification: true,
                    user_id: "637208d545a0d121607a402e",
                    token: "token123",
                    email: "mhazizk@gmail.com",
                  },
                },
              }).then(() => alert("account saved"))
            }
          >
            <View style={styles.flatListView}>
              <IonIcons
                name="download"
                size={18}
                style={{ paddingRight: 16 }}
              />
              <View style={globalStyles.lightTheme.listItem}>
                <Text style={globalStyles.lightTheme.textPrimary}>
                  Save Account to Device
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // ! Get Account from Storage */}
          <TouchableNativeFeedback
            onPress={() =>
              asyncSecureStorage({
                action: STORAGE_ACTIONS.GET,
                key: "account",
              }).then((item) => {
                alert("account loaded");
                dispatchUserAccount({
                  type: ACTIONS.MULTI_ACTIONS.SET_INIT_USER_ACCOUNT,
                  payload: item,
                });
              })
            }
          >
            <View style={styles.flatListView}>
              <IonIcons
                name="document"
                size={18}
                style={{ paddingRight: 16 }}
              />
              <View style={globalStyles.lightTheme.listItem}>
                <Text style={globalStyles.lightTheme.textPrimary}>
                  Load Account from Device and Dispatch
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // ! Get Transactions from Storage */}
          <TouchableNativeFeedback onPress={() => getTransactionsFromStorage()}>
            <View style={styles.flatListView}>
              <IonIcons
                name="document"
                size={18}
                style={{ paddingRight: 16 }}
              />
              <View style={globalStyles.lightTheme.listItem}>
                <Text style={globalStyles.lightTheme.textPrimary}>
                  Load Transactions from Device
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // ! Get Logbooks from Storage */}
          <TouchableNativeFeedback onPress={() => getLogbooksFromStorage()}>
            <View style={styles.flatListView}>
              <IonIcons
                name="document"
                size={18}
                style={{ paddingRight: 16 }}
              />
              <View style={globalStyles.lightTheme.listItem}>
                <Text style={globalStyles.lightTheme.textPrimary}>
                  Load Logbooks from Device
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // ! Get Logbooks from Storage */}
          <TouchableNativeFeedback onPress={() => getCategoriesFromStorage()}>
            <View style={styles.flatListView}>
              <IonIcons
                name="document"
                size={18}
                style={{ paddingRight: 16 }}
              />
              <View style={globalStyles.lightTheme.listItem}>
                <Text style={globalStyles.lightTheme.textPrimary}>
                  Load Categories from Device
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // ! Log global raw transactions */}
          <TouchableNativeFeedback onPress={() => console.log(rawTransactions)}>
            <View style={styles.flatListView}>
              <IonIcons name="code" size={18} style={{ paddingRight: 16 }} />
              <View style={globalStyles.lightTheme.listItem}>
                <Text style={globalStyles.lightTheme.textPrimary}>
                  Log Global Raw Transactions
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // ! Log global raw transactions length */}
          {/* <TouchableNativeFeedback
                        onPress={() => console.log(rawTransactions.transactions.length)}>
                        <View style={styles.flatListView}>
                            <IonIcons name='code' size={18} style={{ paddingRight: 16 }} />
                            <View style={globalStyles.lightTheme.listItem}>
                                <Text style={globalStyles.lightTheme.textPrimary}>Log Global Raw Transactions Length</Text>
                                <Text style={globalStyles.lightTheme.textSecondary}>{rawTransactions.transactions.length}</Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback> */}

          {/* // ! Log app settings */}
          <TouchableNativeFeedback onPress={() => console.log(appSettings)}>
            <View style={styles.flatListView}>
              <IonIcons name="code" size={18} style={{ paddingRight: 16 }} />
              <View style={globalStyles.lightTheme.listItem}>
                <Text style={globalStyles.lightTheme.textPrimary}>
                  Log App Settings
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // ! Load storage account */}
          <TouchableNativeFeedback
            onPress={() =>
              asyncSecureStorage({
                action: STORAGE_ACTIONS.GET,
                key: "token",
              }).then((item) => console.log(item))
            }
          >
            <View style={styles.flatListView}>
              <IonIcons name="code" size={18} style={{ paddingRight: 16 }} />
              <View style={globalStyles.lightTheme.listItem}>
                <Text style={globalStyles.lightTheme.textPrimary}>
                  Load TOken
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // ! Log user account */}
          <TouchableNativeFeedback onPress={() => console.log(userAccount)}>
            <View style={styles.flatListView}>
              <IonIcons name="code" size={18} style={{ paddingRight: 16 }} />
              <View style={globalStyles.lightTheme.listItem}>
                <Text style={globalStyles.lightTheme.textPrimary}>
                  Log User Account
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // ! Log global sorted transactions */}
          <TouchableNativeFeedback
            onPress={() => console.log(sortedTransactions)}
          >
            <View style={styles.flatListView}>
              <IonIcons name="code" size={18} style={{ paddingRight: 16 }} />
              <View style={globalStyles.lightTheme.listItem}>
                <Text style={globalStyles.lightTheme.textPrimary}>
                  Log Global Sorted Transactions
                </Text>
                <Text style={globalStyles.lightTheme.textSecondary}>
                  {countGlobalSortedTransactions()} Transactions
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // ! Log global app settings */}
          <TouchableNativeFeedback onPress={() => console.log(appSettings)}>
            <View style={styles.flatListView}>
              <IonIcons name="code" size={18} style={{ paddingRight: 16 }} />
              <View style={globalStyles.lightTheme.listItem}>
                <Text style={globalStyles.lightTheme.textPrimary}>
                  Log Global App Settings
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // ! Log sortedTransactions settings */}
          <TouchableNativeFeedback
            onPress={async () => console.log(await setSortedTransactions())}
          >
            <View style={styles.flatListView}>
              <IonIcons name="code" size={18} style={{ paddingRight: 16 }} />
              <View style={globalStyles.lightTheme.listItem}>
                <Text style={globalStyles.lightTheme.textPrimary}>
                  Log Sorted Transactions Promises
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // ! Delete All from Storage */}
          <TouchableNativeFeedback onPress={() => deleteAll()}>
            <View style={styles.flatListView}>
              <IonIcons name="trash" size={18} style={{ paddingRight: 16 }} />
              <View style={globalStyles.lightTheme.listItem}>
                <Text style={globalStyles.lightTheme.textPrimary}>
                  Delete All from Device
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // ! Delete Key from Secure Storage */}
          <TouchableNativeFeedback
            onPress={() =>
              asyncSecureStorage({
                action: STORAGE_ACTIONS.DELETE,
                key: "token",
              })
            }
          >
            <View style={styles.flatListView}>
              <IonIcons name="trash" size={18} style={{ paddingRight: 16 }} />
              <View style={globalStyles.lightTheme.listItem}>
                <Text style={globalStyles.lightTheme.textPrimary}>
                  Delete Token from Secure Storage
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // ! Clear All Loaded State */}
          <TouchableNativeFeedback onPress={() => setLoaded(null)}>
            <View style={styles.flatListView}>
              <IonIcons name="trash" size={18} style={{ paddingRight: 16 }} />
              <View style={globalStyles.lightTheme.listItem}>
                <Text style={globalStyles.lightTheme.textPrimary}>
                  Clear Loaded State
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>
        </ScrollView>
      )}
    </>
  );
};

const styles = new StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  flatListView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    height: 48,
  },
  flatListViewUnderscore: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: 'green',
    paddingVertical: 0,
    paddingLeft: 16,
    borderColor: "#d9d9d9",
    borderBottomWidth: 0.5,
    minHeight: 46,
    textAlignVertical: "center",
  },
  flatListViewText: {
    display: "flex",
    color: "#000",
    textAlignVertical: "center",
    fontSize: 18,
    textAlignVertical: "center",
  },
});

export default DeveloperScreen;
