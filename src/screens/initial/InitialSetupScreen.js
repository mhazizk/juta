import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableNativeFeedback,
  View,
} from "react-native";
import CountryFlag from "react-native-country-flag";
import { TouchableOpacity } from "react-native-gesture-handler";
import IonIcons from "react-native-vector-icons/Ionicons";
import { globalStyles } from "../../../src/assets/themes/globalStyles";
import APP_SETTINGS from "../../config/appSettings";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTransactions,
  useGlobalUserAccount,
} from "../../reducers/GlobalContext";
import { ACTIONS } from "../../reducers/GlobalReducer";
import persistStorage from "../../reducers/persist/persistStorage";
import PERSIST_ACTIONS from "../../reducers/persist/persist.actions";

// Image Import
import Onboarding from "react-native-onboarding-swiper";
import colorOfTheYear2022 from "../../../src/assets/img/colorOfTheYear2022.png";
import colorOfTheYear2023 from "../../../src/assets/img/colorOfTheYear2023.png";
import dark from "../../../src/assets/img/dark.png";
import doneSetup from "../../../src/assets/img/doneSetup.png";
import large from "../../../src/assets/img/large.png";
import light from "../../../src/assets/img/light.png";
import medium from "../../../src/assets/img/medium.png";
import small from "../../../src/assets/img/small.png";
import { lightTheme } from "../../../src/assets/themes/lightTheme";
import userCategories from "../../database/userCategories";
import initialCategories from "../../reducers/initial-state/InitialCategories";
import InitialSortedTransactions from "../../reducers/initial-state/InitialSortedTransactions";
import screenList from "../../navigations/ScreenList";
import REDUCER_ACTIONS from "../../reducers/reducer.action";

