import { useEffect } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { globalStyles } from "../../assets/themes/globalStyles";
// import { setSortedTransactions } from "../../utils/FetchData";
import {
  useGlobalAppSettings,
  useGlobalBadgeCounter,
  useGlobalBudgets,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalRepeatedTransactions,
  useGlobalSortedTransactions,
  useGlobalUserAccount,
} from "../../reducers/GlobalContext";
// import persistStorage from "../../reducers/persist/persistStorage";
// import PERSIST_ACTIONS from "../../reducers/persist/persist.actions";
import screenList from "../../navigations/ScreenList";
import REDUCER_ACTIONS from "../../reducers/reducer.action";
// import auth from "../../api/firebase/auth";
import auth from "@react-native-firebase/auth";
// import { useAuthState } from "react-firebase-hooks/auth";
import firestore from "../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../api/firebase/firestoreCollectionNames";
import appSettingsFallback from "../../reducers/fallback-state/appSettingsFallback";
import categoriesFallback from "../../reducers/fallback-state/categoriesFallback";
import mergeTransactionsIntoSortedTransactions from "../../utils/MergeTransactionsIntoSortedTransactions";
import initialSortedTransactions from "../../reducers/initial-state/initialSortedTransactions";
import initialCategories from "../../reducers/initial-state/initialCategories";
import initialLogbooks from "../../reducers/initial-state/initialLogbooks";
import {
  createNewTransactionFromActiveRepeatedTransaction,
  getDeviceId,
  getDeviceOSName,
} from "../../utils";
import getDeviceName from "../../utils/GetDeviceName";
import useFirestoreSubscriptions from "../../hooks/useFirestoreSubscriptions";
import initialRepeatedTransactions from "../../reducers/initial-state/initialRepeatedTransactions";
import JutaLogo from "../../assets/icons/juta-app-icon.png";
// import useAuth from "../../hooks/useAuth";

