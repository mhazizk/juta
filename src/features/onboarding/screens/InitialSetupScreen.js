import { useEffect, useRef, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import CountryFlag from "react-native-country-flag";
import { TouchableOpacity } from "react-native-gesture-handler";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalCategories,
  useGlobalCurrencyRates,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";

// Image Import
import Onboarding from "react-native-onboarding-swiper";
import doneSetup from "../../../../src/assets/img/doneSetup.png";
import large from "../../../../src/assets/img/large.png";
import medium from "../../../../src/assets/img/medium.png";
import small from "../../../../src/assets/img/small.png";
import screenList from "../../../navigations/ScreenList";
import REDUCER_ACTIONS from "../../../reducers/reducer.action";
import uuid from "react-native-uuid";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import categoriesFallback from "../../../reducers/fallback-state/categoriesFallback";
import THEME_CONSTANTS from "../../../constants/themeConstants";
import appSettingsFallback from "../../../reducers/fallback-state/appSettingsFallback";
import CURRENCY_CONSTANTS from "../../../constants/currencyConstants";
import getCurrencyRate from "../../../api/rapidapi/getCurrencyRate";
import initialGlobalCurrencyRates from "../../../reducers/initial-state/initialGlobalCurrencyRates";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import Loading from "../../../components/Loading";
import { TextPrimary } from "../../../components/Text";

const InitialSetupScreen = ({ route, navigation }) => {
  const userId = uuid.v4();
  const logbookId = uuid.v4();
  const onboardingRef = useRef(null);

  // const { transactions, dispatchTransactions } = useGlobalTransactions();
  const { logbooks, dispatchLogbooks } = useGlobalLogbooks();
  const { categories, dispatchCategories } = useGlobalCategories();
  const { globalCurrencyRates, dispatchGlobalCurrencyRates } =
    useGlobalCurrencyRates();
  const { sortedTransactions, dispatchSortedTransactions } =
    useGlobalSortedTransactions();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { globalTheme, dispatchGlobalTheme } = useGlobalTheme();
  const { userAccount, dispatchUSerAccount } = useGlobalUserAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAppSettings, setSelectedAppSettings] = useState({
    ...appSettingsFallback,
    uid: userAccount.uid,
    _timestamps: {
      created_at: Date.now(),
      created_by: userAccount.uid,
      updated_at: Date.now(),
      updated_by: userAccount.uid,
    },
  });
  const [newLogbook, setNewLogbook] = useState({
    _timestamps: {
      created_at: null,
      created_by: userAccount.uid,
      updated_by: userAccount.uid,
      updated_at: null,
    },
    uid: userAccount.uid,
    logbook_currency: selectedAppSettings.logbookSettings.defaultCurrency,
    logbook_type: "basic",
    logbook_id: logbookId,
    logbook_name: "",
    logbook_records: [],
    logbook_categories: [],
    group_id: null,
  });

  useEffect(() => {
    setTimeout(() => {
      dispatchGlobalTheme({
        type: REDUCER_ACTIONS.THEME.SET,
        payload: selectedAppSettings.theme_id,
      });
    }, 1);
  }, [selectedAppSettings.theme_id]);

  useEffect(() => {
    setNewLogbook({
      ...newLogbook,
      logbook_currency: selectedAppSettings.logbookSettings.defaultCurrency,
    });
  }, [selectedAppSettings.logbookSettings.defaultCurrency]);

  useEffect(() => {
    console.log(JSON.stringify(userAccount, null, 2));
  }, [userAccount]);

  const findThemeIcon = (themeId) => {
    return THEME_CONSTANTS.OPTIONS.find((theme) => {
      return theme.id === themeId;
    }).icon;
  };

  const findFontIcon = (fontSize) => {
    switch (true) {
      // Font Size Image
      case fontSize === "small":
        return small;
      case fontSize === "medium":
        return medium;
      case fontSize === "large":
        return large;

      default:
        return medium;
    }
  };

  const finalizeSetup = () => {
    setIsLoading(true);
    setTimeout(async () => {
      // Check Logbook
      const logbookToDispatch = {
        ...newLogbook,
        logbook_name: newLogbook.logbook_name || "My Logbook",
        _timestamps: {
          ...newLogbook._timestamps,
          created_at: Date.now(),
          updated_at: Date.now(),
        },
      };

      // const logbookToDispatch = {
      //   _timestamps: {
      //     created_at: Date.now(),
      //     updated_at: Date.now(),
      //   },
      //   _id: newLogbook.logbook_id,
      //   uid: newLogbook.uid,
      //   logbook_currency: newLogbook.logbook_currency,
      //   logbook_type: "basic",
      //   logbook_id: newLogbook.logbook_id,
      //   logbook_name: newLogbook.logbook_name || "My Logbook",
      //   logbook_records: [],
      //   logbook_categories: [],
      //   __v: 0,
      // };

      dispatchAppSettings({
        type: REDUCER_ACTIONS.APP_SETTINGS.FORCE_SET,
        payload: selectedAppSettings,
      });

      const newCategories = categoriesFallback({
        uid: userAccount.uid,
      });

      dispatchCategories({
        type: REDUCER_ACTIONS.CATEGORIES.SET,
        payload: newCategories,
      });

      dispatchLogbooks({
        type: REDUCER_ACTIONS.LOGBOOKS.SET,
        payload: logbookToDispatch,
      });

      dispatchSortedTransactions({
        type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.INIT_SETUP,
        payload: [
          {
            logbook_id: newLogbook.logbook_id,
            transactions: [],
          },
        ],
      });
      const newCurrencyRateList = await getCurrencyRate(
        globalCurrencyRates.data
      );

      const currencyRatesToDispatch = {
        ...initialGlobalCurrencyRates,
        uid: userAccount.uid,
        data: newCurrencyRateList,
        _timestamps: {
          created_at: Date.now(),
          created_by: userAccount.uid,
          updated_at: Date.now(),
          updated_by: userAccount.uid,
        },
      };
      dispatchGlobalCurrencyRates({
        type: REDUCER_ACTIONS.CURRENCY_RATES.FORCE_SET,
        payload: currencyRatesToDispatch,
      });

      const saveCategories = await firestore.setData(
        FIRESTORE_COLLECTION_NAMES.CATEGORIES,
        userAccount.uid,
        newCategories
        // initialCategories.categories
      );

      const saveAppSettings = await firestore.setData(
        FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
        userAccount.uid,
        selectedAppSettings
      );

      const saveLogbook = await firestore.setData(
        FIRESTORE_COLLECTION_NAMES.LOGBOOKS,
        logbookToDispatch.logbook_id,
        logbookToDispatch
      );

      const saveCurrencyRates = await firestore.setData(
        FIRESTORE_COLLECTION_NAMES.CURRENCY_RATES,
        userAccount.uid,
        currencyRatesToDispatch
      );

      Promise.all([
        saveCategories,
        saveLogbook,
        saveAppSettings,
        saveCurrencyRates,
      ])
        .then(() => {
          return navigation.replace(screenList.splashScreen, {
            fromScreen: screenList.initialSetupScreen,
            targetScreen: screenList.bottomTabNavigator,
          });
        })
        .catch((err) => {
          alert(err);
        });
    }, 1);
  };

  const pages = [
    // TAG : Select Theme
    {
      backgroundColor:
        // selectedAppSettings.theme_id === "dark" ? "#111" : "#fff",
        globalTheme.colors.background,
      image: <Image />,
      title: (
        <>
          <Text
            style={{
              position: "absolute",
              top: "5%",
              color: globalTheme.colors.primary,
              // color: selectedColor(selectedAppSettings.theme_id),
              fontSize: 30,
            }}
          >
            Select Theme
          </Text>
          <View
            style={{ flexDirection: "row", alignItems: "center", width: 200 }}
          >
            <FlatList
              data={THEME_CONSTANTS.OPTIONS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <>
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() => {
                        setSelectedAppSettings({
                          ...selectedAppSettings,
                          theme_id: item.id,
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
                                selectedAppSettings.theme_id === item.id
                                  ? globalTheme.colors.primary
                                  : "transparent",
                              borderRadius: 18,
                              padding: 0,
                              margin: 0,
                            }}
                          >
                            <Image
                              source={findThemeIcon(item.id)}
                              style={{ width: 80, height: 80 }}
                            />
                          </View>
                          <TextPrimary
                            label={item.name}
                            style={{
                              paddingTop:
                                selectedAppSettings.theme_id === item.id
                                  ? 8
                                  : 0,
                            }}
                          />
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
    // {
    //   backgroundColor:
    //     selectedAppSettings.theme_id === "dark" ? "#111" : "#fff",
    //   image: <Image />,
    //   title: (
    //     <>
    //       <Text
    //         style={{
    //           position: "absolute",
    //           top: "5%",
    //           color: selectedColor(selectedAppSettings.theme_id),
    //           fontSize: 30,
    //         }}
    //       >
    //         Select Font Size
    //       </Text>
    //       <View
    //         style={{ flexDirection: "row", alignItems: "center", width: 200 }}
    //       >
    //         <FlatList
    //           data={APP_SETTINGS.FONT_SIZE.OPTIONS}
    //           keyExtractor={(item) => item}
    //           renderItem={({ item }) => {
    //             return (
    //               <>
    //                 <TouchableOpacity
    //                   style={{ flex: 1 }}
    //                   onPress={() => {
    //                     setSelectedAppSettings({
    //                       ...selectedAppSettings,
    //                       fontSize: item,
    //                     });
    //                     setTimeout(() => onboardingRef.current.goNext(), 1000);
    //                   }}
    //                 >
    //                   <View
    //                     style={{
    //                       flex: 1,
    //                       borderRadius: 8,
    //                       borderWidth: 0,
    //                       minHeight: 100,
    //                       margin: 8,
    //                       overflow: "hidden",
    //                     }}
    //                   >
    //                     <View
    //                       style={{
    //                         flex: 1,
    //                         flexDirection: "column",
    //                         padding: 0,
    //                         margin: 0,
    //                         alignItems: "center",
    //                         justifyContent: "center",
    //                       }}
    //                     >
    //                       <View
    //                         style={{
    //                           flex: 1,
    //                           justifyContent: "center",
    //                           alignItems: "center",
    //                           borderWidth: 4,
    //                           borderColor:
    //                             selectedAppSettings.fontSize === item
    //                               ? selectedColor(selectedAppSettings.theme_id)
    //                               : "transparent",
    //                           borderRadius: 18,
    //                           padding: 0,
    //                           margin: 0,
    //                         }}
    //                       >
    //                         <Image
    //                           source={findFontIcon(item)}
    //                           style={{ width: 80, height: 80 }}
    //                         />
    //                       </View>
    //                       <Text
    //                         style={[
    //                           globalStyles.lightTheme.textPrimary,
    //                           {
    //                             color: "#000",
    //                             fontSize:
    //                               item === "small"
    //                                 ? 12
    //                                 : item === "medium"
    //                                 ? 16
    //                                 : 32,
    //                           },
    //                         ]}
    //                       >
    //                         {item[0].toUpperCase() + item.substring(1)}
    //                       </Text>
    //                     </View>
    //                   </View>
    //                 </TouchableOpacity>
    //               </>
    //             );
    //           }}
    //         />
    //       </View>
    //     </>
    //   ),
    //   subtitle: "",
    // },

    // TAG : Select Default Currency
    {
      backgroundColor:
        // selectedAppSettings.theme_id === "dark" ? "#111" : "#fff",
        globalTheme.colors.background,
      image: <Image />,
      title: (
        <>
          <Text
            style={{
              position: "absolute",
              top: "5%",
              color: globalTheme.colors.primary,
              // color: selectedColor(selectedAppSettings.theme_id),
              fontSize: 30,
            }}
          >
            Select Default Currency
          </Text>
          <View
            style={{ flexDirection: "row", alignItems: "center", width: 200 }}
          >
            <FlatList
              data={CURRENCY_CONSTANTS.OPTIONS.sort((a, b) => {
                return a.name.localeCompare(b.name);
              })}
              keyExtractor={(item) => item.isoCode}
              renderItem={({ item }) => {
                return (
                  <>
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() => {
                        setSelectedAppSettings({
                          ...selectedAppSettings,
                          logbookSettings: {
                            ...selectedAppSettings.logbookSettings,
                            defaultCurrency: item,
                          },
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
                                selectedAppSettings.logbookSettings
                                  .defaultCurrency.isoCode === item.isoCode
                                  ? globalTheme.colors.primary
                                  : "transparent",
                              borderRadius: 18,
                              padding: 0,
                              margin: 0,
                            }}
                          >
                            <CountryFlag isoCode={item.isoCode} size={32} />
                            {/* <Text style={{ fontSize: 24 }}>Rp</Text> */}
                          </View>
                          <TextPrimary
                            label={`${item.name} / ${item.symbol}`}
                            style={{
                              paddingTop:
                                selectedAppSettings.logbookSettings
                                  .defaultCurrency.isoCode === item.isoCode
                                  ? 8
                                  : 0,
                            }}
                          />
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
        // selectedAppSettings.theme_id === "dark" ? "#111" : "#fff",
        globalTheme.colors.background,
      image: <Image />,
      title: (
        <>
          <Text
            style={{
              paddingHorizontal: 16,
              position: "absolute",
              top: "5%",
              color: globalTheme.colors.primary,
              // color: selectedColor(selectedAppSettings.theme_id),
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
              color: globalTheme.colors.primary,
              // color: selectedColor(selectedAppSettings.theme_id),
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
              color: globalTheme.colors.primary,
              // color: selectedColor(selectedAppSettings.theme_id),
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
                defaultOption: newLogbook.logbook_name || "",
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
              <IonIcons
                name="book"
                size={80}
                color={globalTheme.colors.foreground}
              />
              <Text
                style={[
                  {
                    ...globalTheme.text.textPrimary,
                  },
                  {
                    paddingVertical: 16,
                    fontSize: 24,
                    textAlign: "center",
                  },
                ]}
              >
                {newLogbook.logbook_name || "Create New Logbook"}
              </Text>
              <IonIcons
                name="add"
                size={32}
                color={globalTheme.colors.foreground}
              />
            </View>
          </TouchableOpacity>
        </>
      ),
      subtitle: "",
    },

    {
      backgroundColor: globalTheme.colors.background,
      image: <Image source={doneSetup} style={{ width: 250, height: 250 }} />,
      title: "Everything is Set !",
      subtitle: "Finish Setup and start using Juta App",
    },
  ];

  return (
    <>
      {!isLoading && (
        <Onboarding
          ref={onboardingRef}
          transitionAnimationDuration={250}
          showSkip={false}
          onDone={() => {
            finalizeSetup();
          }}
          pages={pages}
        />
      )}
      {isLoading && (
        <CustomScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Loading />
          <TextPrimary label="Finishing Setup..." />
        </CustomScrollView>
      )}
    </>
  );
};

export default InitialSetupScreen;
