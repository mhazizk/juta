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
      case !route.params?.status && !user && !loading:
        // goToLogInScreen();
        navigation.replace(screenList.onboardingScreen);
        break;
      case error:
        console.log(error);
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

  const startAppWithNewUser = (currUser) => {
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

    setTimeout(() => {
      navigation.navigate(screenList.bottomTabNavigator);
    }, 1000);
  };

  const startAppWithExistingUser = async (currUser) => {
    // console.log(currUser);
    // Initial load app settings
    const loadAppSettings = await persistStorage.asyncStorage({
      action: PERSIST_ACTIONS.GET,
      key: "appSettings",
    });

    const loadUserDataFromFirestore = await firestore.getOneDoc(
      FIRESTORE_COLLECTION_NAMES.USERS,
      currUser.uid
    );

    const loadAppSettingsFromFirestore = await firestore.getOneDoc(
      FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
      currUser.uid
    );

    const loadLogbooksFromFirestore = await firestore.queryData(
      FIRESTORE_COLLECTION_NAMES.LOGBOOKS,
      currUser.uid
    );

    const loadTransactionsFromFirestore = await firestore.queryData(
      FIRESTORE_COLLECTION_NAMES.TRANSACTIONS,
      currUser.uid
    );

    const loadCategoriesFromFirestore = await firestore.getOneDoc(
      FIRESTORE_COLLECTION_NAMES.CATEGORIES,
      currUser.uid
    );

    const loadBudgetsFromFirestore = await firestore.queryData(
      FIRESTORE_COLLECTION_NAMES.BUDGETS,
      currUser.uid
    );

    // const loadUserAccount = await persistStorage.asyncSecureStorage({
    //   action: PERSIST_ACTIONS.GET,
    //   key: "authAccount",
    // });

    // const loadSortedTransactions = await persistStorage.asyncStorage({
    //   action: PERSIST_ACTIONS.GET,
    //   key: "sortedTransactions",
    // });

    // const loadCategories = await persistStorage.asyncStorage({
    //   action: PERSIST_ACTIONS.GET,
    //   key: "categories",
    // });

    // const loadLogbooks = await persistStorage.asyncStorage({
    //   action: PERSIST_ACTIONS.GET,
    //   key: "logbooks",
    // });

    Promise.all([
      loadUserDataFromFirestore,
      loadAppSettingsFromFirestore,
      loadTransactionsFromFirestore,
      loadLogbooksFromFirestore,
      loadCategoriesFromFirestore,
      loadBudgetsFromFirestore,
      // loadUserAccount,
      // loadAppSettings,
      // loadSortedTransactions,
      // loadLogbooks,
      // loadCategories,
    ])
      .then((data) => {
        dispatchUserAccount({
          type: REDUCER_ACTIONS.USER_ACCOUNT.FORCE_SET,
          payload: data[0],
          // payload: data[0].uid === currUser.uid ? data[0] : currUser,
        });
        dispatchAppSettings({
          type: REDUCER_ACTIONS.APP_SETTINGS.FORCE_SET,
          payload: data[1] || {
            ...appSettingsFallback,
            uid: currUser.uid,
          },
        });
        // Merge transactions into sorted transactions
        const groupSorted = mergeTransactionsIntoSortedTransactions(
          data[2],
          data[3]
        );

        dispatchSortedTransactions({
          type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.FORCE_SET,
          payload: { ...InitialSortedTransactions, groupSorted: groupSorted },
        });

        dispatchLogbooks({
          type: REDUCER_ACTIONS.LOGBOOKS.FORCE_SET,
          payload: {
            ...initialLogbooks,
            logbooks: data[3] || [],
          },
        });

        dispatchCategories({
          type: REDUCER_ACTIONS.CATEGORIES.FORCE_SET,
          payload: {
            ...initialCategories,
            categories: data[4] || { ...categoriesFallback, uid: currUser.uid },
          },
        });

        // Check budget if it is expired
        const budget = data[5];
        let newBudget;
        if (budget.length) {
          console.log(budget);
          const today = Date.now();
          // const foundBudget = budget.find((budget) => {
          //   today > budget.finish_date;
          // });

          if (budget[0].repeat === true && today > budget[0].finish_date) {
            const duration = budget[0].finish_date - budget[0].start_date;
            newBudget = {
              ...budget[0],
              start_date: budget[0].start_date,
              finish_date: budget[0].finish_date + duration,
            };
          }

          dispatchBudgets({
            type: REDUCER_ACTIONS.BUDGETS.SET,
            payload: newBudget || budget[0],
          });
        }

        navigation.replace(screenList.bottomTabNavigator);
      })
      .catch((err) => {
        console.log(err);
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
