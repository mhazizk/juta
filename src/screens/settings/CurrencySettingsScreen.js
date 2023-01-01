// TODO create a currency settings screen

import { View } from "react-native";
import CheckList from "../../components/CheckList";
import { ListItem } from "../../components/List";
import RadioButtonList from "../../components/List/RadioButtonList";
import { TextPrimary, TextSecondary } from "../../components/Text";
import APP_SETTINGS from "../../config/appSettings";
import screenList from "../../navigations/ScreenList";
import { useGlobalAppSettings } from "../../reducers/GlobalContext";
import REDUCER_ACTIONS from "../../reducers/reducer.action";

const CurrencySettingsScreen = ({ navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const [logbookSettings, setLogbookSettings] = useState(appSettings.logbooks);

  return (
    <>
      <View
        style={{
          height: "100%",
          backgroundColor: appSettings.theme.style.colors.background,
        }}
      >
        {/* // SECTION : Logbook Section */}
        <TextPrimary label="Currency" />
        {/* // TAG : Default Currency */}
        <ListItem
          onPress={() => {
            navigation.navigate(screenList.modalScreen, {
              title: "Set Default Currency",
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
          leftLabel="Set Default Currency"
          rightLabel={logbookSettings.defaultCurrency.name}
        />
        <TextSecondary label="Set default currency that also be used as secondary currency" />

        {/* // TAG : Show secondary currency */}
        <CheckList
          item={logbookSettings.showSecondaryCurrency}
          onPress={() => {
            dispatchAppSettings({
              type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
              payload: {
                logbookSettings: {
                  ...logbookSettings,
                  showSecondaryCurrency: !logbookSettings.showSecondaryCurrency,
                },
              },
            });
          }}
          selected={logbookSettings.showSecondaryCurrency}
        />
        <TextSecondary label="Show transaction amount in secondary currency" />

        {/* // TAG : Daily Summary */}
        <TextPrimary label="Daily Summary" />
        <RadioButtonList
          items={APP_SETTINGS.LOGBOOKS.DAILY_SUMMARY_OPTIONS.map((option) => {
            {
              name: if (option.includes("only")) {
                const remove = option.replace(/[^a-zA-Z0-9]/g, " ");
                remove[0].toUpperCase() + remove.substring(1);
              } else {
                option[0].toUpperCase() + option.substring(1);
              }
              value: option;
            }
          })}
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
        {/* // TAG : Show Transaction Time */}
        <TextPrimary label="Show Transaction Time" />
        <CheckList
          item={logbookSettings.showTransactionTime}
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
          selected={logbookSettings.showTransactionTime}
        />
        {/* // TAG : Show Transaction Notes */}
        <TextPrimary label="Show Transaction Notes" />
        <CheckList
          item={logbookSettings.showTransactionNotes}
          onPress={() => {
            dispatchAppSettings({
              type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
              payload: {
                logbookSettings: {
                  ...logbookSettings,
                  showTransactionNotes: !logbookSettings.showTransactionNotes,
                },
              },
            });
          }}
          selected={logbookSettings.showTransactionNotes}
        />
      </View>
    </>
  );
};

export default CurrencySettingsScreen;
