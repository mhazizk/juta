import { Image, Text, View } from "react-native";
import { globalStyles } from "../../../assets/themes/globalStyles";
import Onboarding from 'react-native-onboarding-swiper'
import OnboardingImg1 from '../../../assets/icon.png'
import OnboardingImg2 from '../../../assets/img/onboarding2.png'
import OnboardingImg3 from '../../../assets/img/onboarding3.png'
import OnboardingImg4 from '../../../assets/img/onboarding4.png'
import OnboardingImg5 from '../../../assets/img/onboarding5.png'
import { useGlobalAppSettings } from "../../../modules/GlobalContext";
import { ACTIONS } from "../../../modules/GlobalReducer";
import { lightTheme } from "../../../assets/themes/lightTheme";

const OnboardingScreen = ({ navigation }) => {

    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();


    return (
        <>
            <Onboarding
                transitionAnimationDuration={250}
                showSkip={false}
                onDone={() => {
                    dispatchAppSettings({
                        type: ACTIONS.MULTI_ACTIONS.SET_INIT_APP_SETTINGS,
                        payload: {
                            theme: { name: 'Light Theme', id: 'light', style: lightTheme },
                            screenHidden: ['Onboarding Screen'],
                            fontSize: 'medium',
                            language: 'english',
                            locale: 'us-EN',
                            currency: { name: 'IDR', symbol: 'Rp', isoCode: 'id' },
                        }
                    })

                    navigation.navigate('Initial Setup Screen')
                }}
                pages={[
                    {
                        backgroundColor: '#000',
                        image: <Image source={OnboardingImg1} style={{ width: 250, height: 250 }} />,
                        title: 'Welcome',
                        subtitle: 'to Cash Log',
                    },
                    {
                        backgroundColor: '#00695C',
                        image: <Image source={OnboardingImg2} style={{ width: 250, height: 250 }} />,
                        title: 'Log Your Expense',
                        subtitle: 'No more writing expense on paper',
                    },
                    {
                        backgroundColor: '#196099',
                        image: <Image source={OnboardingImg3} style={{ width: 250, height: 250 }} />,
                        title: 'Categorize Your Expense',
                        subtitle: 'Easy to track expense based on category',
                    },
                    {
                        backgroundColor: '#893050',
                        image: <Image source={OnboardingImg4} style={{ width: 250, height: 250 }} />,
                        title: 'Analyze Your Expense',
                        subtitle: 'Easy to analyze expense in dashboard mode',
                    },
                    {
                        backgroundColor: '#FFBD00',
                        image: <Image source={OnboardingImg5} style={{ width: 250, height: 250 }} />,
                        title: `Let's Start`,
                        subtitle: '',
                    },
                ]
                }
            />
        </>
    )
}

export default OnboardingScreen;