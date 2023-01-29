import { useEffect, useState } from "react";
import { View } from "react-native";
import CheckList from "../../components/CheckList";
import { ListItem } from "../../components/List";
import RadioButtonList from "../../components/List/RadioButtonList";
import { TextPrimary, TextSecondary } from "../../components/Text";
import APP_SETTINGS from "../../config/appSettings";
import screenList from "../../navigations/ScreenList";
import { useGlobalAppSettings } from "../../reducers/GlobalContext";
import REDUCER_ACTIONS from "../../reducers/reducer.action";
import * as utils from "../../utils";
import hexToRgb from "../../utils/HexToRGB";

const CurrencySettingsScreen = ({ navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
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
      {logbookSettings && (
        <View
          style={{
            height: "100%",
            backgroundColor: appSettings.theme.style.colors.background,
          }}
        >
          {/* // SECTION : Logbook Section */}
          <TextPrimary
            label="Logbook Settings"
            style={{
              padding: 16,
              color: appSettings.theme.style.colors.primary,
            }}
          />
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
                  default: logbookSettings.defaultCurrency.name,
                });
              }}
              pressable
              iconLeftName="usd"
              leftLabel="Set default currency"
              rightLabel={logbookSettings.defaultCurrency.name}
            />

            {/* // TAG : Show secondary currency */}
            <CheckList
              pressable
              primaryLabel="Show secondary currency"
              secondaryLabel="This will show the default currency as secondary currency in the Logbook screen."
              item={true}
              selected={logbookSettings.showSecondaryCurrency}
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
          {/* // TAG : Show Transaction Time */}
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
                      showTransactionTime: !logbookSettings.showTransactionTime,
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
        </View>
      )}
    </>
  );
};

export default CurrencySettingsScreen;
