import { Image } from "react-native";
import Footer from "../../../components/Footer";
import Loading from "../../../components/Loading";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import JutaLogo from "../../../assets/icons/juta-app-icon.png";
import {
  useExpoPushToken,
  useGlobalAppSettings,
  useGlobalBadgeCounter,
  useGlobalBudgets,
  useGlobalCategories,
  useGlobalCurrencyRates,
  useGlobalFeatureSwitch,
  useGlobalLoan,
  useGlobalLogbooks,
  useGlobalRepeatedTransactions,
  useGlobalSortedTransactions,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../api/firebase/auth";
import screenList from "../../../navigations/ScreenList";
import startAppWithExistingUser from "../logic/startAppWithExistingUser";
import persistStorage from "../../../reducers/persist/persistStorage";
import PERSIST_ACTIONS from "../../../reducers/persist/persist.actions";
import REDUCER_ACTIONS from "../../../reducers/reducer.action";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import firestore from "../../../api/firebase/firestore";
import startAppWithNewUser from "../logic/startAppWithNewUser";
import isInternetReachable from "../../../utils/isInternetReachable";

const SplashScreen = ({ route, navigation }) => {
  const fromScreen = route.params?.fromScreen || null;
  const targetScreen = route.params?.targetScreen || null;
  const { expoPushToken, setExpoPushToken } = useExpoPushToken();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { globalTheme, dispatchGlobalTheme } = useGlobalTheme();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { globalLoan, dispatchGlobalLoan } = useGlobalLoan();
  const { globalFeatureSwitch, dispatchGlobalFeatureSwitch } =
    useGlobalFeatureSwitch();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { budgets, dispatchBudgets } = useGlobalBudgets();
  const { repeatedTransactions, dispatchRepeatedTransactions } =
    useGlobalRepeatedTransactions();
  const { globalCurrencyRates, dispatchGlobalCurrencyRates } =
    useGlobalCurrencyRates();
  const { badgeCounter, dispatchBadgeCounter } = useGlobalBadgeCounter();
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [user, loading, error] = useAuthState(auth);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log({ __DEV__ });

    persistStorage
      .asyncStorage({
        action: PERSIST_ACTIONS.GET,
        key: "isFirstRun",
      })
      .then((isFirstRun) => {
        setIsFirstRun(isFirstRun);
      })
      .catch((error) => {});

    isInternetReachable().then((isInternetConnected) => {
      if (!isInternetConnected) {
        navigation.replace(screenList.noInternetScreen, {
          fromScreen: screenList.splashScreen,
        });
      } else {
        setIsConnected(true);
      }
    });
    console.log({ expoPushToken });
  }, []);

  useEffect(() => {
    const isNotLoggedIn = !user && !loading;
    const isLoggedInAndVerified = !!user && !loading && !!user?.emailVerified;
    const isLoggedInButNotVerified = !!user && !loading && !user?.emailVerified;
    const newAccountToRedirect =
      isLoggedInAndVerified && fromScreen === screenList.initialSetupScreen;
    const loggedInWithPersistingAccount = isLoggedInAndVerified && !fromScreen;
    const loggedInFromLoginScreen =
      isLoggedInAndVerified && fromScreen === screenList.loginScreen;

    const globalContext = {
      appSettings,
      dispatchAppSettings,
      globalTheme,
      dispatchGlobalTheme,
      userAccount,
      dispatchUserAccount,
      logbooks,
      dispatchLogbooks,
      categories,
      dispatchCategories,
      globalLoan,
      dispatchGlobalLoan,
      globalFeatureSwitch,
      dispatchGlobalFeatureSwitch,
      sortedTransactions,
      dispatchSortedTransactions,
      budgets,
      dispatchBudgets,
      repeatedTransactions,
      dispatchRepeatedTransactions,
      globalCurrencyRates,
      dispatchGlobalCurrencyRates,
      badgeCounter,
      dispatchBadgeCounter,
      expoPushToken,
    };

    // TODO : commented for testing on iOS simulator
    // if (isConnected && !!expoPushToken) {
    if (isConnected) {
      switch (isFirstRun) {
        case true:
          switch (true) {
            case isNotLoggedIn:
              navigation.replace(screenList.onboardingScreen);
              break;
          }
          break;
        case undefined:
          switch (true) {
            case isNotLoggedIn:
              navigation.replace(screenList.onboardingScreen);
              break;
            case isLoggedInAndVerified:
              persistStorage
                .asyncStorage({
                  action: PERSIST_ACTIONS.SET,
                  key: "isFirstRun",
                  rawValue: false,
                })
                .then(() => {})
                .catch((error) => {});
              break;
          }
          break;
        case false:
          switch (true) {
            case loggedInWithPersistingAccount:
              startAppWithExistingUser({
                currentUser: user,
                globalContext,
              }).then((screenName) => {
                navigation.replace(screenName);
              });
              break;
            case loggedInFromLoginScreen:
              startAppWithExistingUser({
                currentUser: user,
                globalContext,
              }).then((screenName) => {
                console.log({ screenName });
                navigation.replace(screenName);
              });
              break;
            case isLoggedInButNotVerified:
              if (!userAccount) {
                const fetchUserAccount = firestore.getOneDoc(
                  FIRESTORE_COLLECTION_NAMES.USERS,
                  userAccount?.uid
                );
                dispatchUserAccount({
                  type: REDUCER_ACTIONS.USER_ACCOUNT.FORCE_SET,
                  payload: fetchUserAccount,
                });
              }
              if (!appSettings || appSettings?.uid !== userAccount?.uid) {
                const appSettingsData = firestore.getOneDoc(
                  FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
                  userAccount?.uid
                );
                dispatchAppSettings({
                  type: REDUCER_ACTIONS.APP_SETTINGS.FORCE_SET,
                  payload: appSettingsData,
                });
              }
              navigation.replace(screenList.emailVerificationScreen, {
                fromScreen: screenList.splashScreen,
              });
              break;
            case newAccountToRedirect:
              startAppWithNewUser({
                currentUser: user,
                globalContext,
              }).then((screenName) => {
                navigation.replace(screenName);
              });
              break;
            case isNotLoggedIn:
              navigation.replace(screenList.loginScreen);
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
    }
  }, [
    expoPushToken,
    isConnected,
    user,
    loading,
    error,
    isFirstRun,
    fromScreen,
    targetScreen,
    sortedTransactions.reducerUpdatedAt,
  ]);

  return (
    <>
      <CustomScrollView
        contentContainerStyle={{
          justifyContent: "center",
        }}
      >
        <Image
          source={JutaLogo}
          style={{
            width: 150,
            height: 150,
          }}
        />
        <Loading />

        <Footer />
      </CustomScrollView>
    </>
  );
};

export default SplashScreen;
