import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import LargeJSONTransactions from "../../database/largeTransactions.json";
import userCategories from "../../database/userCategories";
import userLogBooks from "../../database/userLogBooks";
import userTransactions from "../../database/userTransactions";
import { setSortedTransactions } from "../../utils/FetchData";
import {
  useGlobalAppSettings,
  useGlobalBadgeCounter,
  useGlobalBudgets,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalRepeatedTransactions,
  useGlobalSortedTransactions,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../reducers/GlobalContext";
import persistStorage from "../../reducers/persist/persistStorage";
import PERSIST_ACTIONS from "../../reducers/persist/persist.actions";
import REDUCER_ACTIONS from "../../reducers/reducer.action";
import { ListItem } from "../../components/List";
import { TextPrimary } from "../../components/Text";
import devAppSettings from "../../dev/devAppSettings";
import devUserAccount from "../../dev/devUserAccount";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../api/firebase/auth";
import firestore from "../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../api/firebase/firestoreCollectionNames";
import mergeTransactionsIntoSortedTransactions from "../../utils/mergeTransactionsIntoSortedTransactions";
import testing from "../../dev/testing";
import CustomScrollView from "../../shared-components/CustomScrollView";
import ListSection from "../../components/List/ListSection";
import featureSwitch from "../../features/subscription/model/subscriptionFeatureList";
import uuid from "react-native-uuid";
import getSecretFromCloudFunctions from "../../api/firebase/getSecretFromCloudFunctions";
import env from "../../config/env";
import SECRET_KEYS from "../../constants/secretManager";

const DeveloperScreen = ({ item, navigation }) => {
  // const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { budgets, dispatchBudgets } = useGlobalBudgets();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { repeatedTransactions, dispatchRepeatedTransactions } =
    useGlobalRepeatedTransactions();
  const { badgeCounter, dispatchBadgeCounter } = useGlobalBadgeCounter();
  const [loaded, setLoaded] = useState(null);
  const [firebaseUserAccount, setFirebaseUserAccount] = useState(null);
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {}, []);

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
        <CustomScrollView>
          <ListSection>
            <ListItem
              pressable
              leftLabel="Try get secret from cloud"
              onPress={async () => {
                const data = await getSecretFromCloudFunctions(
                  "FEATURE_COLLECTION_NAME"
                );
                console.log(JSON.stringify({ data }, null, 2));
              }}
            />
            <ListItem
              pressable
              leftLabel="Set subscription to firebase"
              onPress={async () => {
                const collection = await getSecretFromCloudFunctions(
                  SECRET_KEYS.FEATURE_SWITCH_COLLECTION_NAME
                );
                const docId = await getSecretFromCloudFunctions(
                  SECRET_KEYS.FEATURE_SWITCH_DOCUMENT_ID
                );
                await firestore.setData(collection, docId, {
                  subscriptionFeatureList: featureSwitch,
                });
              }}
            />
            <ListItem
              pressable
              leftLabel="Set feature switch to firebase"
              onPress={async () => {
                const collection = await getSecretFromCloudFunctions(
                  SECRET_KEYS.FEATURE_SWITCH_COLLECTION_NAME
                );
                const docId = await getSecretFromCloudFunctions(
                  SECRET_KEYS.FEATURE_SWITCH_DOCUMENT_ID
                );
                await firestore.setData(collection, docId, {
                  featureSwitch,
                });
              }}
            />
          </ListSection>

          {/* // TAG : Save Large Transactions to Storage */}
          <TouchableNativeFeedback onPress={() => saveLargeJSONTransactions()}>
            <View style={styles.flatListView}>
              <IonIcons
                name="download"
                size={18}
                style={{ paddingRight: 16 }}
              />
              <View style={globalTheme.list.listItem}>
                <Text style={globalTheme.text.textPrimary}>
                  Save 1000 Transactions JSON to AsyncStorage
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // TAG : Save Transactions to Storage */}
          <TouchableNativeFeedback onPress={() => saveTransactions()}>
            <View style={styles.flatListView}>
              <IonIcons
                name="download"
                size={18}
                style={{ paddingRight: 16 }}
              />
              <View style={globalTheme.list.listItem}>
                <Text style={globalTheme.text.textPrimary}>
                  Save Transactions to Device
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // TAG : Save Logbooks to Storage */}
          <TouchableNativeFeedback onPress={() => saveLogbooks()}>
            <View style={styles.flatListView}>
              <IonIcons
                name="download"
                size={18}
                style={{ paddingRight: 16 }}
              />
              <View style={globalTheme.list.listItem}>
                <Text style={globalTheme.text.textPrimary}>
                  Save Logbooks to Device
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // TAG : Save Categories to Storage */}
          <TouchableNativeFeedback onPress={() => saveCategories()}>
            <View style={styles.flatListView}>
              <IonIcons
                name="download"
                size={18}
                style={{ paddingRight: 16 }}
              />
              <View style={globalTheme.list.listItem}>
                <Text style={globalTheme.text.textPrimary}>
                  Save Categories to Device
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // TAG : Save Account to Storage */}
          <ListItem
            pressable
            leftLabel="Save Account to Device"
            iconLeftName="download"
            iconPack="IonIcons"
            onPress={() =>
              persistStorage
                .asyncSecureStorage({
                  action: PERSIST_ACTIONS.SET,
                  key: "account",
                  rawValue: {
                    profile: {
                      displayName: "Haziz",
                      photoURL: null,
                    },
                    account: {
                      premium: true,
                      user_id: "637208d545a0d121607a402e",
                      token: "token123",
                      email: "mhazizk@gmail.com",
                    },
                  },
                })
                .then(() => alert("account saved"))
            }
          />
          {/* // TAG : Get Account from Storage */}
          <ListItem
            pressable
            leftLabel="Get Account from Device"
            iconLeftName="document"
            iconPack="IonIcons"
            onPress={() =>
              persistStorage
                .asyncSecureStorage({
                  action: PERSIST_ACTIONS.GET,
                  key: "account",
                })
                .then((item) => {
                  alert("account loaded");
                  dispatchUserAccount({
                    type: REDUCER_ACTIONS.USER_ACCOUNT.SET_MULTI_ACTIONS,
                    payload: item,
                  });
                })
            }
          />

          {/* // TAG : Get Transactions from Storage */}
          <TouchableNativeFeedback onPress={() => getTransactionsFromStorage()}>
            <View style={styles.flatListView}>
              <IonIcons
                name="document"
                size={18}
                style={{ paddingRight: 16 }}
              />
              <View style={globalTheme.list.listItem}>
                <Text style={globalTheme.text.textPrimary}>
                  Load Transactions from Device
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // TAG : Get Logbooks from Storage */}
          <TouchableNativeFeedback onPress={() => getLogbooksFromStorage()}>
            <View style={styles.flatListView}>
              <IonIcons
                name="document"
                size={18}
                style={{ paddingRight: 16 }}
              />
              <View style={globalTheme.list.listItem}>
                <Text style={globalTheme.text.textPrimary}>
                  Load Logbooks from Device
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // TAG : Get Categories from Storage */}
          <TouchableNativeFeedback onPress={() => getCategoriesFromStorage()}>
            <View style={styles.flatListView}>
              <IonIcons
                name="document"
                size={18}
                style={{ paddingRight: 16 }}
              />
              <View style={globalTheme.list.listItem}>
                <Text style={globalTheme.text.textPrimary}>
                  Load Categories from Device
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>
          {/* // SECTION : Async Storage */}
          <TextPrimary label="Async Storage" style={{ padding: 16 }} />
          <ListItem
            pressable
            leftLabel="// TAG : Remove all async storage"
            iconLeftName="document"
            iconPack="IonIcons"
            onPress={async () => {
              await persistStorage.asyncStorage({
                action: PERSIST_ACTIONS.DELETE_ALL,
              });
            }}
          />
          {/* // SECTION : Categories */}
          <TextPrimary label="Categories" style={{ padding: 16 }} />
          <ListItem
            pressable
            leftLabel="// TAG : Log categories"
            iconLeftName="document"
            iconPack="IonIcons"
            onPress={() => {
              console.log(JSON.stringify(categories));
            }}
          />

          {/* // SECTION : Repeated Transactions */}
          <TextPrimary label="Repeated Transactions" style={{ padding: 16 }} />
          <ListItem
            pressable
            leftLabel="// TAG : Log repeated transactions in state"
            iconLeftName="document"
            iconPack="IonIcons"
            onPress={() => {
              console.log(JSON.stringify(repeatedTransactions));
            }}
          />

          {/* // SECTION : Transactions */}
          <TextPrimary label="Transactions" style={{ padding: 16 }} />
          <ListItem
            pressable
            leftLabel="// TAG : Post custom transaction to server"
            iconLeftName="cloud-upload"
            iconPack="IonIcons"
            onPress={() => {
              firestore
                .setData(FIRESTORE_COLLECTION_NAMES.TRANSACTIONS, {
                  _timestamps: {
                    created_at: 1673276098432,
                    updated_at: 1673276098432,
                  },
                  logbook_id: "ef756b9f-9f3c-4723-a99c-40bb5d265cf3",
                  transaction_id: "bbb21e92-0d0a-4658-adc0-cea5791936e3",
                  details: {
                    in_out: "expense",
                    type: "cash",
                    date: 1673276098432,
                    notes: null,
                    amount: 100000,
                    category_id: "1",
                  },
                })
                .then(() => alert("transaction posted"));
            }}
          />
          <ListItem
            pressable
            leftLabel="// TAG : Try log merge transactions"
            iconLeftName="document"
            iconPack="IonIcons"
            onPress={() => {
              mergeTransactionsIntoSortedTransactions(
                testing.transactions,
                testing.logbooks
              );
            }}
          />
          <ListItem
            pressable
            leftLabel="// TAG : Log transactions from snapshot"
            iconLeftName="document"
            iconPack="IonIcons"
            onPress={() => {
              const unsubscribe = firestore.getAndListenMultipleDocs({
                collectionName: FIRESTORE_COLLECTION_NAMES.TRANSACTIONS,
                documentId: appSettings.uid,
                getAllDocsCallback: (data) => console.log(JSON.stringify(data)),
                errorCallback: (error) => console.log(error),
              });

              return setTimeout(() => {
                unsubscribe();
                alert("unsubscribed");
              }, 1000);
            }}
          />

          <ListItem
            pressable
            leftLabel="// TAG : Log sortedTransactions"
            iconLeftName="document"
            iconPack="IonIcons"
            onPress={() => {
              console.log(JSON.stringify(sortedTransactions));
            }}
          />

          {/* // SECTION : Badge Counter */}
          <TextPrimary label="Badge Counter" style={{ padding: 16 }} />
          <ListItem
            pressable
            leftLabel="// TAG : Log badge counter from state"
            iconLeftName="document"
            iconPack="IonIcons"
            onPress={() => {
              console.log(JSON.stringify(badgeCounter));
            }}
          />
          {/* // SECTION : Budgets */}
          <TextPrimary label="Budget" style={{ padding: 16 }} />
          <ListItem
            pressable
            leftLabel="// TAG : Log budgets from state"
            iconLeftName="document"
            iconPack="IonIcons"
            onPress={() => {
              console.log(JSON.stringify(budgets));
            }}
          />
          <ListItem
            pressable
            leftLabel="// TAG : Load budgets from firestore"
            iconLeftName="document"
            iconPack="IonIcons"
            onPress={async () => {
              console.log(
                JSON.stringify(
                  await firestore.queryData(
                    FIRESTORE_COLLECTION_NAMES.BUDGETS,
                    appSettings.uid
                  )
                )
              );
            }}
          />
          {/* // SECTION : Logbook */}
          <TextPrimary label="Logbooks" style={{ padding: 16 }} />
          <ListItem
            pressable
            leftLabel="// TAG : Post logbook to server"
            iconLeftName="cloud-upload"
            iconPack="IonIcons"
            onPress={() => {
              firestore
                .setData(FIRESTORE_COLLECTION_NAMES.LOGBOOKS, {
                  _timestamps: {
                    created_at: 1673263349998,
                    updated_at: 1673263349998,
                  },
                  uid: "5eiznx0wC5UhVjJhPp7VWl3ihD93",
                  logbook_currency: {
                    name: "IDR",
                    symbol: "Rp",
                    isoCode: "id",
                  },
                  logbook_type: "basic",
                  logbook_id: "eb1aada7-89df-4f98-b04f-91969b109a1e",
                  logbook_name: "Logbook ku",
                  logbook_records: [],
                  logbook_categories: [],
                })
                .then(() => alert("logbook posted"));
            }}
          />
          <ListItem
            pressable
            leftLabel="// TAG : Log logbooks from server"
            iconLeftName="document"
            iconPack="IonIcons"
            onPress={async () => {
              console.log(
                JSON.stringify(
                  await firestore.queryData(
                    FIRESTORE_COLLECTION_NAMES.LOGBOOKS,
                    appSettings.uid
                  )
                  // firestore.getAndListenMultipleDocs(
                  //   FIRESTORE_COLLECTION_NAMES.TRANSACTIONS,
                  //   appSettings.uid,
                  //   (data) => console.log(data),
                  //   (error) => console.log(error)
                  // )
                )
              );
            }}
          />
          <ListItem
            pressable
            leftLabel="// TAG : Log logbooks state"
            iconLeftName="document"
            iconPack="IonIcons"
            onPress={() => {
              console.log(JSON.stringify(logbooks));
            }}
          />
          <ListItem
            pressable
            leftLabel="// TAG : Force set new logbooks to Reducer State"
            iconLeftName="document"
            iconPack="IonIcons"
            onPress={() => {
              dispatchLogbooks({
                type: REDUCER_ACTIONS.LOGBOOKS.FORCE_SET,
                payload: {
                  logbooks: [{}],
                },
              });
            }}
          />
          {/* // SECTION : User Account */}
          <TextPrimary label="User account" style={{ padding: 16 }} />
          <ListItem
            pressable
            leftLabel="// TAG : Log firebase user account state"
            iconLeftName="document"
            iconPack="IonIcons"
            onPress={() => {
              console.log(user);
            }}
          />
          <ListItem
            pressable
            leftLabel="// TAG : Log user account from snapshot"
            iconLeftName="document"
            iconPack="IonIcons"
            onPress={() => {
              const unsubscribe = firestore.getAndListenOneDoc({
                collectionName: FIRESTORE_COLLECTION_NAMES.USERS,
                documentId: appSettings.uid,
                callback: (data) => console.log(JSON.stringify(data)),
                errorCallback: (error) => console.log(error),
              });

              return setTimeout(() => {
                unsubscribe();
                alert("unsubscribed");
              }, 1000);
            }}
          />

          <ListItem
            pressable
            leftLabel="// TAG : Log reducer user account state"
            iconLeftName="document"
            iconPack="IonIcons"
            onPress={() => {
              console.log(userAccount);
            }}
          />
          <ListItem
            pressable
            leftLabel="// TAG : Force set new user account to Reducer State"
            iconLeftName="download"
            iconPack="IonIcons"
            onPress={() => {
              dispatchUserAccount({
                type: REDUCER_ACTIONS.USER_ACCOUNT.FORCE_SET,
                payload: devUserAccount,
              });
              alert("user account has been forced set");
            }}
          />
          <ListItem
            pressable
            leftLabel="// TAG : Force set new user account to Storage"
            iconLeftName="download"
            iconPack="IonIcons"
            onPress={() => {
              persistStorage.asyncSecureStorage({
                action: PERSIST_ACTIONS.SET,
                key: "account",
                rawValue: devUserAccount,
              });
              alert("user account has been forced saved to storage");
            }}
          />
          <ListItem
            pressable
            leftLabel="// TAG : Remove user account from Storage"
            iconLeftName="trash"
            iconPack="IonIcons"
            onPress={() => {
              persistStorage
                .asyncSecureStorage({
                  action: PERSIST_ACTIONS.DELETE,
                  key: "account",
                })
                .then(() => {
                  alert("user account has been forced removed from storage");
                });
            }}
          />

          <TextPrimary label="App Settings" style={{ padding: 16 }} />
          <ListItem
            pressable
            leftLabel="// TAG : Log app settings state"
            iconLeftName="document"
            iconPack="IonIcons"
            onPress={() => {
              console.log(JSON.stringify(appSettings));
              alert("all app settings removed");
            }}
          />
          <ListItem
            pressable
            leftLabel="// TAG : Remove all app settings from Reducer"
            iconLeftName="trash"
            iconPack="IonIcons"
            onPress={() => {
              dispatchAppSettings({
                type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
                payload: null,
              });
              alert("all app settings removed");
            }}
          />
          <ListItem
            pressable
            leftLabel="// TAG : Remove all app settings from storage"
            iconLeftName="trash"
            iconPack="IonIcons"
            onPress={() => {
              persistStorage
                .asyncStorage({
                  action: PERSIST_ACTIONS.DELETE,
                  key: "appSettings",
                })
                .then(() => {
                  alert("all app settings removed");
                });
            }}
          />
          <ListItem
            pressable
            leftLabel="// TAG : Force set new app settings to Reducer and storage"
            iconLeftName="download"
            iconPack="IonIcons"
            onPress={() => {
              dispatchAppSettings({
                type: REDUCER_ACTIONS.APP_SETTINGS.FORCE_SET,
                payload: devAppSettings,
              });
              alert("app settings has been forced set");
            }}
          />

          <TextPrimary label="Screens" style={{ padding: 16 }} />
          <ListItem
            pressable
            leftLabel="// TAG : Remove all hidden screens from Reducer"
            iconLeftName="trash"
            iconPack="IonIcons"
            onPress={() => {
              dispatchAppSettings({
                type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
                payload: {
                  ...appSettings,
                  hiddenScreenss: [],
                },
              });
              alert("all hidden screens removed");
            }}
          />

          {/* // TAG : Log global raw transactions */}
          <TouchableNativeFeedback onPress={() => {}}>
            <View style={styles.flatListView}>
              <IonIcons name="code" size={18} style={{ paddingRight: 16 }} />
              <View style={globalTheme.list.listItem}>
                <Text style={globalTheme.text.textPrimary}>
                  Log Global Raw Transactions
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // TAG : Log app settings */}
          <TouchableNativeFeedback onPress={() => console.log(appSettings)}>
            <View style={styles.flatListView}>
              <IonIcons name="code" size={18} style={{ paddingRight: 16 }} />
              <View style={globalTheme.list.listItem}>
                <Text style={globalTheme.text.textPrimary}>
                  Log App Settings
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // TAG : Load storage account */}
          <TouchableNativeFeedback
            onPress={() =>
              persistStorage
                .asyncSecureStorage({
                  action: PERSIST_ACTIONS.GET,
                  key: "token",
                })
                .then((item) => console.log(item))
            }
          >
            <View style={styles.flatListView}>
              <IonIcons name="code" size={18} style={{ paddingRight: 16 }} />
              <View style={globalTheme.list.listItem}>
                <Text style={globalTheme.text.textPrimary}>Load TOken</Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // TAG : Log user account */}
          <TouchableNativeFeedback onPress={() => console.log(userAccount)}>
            <View style={styles.flatListView}>
              <IonIcons name="code" size={18} style={{ paddingRight: 16 }} />
              <View style={globalTheme.list.listItem}>
                <Text style={globalTheme.text.textPrimary}>
                  Log User Account
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // TAG : Log global sorted transactions */}
          <TouchableNativeFeedback
            onPress={() => console.log(sortedTransactions)}
          >
            <View style={styles.flatListView}>
              <IonIcons name="code" size={18} style={{ paddingRight: 16 }} />
              <View style={globalTheme.list.listItem}>
                <Text style={globalTheme.text.textPrimary}>
                  Log Global Sorted Transactions
                </Text>
                <Text style={globalTheme.text.textSecondary}>
                  {countGlobalSortedTransactions()} Transactions
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // TAG : Log global app settings */}
          <TouchableNativeFeedback onPress={() => console.log(appSettings)}>
            <View style={styles.flatListView}>
              <IonIcons name="code" size={18} style={{ paddingRight: 16 }} />
              <View style={globalTheme.list.listItem}>
                <Text style={globalTheme.text.textPrimary}>
                  Log Global App Settings
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // TAG : Log sortedTransactions settings */}
          <TouchableNativeFeedback
            onPress={async () => console.log(await setSortedTransactions())}
          >
            <View style={styles.flatListView}>
              <IonIcons name="code" size={18} style={{ paddingRight: 16 }} />
              <View style={globalTheme.list.listItem}>
                <Text style={globalTheme.text.textPrimary}>
                  Log Sorted Transactions Promises
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // TAG : Delete All from Storage */}
          <TouchableNativeFeedback onPress={() => deleteAll()}>
            <View style={styles.flatListView}>
              <IonIcons name="trash" size={18} style={{ paddingRight: 16 }} />
              <View style={globalTheme.list.listItem}>
                <Text style={globalTheme.text.textPrimary}>
                  Delete All from Device
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // TAG : Delete Key from Secure Storage */}
          <TouchableNativeFeedback
            onPress={() =>
              persistStorage.asyncSecureStorage({
                action: PERSIST_ACTIONS.DELETE,
                key: "token",
              })
            }
          >
            <View style={styles.flatListView}>
              <IonIcons name="trash" size={18} style={{ paddingRight: 16 }} />
              <View style={globalTheme.list.listItem}>
                <Text style={globalTheme.text.textPrimary}>
                  Delete Token from Secure Storage
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/* // TAG : Clear All Loaded State */}
          <TouchableNativeFeedback onPress={() => setLoaded(null)}>
            <View style={styles.flatListView}>
              <IonIcons name="trash" size={18} style={{ paddingRight: 16 }} />
              <View style={globalTheme.list.listItem}>
                <Text style={globalTheme.text.textPrimary}>
                  Clear Loaded State
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>
        </CustomScrollView>
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
