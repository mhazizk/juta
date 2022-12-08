import { FlatList, Image, Text, TouchableNativeFeedback, View } from "react-native";
import { globalStyles } from "../../../assets/globalStyles";
import Onboarding from 'react-native-onboarding-swiper'
import OnboardingImg1 from '../../../assets/icon.png'
import OnboardingImg2 from '../../../assets/onboarding2.png'
import OnboardingImg3 from '../../../assets/onboarding3.png'
import OnboardingImg4 from '../../../assets/onboarding4.png'
import OnboardingImg5 from '../../../assets/onboarding5.png'
import colorOfTheYear2023 from '../../../assets/colorOfTheYear2023.png'
import colorOfTheYear2022 from '../../../assets/colorOfTheYear2022.png'
import light from '../../../assets/light.png'
import dark from '../../../assets/dark.png'
import large from '../../../assets/large.png'
import medium from '../../../assets/medium.png'
import small from '../../../assets/small.png'
import { useGlobalAppSettings } from "../../../modules/GlobalContext";
import { ACTIONS } from "../../../modules/GlobalReducer";
import { useEffect, useRef, useState } from "react";
import APP_SETTINGS from "../../../config/appSettings";
import { TouchableOpacity } from "react-native-gesture-handler";
import CountryFlag from "react-native-country-flag";

