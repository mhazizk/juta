import { useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { TextSecondary } from "../../components/Text";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTheme,
} from "../../reducers/GlobalContext";
import CustomScrollView from "../../shared-components/CustomScrollView";
import TransactionsSearchResults from "./TransactionsSearchResults";

const SearchScreen = ({ navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const [searchQuery, setSearchQuery] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    // refresh
    console.log(searchQuery);
    inputRef.current.focus();
  }, [searchQuery]);

  const checkmark = require("../../../src/assets/img/checkmark.png");
  return (
    <>
      <View
        style={{
          backgroundColor: globalTheme.colors.background,
          height: "100%",
        }}
      >
        {/* Search Bar */}
        <View
          style={{
            display: "flex",
            backgroundColor: globalTheme.colors.header,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: 16,
            padding: 16,
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              overflow: "hidden",
              flexDirection: "row",
              borderColor: globalTheme.colors.primary,
              justifyContent: "space-between",
              borderRadius: 16,
              borderWidth: 1,
              backgroundColor: globalTheme.colors.background,
            }}
          >
            <IonIcons
              name="search"
              size={24}
              color={globalTheme.colors.primary}
              style={{ paddingHorizontal: 16 }}
            />
            <TextInput
              ref={inputRef}
              returnKeyType="search"
              placeholder="I am looking for ..."
              placeholderTextColor={globalTheme.text.textSecondary.color}
              style={{
                ...globalTheme.text.textPrimary,
                flex: 1,
                paddingLeft: 0,
                height: 48,
              }}
              onChangeText={(searchText) => setSearchQuery(searchText)}
              clearButtonMode="while-editing"
              value={searchQuery}
            />
            {searchQuery && (
              <IonIcons
                onPress={() => {
                  setSearchQuery("");
                }}
                name="close-circle"
                size={24}
                color={globalTheme.colors.foreground}
                style={{ paddingHorizontal: 16 }}
              />
            )}
            {/* <TouchableOpacity
                        onPress={() => { setSearchQuery('') }}>
                        <View style={{ flex: 1, display: `${searchQuery ? 'flex' : 'none'}`, height: 36, width: 36, alignItems: 'center', justifyContent: 'center' }}>
                        </View>
                    </TouchableOpacity> */}
          </View>
          {/* <TouchableOpacity
                    onPress={() => { alert(`Feature on progress ...\n${searchQuery?.searchText}`) }}>
                    <View style={{ flex: 1, display: 'flex', height: 36, width: 36, alignItems: 'center', justifyContent: 'center' }}>
                        <IonIcons name='search-outline' size={24} color={globalTheme.colors.foreground} />
                    </View>
                </TouchableOpacity> */}
        </View>
        {/* {searchQuery && <SearchResultTab />} */}
        {searchQuery && (
          <>
            <TransactionsSearchResults
              searchQuery={searchQuery}
              onPress={({ transaction, selectedLogbook }) => {
                console.log(selectedLogbook);
                navigation.navigate(screenList.transactionPreviewScreen, {
                  transaction: transaction,
                  selectedLogbook: selectedLogbook,
                });
              }}
            />
          </>
        )}

        {!searchQuery && (
          <CustomScrollView
            contentContainerStyle={{
              flex: 1,
              minHeight: null,
              justifyContent: "center",
            }}
          >
            <IonIcons
              name="search"
              size={48}
              color={globalTheme.colors.secondary}
              style={{ padding: 16 }}
            />
            <TextSecondary label="Looking for something ?" />
          </CustomScrollView>
        )}
      </View>
    </>
  );
};

export default SearchScreen;