const InitialSetupScreen = ({ navigation }) => {
  const { transactions, dispatchTransactions } = useGlobalTransactions();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { userAccount, dispatchUSerAccount } = useGlobalUserAccount();
  const [selectedAppSettings, setSelectedAppSettings] = useState({
    theme: { name: "Light Theme", id: "light", style: lightTheme },
    fontSize: "medium",
    language: "english",
    locale: "es-UN",
    currency: { name: "IDR", symbol: "Rp", isoCode: "id" },
    screenHidden: [screenList.onboardingScreen, screenList.initialSetupScreen],
  });
  const [newLogbook, setNewLogbook] = useState({
    _timestamps: {
      created_at: null,
      updated_at: null,
    },
    _id: "12234",
    user_id: "haziz1",
    username: "mhazizk",
    logbook_currency: selectedAppSettings.currency,
    logbook_type: "basic",
    logbook_id: "logbook1",
    logbook_name: "",
    logbook_records: [],
    logbook_categories: [],
    __v: 0,
  });

  const onboardingRef = useRef(null);

  useEffect(() => {}, [appSettings, newLogbook]);

  const findImage = (data) => {
    switch (true) {
      // Theme Image
      case data === "light":
        return light;
      case data === "dark":
        return dark;
      case data === "colorOfTheYear2022":
        return colorOfTheYear2022;
      case data === "colorOfTheYear2023":
        return colorOfTheYear2023;

      // Font Size Image
      case data === "small":
        return small;
      case data === "medium":
        return medium;
      case data === "large":
        return large;

      default:
        return light;
    }
  };

  const selectedColor = (data) => {
    switch (true) {
      case data === "light":
        return "#000";
      case data === "dark":
        return "#eee";
      case data === "colorOfTheYear2022":
        return "#6463B1";
      case data === "colorOfTheYear2023":
        return "#BC2649";

      default:
        return "transparent";
    }
  };

  const finalizeSetup = async () => {
    // Check Logbook
    const logbookToDispatch = {
      _timestamps: {
        created_at: Date.now(),
        updated_at: Date.now(),
      },
      _id: newLogbook.logbook_id,
      user_id: newLogbook.user_id,
      username: newLogbook.username,
      logbook_currency: newLogbook.logbook_currency,
      logbook_type: "basic",
      logbook_id: newLogbook.logbook_id,
      logbook_name: newLogbook.logbook_name || "My Logbook",
      logbook_records: [],
      logbook_categories: [],
      __v: 0,
    };

    dispatchAppSettings({
      type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
      payload: selectedAppSettings,
    });

    dispatchCategories({
      type: ACTIONS.CATEGORIES.SET,
      payload: userCategories,
    });

    dispatchLogbooks({
      type: ACTIONS.LOGBOOKS.SET,
      payload: logbookToDispatch,
    });

    dispatchSortedTransactions({
      type: ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.INIT_SETUP,
      // type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.SET_MULTI_ACTIONS,
      payload: [
        {
          logbook_id: newLogbook.logbook_id,
          transactions: [],
        },
      ],
    });

    // dispatchSortedTransactions({
    // })

    // Save to storage
    const saveTransaction = await persistStorage.asyncStorage({
      action: PERSIST_ACTIONS.SET,
      key: "transactions",
      rawValue: [],
    });
    const saveCategories = await persistStorage.asyncStorage({
      action: PERSIST_ACTIONS.SET,
      key: "categories",
      rawValue: initialCategories,
    });
    const saveSortedTransactions = await persistStorage.asyncStorage({
      action: PERSIST_ACTIONS.SET,
      key: "sortedTrasactions",
      rawValue: InitialSortedTransactions,
    });
    const saveAppSettings = await persistStorage.asyncStorage({
      action: PERSIST_ACTIONS.SET,
      key: "appSettings",
      rawValue: selectedAppSettings,
    });

    Promise.all([
      saveCategories,
      saveTransaction,
      saveSortedTransactions,
      saveAppSettings,
    ]).then(() => {
      return navigation.navigate(screenList.bottomTabNavigator);
    });
  };

  const pages = [
    // TAG : Select Theme
    {
      backgroundColor:
        selectedAppSettings.theme.id === "dark" ? "#111" : "#fff",
      image: <Image />,
      title: (
        <>
          <Text
            style={{
              position: "absolute",
              top: "5%",
              color: selectedColor(selectedAppSettings.theme.id),
              fontSize: 30,
            }}
          >
            Select Theme
          </Text>
          <View
            style={{ flexDirection: "row", alignItems: "center", width: 200 }}
          >
            <FlatList
              data={APP_SETTINGS.THEME.OPTIONS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <>
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() => {
                        setSelectedAppSettings({
                          ...selectedAppSettings,
                          theme: item,
                        });
                        setTimeout(() => onboardingRef.current.goNext(), 1000);
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          borderRadius: 8,
                          borderWidth: 0,
                          minHeight: 100,
                          margin: 8,
                          overflow: "hidden",
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "column",
                            padding: 0,
                            margin: 0,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              alignItems: "center",
                              borderWidth: 4,
                              borderColor:
                                selectedAppSettings.theme.id === item.id
                                  ? selectedColor(item.id)
                                  : "transparent",
                              borderRadius: 18,
                              padding: 0,
                              margin: 0,
                            }}
                          >
                            <Image
                              source={findImage(item.id)}
                              style={{ width: 80, height: 80 }}
                            />
                          </View>
                          <Text
                            style={[
                              globalStyles.lightTheme.textPrimary,
                              { color: "#000" },
                            ]}
                          >
                            {item.name}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </>
                );
              }}
            />
          </View>
        </>
      ),
      subtitle: "",
    },

    // TAG : Select Font Size
    {
      backgroundColor:
        selectedAppSettings.theme.id === "dark" ? "#111" : "#fff",
      image: <Image />,
      title: (
        <>
          <Text
            style={{
              position: "absolute",
              top: "5%",
              color: selectedColor(selectedAppSettings.theme.id),
              fontSize: 30,
            }}
          >
            Select Font Size
          </Text>
          <View
            style={{ flexDirection: "row", alignItems: "center", width: 200 }}
          >
            <FlatList
              data={APP_SETTINGS.FONT_SIZE.OPTIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                return (
                  <>
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() => {
                        setSelectedAppSettings({
                          ...selectedAppSettings,
                          fontSize: item,
                        });
                        setTimeout(() => onboardingRef.current.goNext(), 1000);
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          borderRadius: 8,
                          borderWidth: 0,
                          minHeight: 100,
                          margin: 8,
                          overflow: "hidden",
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "column",
                            padding: 0,
                            margin: 0,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              alignItems: "center",
                              borderWidth: 4,
                              borderColor:
                                selectedAppSettings.fontSize === item
                                  ? selectedColor(selectedAppSettings.theme.id)
                                  : "transparent",
                              borderRadius: 18,
                              padding: 0,
                              margin: 0,
                            }}
                          >
                            <Image
                              source={findImage(item)}
                              style={{ width: 80, height: 80 }}
                            />
                          </View>
                          <Text
                            style={[
                              globalStyles.lightTheme.textPrimary,
                              {
                                color: "#000",
                                fontSize:
                                  item === "small"
                                    ? 12
                                    : item === "medium"
                                    ? 16
                                    : 32,
                              },
                            ]}
                          >
                            {item[0].toUpperCase() + item.substring(1)}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </>
                );
              }}
            />
          </View>
        </>
      ),
      subtitle: "",
    },

    // TAG : Select Currency
    {
      backgroundColor:
        selectedAppSettings.theme.id === "dark" ? "#111" : "#fff",
      image: <Image />,
      title: (
        <>
          <Text
            style={{
              position: "absolute",
              top: "5%",
              color: selectedColor(selectedAppSettings.theme.id),
              fontSize: 30,
            }}
          >
            Select Default Currency
          </Text>
          <View
            style={{ flexDirection: "row", alignItems: "center", width: 200 }}
          >
            <FlatList
              data={APP_SETTINGS.CURRENCY.OPTIONS}
              keyExtractor={(item) => item.isoCode}
              renderItem={({ item }) => {
                return (
                  <>
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() => {
                        setSelectedAppSettings({
                          ...selectedAppSettings,
                          currency: item,
                        });
                        setTimeout(() => onboardingRef.current.goNext(), 1000);
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          borderRadius: 8,
                          borderWidth: 0,
                          minHeight: 100,
                          margin: 8,
                          overflow: "hidden",
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "column",
                            padding: 0,
                            margin: 0,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <View
                            style={{
                              height: 80,
                              width: 80,
                              justifyContent: "center",
                              alignItems: "center",
                              borderWidth: 4,
                              borderColor:
                                selectedAppSettings.currency.isoCode ===
                                item.isoCode
                                  ? selectedColor(selectedAppSettings.theme.id)
                                  : "transparent",
                              borderRadius: 18,
                              padding: 0,
                              margin: 0,
                            }}
                          >
                            <CountryFlag isoCode={item.isoCode} size={32} />
                            {/* <Text style={{ fontSize: 24 }}>Rp</Text> */}
                          </View>
                          <Text
                            style={[
                              globalStyles.lightTheme.textPrimary,
                              { color: "#000" },
                            ]}
                          >
                            {item.name} / {item.symbol}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </>
                );
              }}
            />
          </View>
        </>
      ),
      subtitle: "",
    },

    // TAG : Create First Logbook
    {
      backgroundColor:
        selectedAppSettings.theme.id === "dark" ? "#111" : "#fff",
      image: <Image />,
      title: (
        <>
          <Text
            style={{
              paddingHorizontal: 16,
              position: "absolute",
              top: "5%",
              color: selectedColor(selectedAppSettings.theme.id),
              fontSize: 30,
            }}
          >
            Create Your First Logbook
          </Text>
          <Text
            style={{
              paddingHorizontal: 16,
              position: "absolute",
              top: "10%",
              textAlign: "center",
              color: selectedColor(selectedAppSettings.theme.id),
              fontSize: 18,
            }}
          >
            Logbook is a book to save your transactions, just like ordinary book
          </Text>
          <Text
            style={{
              paddingHorizontal: 16,
              position: "absolute",
              bottom: "5%",
              textAlign: "center",
              color: selectedColor(selectedAppSettings.theme.id),
              fontSize: 18,
            }}
          >
            Don't worry, you can edit it later
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(screenList.modalScreen, {
                title: "New Logbook",
                modalType: "textInput",
                placeholder: "Enter new logbook name ...",
                default: newLogbook.logbook_name || "",
                selected: (item) =>
                  setNewLogbook({
                    ...newLogbook,
                    logbook_name: item || "My Logbook",
                  }),
              })
            }
            style={{ padding: 48 }}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                width: 200,
              }}
            >
              <IonIcons name="book" size={80} />
              <Text
                style={{ fontSize: 24, color: "#000", textAlign: "center" }}
              >
                {newLogbook.logbook_name || "Create New Logbook"}
              </Text>
              {/* <TextInput
                            placeholder="Type new logbook name ..."
                            textAlign='center'
                            style={{ ...globalStyles.lightTheme.textPrimary }}
                            onChangeText={(text) => setNewLogbook({ ...newLogbook, logbook_name: text })}
                            value={newLogbook.logbook_name}
                        /> */}
            </View>
          </TouchableOpacity>
        </>
      ),
      subtitle: "",
    },

    {
      backgroundColor: "#fff",
      image: <Image source={doneSetup} style={{ width: 250, height: 250 }} />,
      title: "Everything is Set !",
      subtitle: "Finish Setup and start using Cash Log App",
    },
  ];

  return (
    <>
      <Onboarding
        ref={onboardingRef}
        transitionAnimationDuration={250}
        showSkip={false}
        onDone={() => {
          finalizeSetup();
        }}
        pages={pages}
      />
    </>
  );
};

export default InitialSetupScreen;