const InitialSetupScreen = ({ navigation }) => {

    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
    const [selectedAppSettings, setSelectedAppSettings] = useState({
        theme: { name: 'Light Theme', id: 'light' },
        fontSize: 'medium',
        language: 'english',
        locale: 'us-EN',
        currency: { name: 'IDR', symbol: 'Rp', isoCode: 'id' },
        screenHidden: ['Onboarding Screen', 'Initial Setup Screen']

    })

    const onboardingRef = useRef(null);

    useEffect(() => {

    }, [appSettings])

    const findImage = (data) => {
        switch (true) {

            // Theme Image
            case data === 'light':
                return light;
            case data === 'dark':
                return dark;
            case data === 'colorOfTheYear2022':
                return colorOfTheYear2022;
            case data === 'colorOfTheYear2023':
                return colorOfTheYear2023;

            // Font Size Image
            case data === 'small':
                return small;
            case data === 'medium':
                return medium;
            case data === 'large':
                return large;

            default:
                return light;
        }
    }

    const selectedColor = (data) => {
        switch (true) {
            case data === 'light':
                return '#000';
            case data === 'dark':
                return '#eee';
            case data === 'colorOfTheYear2022':
                return '#6463B1';
            case data === 'colorOfTheYear2023':
                return '#BC2649';

            default:
                return 'transparent';
        }
    }



    return (
        <>
            <Onboarding
                ref={onboardingRef}
                transitionAnimationDuration={250}
                showSkip={false}
                onDone={() => {
                    dispatchAppSettings({
                        type: ACTIONS.MULTI_ACTIONS.SET_INIT_APP_SETTINGS,
                        payload: selectedAppSettings
                    })

                    navigation.navigate('Bottom Tab')
                }}
                pages={[

                    // ! Select Theme
                    {
                        backgroundColor: selectedAppSettings.theme.id === 'dark' ? '#111' : '#fff',
                        image: <Image />,
                        title:
                            <>
                                <Text style={{ position: 'absolute', top: '5%', color: selectedColor(selectedAppSettings.theme.id), fontSize: 30 }}>Select Theme</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: 200 }}>
                                    <FlatList
                                        data={APP_SETTINGS.THEME.OPTIONS}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item }) => {
                                            return (
                                                <>
                                                    <TouchableOpacity
                                                        style={{ flex: 1 }}
                                                        onPress={() => {
                                                            setSelectedAppSettings({ ...selectedAppSettings, theme: item });
                                                            setTimeout(() => onboardingRef.current.goNext(), 1000)
                                                        }}>
                                                        <View style={{ flex: 1, borderRadius: 8, borderWidth: 0, minHeight: 100, margin: 8, overflow: 'hidden' }}>
                                                            <View style={{ flex: 1, flexDirection: 'column', padding: 0, margin: 0, alignItems: 'center', justifyContent: 'center' }}>
                                                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: selectedAppSettings.theme.id === item.id ? selectedColor(item.id) : 'transparent', borderRadius: 18, padding: 0, margin: 0 }}>
                                                                    <Image source={findImage(item.id)} style={{ width: 80, height: 80 }} />
                                                                </View>
                                                                <Text style={[globalStyles.lightTheme.textPrimary, { color: '#000' }]}>{item.name}</Text>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                </>
                                            )
                                        }}
                                    />
                                </View>
                            </>
                        ,
                        subtitle: '',
                    },

                    // ! Select Font Size
                    {
                        backgroundColor: selectedAppSettings.theme.id === 'dark' ? '#111' : '#fff',
                        image: <Image />,
                        title:
                            <>
                                <Text style={{ position: 'absolute', top: '5%', color: selectedColor(selectedAppSettings.theme.id), fontSize: 30 }}>Select Font Size</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: 200 }}>
                                    <FlatList
                                        data={APP_SETTINGS.FONT_SIZE.OPTIONS}
                                        keyExtractor={(item) => item}
                                        renderItem={({ item }) => {
                                            return (
                                                <>
                                                    <TouchableOpacity
                                                        style={{ flex: 1 }}
                                                        onPress={() => {
                                                            setSelectedAppSettings({ ...selectedAppSettings, fontSize: item })
                                                            setTimeout(() => onboardingRef.current.goNext(), 1000)
                                                        }}>
                                                        <View style={{ flex: 1, borderRadius: 8, borderWidth: 0, minHeight: 100, margin: 8, overflow: 'hidden' }}>
                                                            <View style={{ flex: 1, flexDirection: 'column', padding: 0, margin: 0, alignItems: 'center', justifyContent: 'center' }}>
                                                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: selectedAppSettings.fontSize === item ? selectedColor(selectedAppSettings.theme.id) : 'transparent', borderRadius: 18, padding: 0, margin: 0 }}>
                                                                    <Image source={findImage(item)} style={{ width: 80, height: 80 }} />
                                                                </View>
                                                                <Text style={[globalStyles.lightTheme.textPrimary, { color: '#000', fontSize: item === 'small' ? 12 : item === 'medium' ? 16 : 32 }]}>{item[0].toUpperCase() + item.substring(1)}</Text>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                </>
                                            )
                                        }}
                                    />
                                </View>
                            </>
                        ,
                        subtitle: '',
                    },

                    // ! Select Currency
                    {
                        backgroundColor: selectedAppSettings.theme.id === 'dark' ? '#111' : '#fff',
                        image: <Image />,
                        title:
                            <>
                                <Text style={{ position: 'absolute', top: '5%', color: selectedColor(selectedAppSettings.theme.id), fontSize: 30 }}>Select Default Currency</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: 200 }}>
                                    <FlatList
                                        data={APP_SETTINGS.CURRENCY.OPTIONS}
                                        keyExtractor={(item) => item.isoCode}
                                        renderItem={({ item }) => {
                                            return (
                                                <>
                                                    <TouchableOpacity
                                                        style={{ flex: 1 }}
                                                        onPress={() => {
                                                            setSelectedAppSettings({ ...selectedAppSettings, currency: item })
                                                            setTimeout(() => onboardingRef.current.goNext(), 1000)
                                                        }}>
                                                        <View style={{ flex: 1, borderRadius: 8, borderWidth: 0, minHeight: 100, margin: 8, overflow: 'hidden' }}>
                                                            <View style={{ flex: 1, flexDirection: 'column', padding: 0, margin: 0, alignItems: 'center', justifyContent: 'center' }}>
                                                                <View style={{ height: 80, width: 80, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: selectedAppSettings.currency.isoCode === item.isoCode ? selectedColor(selectedAppSettings.theme.id) : 'transparent', borderRadius: 18, padding: 0, margin: 0 }}>
                                                                    <CountryFlag
                                                                        isoCode={item.isoCode}
                                                                        size={32}
                                                                    />
                                                                    {/* <Text style={{ fontSize: 24 }}>Rp</Text> */}
                                                                </View>
                                                                <Text style={[globalStyles.lightTheme.textPrimary, { color: '#000' }]}>{item.name} / {item.symbol}</Text>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                </>
                                            )
                                        }}
                                    />
                                </View>
                            </>
                        ,
                        subtitle: '',
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

export default InitialSetupScreen;