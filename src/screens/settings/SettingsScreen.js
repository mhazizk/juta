import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import CheckList from "../../components/CheckList";
import { ListItem } from "../../components/List";
import RadioButtonList from "../../components/List/RadioButtonList";
import { TextPrimary } from "../../components/Text";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalCurrencyRates,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../reducers/GlobalContext";
import REDUCER_ACTIONS from "../../reducers/reducer.action";
import * as utils from "../../utils";
import SettingsHeaderList from "../../components/List/SettingsHeaderList";
import ListSection from "../../components/List/ListSection";
import Animated from "react-native-reanimated";
import getCurrencyRate from "../../api/rapidapi/getCurrencyRate";
import SUBSCRIPTION_LIMIT from "../../features/subscription/model/subscriptionLimit";
import getSubscriptionLimit from "../../features/subscription/logic/getSubscriptionLimit";
import firestore from "../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../api/firebase/firestoreCollectionNames";
import THEME_CONSTANTS from "../../constants/themeConstants";
import CustomScrollView from "../../shared-components/CustomScrollView";
import NEGATIVE_CURRENCY_SYMBOL_CONSTANTS from "../../constants/negativeCurrencySymbolConstants";
import LANGUAGE_CONSTANTS from "../../constants/languageConstants";
import CURRENCY_CONSTANTS from "../../constants/currencyConstants";
import FONT_SIZE_CONSTANTS from "../../constants/fontSizeConstants";
import LOGBOOK_SETTINGS_CONSTANTS from "../../constants/logbookSettingsConstants";

