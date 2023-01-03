// TODO create a currency settings screen

import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import CheckList from "../../components/CheckList";
import { ListItem } from "../../components/List";
import RadioButtonList from "../../components/List/RadioButtonList";
import { TextPrimary, TextSecondary } from "../../components/Text";
import APP_SETTINGS from "../../config/appSettings";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalUserAccount,
} from "../../reducers/GlobalContext";
import REDUCER_ACTIONS from "../../reducers/reducer.action";
import * as utils from "../../utils";
import IonIcons from "react-native-vector-icons/Ionicons";
import SettingsHeaderList from "../../components/List/SettingsHeaderList";
import SettingsSection from "../../components/List/SettingsSection";
import Animated, { useSharedValue } from "react-native-reanimated";

const CurrencySettingsScreen = ({ navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
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
  useEffect(() => {
    // console.log(JSON.stringify(appSettings));
  }, [appSettings]);

  useEffect(() => {
    setTimeout(() => {
      dispatchAppSettings({
        type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
        payload: {
          dashboardSettings: dashboardSettings,
          searchSettings: searchSettings,
          logbookSettings: logbookSettings,
        },
      });
    }, 1);
  }, [dashboardSettings, searchSettings, logbookSettings]);

  return (
    <>
      <Animated.ScrollView
        style={{
          height: "100%",
          backgroundColor: appSettings.theme.style.colors.background,
        }}
      >
        {/* // SECTION : Personalization Section */}
        {appSettings && (
          <>
            <SettingsHeaderList
              label="Personalization"
              iconName="color-palette"
            />
            {/* // TAG : Other */}
            <SettingsSection>
              {/* // TAG : App Theme */}
              <ListItem
                pressable
                leftLabel="Theme"
                rightLabel={appSettings.theme.name}
                iconLeftName="contrast"
                iconPack="IonIcons"
                onPress={() =>
                  navigation.navigate(screenList.modalScreen, {
                    title: "Theme",
                    modalType: "list",
                    props: APP_SETTINGS.THEME.OPTIONS.map((theme) => theme),
                    default: appSettings.theme,
                    selected: (item) =>
                      dispatchAppSettings({
                        type: REDUCER_ACTIONS.APP_SETTINGS.THEME.SET,
                        payload: item,
                      }),
                  })
                }
              />

              {/* // TAG : Font Size */}
              <ListItem
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
                    default: { name: appSettings.fontSize },
                  })
                }
              />

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
                    default: { name: appSettings.language },
                  })
                }
              />
            </SettingsSection>
          </>
        )}

        {/* // SECTION : Account Section */}
        {userAccount && (
          <>
            <SettingsHeaderList
              label="Account Settings"
              iconName="person-circle"
            />
            {/* // TAG : Other */}
            <SettingsSection>
              {/* // TAG : Change Email */}
              <ListItem
                pressable
                leftLabel="Change Email"
                rightLabel={userAccount.account.email}
                iconLeftName="mail"
                iconPack="IonIcons"
                onPress={() => alert("Feature in progress ...")}
              />

              {/* // TAG : Change Password */}
              <ListItem
                pressable
                leftLabel="Change Password"
                iconLeftName="key"
                iconPack="IonIcons"
                onPress={() => alert("Feature in progress ...")}
              />

              {/* // TAG : Premium */}
              <ListItem
                pressable
                leftLabel="Account Type"
                rightLabel={
                  userAccount.account.premium
                    ? "Premium Account"
                    : "Basic Account"
                }
                iconLeftName="checkmark"
                iconPack="IonIcons"
                onPress={() => alert("Feature in progress ...")}
              />
            </SettingsSection>
          </>
        )}
        {/* // TODO : Dashboard Section */}
        {/* // SECTION : Dashboard Section */}
        {dashboardSettings && (
          <>
            <SettingsHeaderList
              label="Dashboard Settings"
              iconName="analytics"
            />
            <SettingsSection>
              {/* // TAG : Show Recent Transactions */}
              <CheckList
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
              />
              {/* // TAG : Show Total Expense Widget  */}
              <CheckList
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
              />
              {/* // TAG : Show Total Income Widget  */}
              <CheckList
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
              />
              {/* // TAG : Show Total Balance Widget  */}
              <CheckList
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
              />
              {/* // TAG : Show My Budgets Widget  */}
              <CheckList
                primaryLabel="Show My Budgets Widget"
                item={true}
                selected={dashboardSettings.showMyBudgetsWidget}
                onPress={() => {
                  setDashboardSettings({
                    ...dashboardSettings,
                    showMyBudgetsWidget: !dashboardSettings.showMyBudgetsWidget,
                  });
                }}
              />
              {/* // TAG : Show My Logbooks Widget  */}
              <CheckList
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
            </SettingsSection>
          </>
        )}

        {/* // TODO : Search Section */}
        {/* // SECTION : Search Section */}
        {searchSettings && (
          <>
            <SettingsHeaderList label="Search Settings" iconName="search" />
            <SettingsSection>
              {/* // TAG : Transactions Search*/}
              <CheckList
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
              />
              {/* // TAG : Settings Search */}
              <CheckList
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
            </SettingsSection>
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
                paddingHorizontal: 16,
                paddingBottom: 16,
                color: appSettings.theme.style.colors.primary,
              }}
            />
            <SettingsSection>
              <ListItem
                onPress={() => {
                  navigation.navigate(screenList.modalScreen, {
                    title: "Set default currency",
                    modalType: "list",
                    props: APP_SETTINGS.CURRENCY.OPTIONS,
                    selected: (item) => {
                      setLogbookSettings({
                        ...logbookSettings,
                        defaultCurrency: item,
                      });
                    },
                    default: logbookSettings.defaultCurrency,
                  });
                }}
                pressable
                iconLeftName="usd"
                leftLabel="Set default currency"
                rightLabel={logbookSettings.defaultCurrency.name}
              />

              {/* // TAG : Secondary Currency */}
              <ListItem
                onPress={() => {
                  navigation.navigate(screenList.modalScreen, {
                    title: "Set secondary currency",
                    modalType: "list",
                    props: APP_SETTINGS.CURRENCY.OPTIONS,
                    selected: (item) => {
                      setLogbookSettings({
                        ...logbookSettings,
                        secondaryCurrency: item,
                      });
                    },
                    default: logbookSettings.secondaryCurrency,
                  });
                }}
                pressable
                iconLeftName="usd"
                leftLabel="Set secondary currency"
                rightLabel={logbookSettings.secondaryCurrency.name}
              />

              {/* // TAG : Show secondary currency */}
              <CheckList
                primaryLabel="Show secondary currency"
                secondaryLabel="This will show the default currency as secondary currency in the Logbook screen."
                item={true}
                selected={logbookSettings.showSecondaryCurrency}
                onPress={() => {
                  setLogbookSettings({
                    ...logbookSettings,
                    showSecondaryCurrency:
                      !logbookSettings.showSecondaryCurrency,
                  });
                }}
              />

              {/* // TAG : Currency Rate */}
              <ListItem
                pressable
                leftLabel="Currency rate"
                // iconLeftName="checkmark"
                // iconPack="IonIcons"
                onPress={() => alert("TODO : Add currency rate")}
                // TODO : Add currency rate screen
              />
            </SettingsSection>

            {/* // TAG : Daily Summary */}
            <TextPrimary
              label="Daily Summary"
              style={{
                paddingHorizontal: 16,
                paddingBottom: 16,
                color: appSettings.theme.style.colors.primary,
              }}
            />
            <View
              style={{
                overflow: "hidden",
                borderRadius: 16,
                marginBottom: 16,
                backgroundColor: utils.HexToRgb({
                  hex: appSettings.theme.style.colors.foreground,
                  opacity: 0.07,
                }),
              }}
            >
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
            </View>
            {/* // TAG : Other */}
            <SettingsSection>
              {/* // TAG : Show Transaction Time */}
              <CheckList
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
            </SettingsSection>
          </>
        )}
        {/* // SECTION : Data Section */}
        {userAccount && (
          <>
            <SettingsHeaderList label="Data Settings" iconName="cube" />
            {/* // TAG : Other */}
            <View
              style={{
                marginBottom: 16,
                overflow: "hidden",
                borderRadius: 16,
                backgroundColor: utils.HexToRgb({
                  hex: appSettings.theme.style.colors.foreground,
                  opacity: 0.07,
                }),
              }}
            >
              {/* // TAG : Export */}
              <ListItem
                pressable
                onPress={() => alert("Feature in progress ...")}
                iconPack="IonIcons"
                iconLeftName="share-outline"
                leftLabel="Export Data"
                // rightLabel="Export all log books and transactions"
              />

              {/* // TAG : Sync */}
              <ListItem
                pressable
                onPress={() => alert("Feature in progress ...")}
                iconPack="IonIcons"
                iconLeftName="sync"
                leftLabel="Sync Data"
                rightLabel="Last sync : 17 Nov 2022"
              />
            </View>
          </>
        )}
      </Animated.ScrollView>
    </>
  );
};

export default CurrencySettingsScreen;
