import { useEffect, useState } from "react";
import { FlatList, Text, TextInput, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity, View } from "react-native"
import { globalStyles, globalTheme } from "../../assets/globalStyles";
import { ButtonPrimary, ButtonSecondary } from "../../components/Button";
import APP_SETTINGS from "../../config/appSettings";
import IonIcons from 'react-native-vector-icons/Ionicons';
import { useGlobalLoading } from "../../modules/GlobalContext";
import { ACTIONS } from "../../modules/GlobalReducer";

const ModalScreen = ({ route, navigation }) => {

    const { isLoading, dispatchLoading } = useGlobalLoading();
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
        setSelected(route?.params?.default);
        setTextInput(route?.params?.default)
        // console.log(route.params.default)
        // console.log(selected)
    }, [])

    return (
        <>
            {/* // ! Transparent Overlay */}
            <TouchableOpacity onPress={() => navigation.pop(1)} style={{ flex: 1, backgroundColor: 'transparent' }}>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                </View>
            </TouchableOpacity>

            {/* // ! Content card */}
            <View
                style={{
                    ...globalStyles.lightTheme.view,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    maxHeight: '50%',
                    borderRadius: 16
                    // flex:1
                }}>
                <View style={{ padding: 16 }}>
                    <Text style={{ ...globalStyles.lightTheme.textPrimary, fontSize: 24 }}>{route?.params?.title}</Text>
                </View>

                {/* // ! Flatlist Map Params Props */}
                {route.params?.modalType === 'list' &&
                    <FlatList
                        style={{ ...globalStyles.lightTheme.view }}
                        data={route?.params?.props}
                        keyExtractor={(item, id) => item?.name + id}
                        renderItem={({ item }) => (
                            <>
                                <TouchableNativeFeedback onPress={() => { setSelected(item) }}>
                                    <View style={{ ...globalStyles.lightTheme.listContainer }}>
                                        <IonIcons
                                            name={item?.icon?.name}
                                            size={18}
                                            color={item?.icon?.color}
                                            style={{ display: item?.icon?.pack === 'ion_icons' ? 'flex' : 'none', paddingRight: 16 }} />
                                        <View style={globalStyles.lightTheme.listItem}>
                                            <Text style={globalStyles.lightTheme.textPrimary}>{item?.name[0].toUpperCase() + item?.name.substring(1)}</Text>
                                            <IonIcons name='checkmark-circle' size={22} style={{ display: selected?.name == item?.name ? 'flex' : 'none' }} />
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
                            style={{ paddingHorizontal: 16, fontSize: 16, borderRadius: 8, borderWidth: 1, height: 48 }}
                            placeholder={route.params?.placeholder ? route.params.placeholder : 'Type here....'}
                            defaultValue={route.params?.default ? route.params.default : ''}
                            value={textInput}
                            onChangeText={(input) => setTextInput(input)}
                        />
                    </View>
                }

                {/* // ! Action Button */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16 }}>

                    {/* // ! Cancel Button */}
                    <View style={{ paddingRight: 8 }}>
                        <ButtonSecondary label='Cancel' onPress={() => navigation.goBack()} theme='lightTheme' />
                    </View>
                    {/* // ! Save Button */}
                    <View style={{ paddingLeft: 8 }}>
                        <ButtonPrimary
                            label='Save'
                            onPress={
                                route.params?.modalType === 'list' ?
                                    () => {
                                        route.params.selected(selected); navigation.goBack()
                                    } :
                                    route.params?.modalType === 'textInput' ?
                                        () => {
                                            route.params.selected(textInput); navigation.goBack()
                                        } :
                                        () => { navigation.goBack() }
                            }
                            theme='lightTheme' />
                    </View>
                </View>
            </View>
        </>
    )
}

export default ModalScreen;