const SettingsScreen = ({ navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { globalTheme, dispatchGlobalTheme } = useGlobalTheme();
  const { globalCurrencyRates, dispatchGlobalCurrencyRates } =
    useGlobalCurrencyRates();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const [dashboardSettings, setDashboardSettings] = useState(
    appSettings.dashboardSettings
  );
  const [searchSettings, setSearchSettings] = useState(
    appSettings.searchSettings
  );
  const [logbookSettings, setLogbookSettings] = useState(
    appSettings.logbookSettings
  );
  const [currencyRates, setCurrencyRates] = useState(globalCurrencyRates);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log({ currencyRates });
    // setTimeout(() => {
    //   dispatchGlobalCurrencyRates({
    //     type: REDUCER_ACTIONS.CURRENCY_RATES.SET_MULTI_ACTIONS,
    //     payload: currencyRates,
    //   });
    // }, 1);
    // setTimeout(async () => {
    //   await firestore.setData(
    //     FIRESTORE_COLLECTION_NAMES.CURRENCY_RATES,
    //     userAccount.uid,
    //     currencyRates
    //   );
    // }, 1000);
  }, [currencyRates]);

  useEffect(() => {
    const payload = {
      logbookSettings: logbookSettings,
      _timestamps: {
        ...appSettings._timestamps,
        updated_at: Date.now(),
        updated_by: userAccount.uid,
      },
    };
    setTimeout(() => {
      dispatchAppSettings({
        type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
        payload: payload,
      });
    }, 1);
    setTimeout(async () => {
      await firestore.setData(
        FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
        appSettings.uid,
        { ...appSettings, ...payload }
      );
    }, 1000);
  }, [logbookSettings]);

  useEffect(() => {
    const payload = {
      dashboardSettings: dashboardSettings,
      _timestamps: {
        ...appSettings._timestamps,
        updated_at: Date.now(),
        updated_by: userAccount.uid,
      },
    };
    setTimeout(() => {
      dispatchAppSettings({
        type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
        payload: payload,
      });
    }, 1);
    setTimeout(async () => {
      await firestore.setData(
        FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
        appSettings.uid,
        { ...appSettings, ...payload }
      );
    }, 1000);
  }, [dashboardSettings]);

  useEffect(() => {
    const payload = {
      searchSettings: searchSettings,
      _timestamps: {
        ...appSettings._timestamps,
        updated_at: Date.now(),
        updated_by: userAccount.uid,
      },
    };
    setTimeout(() => {
      dispatchAppSettings({
        type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
        payload: payload,
      });
    }, 1);
    setTimeout(async () => {
      await firestore.setData(
        FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
        appSettings.uid,
        { ...appSettings, ...payload }
      );
    }, 1000);
  }, [searchSettings]);

  // useEffect(() => {
  // }, [appSettings?.theme_id]);

  useEffect(() => {
    console.log(currencyRates);
  }, [currencyRates]);
  return (
    <>
      <CustomScrollView>
        {/* // SECTION : Personalization Section */}
        {appSettings && (
          <>
            <SettingsHeaderList
              label="Personalization"
              iconName="color-palette"
            />
            {/* // TAG : Other */}
            <ListSection>
              {/* // TAG : App Theme */}
              <ListItem
                pressable
                leftLabel="Theme"
                rightLabel={globalTheme.identifier.name}
                iconLeftName="contrast"
                iconPack="IonIcons"
                onPress={() =>
                  navigation.navigate(screenList.modalScreen, {
                    title: "Select Theme",
                    modalType: "list",
                    iconProps: {
                      name: "contrast",
                      pack: "IonIcons",
                    },
                    props: THEME_CONSTANTS.OPTIONS.map((theme) => theme),
                    defaultOption: THEME_CONSTANTS.OPTIONS.find((theme) => {
                      return theme.id === appSettings.theme_id;
                    }),
                    selected: (item) => {
                      const payload = {
                        theme_id: item.id,
                        _timestamps: {
                          ...appSettings._timestamps,
                          updated_at: Date.now(),
                          updated_by: userAccount.uid,
                        },
                      };
                      dispatchGlobalTheme({
                        type: REDUCER_ACTIONS.THEME.SET,
                        payload: item.id,
                      });
                      setTimeout(() => {
                        dispatchAppSettings({
                          type: REDUCER_ACTIONS.APP_SETTINGS.THEME.SET,
                          payload: item.id,
                        });
                      }, 1);
                      setTimeout(async () => {
                        await firestore.setData(
                          FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
                          appSettings.uid,
                          { ...appSettings, ...payload }
                        );
                      }, 1000);
                    },
                  })
                }
              />

              {/* // TAG : Font Size */}
              {/* <ListItem
                pressable
                leftLabel="Font Size"
                rightLabel={
                  appSettings.fontSize[0].toUpperCase() +
                  appSettings.fontSize.substring(1)
                }
                iconLeftName="text"
                iconPack="IonIcons"
                onPress={() =>
                  navigation.navigate(screenList.modalScreen, {
                    title: "Font Size",
                    modalType: "list",
                    props: FONT_SIZE_CONSTANTS.OPTIONS.map((option) => {
                      return { name: option };
                    }),
                    selected: (item) =>
                      dispatchAppSettings({
                        type: REDUCER_ACTIONS.FONT_SIZE_CONSTANTS.SET,
                        payload: item.name,
                      }),
                    defaultOption: { name: appSettings.fontSize },
                  })
                }
              /> */}

              {/* // TAG : Language */}
              <ListItem
                pressable
                leftLabel="Language"
                rightLabel={
                  appSettings.language[0].toUpperCase() +
                  appSettings.language.substring(1)
                }
                iconLeftName="language"
                iconPack="IonIcons"
                onPress={() =>
                  navigation.navigate(screenList.modalScreen, {
                    title: "Language",
                    modalType: "list",
                    props: LANGUAGE_CONSTANTS.OPTIONS.map((option) => {
                      return { name: option.name, locale: option.locale };
                    }),
                    selected: (item) => {
                      // TODO : Add Language Support
                      // dispatchAppSettings({
                      //   type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
                      //   payload: {
                      //     language: item.name,
                      //     locale: item.locale,
                      //   },
                      // });
                    },
                    defaultOption: { name: appSettings.language },
                  })
                }
              />
            </ListSection>
          </>
        )}

        {/* // TODO : Hide Dashboard Section for next release */}
        {/* // SECTION : Dashboard Section */}
        {dashboardSettings && (
          <>
            {/* <SettingsHeaderList
              label="Dashboard Settings"
              iconName="analytics"
            />
            <ListSection> */}
            {/* // TAG : Show Recent Transactions */}
            {/* <CheckList
                primaryLabel="Show Recent Transactions"
                item={true}
                selected={dashboardSettings.showRecentTransactions}
                onPress={() => {
                  setDashboardSettings({
                    ...dashboardSettings,
                    showRecentTransactions:
                      !dashboardSettings.showRecentTransactions,
                  });
                }}
              /> */}
            {/* // TAG : Show Total Expense Widget  */}
            {/* <CheckList
                primaryLabel="Show Total Expense Widget"
                item={true}
                selected={dashboardSettings.showTotalExpenseWidget}
                onPress={() => {
                  setDashboardSettings({
                    ...dashboardSettings,
                    showTotalExpenseWidget:
                      !dashboardSettings.showTotalExpenseWidget,
                  });
                }}
              /> */}
            {/* // TAG : Show Total Income Widget  */}
            {/* <CheckList
                primaryLabel="Show Total Income Widget"
                item={true}
                selected={dashboardSettings.showTotalIncomeWidget}
                onPress={() => {
                  setDashboardSettings({
                    ...dashboardSettings,
                    showTotalIncomeWidget:
                      !dashboardSettings.showTotalIncomeWidget,
                  });
                }}
              /> */}
            {/* // TAG : Show Total Balance Widget  */}
            {/* <CheckList
                primaryLabel="Show Total Balance Widget"
                item={true}
                selected={dashboardSettings.showTotalBalanceWidget}
                onPress={() => {
                  setDashboardSettings({
                    ...dashboardSettings,
                    showTotalBalanceWidget:
                      !dashboardSettings.showTotalBalanceWidget,
                  });
                }}
              /> */}
            {/* // TAG : Show My Budgets Widget  */}
            {/* <CheckList
                primaryLabel="Show My Budgets Widget"
                item={true}
                selected={dashboardSettings.showMyBudgetsWidget}
                onPress={() => {
                  setDashboardSettings({
                    ...dashboardSettings,
                    showMyBudgetsWidget: !dashboardSettings.showMyBudgetsWidget,
                  });
                }}
              /> */}
            {/* // TAG : Show My Logbooks Widget  */}
            {/* <CheckList
                primaryLabel="Show My Logbooks Widget"
                item={true}
                selected={dashboardSettings.showMyLogbooksWidget}
                onPress={() => {
                  setDashboardSettings({
                    ...dashboardSettings,
                    showMyLogbooksWidget:
                      !dashboardSettings.showMyLogbooksWidget,
                  });
                }}
              />
            </ListSection> */}
          </>
        )}

        {/* // TODO : Hide Search Section for next release */}
        {/* // SECTION : Search Section */}
        {searchSettings && (
          <>
            {/* <SettingsHeaderList label="Search Settings" iconName="search" />
            <ListSection> */}
            {/* // TAG : Transactions Search*/}
            {/* <CheckList
                primaryLabel="Transactions"
                item={true}
                selected={searchSettings.showTransactionsResult}
                onPress={() => {
                  setSearchSettings({
                    ...searchSettings,
                    showTransactionsResult:
                      !searchSettings.showTransactionsResult,
                  });
                }}
              /> */}
            {/* // TAG : Settings Search */}
            {/* <CheckList
                primaryLabel="Settings"
                item={true}
                selected={searchSettings.showSettingsResult}
                onPress={() => {
                  setSearchSettings({
                    ...searchSettings,
                    showSettingsResult: !searchSettings.showSettingsResult,
                  });
                }}
              />
            </ListSection> */}
          </>
        )}

        {/* // SECTION : Logbook Section */}
        {logbookSettings && (
          <>
            <SettingsHeaderList label="Logbook Settings" iconName="book" />
            {/* // TAG : Default Currency */}
            <TextPrimary
              label="Currency"
              style={{
                alignSelf: "flex-start",
                paddingHorizontal: 16,
                paddingBottom: 16,
              }}
            />
            <ListSection>
              {/* // TAG : Main currency */}
              <ListItem
                onPress={() => {
                  navigation.navigate(screenList.modalScreen, {
                    title: "Set default currency",
                    modalType: "currencyList",
                    props: CURRENCY_CONSTANTS.OPTIONS.sort((a, b) => {
                      return a.name > b.name ? 1 : -1;
                    }),
                    selected: (item) => {
                      setLogbookSettings({
                        ...logbookSettings,
                        defaultCurrency: item,
                      });
                    },
                    defaultOption: logbookSettings.defaultCurrency,
                  });
                }}
                pressable
                iconLeftName="usd"
                leftLabel="Set default currency"
                rightLabel={
                  logbookSettings.defaultCurrency.name +
                  " / " +
                  logbookSettings.defaultCurrency.symbol
                }
              />

              {/* // TAG : Secondary Currency */}
              <ListItem
                onPress={() => {
                  navigation.navigate(screenList.modalScreen, {
                    title: "Set secondary currency",
                    modalType: "currencyList",
                    props: CURRENCY_CONSTANTS.OPTIONS.sort((a, b) => {
                      return a.name > b.name ? 1 : -1;
                    }),
                    selected: (item) => {
                      setLogbookSettings({
                        ...logbookSettings,
                        secondaryCurrency: item,
                      });
                    },
                    defaultOption: logbookSettings.secondaryCurrency,
                  });
                }}
                pressable
                iconLeftName="usd"
                leftLabel="Set secondary currency"
                rightLabel={
                  logbookSettings.secondaryCurrency.name +
                  " / " +
                  logbookSettings.secondaryCurrency.symbol
                }
              />
              {/* // TAG : Show secondary currency */}
              <CheckList
                pressable={getSubscriptionLimit(
                  userAccount.subscription.plan,
                  SUBSCRIPTION_LIMIT.SECONDARY_CURRENCY
                )}
                disabled={
                  !getSubscriptionLimit(
                    userAccount.subscription.plan,
                    SUBSCRIPTION_LIMIT.SECONDARY_CURRENCY
                  )
                }
                primaryLabel="Show secondary currency"
                secondaryLabel="This will show the default currency as secondary currency in the Logbook screen."
                item={true}
                selected={logbookSettings.showSecondaryCurrency}
                onPress={() => {
                  if (
                    getSubscriptionLimit(
                      userAccount.subscription.plan,
                      SUBSCRIPTION_LIMIT.SECONDARY_CURRENCY
                    )
                  ) {
                    setLogbookSettings({
                      ...logbookSettings,
                      showSecondaryCurrency:
                        !logbookSettings.showSecondaryCurrency,
                    });
                  } else {
                    Alert.alert(
                      "Upgrade your subscription",
                      "This feature is only available for premium users. Please upgrade your subscription to unlock this feature.",
                      [
                        { text: "Cancel", onPress: () => {}, style: "cancel" },
                        {
                          text: "Upgrade",
                          onPress: () => {
                            navigation.navigate(screenList.paywallScreen);
                          },
                        },
                      ]
                    );
                  }
                }}
              />

              {/* // TAG : Update Currency Rates */}
              <ListItem
                pressable
                leftLabel="Update currency rates"
                rightLabel={
                  isLoading
                    ? "Updating... "
                    : "Last updated at : " +
                      new Date(currencyRates._timestamps.updated_at).getDate() +
                      "/" +
                      (new Date(
                        currencyRates._timestamps.updated_at
                      ).getMonth() +
                        1) +
                      "/" +
                      new Date(
                        currencyRates._timestamps.updated_at
                      ).getFullYear()
                }
                isLoading={isLoading}
                onPress={() => {
                  setIsLoading(true);
                  getCurrencyRate(globalCurrencyRates.data).then((data) => {
                    setCurrencyRates({
                      ...globalCurrencyRates,
                      data: data,
                      _timestamps: {
                        ...globalCurrencyRates._timestamps,
                        updated_at: Date.now(),
                        updated_by: userAccount.uid,
                      },
                    });
                    setIsLoading(false);
                  });
                }}

                // TODO : Add currency rate screen
              />

              {/* // TAG : Negative currency */}
              <ListItem
                pressable
                iconLeftName="usd"
                leftLabel="Negative currency symbol"
                rightLabel={utils.getFormattedNumber({
                  value: -123,
                  currencyIsoCode: logbookSettings.defaultCurrency.isoCode,
                  negativeSymbol:
                    appSettings.logbookSettings.negativeCurrencySymbol,
                })}
                onPress={() => {
                  navigation.navigate(screenList.modalScreen, {
                    title: "Set negative currency symbol",
                    modalType: "list",
                    props: NEGATIVE_CURRENCY_SYMBOL_CONSTANTS.OPTIONS,
                    defaultOption:
                      NEGATIVE_CURRENCY_SYMBOL_CONSTANTS.OPTIONS.find(
                        (item) => {
                          return (
                            item.id === logbookSettings.negativeCurrencySymbol
                          );
                        }
                      ),
                    selected: (item) => {
                      setLogbookSettings({
                        ...logbookSettings,
                        negativeCurrencySymbol: item.id,
                      });
                    },
                  });
                }}
              />
            </ListSection>

            {/* // TAG : Daily Summary */}
            <TextPrimary
              label="Daily Summary"
              style={{
                alignSelf: "flex-start",
                paddingHorizontal: 16,
                paddingBottom: 16,
              }}
            />
            <ListSection>
              <RadioButtonList
                items={LOGBOOK_SETTINGS_CONSTANTS.DAILY_SUMMARY.OPTIONS.map(
                  (option) => {
                    return {
                      name: utils.FormatHyphenInStrings(option),
                      value: option,
                    };
                  }
                )}
                selected={logbookSettings.dailySummary}
                onChange={(item) => {
                  setLogbookSettings({
                    ...logbookSettings,
                    dailySummary: item.value,
                  });
                }}
              />
            </ListSection>
            {/* // TAG : Other */}
            <ListSection>
              {/* // TAG : Show Transaction Time */}
              <CheckList
                pressable
                primaryLabel="Show transaction time"
                item={true}
                selected={logbookSettings.showTransactionTime}
                onPress={() => {
                  setLogbookSettings({
                    ...logbookSettings,
                    showTransactionTime: !logbookSettings.showTransactionTime,
                  });
                }}
              />
              {/* // TAG : Show Transaction Notes */}
              <CheckList
                pressable
                item={true}
                primaryLabel="Show transaction notes"
                selected={logbookSettings.showTransactionNotes}
                onPress={() => {
                  setLogbookSettings({
                    ...logbookSettings,
                    showTransactionNotes: !logbookSettings.showTransactionNotes,
                  });
                }}
              />
            </ListSection>
          </>
        )}
      </CustomScrollView>
    </>
  );
};

export default SettingsScreen;
