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
        <ScrollView
          contentContainerStyle={{
            backgroundColor: appSettings.theme.style.colors.background,
            minHeight: "100%",
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
        </ScrollView>
      )}
    </>
  );
};

export default MyLogbooksScreen;
