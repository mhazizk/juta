import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ListItem } from "../../components/List";
import UserHeaderComponent from "../../components/UserHeader";
import APP_SETTINGS from "../../config/appSettings";
import screenList from "../../navigations/ScreenList";
import {
  useGlobalAppSettings,
  useGlobalTransactions,
} from "../../reducers/GlobalContext";
import REDUCER_ACTIONS from "../../reducers/reducer.action";

const PersonalizationSettingsScreen = ({ item, navigation }) => {
  const { state, dispatch } = useGlobalTransactions();
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  const [appPersonalization, setPersonalization] = useState({
    appTheme: false,
    fontSize: false,
    language: false,
  });

  return (
    <>
      {appSettings && (
        <View
          style={{
            height: "100%",
            backgroundColor: appSettings.theme.style.colors.background,
          }}
        >
          <UserHeaderComponent />
          {/* <View style={{ backgroundColor: '#fff', padding: 16 }}>
                        <Text style={{ fontSize: 32, color: '#bbb' }}>Personalization</Text>
                    </View> */}

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
      )}
    </>
  );
};

const styles = new StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  flatListView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    height: 48,
  },
  flatListViewUnderscore: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: 'green',
    paddingVertical: 0,
    paddingLeft: 16,
    borderColor: "#d9d9d9",
    borderBottomWidth: 0.5,
    minHeight: 46,
    textAlignVertical: "center",
  },
  flatListViewText: {
    display: "flex",
    color: "#000",
    textAlignVertical: "center",
    fontSize: 18,
    textAlignVertical: "center",
  },
});

export default PersonalizationSettingsScreen;
