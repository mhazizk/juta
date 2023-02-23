import { useEffect, useState } from "react";
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
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../api/firebase/auth";
import CustomScrollView from "../../shared-components/CustomScrollView";
import { TextSecondary } from "../../components/Text";

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
          <TextSecondary
          label='Nothing to see here'
          />
        </CustomScrollView>
      )}
    </>
  );
};

export default DeveloperScreen;
