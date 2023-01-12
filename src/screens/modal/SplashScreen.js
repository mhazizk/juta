import * as Device from "expo-device";
import * as Application from "expo-application";

import { useEffect } from "react";
import { ActivityIndicator, Linking, Text, View } from "react-native";
import { globalStyles } from "../../assets/themes/globalStyles";
import { lightTheme } from "../../assets/themes/lightTheme";
import { setSortedTransactions } from "../../utils/FetchData";
import {
  useGlobalAppSettings,
  useGlobalBudgets,
  useGlobalCategories,
  useGlobalLoading,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTransactions,
  useGlobalUserAccount,
} from "../../reducers/GlobalContext";
import { ACTIONS } from "../../reducers/GlobalReducer";
import persistStorage from "../../reducers/persist/persistStorage";
import PERSIST_ACTIONS from "../../reducers/persist/persist.actions";
import screenList from "../../navigations/ScreenList";
import REDUCER_ACTIONS from "../../reducers/reducer.action";
import uuid from "react-native-uuid";
import Loading from "../../components/Loading";
import auth from "../../api/firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import firestore from "../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../api/firebase/firestoreCollectionNames";
import devAppSettings from "../../dev/devAppSettings";
import appSettingsFallback from "../../reducers/fallback-state/appSettingsFallback";
import categoriesFallback from "../../reducers/fallback-state/categoriesFallback";
import mergeTransactionsIntoSortedTransactions from "../../utils/MergeTransactionsIntoSortedTransactions";
import InitialSortedTransactions from "../../reducers/initial-state/InitialSortedTransactions";
import initialCategories from "../../reducers/initial-state/InitialCategories";
import initialLogbooks from "../../reducers/initial-state/InitialLogbooks";
import { getDeviceId, getDeviceOSName } from "../../utils";
import getDeviceName from "../../utils/GetDeviceName";
// import useAuth from "../../hooks/useAuth";

const SplashScreen = ({ route, navigation }) => {
  const { isLoading, dispatchLoading } = useGlobalLoading();
  const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { budgets, dispatchBudgets } = useGlobalBudgets();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {}, []);

  useEffect(() => {
    // goToLogInScreen();
    switch (true) {
      case route.params?.status === "NEW_USER" && !!user && !loading:
        startAppWithNewUser(user);
        break;
      case !route.params?.status && !!user && !loading:
        startAppWithExistingUser(user);
        break;
      case !route.params?.status === "RETRY_LOGIN":
        // case !route.params?.status === "RETRY_LOGIN" && !user && !loading:
        navigation.replace(screenList.loginScreen);
        break;
      case error:
        console.log(error);
        break;

      case !user && !loading:
        navigation.replace(screenList.onboardingScreen);
        break;

      default:
        break;
    }
  }, [user, loading, error]);

  useEffect(() => {
    // refresh state
  }, [appSettings, userAccount, sortedTransactions, logbooks, categories]);

  useEffect(() => {}, [isLoading]);

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
    const loadAppSettings = await persistStorage.asyncStorage({
      action: PERSIST_ACTIONS.GET,
      key: "appSettings",
    });

    Promise.all([loadAppSettings]).then((data) => {
      dispatchAppSettings({
        type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
        payload: data[0],
      });
      navigation.replace(screenList.loginScreen);
    });
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

        dispatchCategories({
          type: REDUCER_ACTIONS.CATEGORIES.SET_MULTI_ACTIONS,
          payload: {
            categories: { ...categoriesFallback, uid: currUser.uid },
          },
        });

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
        const otherDevicesLoggedIn = userAccountData.devicesLoggedIn.filter(
          (device) => device.device_id !== deviceIdData
        );
        const loggedInUserAccount = {
          ...userAccountData,
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
        // Merge transactions into sorted transactions
        const groupSorted = mergeTransactionsIntoSortedTransactions(
          transactionsData,
          logbooksData
        );

        dispatchSortedTransactions({
          type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.FORCE_SET,
          payload: { ...InitialSortedTransactions, groupSorted: groupSorted },
        });

        dispatchLogbooks({
          type: REDUCER_ACTIONS.LOGBOOKS.FORCE_SET,
          payload: {
            ...initialLogbooks,
            logbooks: logbooksData || [],
          },
        });

        dispatchCategories({
          type: REDUCER_ACTIONS.CATEGORIES.FORCE_SET,
          payload: {
            ...initialCategories,
            categories: categoriesData || {
              ...categoriesFallback,
              uid: currUser.uid,
            },
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
        // dispatchBudgets({
        //   type: REDUCER_ACTIONS.BUDGETS.FORCE_SET,
        //   payload: {
        //     budgetPatchCounter: 0,
        //     budgetInsertCounter: 0,
        //     budgetDeleteCounter: 0,
        //     budgets: [newBudget || budgetsData[0]] || [],
        //   },
        // });

        navigation.replace(screenList.bottomTabNavigator);
      })
      .catch((err) => {
        console.log(err);
        navigation.replace(screenList.login);
      });
  };

  // const dispatchInitSortedTransactions = () => {
  const getSortedTransactions = async () => {
    try {
      dispatchSortedTransactions({
        type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.SET,
        payload: await setSortedTransactions(),
      });
    } catch (error) {
      console.log(error);
    }
  };
  // }

  return (
    <>
      <View
        style={{
          ...globalStyles.lightTheme.view,
          backgroundColor: "maroon",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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