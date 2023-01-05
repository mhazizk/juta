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

const SplashScreen = ({ navigation }) => {
  const { isLoading, dispatchLoading } = useGlobalLoading();
  const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();

  useEffect(() => {
    setTimeout(() => {
      loadInitialState();
    }, 1);
  }, []);

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

  const loadInitialState = async () => {
    // Initial load app settings
    const loadAppSettings = await persistStorage.asyncStorage({
      action: PERSIST_ACTIONS.GET,
      key: "appSettings",
    });

    const loadUserAccount = await persistStorage.asyncSecureStorage({
      action: PERSIST_ACTIONS.GET,
      key: "account",
    });

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
      loadUserAccount,
      loadAppSettings,
      loadSortedTransactions,
      loadLogbooks,
      loadCategories,
    ])
      .then((data) => {
        console.log(data[0]);
        switch (true) {
          case !data[0] || isUserAccountEmpty(data[0]):
            console.log("No account");
            dispatchAppSettings({
              type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
              payload: data[1],
            });
            navigation.navigate(screenList.loginScreen);

          default:
            dispatchUserAccount({
              type: REDUCER_ACTIONS.USER_ACCOUNT.SET_MULTI_ACTIONS,
              payload: data[0],
            });
            dispatchAppSettings({
              type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
              payload: data[1],
            });
            dispatchSortedTransactions({
              type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
                .SET_MULTI_ACTIONS,
              payload: data[2],
            });
            dispatchLogbooks({
              type: REDUCER_ACTIONS.LOGBOOKS.SET_MULTI_ACTIONS,
              payload: data[3],
            });
            dispatchCategories({
              type: REDUCER_ACTIONS.CATEGORIES.SET_MULTI_ACTIONS,
              payload: data[4],
            });
            //  Hide splash screen
            if (
              !data[0].hiddenScreens?.some(
                (screen) => screen === screenList.splashScreen
              )
            ) {
              dispatchAppSettings({
                type: REDUCER_ACTIONS.APP_SETTINGS.SCREEN_HIDDEN.PUSH,
                payload: screenList.splashScreen,
              });
            } else {
            }
            return;
        }
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
