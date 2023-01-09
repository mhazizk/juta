import { useEffect } from "react";
import { ActivityIndicator, Linking, Text, View } from "react-native";
import { globalStyles } from "../../assets/themes/globalStyles";
import { lightTheme } from "../../assets/themes/lightTheme";
import { setSortedTransactions } from "../../utils/FetchData";
import {
  useGlobalAppSettings,
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
  // const auth = useAuth();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {}, []);

  useEffect(() => {
    // goToLogInScreen();
    switch (true) {
      case !!user && !loading:
        startApp(user);
        break;
      case !user && !loading:
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

  const startApp = async (currUser) => {
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

    // TODO : load transactions from firestore
    // TODO : load categories from firestore
    // TODO : load budget from firestore
    // TODO : merge transactions into sorted transactions

    // const loadUserAccount = await persistStorage.asyncSecureStorage({
    //   action: PERSIST_ACTIONS.GET,
    //   key: "authAccount",
    // });

    const loadSortedTransactions = await persistStorage.asyncStorage({
      action: PERSIST_ACTIONS.GET,
      key: "sortedTransactions",
    });

    const loadCategories = await persistStorage.asyncStorage({
      action: PERSIST_ACTIONS.GET,
      key: "categories",
    });

    const loadLogbooks = await persistStorage.asyncStorage({
      action: PERSIST_ACTIONS.GET,
      key: "logbooks",
    });

    Promise.all([
      // loadUserAccount,
      loadUserDataFromFirestore,
      // loadAppSettings,
      loadAppSettingsFromFirestore,
      loadSortedTransactions,
      // loadLogbooks,
      loadLogbooksFromFirestore,
      loadCategories,
    ])
      .then((data) => {
        // Check if firebase user is the same as the one in local storage
        dispatchUserAccount({
          type: REDUCER_ACTIONS.USER_ACCOUNT.FORCE_SET,
          payload: data[0],
          // payload: data[0].uid === currUser.uid ? data[0] : currUser,
        });

        dispatchAppSettings({
          type: REDUCER_ACTIONS.APP_SETTINGS.FORCE_SET,
          payload: data[1],
        });
        dispatchSortedTransactions({
          type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.FORCE_SET,
          payload: data[2],
        });
        dispatchLogbooks({
          type: REDUCER_ACTIONS.LOGBOOKS.SET_MULTI_ACTIONS,
          payload: {
            logbooks: data[3],
          },
        });
        dispatchCategories({
          type: REDUCER_ACTIONS.CATEGORIES.FORCE_SET,
          payload: data[4],
        });
        navigation.replace(screenList.bottomTabNavigator);

        // switch (true) {
        //   case !data[0] || isUserAccountEmpty(data[0] || !currUser):
        //     console.log("No account");
        //     dispatchAppSettings({
        //       type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
        //       payload: data[1],
        //     });
        //     navigation.replace(screenList.loginScreen);
        //     return;

        //   default:
        //     // dispatchUserAccount({
        //     //   type: REDUCER_ACTIONS.USER_ACCOUNT.SET_MULTI_ACTIONS,
        //     //   payload: data[0],
        //     // });
        //     dispatchAppSettings({
        //       type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
        //       payload: data[1],
        //     });
        //     dispatchSortedTransactions({
        //       type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
        //         .SET_MULTI_ACTIONS,
        //       payload: data[2],
        //     });
        //     dispatchLogbooks({
        //       type: REDUCER_ACTIONS.LOGBOOKS.SET_MULTI_ACTIONS,
        //       payload: data[3],
        //     });
        //     dispatchCategories({
        //       type: REDUCER_ACTIONS.CATEGORIES.SET_MULTI_ACTIONS,
        //       payload: data[4],
        //     });
        //     //  Hide splash screen
        //     if (
        //       !data[0].hiddenScreens?.some(
        //         (screen) => screen === screenList.splashScreen
        //       )
        //     ) {
        //       dispatchAppSettings({
        //         type: REDUCER_ACTIONS.APP_SETTINGS.SCREEN_HIDDEN.PUSH,
        //         payload: screenList.splashScreen,
        //       });
        //     } else {
        //     }
        //     return;
        // }
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