const SplashScreen = ({ route, navigation }) => {
  // const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { budgets, dispatchBudgets } = useGlobalBudgets();
  const { repeatedTransactions, dispatchRepeatedTransactions } =
    useGlobalRepeatedTransactions();
  const { badgeCounter, dispatchBadgeCounter } = useGlobalBadgeCounter();
  // const [user, loading, error] = useAuthState(auth);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log({ __DEV__ });
    const subscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    // subscribe();
  }, []);

  useEffect(() => {
    // goToLogInScreen();
    switch (true) {
      case route.params?.status === "NEW_USER" && !!user:
        startAppWithNewUser(user);
        break;
      case !route.params?.status && !!user:
        startAppWithExistingUser(user);
        break;
      case !route.params?.status === "RETRY_LOGIN":
        // case !route.params?.status === "RETRY_LOGIN" && !user:
        navigation.replace(screenList.loginScreen);
        break;
      case error:
        console.log(error);
        break;

      case !user:
        navigation.replace(screenList.onboardingScreen);
        break;

      default:
        break;
    }
  }, [user]);

  useEffect(() => {
    // refresh state
  }, [appSettings, userAccount, sortedTransactions, logbooks, categories]);

  // useEffect(() => {
  //   if (sortedTransactions.sortedTransactionsInitCounter) {
  //     dispatchAppSettings({
  //       type: ACTIONS.APP_SETTINGS.SCREEN_HIDDEN.PUSH,
  //       payload: screenList.splashScreen,
  //     });

  //     navigation.navigate(screenList.bottomTabNavigator);
  //   }
  // }, [sortedTransactions.sortedTransactionsInitCounter]);
  const isUserAccountEmpty = (userAccount) => {
    for (let i in userAccount) {
      return false;
    }
    return true;
  };

  const goToLogInScreen = async () => {
    // const loadAppSettings = await persistStorage.asyncStorage({
    //   action: PERSIST_ACTIONS.GET,
    //   key: "appSettings",
    // });
    // Promise.all([loadAppSettings]).then((data) => {
    //   dispatchAppSettings({
    //     type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
    //     payload: data[0],
    //   });
    //   navigation.replace(screenList.loginScreen);
    // });
  };

  const startAppWithNewUser = async (currUser) => {
    Promise.all([
      firestore.get(FIRESTORE_COLLECTION_NAMES.USERS, currUser.uid),
      getDeviceId(),
      getDeviceName(),
      getDeviceOSName(),
    ])
      .then((data) => {
        const userAccount = data[0];
        const deviceId = data[1];
        const deviceName = data[2];
        const deviceOSName = data[3];
        const loggedInUserAccount = {
          ...userAccount,
          devicesLoggedIn: [
            ...userAccount.devicesLoggedIn,
            {
              device_id: deviceId,
              device_name: deviceName,
              device_os_name: deviceOSName,
              last_login: Date.now(),
            },
          ],
        };

        dispatchUserAccount({
          type: REDUCER_ACTIONS.USER_ACCOUNT.FORCE_SET,
          payload: loggedInUserAccount,
        });

        dispatchAppSettings({
          type: REDUCER_ACTIONS.APP_SETTINGS.FORCE_SET,
          payload: {
            ...appSettings,
            uid: currUser.uid,
          },
        });

        // dispatchCategories({
        //   type: REDUCER_ACTIONS.CATEGORIES.SET_MULTI_ACTIONS,
        //   payload: {
        //     categories: { ...categoriesFallback, uid: currUser.uid },
        //   },
        // });

        setTimeout(async () => {
          await firestore.setData(
            FIRESTORE_COLLECTION_NAMES.USERS,
            currUser.uid,
            loggedInUserAccount
          );

          navigation.navigate(screenList.bottomTabNavigator);
        }, 1000);
      })
      .catch((error) => {
        navigation.navigate(screenList.loginScreen);
      });
  };

  const startAppWithExistingUser = async (currUser) => {
    // console.log(currUser);
    // Initial load app settings
    // const loadAppSettings = await persistStorage.asyncStorage({
    //   action: PERSIST_ACTIONS.GET,
    //   key: "appSettings",
    // });

    const deviceId = getDeviceId();

    const deviceName = getDeviceName();

    const deviceOSName = getDeviceOSName();

    // const listenedDataInFirestore = {
    //   userData: null,
    //   appSettings: null,
    //   categories: null,
    //   logbooks: null,
    //   budgets: null,
    //   transactions: null,
    // };

    // const loadUserDataFromFirestore = firestore.getAndListenOneDoc(
    //   FIRESTORE_COLLECTION_NAMES.USERS,
    //   currUser.uid,
    //   (data) => Promise.resolve(data),
    //   (error) => Promise.reject(error)
    // );
    const loadUserDataFromFirestore = firestore.getOneDoc(
      FIRESTORE_COLLECTION_NAMES.USERS,
      currUser.uid
    );

    // const loadAppSettingsFromFirestore = firestore.getAndListenOneDoc(
    //   FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
    //   currUser.uid,
    //   (data) => Promise.resolve(data),
    //   (error) => Promise.reject(error)
    // );
    const loadAppSettingsFromFirestore = firestore.getOneDoc(
      FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
      currUser.uid
    );

    // const loadLogbooksFromFirestore = firestore.getAndListenMultipleDocs(
    //   FIRESTORE_COLLECTION_NAMES.LOGBOOKS,
    //   currUser.uid,
    //   (data) => Promise.resolve(data),
    //   (error) => Promise.reject(error)
    // );
    const loadLogbooksFromFirestore = firestore.queryData(
      FIRESTORE_COLLECTION_NAMES.LOGBOOKS,
      currUser.uid
    );

    // const loadTransactionsFromFirestore = firestore.getAndListenMultipleDocs(
    //   FIRESTORE_COLLECTION_NAMES.TRANSACTIONS,
    //   currUser.uid,
    //   (data) => Promise.resolve(data),
    //   (error) => Promise.reject(error)
    // );
    const loadTransactionsFromFirestore = firestore.queryData(
      FIRESTORE_COLLECTION_NAMES.TRANSACTIONS,
      currUser.uid
    );

    // const loadCategoriesFromFirestore = firestore.getAndListenOneDoc(
    //   FIRESTORE_COLLECTION_NAMES.CATEGORIES,
    //   currUser.uid,
    //   (data) => Promise.resolve(data),
    //   (error) => Promise.reject(error)
    // );
    const loadCategoriesFromFirestore = firestore.getOneDoc(
      FIRESTORE_COLLECTION_NAMES.CATEGORIES,
      currUser.uid
    );

    // const loadBudgetsFromFirestore = firestore.getAndListenMultipleDocs(
    //   FIRESTORE_COLLECTION_NAMES.BUDGETS,
    //   currUser.uid,
    //   (data) => Promise.resolve(data),
    //   (error) => Promise.reject(error)
    // );
    const loadBudgetsFromFirestore = firestore.queryData(
      FIRESTORE_COLLECTION_NAMES.BUDGETS,
      currUser.uid
    );

    const loadRepeatedTransactionsFromFirestore = firestore.queryData(
      FIRESTORE_COLLECTION_NAMES.REPEATED_TRANSACTIONS,
      currUser.uid
    );

    Promise.all([
      deviceId,
      deviceName,
      deviceOSName,
      loadUserDataFromFirestore,
      loadAppSettingsFromFirestore,
      loadTransactionsFromFirestore,
      loadLogbooksFromFirestore,
      loadCategoriesFromFirestore,
      loadBudgetsFromFirestore,
      loadRepeatedTransactionsFromFirestore,
    ])
      .then((data) => {
        const deviceIdData = data[0];
        const deviceNameData = data[1];
        const deviceOSNameData = data[2];
        const userAccountData = data[3];
        const appSettingsData = data[4];
        const transactionsData = data[5];
        const logbooksData = data[6];
        const categoriesData = data[7];
        const budgetsData = data[8];
        const repeatedTransactionsData = data[9];
        const otherDevicesLoggedIn = userAccountData.devicesLoggedIn.filter(
          (device) => device.device_id !== deviceIdData
        );
        const loggedInUserAccount = {
          ...userAccountData,
          // subscription: {
          //   active: false,
          //   plan: "free",
          //   date: Date.now(),
          //   expiry: null,
          // },
          devicesLoggedIn: [
            ...otherDevicesLoggedIn,
            {
              device_id: deviceIdData,
              device_name: deviceNameData,
              device_os_name: deviceOSNameData,
              last_login: Date.now(),
            },
          ],
        };

        dispatchUserAccount({
          type: REDUCER_ACTIONS.USER_ACCOUNT.FORCE_SET,
          payload: loggedInUserAccount,
        });
        setTimeout(async () => {
          await firestore.setData(
            FIRESTORE_COLLECTION_NAMES.USERS,
            currUser.uid,
            loggedInUserAccount
          );
        }, 1);

        dispatchAppSettings({
          type: REDUCER_ACTIONS.APP_SETTINGS.FORCE_SET,
          payload: appSettingsData || {
            ...appSettingsFallback,
            uid: currUser.uid,
          },
        });

        const fallbackCategories = categoriesFallback({
          uid: currUser.uid,
          created_by: currUser.uid,
          updated_by: currUser.uid,
        });

        const categories = {
          ...initialCategories,
          categories: categoriesData || fallbackCategories,
        };

        dispatchCategories({
          type: REDUCER_ACTIONS.CATEGORIES.FORCE_SET,
          payload: categories,
        });

        const checkedTransactionsAndRepeatedTransactions =
          createNewTransactionFromActiveRepeatedTransaction(
            repeatedTransactionsData,
            transactionsData
          );

        // Merge transactions into sorted transactions
        const groupSorted = mergeTransactionsIntoSortedTransactions(
          checkedTransactionsAndRepeatedTransactions.getAllTransactions,
          logbooksData
        );

        dispatchSortedTransactions({
          type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.FORCE_SET,
          payload: { ...initialSortedTransactions, groupSorted: groupSorted },
        });

        dispatchLogbooks({
          type: REDUCER_ACTIONS.LOGBOOKS.FORCE_SET,
          payload: {
            ...initialLogbooks,
            logbooks: logbooksData || [],
          },
        });

        // Check budget if it is expired
        // const budget = budgetsData[0];
        let newBudget;
        if (budgetsData.length) {
          console.log(budgetsData);
          const today = Date.now();
          const budget = budgetsData[0];
          // const foundBudget = budget.find((budget) => {
          //   today > budget.finish_date;
          // });

          if (budget.repeat === true && today > budget.finish_date) {
            const duration = budget.finish_date - budget.start_date;
            newBudget = {
              ...budget,
              start_date: budget.start_date,
              finish_date: budget.finish_date + duration,
            };
          }
          dispatchBudgets({
            type: REDUCER_ACTIONS.BUDGETS.SET,
            payload: newBudget || budgetsData[0],
          });
        }

        dispatchRepeatedTransactions({
          type: REDUCER_ACTIONS.REPEATED_TRANSACTIONS.FORCE_SET,
          payload: {
            ...initialRepeatedTransactions,
            repeatedTransactions:
              checkedTransactionsAndRepeatedTransactions.getAllRepeatedTransactions ||
              [],
          },
        });

        // push new transaction to firestore
        checkedTransactionsAndRepeatedTransactions.getNewTransactionsOnly.forEach(
          async (newTransaction) => {
            await firestore.setData(
              FIRESTORE_COLLECTION_NAMES.TRANSACTIONS,
              newTransaction.transaction_id,
              newTransaction
            );
          }
        );

        // push modified repeat section to firestore
        checkedTransactionsAndRepeatedTransactions.getModifiedRepeatedTransactionsOnly.forEach(
          async (modifiedRepeatSection) => {
            await firestore.setData(
              FIRESTORE_COLLECTION_NAMES.REPEATED_TRANSACTIONS,
              modifiedRepeatSection.repeat_id,
              modifiedRepeatSection
            );
          }
        );

        setTimeout(() => {
          useFirestoreSubscriptions({
            uid: userAccountData.uid,
            subscribeAll: true,

            appSettings: appSettings,
            dispatchAppSettings: dispatchAppSettings,

            userAccount: userAccount,
            dispatchUserAccount: dispatchUserAccount,

            logbooks: logbooks,
            dispatchLogbooks: dispatchLogbooks,

            sortedTransactions: sortedTransactions,
            dispatchSortedTransactions: dispatchSortedTransactions,

            categories: categories,
            dispatchCategories: dispatchCategories,

            budgets: budgets,
            dispatchBudgets: dispatchBudgets,

            repeatedTransactions: repeatedTransactions,
            dispatchRepeatedTransactions: dispatchRepeatedTransactions,

            badgeCounter: badgeCounter,
            dispatchBadgeCounter: dispatchBadgeCounter,
          });
        }, 1000);

        navigation.replace(screenList.bottomTabNavigator);
      })
      .catch((err) => {
        console.log(err);
        navigation.replace(screenList.loginScreen);
      });
  };

  // const dispatchInitSortedTransactions = () => {
  // const getSortedTransactions = async () => {
  //   try {
  //     dispatchSortedTransactions({
  //       type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.SET,
  //       payload: await setSortedTransactions(),
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // }

  return (
    <>
      <View
        style={{
          ...globalStyles.lightTheme.view,
          backgroundColor: "#000000",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={JutaLogo}
          style={{
            width: 200,
            height: 200,
          }}
        />
        <ActivityIndicator size={48} color="#000" />

        {/* App Version */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <Text>Cash Log</Text>
          <Text>v.1.0.0</Text>
        </View>
      </View>
    </>
  );
};

export default SplashScreen;
