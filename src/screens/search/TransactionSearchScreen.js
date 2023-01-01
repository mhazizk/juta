import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { TextPrimary } from "../../components/Text";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalSortedTransactions
} from "../../reducers/GlobalContext";

const TransactionSearchScreen = ({ route, navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { sortedTransactions, dispatchSortedTransctions } =
    useGlobalSortedTransactions();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();

  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    search();
  }, []);

  useEffect(() => {}, [searchResult]);

  // TAG : Function Section
  const search = () => {
    // Search by Transaction Notes
    if (route.params.searchQuery) {
      const searchQuery = route.params.searchQuery;
      const searchResult = sortedTransactions.groupSorted.filter((logbook) =>
        logbook.transactions.filter((section) =>
          section.data.filter((transaction) =>
            transaction.details.notes
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          )
        )
      );
      setSearchResult(searchResult);
    }

    // Search by Amount
    if (route.params.searchQuery) {
      const searchQuery = route.params.searchQuery;
      const searchResult = sortedTransactions.groupSorted.filter((logbook) =>
        logbook.transactions.filter((section) =>
          section.data.filter((transaction) =>
            transaction.details.amount
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          )
        )
      );
      setSearchResult(searchResult);
    }
  };

  return (
    <>
      <View
        style={{
          height: "100%",
          backgroundColor: appSettings.theme.style.colors.background,
        }}
      >
        <FlatList
        // data={}
        />
        <TextPrimary label="Transaction Search Screen" />
      </View>
    </>
  );
};

export default TransactionSearchScreen;
