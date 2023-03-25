import { useEffect, useState } from "react";
import {
  useGlobalAppSettings,
  useGlobalBadgeCounter,
  useGlobalBudgets,
  useGlobalCategories,
  useGlobalCurrencyRates,
  useGlobalLogbooks,
  useGlobalRepeatedTransactions,
  useGlobalSortedTransactions,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../api/firebase/auth";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import { TextSecondary } from "../../../components/Text";
import { ListItem } from "../../../components/List";
import ListSection from "../../../components/List/ListSection";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import REDUCER_ACTIONS from "../../../reducers/reducer.action";
import screenList from "../../../navigations/ScreenList";

const DeveloperScreen = ({ item, navigation }) => {
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
  const { globalCurrencyRates, dispatchGlobalCurrencyRates } =
    useGlobalCurrencyRates();
  const { badgeCounter, dispatchBadgeCounter } = useGlobalBadgeCounter();
  const [firebaseUserAccount, setFirebaseUserAccount] = useState(null);
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {}, []);

  return (
    <>
      {appSettings && (
        <CustomScrollView
          contentContainerStyle={{
            justifyContent: "center",
          }}
        >
          <TextSecondary label="Nothing to see here" />
        </CustomScrollView>
      )}
    </>
  );
};

export default DeveloperScreen;
