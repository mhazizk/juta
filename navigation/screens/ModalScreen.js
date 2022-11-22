import { useEffect, useState } from "react";
import { FlatList, Text, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity, View } from "react-native"
import { globalStyles, globalTheme } from "../../assets/globalStyles";
import { ButtonPrimary, ButtonSecondary } from "../../components/Button";
import APP_SETTINGS from "../../config/appSettings";
import IonIcons from 'react-native-vector-icons/Ionicons';

const ModalScreen = ({ route, navigation }) => {

    const [selected, setSelected] = useState();


    const styleSelection =
        APP_SETTINGS.THEME.USER == 'light' ?
            globalStyles :
            globalStyles.darkTheme

    useEffect(() => {
        // refresh
        // console.log(selected)
    }, [selected])

    useEffect(() => {
        setSelected(route?.params?.default);
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
                    maxHeight: '50%'
                    // flex:1
                }}>
                <View style={{ padding: 16 }}>
                    <Text style={{ ...globalStyles.lightTheme.textPrimary, fontSize: 24 }}>{route?.params?.title}</Text>
                </View>

                {/* // ! Flatlist Map Params Props */}
                <FlatList
                    style={{ ...globalStyles.lightTheme.view }}
                    data={route?.params?.props}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <>
                            <TouchableNativeFeedback onPress={() => { setSelected(item) }}>
                                <View style={{ ...globalStyles.lightTheme.listContainer }}>
                                    <View style={globalStyles.lightTheme.listItem}>
                                        <Text style={globalStyles.lightTheme.textPrimary}>{item[0].toUpperCase() + item.substring(1)}</Text>
                                        <IonIcons name='checkmark-circle' size={22} style={{ display: selected == item ? 'flex' : 'none' }} />
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </>
                    )}
                />

                {/* // ! Action Button */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16 }}>

                    {/* // ! Cancel Button */}
                    <View style={{ paddingRight: 8 }}>
                        <ButtonSecondary label='Cancel' onPress={() => navigation.goBack()} theme='lightTheme' />
                    </View>
                    {/* // ! Save Button */}
                    <View style={{ paddingLeft: 8 }}>
                        <ButtonPrimary label='Save' onPress={() => { route.params.selectedList(selected); navigation.goBack() }} theme='lightTheme' />
                    </View>
                </View>
            </View>
        </>
    )
}

export default ModalScreen;