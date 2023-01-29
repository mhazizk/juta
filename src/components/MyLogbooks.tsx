import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalUserAccount
} from "../reducers/GlobalContext";
import { ListItem, SearchResultListItem, TransactionListItem } from "./List";
import { TextPrimary, TextSecondary } from "./Text";

const MyLogbooks = ({ route, navigation, onPress }) => {
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const [loadedLogbooks, setLoadedLogbooks] = useState(null);

  useEffect(() => {
    sortingLogbooks();
  }, []);

  useEffect(() => {
    sortingLogbooks();
  }, [logbooks.logbooks]);

  useEffect(() => {
    sortingLogbooks();
  }, [logbooks.reducerUpdatedAt]);

  useEffect(() => {}, [loadedLogbooks]);

  const sortingLogbooks = () => {
    const sortedLogbooks = logbooks.logbooks.sort(sortLogbooks);
    setLoadedLogbooks(sortedLogbooks);
  };

  const sortLogbooks = (prev, curr) => {
    if (prev.logbook_name > curr.logbook_name) {
      return 1;
    }
    if (prev.logbook_name < curr.logbook_name) {
      return -1;
    }
    return 0;
  };

  return (
    <>
      <TextPrimary
        label="My Logbooks"
        style={{ fontSize: 18, fontWeight: "bold", paddingHorizontal: 16 }}
      />
      <View
        style={{
          flex: 0,
          flexDirection: "column",
          paddingTop: 8,
          paddingBottom: 32,
        }}
      >
        <FlatList
          data={loadedLogbooks}
          keyExtractor={(item) => item.logbook_id}
          renderItem={({ item }) => (
            <>
              {loadedLogbooks && (
                <ListItem
                  pressable
                  leftLabel={
                    item?.logbook_name[0]?.toUpperCase() +
                    item?.logbook_name?.substring(1)
                  }
                  rightLabel="2 transactions"
                  iconLeftName="book"
                  iconRightName="chevron-forward"
                  onPress={() => onPress(item)}
                />
              )}
            </>
          )}
        />
        {!loadedLogbooks && (
          <TextSecondary
            label="No Recent Transactions"
            style={{ paddingHorizontal: 16 }}
          />
        )}
      </View>
    </>
  );
};

export default MyLogbooks;
