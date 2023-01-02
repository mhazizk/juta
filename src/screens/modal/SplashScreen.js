import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { globalStyles } from "../../assets/themes/globalStyles";
import { lightTheme } from "../../assets/themes/lightTheme";
import { setSortedTransactions } from "../../utils/FetchData";
import {
  useGlobalAppSettings,
  useGlobalLoading,
  useGlobalSortedTransactions,
  useGlobalTransactions,
  useGlobalUserAccount,
} from "../../reducers/GlobalContext";
import { ACTIONS } from "../../reducers/GlobalReducer";
import persistStorage from "../../reducers/persist/persistStorage";
import PERSIST_ACTIONS from "../../reducers/persist/persist.actions";
import screenList from "../../navigations/ScreenList";
import REDUCER_ACTIONS from "../../reducers/reducer.action";

const SplashScreen = ({ navigation }) => {
  const { isLoading, dispatchLoading } = useGlobalLoading();
  const { rawTransactions, dispatchRawTransactions } = useGlobalTransactions();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();

  useEffect(() => {
    setTimeout(() => {
      loadInitialState().then(() => {
        dispatchAppSettings({
          type: REDUCER_ACTIONS.APP_SETTINGS.SCREEN_HIDDEN.PUSH,
          payload: screenList.splashScreen,
        });

        navigation.navigate(screenList.bottomTabNavigator);
      });
    }, 100);
  }, []);

  useEffect(() => {}, [isLoading]);

  useEffect(() => {
    if (sortedTransactions.sortedTransactionsInitCounter) {
      dispatchAppSettings({
        type: ACTIONS.APP_SETTINGS.SCREEN_HIDDEN.PUSH,
        payload: screenList.splashScreen,
      });

      navigation.navigate(screenList.bottomTabNavigator);
    }
  }, [sortedTransactions.sortedTransactionsInitCounter]);

  const loadInitialState = async () => {
    // Initial load app settings
    const loadAppSettings = await persistStorage.asyncStorage({
      action: PERSIST_ACTIONS.GET,
      key: "appSettings",
    });

    if (!loadAppSettings) {
      dispatchAppSettings({
        type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
        payload: {
          theme: { name: "Light Theme", id: "light", style: lightTheme },
          fontSize: "medium",
          language: "english",
          locale: "en-US",
          currencyRate: [
            { name: "USD", rate: 1 },
            { name: "IDR", rate: 14000 },
          ],
          logbookSettings: {
            defaultCurrency: { name: "IDR", symbol: "Rp", isoCode: "id" },
            showSecondaryCurrency: true,
            showTransactionNotes: true,
            showTransactionTime: true,
            dailySummary: "expense-only",
          },
          currency: { name: "IDR", symbol: "Rp", isoCode: "id" },
          screenHidden: [],
        },
      });
    }

    // Load Account from Storage
    // const loadAccount = await persistStorage.asyncSecureStorage({
    //   action: PERSIST_ACTIONS.GET,
    //   key: "account",
    // });

    // TAG : Load Account from Storage
    try {
      persistStorage
        .asyncSecureStorage({
          action: PERSIST_ACTIONS.GET,
          key: "account",
        })
        .then((loadedAccount) => {
          if (loadedAccount) {
            console.log(loadedAccount);
            dispatchUserAccount({
              type: REDUCER_ACTIONS.USER_ACCOUNT.SET_MULTI_ACTIONS,
              payload: loadedAccount,
            });
          } else {
            dispatchUserAccount({
              type: REDUCER_ACTIONS.USER_ACCOUNT.SET_MULTI_ACTIONS,
              payload: {
                profile: {
                  nickname: "haziz",
                  avatar: null,
                },
                account: {
                  premium: true,
                  user_id: "637208d545",
                },
              },
            });
          }
        });
    } catch (error) {
      throw new Error(error);
    }

    // Initial load raw transactions
    // if (!rawTransactions) {
    //     Promise.all([getTransactionsFromStorage(), getCategoriesFromStorage(), getLogbooksFromStorage()])
    //         .then((array) => {
    //             console.log('loaded')
    //             return (
    //                 dispatchRawTransactions({
    //                     type: ACTIONS.MULTI_ACTIONS.SET_INIT_TRANSACTIONS,
    //                     payload: {
    //                         transactions: array[0],
    //                         categories: array[1],
    //                         logbooks: array[2]
    //                     }
    //                 })
    //             )
    //         }
    //         )
    // }
    // console.log(sortedTransactions)
    // Initial load sorted Transactions
    if (!sortedTransactions.groupSorted) {
      await getSortedTransactions();
    }
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
