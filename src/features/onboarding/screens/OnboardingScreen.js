import { Image } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import JutaLogo from "../../../assets/icons/juta-app-icon.png";
import OnboardingImg1 from "../../../assets/img/onboarding1.png";
import OnboardingImg2 from "../../../assets/img/onboarding2.png";
import OnboardingImg3 from "../../../assets/img/onboarding3.png";
import OnboardingImg4 from "../../../assets/img/onboarding4.png";
import OnboardingImg5 from "../../../assets/img/onboarding5.png";
import screenList from "../../../navigations/ScreenList";
import appSettingsFallback from "../../../reducers/fallback-state/appSettingsFallback";
import { useGlobalAppSettings } from "../../../reducers/GlobalContext";
import PERSIST_ACTIONS from "../../../reducers/persist/persist.actions";
import persistStorage from "../../../reducers/persist/persistStorage";
import REDUCER_ACTIONS from "../../../reducers/reducer.action";

const OnboardingScreen = ({ navigation }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  return (
    <>
      <Onboarding
        transitionAnimationDuration={250}
        showSkip={false}
        onDone={() => {
          persistStorage
            .asyncStorage({
              action: PERSIST_ACTIONS.SET,
              key: "isFirstRun",
              rawValue: false,
            })
            .then(() => {
              dispatchAppSettings({
                type: REDUCER_ACTIONS.APP_SETTINGS.FORCE_SET,
                payload: appSettingsFallback,
              });
              navigation.replace(screenList.loginScreen);
            })
            .catch((error) => {});
        }}
        pages={[
          {
            backgroundColor: "#000",
            image: (
              <Image source={JutaLogo} style={{ width: 150, height: 150 }} />
            ),
            title: "Welcome to Juta",
            subtitle: "Your personal finance tracker",
          },
          {
            backgroundColor: "#FFBD00",
            image: (
              <Image
                source={OnboardingImg1}
                style={{ width: 250, height: 250 }}
              />
            ),
            title: `Dashboard for you`,
            subtitle: "Track everything in one place",
          },
          {
            backgroundColor: "#00695C",
            image: (
              <Image
                source={OnboardingImg2}
                style={{ width: 250, height: 250 }}
              />
            ),
            title: "Log your expense",
            subtitle: "No more writing expense on paper",
          },
          {
            backgroundColor: "#196099",
            image: (
              <Image
                source={OnboardingImg3}
                style={{ width: 250, height: 250 }}
              />
            ),
            title: "Categorize everything",
            subtitle: "Categorize your expense to get better insight",
          },
          {
            backgroundColor: "#893050",
            image: (
              <Image
                source={OnboardingImg4}
                style={{ width: 250, height: 250 }}
              />
            ),
            title: "Analyze your expense",
            subtitle: "Get insight of your expense",
          },
          {
            backgroundColor: "#000",
            image: (
              <Image
                source={OnboardingImg5}
                style={{ width: 250, height: 250 }}
              />
            ),
            title: `Let's start`,
            subtitle: "",
          },
        ]}
      />
    </>
  );
};

export default OnboardingScreen;
