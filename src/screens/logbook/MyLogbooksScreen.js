import { useEffect, useState } from "react";
import { Text, TouchableNativeFeedback, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import IonIcons from "react-native-vector-icons/Ionicons";
import { globalStyles } from "../../../src/assets/themes/globalStyles";
import { ListItem } from "../../components/List";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalUserAccount,
} from "../../reducers/GlobalContext";
import { ACTIONS } from "../../reducers/GlobalReducer";
import uuid from "react-native-uuid";
import firestore from "../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../api/firebase/firestoreCollectionNames";

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
  }, [logbooks.logbookPatchCounter]);

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
        <View
          style={{
            backgroundColor: appSettings.theme.style.colors.background,
            height: "100%",
          }}
        >
          <FlatList
            data={loadedLogbooks}
            keyExtractor={(item) => item.logbook_id}
            style={{ flex: 1 }}
            renderItem={({ item }) => (
              <>
                <ListItem
                  pressable
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
            )}
            ListFooterComponent={() => (
              <>
                <ListItem
                  pressable
                  leftLabel="Add New Logbook"
                  iconPack="IonIcons"
                  iconLeftName="add-circle"
                  onPress={() =>
                    navigation.navigate(screenList.modalScreen, {
                      modalType: "textInput",
                      title: "Create New Log Book",
                      placeholder: "Enter new log book name ...",
                      selected: (item) => {
                        const newLogbook = {
                          _timestamps: {
                            created_at: Date.now(),
                            updated_at: Date.now(),
                          },
                          _id: uuid.v4(),
                          uid: userAccount.uid,
                          logbook_currency: {
                            name: "IDR",
                            symbol: "Rp",
                            isoCode: "id",
                          },
                          logbook_type: "basic",
                          logbook_id: uuid.v4(),
                          logbook_name: item,
                          logbook_records: [],
                          logbook_categories: [],
                          __v: 0,
                        };

                        setTimeout(async () => {
                          await firestore.setData(
                            FIRESTORE_COLLECTION_NAMES.LOGBOOKS,
                            newLogbook.logbook_id,
                            newLogbook
                          );
                        }, 1);

                        dispatchLogbooks({
                          type: ACTIONS.LOGBOOKS.INSERT,
                          payload: newLogbook,
                        });

                        dispatchSortedTransactions({
                          type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
                            .INSERT_LOGBOOK,
                          payload: {
                            newLogbook: {
                              logbook_id: newLogbook.logbook_id,
                              transactions: [],
                            },
                            logbookToOpen: {
                              name: newLogbook.logbook_name,
                              logbook_id: newLogbook.logbook_id,
                              logbook_currency: {
                                name: "IDR",
                                symbol: "Rp",
                                isoCode: "id",
                              },
                            },
                          },
                        });
                      },
                    })
                  }
                />
              </>
            )}
          />
        </View>
      )}
    </>
  );
};

export default MyLogbooksScreen;
