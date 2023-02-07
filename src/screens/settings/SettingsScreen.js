import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import CheckList from "../../components/CheckList";
import { ListItem } from "../../components/List";
import RadioButtonList from "../../components/List/RadioButtonList";
import { TextPrimary } from "../../components/Text";
import APP_SETTINGS from "../../config/appSettings";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalTheme,
  useGlobalUserAccount,
} from "../../reducers/GlobalContext";
import REDUCER_ACTIONS from "../../reducers/reducer.action";
import * as utils from "../../utils";
import SettingsHeaderList from "../../components/List/SettingsHeaderList";
import ListSection from "../../components/List/ListSection";
import Animated from "react-native-reanimated";
import getCurrencyRate from "../../api/GetCurrencyRate";
import SUBSCRIPTION_LIMIT from "../../features/subscription/model/subscriptionLimit";
import getSubscriptionLimit from "../../features/subscription/logic/getSubscriptionLimit";
import firestore from "../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../api/firebase/firestoreCollectionNames";
import THEME_CONSTANTS from "../../constants/themeConstants";
import CustomScrollView from "../../shared-components/CustomScrollView";

const SettingsScreen = ({ navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { globalTheme, dispatchGlobalTheme } = useGlobalTheme();
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
  const [currencyRate, setCurrencyRate] = useState(appSettings.currencyRate);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const payload = {
        currencyRate: currencyRate,
        _timestamps: {
          ...appSettings._timestamps,
          updated_at: Date.now(),
          updated_by: userAccount.uid,
        },
      };
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
  }, [currencyRate]);

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

  useEffect(() => {
    const payload = {
      theme_id: appSettings.theme_id,
      _timestamps: {
        ...appSettings._timestamps,
        updated_at: Date.now(),
        updated_by: userAccount.uid,
      },
    };
    setTimeout(() => {
      dispatchGlobalTheme({
        type: REDUCER_ACTIONS.THEME.SET,
        payload: appSettings.theme_id,
      });
    }, 1);
    setTimeout(async () => {
      await firestore.setData(
        FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
        appSettings.uid,
        { ...appSettings, ...payload }
      );
    }, 1000);
  }, [appSettings?.theme_id]);

  useEffect(() => {
    console.log(currencyRate);
  }, [currencyRate]);
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
                    defaultOption: appSettings.theme_id,
                    selected: (item) =>
                      dispatchAppSettings({
                        type: REDUCER_ACTIONS.APP_SETTINGS.THEME.SET,
                        payload: item.id,
                      }),
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
                    props: APP_SETTINGS.FONT_SIZE.OPTIONS.map((option) => {
                      return { name: option };
                    }),
                    selected: (item) =>
                      dispatchAppSettings({
                        type: REDUCER_ACTIONS.APP_SETTINGS.FONT_SIZE.SET,
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
                    props: APP_SETTINGS.LANGUAGE.OPTIONS.map((option) => {
                      return { name: option.name, locale: option.locale };
                    }),
                    selected: (item) =>
                      dispatchAppSettings({
                        type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
                        payload: {
                          language: item.name,
                          locale: item.locale,
                        },
                      }),
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
                color: globalTheme.colors.primary,
              }}
            />
            <ListSection>
              <ListItem
                onPress={() => {
                  navigation.navigate(screenList.modalScreen, {
                    title: "Set default currency",
                    modalType: "currencyList",
                    props: APP_SETTINGS.CURRENCY.OPTIONS,
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
                    props: APP_SETTINGS.CURRENCY.OPTIONS,
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
                        { text: "OK", onPress: () => {}, style: "cancel" },
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

              {/* // TAG : Update Currency Rate */}
              <ListItem
                pressable
                leftLabel="Update currency rate"
                rightLabel={
                  isLoading
                    ? "Updating... "
                    : "Last updated at : " +
                      new Date(currencyRate.updatedAt).getDate() +
                      "/" +
                      (new Date(currencyRate.updatedAt).getMonth() + 1) +
                      "/" +
                      new Date(currencyRate.updatedAt).getFullYear()
                }
                isLoading={isLoading}
                // iconLeftName="checkmark"
                // iconPack="IonIcons"
                // onPress={() => alert("TODO : Add currency rate")}
                // onPress={() =>
                //   getCurrencyRate(appSettings.currencyRate).then((data) => {
                //     setCurrencyRate({ data: data, updatedAt: new Date() });
                //   })
                // }
                onPress={() => {
                  setIsLoading(true);
                  getCurrencyRate(appSettings.currencyRate.data).then(
                    (data) => {
                      setCurrencyRate({ data: data, updatedAt: Date.now() });
                      setIsLoading(false);
                    }
                  );
                }}

                // TODO : Add currency rate screen
              />
            </ListSection>

            {/* // TAG : Daily Summary */}
            <TextPrimary
              label="Daily Summary"
              style={{
                alignSelf: "flex-start",
                paddingHorizontal: 16,
                paddingBottom: 16,
                color: globalTheme.colors.primary,
              }}
            />
            <ListSection>
              <RadioButtonList
                items={APP_SETTINGS.LOGBOOKS.DAILY_SUMMARY.OPTIONS.map(
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
                primaryLabel="Show Transaction Time"
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
                primaryLabel="Show Transaction Notes"
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
