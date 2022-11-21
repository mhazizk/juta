import { useEffect, useState } from "react";
import { FlatList, Text, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity, View } from "react-native"
import { globalStyles, globalTheme } from "../../assets/globalStyles";
import APP_SETTINGS from "../../config/appSettings";

const ModalScreen = ({ route, navigation }) => {

    const [modal, setModal] = useState();


    const styleSelection =
        APP_SETTINGS.THEME.USER == 'light' ?
            globalStyles :
            globalStyles.darkTheme

    useEffect(() => {
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
                            <TouchableNativeFeedback onPress={() => { }}>
                                <View style={{ ...globalStyles.lightTheme.listContainer }}>
                                    <View style={globalStyles.lightTheme.listItem}>
                                        <Text style={globalStyles.lightTheme.textPrimary}>{item[0].toUpperCase() + item.substring(1)}</Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </>
                    )}
                />

                {/* // ! Action Button */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16 }}>


                    {/* // ! Cancel Button */}
                    <View style={{
                        height: 48,
                        width: 150,
                        borderColor: '#000',
                        borderWidth: 1,
                        borderRadius: 8,
                        margin: 4
                    }}>
                        <TouchableOpacity onPress={() => navigation.pop(1)}>
                            <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ ...globalStyles.lightTheme.textButtonSecondary }}>Cancel</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* // ! Save Button */}
                    <View style={{
                        ...globalStyles.lightTheme.buttonPrimary,
                        height: 48,
                        width: 150,
                        borderColor: '#000',
                        borderWidth: 0,
                        borderRadius: 8,
                        margin: 4,
                    }}>
                        <TouchableOpacity onPress={() => navigation.pop(1)}>
                            <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ ...globalStyles.lightTheme.textButtonPrimary }}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    )
}

export default ModalScreen;