import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity, View } from "react-native"
import { globalStyles, globalTheme } from "../../assets/globalStyles";
import { ButtonPrimary, ButtonSecondary } from "../../components/Button";
import APP_SETTINGS from "../../config/appSettings";
import IonIcons from 'react-native-vector-icons/Ionicons';

const LoadingScreen = ({ route, navigation }) => {

    const [initial, setInitial] = useState(null);


    useEffect(() => {
        setTimeout(() => navigation.navigate('Bottom Tab'), 2000)
    }, [])

    useEffect(() => {

    }, [initial])


    return (
        <>
            {/* // ! Transparent Overlay */}
            {/* <TouchableOpacity onPress={() => navigation.pop(1)} style={{ flex: 1, backgroundColor: 'transparent' }}> */}
            <View style={{ flex: 1, backgroundColor: 'transparent' }}>
            </View>
            {/* </TouchableOpacity> */}

            {/* // ! Content card */}
            <View
                style={{
                    ...globalStyles.lightTheme.view,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    maxHeight: '50%',
                    paddingVertical: 24
                    // flex:1
                }}>
                <ActivityIndicator size={48} color='#000' style={{ paddingBottom: 16 }} />
                <View >
                    <Text style={{ ...globalStyles.lightTheme.textPrimary }}>{route?.params?.label}</Text>
                </View>


            </View>
        </>
    )
}

export default LoadingScreen;