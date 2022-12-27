import { useEffect, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import SearchResultTab from "../../components/SearchResultTab";
import { TextSecondary } from "../../components/Text";
import UserHeaderComponent from "../../components/UserHeader";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
} from "../../reducers/GlobalContext";
import GlobalSearchResultsScreen from "./GlobalSearchResultsScreen";

const SearchScreen = ({ navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
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
          backgroundColor: appSettings.theme.style.colors.background,
          height: "100%",
        }}
      >
        {/* Search Bar */}
        <View
          style={{
            display: "flex",
            backgroundColor: appSettings.theme.style.colors.header,
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
              borderColor: appSettings.theme.style.colors.primary,
              justifyContent: "space-between",
              borderRadius: 8,
              borderWidth: 1,
              backgroundColor: appSettings.theme.style.colors.background,
            }}
          >
            <IonIcons
              name="search"
              size={24}
              color={appSettings.theme.style.colors.primary}
              style={{ paddingHorizontal: 16 }}
            />
            <TextInput
              ref={inputRef}
              returnKeyType="search"
              placeholder="I am looking for ..."
              placeholderTextColor={
                appSettings.theme.style.text.textSecondary.color
              }
              style={{
                ...appSettings.theme.style.text.textPrimary,
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
                color={appSettings.theme.style.colors.foreground}
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
                        <IonIcons name='search-outline' size={24} color={appSettings.theme.style.colors.foreground} />
                    </View>
                </TouchableOpacity> */}
        </View>
        {/* {searchQuery && <SearchResultTab />} */}
        {searchQuery && (
          <GlobalSearchResultsScreen
            searchQuery={searchQuery}
            onPress={({ transaction, selectedLogbook }) => {
              console.log(selectedLogbook);
              navigation.navigate("Transaction Preview Screen", {
                transaction: transaction,
                selectedLogbook: selectedLogbook,
              });
            }}
          />
        )}
        {/* {console.log(searchQuery)} */}

        {!searchQuery && (
          <ScrollView
            contentContainerStyle={{
              backgroundColor: appSettings.theme.style.colors.background,
              height: "100%",
            }}
          >
            <View
              style={{
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IonIcons
                name="search"
                size={48}
                color={appSettings.theme.style.colors.secondary}
                style={{ padding: 16 }}
              />
              <TextSecondary label="Looking for something ?" />
            </View>
          </ScrollView>
        )}
      </View>
    </>
  );
};

export default SearchScreen;
