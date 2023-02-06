import { signOut } from "firebase/auth/react-native";
import { useEffect } from "react";
import { ScrollView } from "react-native";
import auth from "../../../api/firebase/auth";
import logOutRevenueCat from "../../../api/revenue-cat/logOutRevenueCat";
import Loading from "../../../components/Loading";
import { TextPrimary } from "../../../components/Text";
import useFirestoreSubscriptions from "../../../hooks/useFirestoreSubscriptions";
import screenList from "../../../navigations/ScreenList";
import appSettingsFallback from "../../../reducers/fallback-state/appSettingsFallback";
import {
  useGlobalAppSettings,
  useGlobalUserAccount,
} from "../../../reducers/GlobalContext";
import REDUCER_ACTIONS from "../../../reducers/reducer.action";

const LogoutScreen = ({ navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const { userAccount, dispatchUserAccount } = useGlobalUserAccount();

  useEffect(() => {
    useFirestoreSubscriptions({
      uid: userAccount.uid,
      unsubscribeAll: true,
    });
    setTimeout(() => {
      signOut(auth).then(async () => {
        dispatchAppSettings({
          type: REDUCER_ACTIONS.APP_SETTINGS.FORCE_SET,
          payload: appSettingsFallback,
        });
        dispatchUserAccount({
          type: REDUCER_ACTIONS.USER_ACCOUNT.FORCE_SET,
          payload: null,
        });
        await logOutRevenueCat();
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: screenList.splashScreen }],
          });
        }, 500);
      });
    }, 3000);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appSettings.theme.style.colors.background,
      }}
    >
      <Loading />
      <TextPrimary label="Logging you out..." />
    </ScrollView>
  );
};

export default LogoutScreen;
