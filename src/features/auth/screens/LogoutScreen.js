import { signOut } from "firebase/auth/react-native";
import { useEffect } from "react";
import { ScrollView } from "react-native";
import auth from "../../../api/firebase/auth";
import logOutRevenueCat from "../../../api/revenue-cat/logOutRevenueCat";
import Loading from "../../../components/Loading";
import { TextPrimary } from "../../../components/Text";
import useFirestoreSubscriptions from "../../../hooks/useFirestoreSubscriptions";
import screenList from "../../../navigations/ScreenList";
import appSettingsFallback from "../../../reducers/fallback-state/appSettingsFallback";
import {
  useGlobalAppSettings,
  useGlobalBadgeCounter,
  useGlobalBudgets,
  useGlobalCategories,
  useGlobalCurrencyRates,
  useGlobalLoan,
  useGlobalLogbooks,
  useGlobalRepeatedTransactions,
  useGlobalSortedTransactions,
  useGlobalTheme,
  useGlobalTransactions,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import REDUCER_ACTIONS from "../../../reducers/reducer.action";
import CustomScrollView from "../../../shared-components/CustomScrollView";

const LogoutScreen = ({ navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { globalTheme, dispatchGlobalTheme } = useGlobalTheme();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { globalLoan, dispatchGlobalLoan } = useGlobalLoan();
  const { globalCurrencyRates, dispatchGlobalCurrencyRates } =
    useGlobalCurrencyRates();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { budgets, dispatchBudgets } = useGlobalBudgets();
  const { repeatedTransactions, dispatchRepeatedTransactions } =
    useGlobalRepeatedTransactions();
  const { badgeCounter, dispatchBadgeCounter } = useGlobalBadgeCounter();

  useEffect(() => {
    const {
      unsubscribeAppSettings,
      unsubscribeUserAccount,
      unsubscribeLogbooks,
      unsubscribeTransactions,
      unsubscribeCategories,
      unsubscribeBudgets,
      unsubscribeRepeatedTransactions,
      unsubscribeCurrencyRates,
      unsubscribeLoan,
      // unsubscribeFeatures,
    } = useFirestoreSubscriptions({
      uid: userAccount.uid,
      unsubscribeAll: true,

      appSettings,
      dispatchAppSettings,

      userAccount,
      dispatchUserAccount,

      logbooks,
      dispatchLogbooks,

      sortedTransactions,
      dispatchSortedTransactions,

      categories,
      dispatchCategories,

      repeatedTransactions,
      dispatchRepeatedTransactions,

      budgets,
      dispatchBudgets,

      badgeCounter,
      dispatchBadgeCounter,

      globalLoan,
      dispatchGlobalLoan,
    });

    // unsubscribe from firestore subscriptions
    unsubscribeAppSettings;
    unsubscribeUserAccount;
    unsubscribeLogbooks;
    unsubscribeTransactions;
    unsubscribeCategories;
    unsubscribeBudgets;
    unsubscribeRepeatedTransactions;
    unsubscribeCurrencyRates;
    unsubscribeLoan;
    // unsubscribeFeatures;

    setTimeout(() => {
      signOut(auth).then(async () => {
        dispatchAppSettings({
          type: REDUCER_ACTIONS.APP_SETTINGS.FORCE_SET,
          payload: appSettingsFallback,
        });
        dispatchGlobalTheme({
          type: REDUCER_ACTIONS.THEME.SET,
          payload: appSettingsFallback.theme_id,
        });
        dispatchUserAccount({
          type: REDUCER_ACTIONS.USER_ACCOUNT.FORCE_SET,
          payload: null,
        });
        setTimeout(async () => {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: screenList.loginScreen,
                params: {
                  fromScreen: screenList.logoutScreen,
                  // targetScreen: screenList.loginScreen,
                },
              },
            ],
          });
          await logOutRevenueCat();
        }, 500);
      });
    }, 3000);
  }, []);

  return (
    <CustomScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Loading />
      <TextPrimary label="Logging you out..." />
    </CustomScrollView>
  );
};

export default LogoutScreen;
