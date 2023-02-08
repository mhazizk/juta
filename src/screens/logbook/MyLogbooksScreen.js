import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { ListItem } from "../../components/List";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalUserAccount,
} from "../../reducers/GlobalContext";
import ListSection from "../../components/List/ListSection";
import CustomScrollView from "../../shared-components/CustomScrollView";

const MyLogbooksScreen = ({ navigation }) => {
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
      {loadedLogbooks && (
        <CustomScrollView
          contentContainerStyle={{
            justifyContent: "flex-start",
          }}
        >
          <ListSection marginTop={16}>
            {loadedLogbooks?.map((item) => {
              return (
                <>
                  <ListItem
                    pressable
                    key={item.logbook_id}
                    leftLabel={
                      item?.logbook_name[0]?.toUpperCase() +
                      item?.logbook_name?.substring(1)
                    }
                    iconLeftName="book"
                    iconRightName="chevron-forward"
                    iconPack="IonIcons"
                    onPress={() => {
                      navigation.navigate(screenList.logbookPreviewScreen, {
                        logbook: item,
                      });
                    }}
                  />
                </>
              );
            })}
          </ListSection>
        </CustomScrollView>
      )}
    </>
  );
};

export default MyLogbooksScreen;
