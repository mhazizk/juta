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
import hexToRgb from "../../utils/HexToRGB";
import IonIcons from "react-native-vector-icons/Ionicons";
import SettingsHeaderList from "../../components/List/SettingsHeaderList";

const CurrencySettingsScreen = ({ navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();
  const [logbookSettings, setLogbookSettings] = useState(
    appSettings.logbookSettings
  );
  useEffect(() => {
    console.log(logbookSettings);
  }, [logbookSettings]);

  useEffect(() => {
    setLogbookSettings(appSettings.logbookSettings);
  }, [appSettings.logbookSettings]);

  return (
    <>
      <ScrollView
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
            <View
              style={{
                marginBottom: 16,
                overflow: "hidden",
                borderRadius: 16,
                backgroundColor: hexToRgb({
                  hex: appSettings.theme.style.colors.foreground,
                  opacity: 0.07,
                }),
              }}
            >
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
            </View>
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
            <View
              style={{
                marginBottom: 16,
                overflow: "hidden",
                borderRadius: 16,
                backgroundColor: hexToRgb({
                  hex: appSettings.theme.style.colors.foreground,
                  opacity: 0.07,
                }),
              }}
            >
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
            </View>
          </>
        )}
        {/* // TODO : Dashboard Section */}
        {/* // TODO : Search Section */}
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
            <View
              style={{
                marginBottom: 16,
                overflow: "hidden",
                borderRadius: 16,
                backgroundColor: hexToRgb({
                  hex: appSettings.theme.style.colors.foreground,
                  opacity: 0.07,
                }),
              }}
            >
              <ListItem
                onPress={() => {
                  navigation.navigate(screenList.modalScreen, {
                    title: "Set default currency",
                    modalType: "list",
                    props: APP_SETTINGS.CURRENCY.OPTIONS,
                    selected: (item) => {
                      dispatchAppSettings({
                        type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
                        payload: {
                          logbookSettings: {
                            ...logbookSettings,
                            defaultCurrency: item,
                          },
                        },
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

              {/* // TAG : Premium */}
              <ListItem
                pressable
                leftLabel="Currency rate"
                // iconLeftName="checkmark"
                // iconPack="IonIcons"
                onPress={() => alert("TODO : Add currency rate")}
                // TODO : Add currency rate screen
              />

              {/* // TAG : Show secondary currency */}
              <CheckList
                primaryLabel="Show secondary currency"
                secondaryLabel="This will show the default currency as secondary currency in the Logbook screen."
                item={true}
                selected={logbookSettings.showSecondaryCurrency}
                // TODO : fix this check list
                onPress={() => {
                  dispatchAppSettings({
                    type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
                    payload: {
                      logbookSettings: {
                        ...logbookSettings,
                        showSecondaryCurrency:
                          !logbookSettings.showSecondaryCurrency,
                      },
                    },
                  });
                }}
              />
            </View>

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
                backgroundColor: hexToRgb({
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
                  dispatchAppSettings({
                    type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
                    payload: {
                      logbookSettings: {
                        ...logbookSettings,
                        dailySummary: item.value,
                      },
                    },
                  });
                }}
              />
            </View>
            {/* // TAG : Other */}
            <View
              style={{
                marginBottom: 16,
                overflow: "hidden",
                borderRadius: 16,
                backgroundColor: hexToRgb({
                  hex: appSettings.theme.style.colors.foreground,
                  opacity: 0.07,
                }),
              }}
            >
              {/* // TAG : Show Transaction Time */}
              <CheckList
                primaryLabel="Show Transaction Time"
                item={true}
                selected={logbookSettings.showTransactionTime}
                onPress={() => {
                  dispatchAppSettings({
                    type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
                    payload: {
                      logbookSettings: {
                        ...logbookSettings,
                        showTransactionTime:
                          !logbookSettings.showTransactionTime,
                      },
                    },
                  });
                }}
              />
              {/* // TAG : Show Transaction Notes */}
              <CheckList
                item={true}
                primaryLabel="Show Transaction Notes"
                selected={logbookSettings.showTransactionNotes}
                onPress={() => {
                  dispatchAppSettings({
                    type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
                    payload: {
                      logbookSettings: {
                        ...logbookSettings,
                        showTransactionNotes:
                          !logbookSettings.showTransactionNotes,
                      },
                    },
                  });
                }}
              />
            </View>
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
                backgroundColor: hexToRgb({
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
      </ScrollView>
    </>
  );
};

export default CurrencySettingsScreen;
