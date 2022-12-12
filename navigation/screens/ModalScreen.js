import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity, View } from "react-native"
import { globalStyles, globalTheme } from "../../assets/themes/globalStyles";
import { ButtonPrimary, ButtonSecondary } from "../../components/Button";
import APP_SETTINGS from "../../config/appSettings";
import IonIcons from 'react-native-vector-icons/Ionicons';
import { useGlobalAppSettings, useGlobalLoading } from "../../modules/GlobalContext";
import { ACTIONS } from "../../modules/GlobalReducer";
import CountryFlag from "react-native-country-flag";
import { TextPrimary } from "../../components/Text";
import { ListItem } from "../../components/List";


const ModalScreen = ({ route, navigation }) => {

    const { isLoading, dispatchLoading } = useGlobalLoading();
    const { appSettings, dispathAppSettings } = useGlobalAppSettings();
    const [localLoading, setLocalLoading] = useState(false);
    const [selected, setSelected] = useState(null);
    const [textInput, setTextInput] = useState(null);


    useEffect(() => {
        // refresh
        console.log(selected)
    }, [selected])

    useEffect(() => {
        // refresh
        console.log(textInput)
    }, [textInput])

    useEffect(() => {

    }, [localLoading])

    useEffect(() => {
        setSelected(route?.params?.default);
        setTextInput(route?.params?.default)
        // console.log(route.params.default)
        // console.log(selected)
    }, [])


    const onPressReturn = () => {
        switch (true) {
            case route?.params.modalType === 'list' || route?.params.modalType === 'currencyList':
                return route.params.selected(selected);
            case route?.params.modalType === 'textInput':
                return route.params.selected(textInput);

            default:
                console.log('thrd')
                return;
        }
    }

    return (
        <>
            {/* // ! Transparent Overlay */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ flex: 1, backgroundColor: 'transparent' }}>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                </View>
            </TouchableOpacity>

            {/* // ! Content card */}
            <View
                style={[{
                    backgroundColor: appSettings.theme.style.colors.background
                },
                {
                    display: 'flex',
                    justifyContent: 'flex-start',
                    maxHeight: '50%',
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16
                    // flex:1
                }]}>
                <View style={{ padding: 16 }}>
                    <TextPrimary
                        label={route?.params?.title}
                        style={{ fontSize: 24 }}
                    />
                </View>

                {/* // ! Flatlist Map Params Props */}
                {route.params?.modalType === 'list' &&
                    <FlatList
                        data={route?.params?.props}
                        keyExtractor={(item, id) => item?.name + id}
                        renderItem={({ item }) => (
                            <>
                                <ListItem
                                    pressable
                                    iconLeftName={item?.icon?.name}
                                    iconRightName={selected?.name == item?.name ? 'checkmark-circle' : null}
                                    leftLabel={item?.name[0].toUpperCase() + item?.name.substring(1)}
                                    onPress={() => { setSelected(item) }}
                                />
                                {/* <TouchableNativeFeedback onPress={() => { setSelected(item) }}>
                                    <View style={{ ...globalStyles.lightTheme.listContainer }}>

                                        {item.logbook_currency &&
                                            <View style={[{ flex: 0, minWidth: 36, alignItems: 'center', justifyContent: 'center', padding: 8, borderRadius: 8 }, { backgroundColor: '#ddd' }]}>
                                                <Text style={{ ...globalStyles.lightTheme.textPrimary }}>{item.logbook_currency.symbol}</Text>
                                            </View>}

                                        {item.icon &&
                                            <IonIcons
                                                name={item?.icon?.name}
                                                size={18}
                                                color={item?.icon?.color}
                                                style={{ display: item?.icon?.pack === 'ion_icons' ? 'flex' : 'none' }} />}

                                        <View style={{ ...globalStyles.lightTheme.listItem, flex: 1, paddingHorizontal: 16 }}>
                                            <Text style={globalStyles.lightTheme.textPrimary}>{item?.name[0].toUpperCase() + item?.name.substring(1)}</Text>
                                        </View>
                                        <IonIcons name='checkmark-circle' size={22} style={{ display: selected?.name == item?.name ? 'flex' : 'none' }} />
                                    </View>
                                </TouchableNativeFeedback> */}
                            </>
                        )}
                    />}


                {/* // ! Flatlist Params Currency */}
                {route.params?.modalType === 'currencyList' &&
                    <FlatList
                        data={route?.params?.props}
                        keyExtractor={(item, id) => item?.name + id}
                        renderItem={({ item }) => (
                            <>
                                <TouchableNativeFeedback onPress={() => { setSelected(item) }}>
                                    <View style={appSettings.theme.style.list.listContainer}>
                                        <CountryFlag
                                            isoCode={item?.isoCode}
                                            size={18}
                                        />
                                        <View style={{ ...appSettings.theme.style.list.listItem, paddingLeft: 16 }}>
                                            <TextPrimary
                                                label={`${item?.name[0].toUpperCase() + item?.name.substring(1)} / ${item?.symbol}`}
                                            />
                                            <IonIcons name='checkmark-circle' size={22} style={{ display: selected?.name == item?.name ? 'flex' : 'none' }} color={appSettings.theme.style.colors.foreground} />
                                        </View>
                                    </View>
                                </TouchableNativeFeedback>
                            </>
                        )}
                    />}

                {/* // ! Input Params */}
                {route.params?.modalType === 'textInput' &&
                    <View style={{ paddingHorizontal: 16 }}>
                        <TextInput
                            style={{ paddingHorizontal: 16, fontSize: 16, borderRadius: 8, borderWidth: 1, height: 48, borderColor: appSettings.theme.style.colors.primary, color: appSettings.theme.style.text.textPrimary.color }}
                            placeholder={route.params?.placeholder ? route.params.placeholder : 'Type here....'}
                            placeholderTextColor={appSettings.theme.style.text.textSecondary.color}
                            defaultValue={route.params?.default ? route.params.default : ''}
                            value={textInput}
                            onChangeText={(input) => setTextInput(input)}
                        />
                    </View>
                }

                {/* // ! Option Flatlist Params */}
                {route.params?.modalType === 'action' &&
                    <>
                        {/* <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center', padding: 16 }}> */}

                        {/* // ! Delete Action */}
                        <TouchableNativeFeedback onPress={() => { }}>
                            <View style={appSettings.theme.style.list.listContainer}>
                                <IonIcons
                                    name='trash'
                                    size={18}
                                    // color={item?.icon?.color}
                                    style={{ paddingRight: 16 }} />
                                <View style={globalStyles.lightTheme.listItem}>
                                    <Text style={globalStyles.lightTheme.textPrimary}>Delete</Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        {/* </View> */}
                    </>}

                {/* // ! Action Button */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16 }}>

                    {/* // ! Cancel Button */}
                    <View style={{ paddingRight: 8 }}>
                        <ButtonSecondary label='Cancel' onPress={() => navigation.goBack()} theme={appSettings.theme.style} />
                    </View>
                    {/* // ! Save Button */}
                    <View style={{ paddingLeft: 8 }}>

                        {/* {localLoading && */}
                        {/* <ActivityIndicator
                                size={32}
                                color='#fff'
                                style={{ backgroundColor: '#bbb', borderRadius: 8, height: 48, width: 80 }}
                            /> */}
                        {/* } */}

                        {/* {!localLoading && */}
                        <ButtonPrimary
                            label='Save'
                            onPress={() => {
                                onPressReturn()
                                navigation.goBack()
                            }
                                // route.params?.modalType === 'list' ?
                                // () => {
                                // dispatchLoading({
                                //     type: ACTIONS.LOADING.SET,
                                //     payload: true
                                // })
                                // setLocalLoading(true)
                                //     route.params.selected(selected); navigation.goBack()
                                // } :
                                // route.params?.modalType === 'textInput' ?
                                //     () => {
                                //         route.params.selected(textInput); navigation.goBack()
                                //     } :
                                //     () => { navigation.goBack() }
                            }
                            theme={appSettings.theme.style} />
                        {/* } */}
                    </View>
                </View>
            </View>
        </>
    )
}

export default ModalScreen;