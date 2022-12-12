import { TouchableNativeFeedback, View } from "react-native"
import { TextPrimary, TextSecondary } from "./Text"
import IonIcons from 'react-native-vector-icons/Ionicons'
import { useGlobalAppSettings } from "../modules/GlobalContext"


export const ListItem = ({ leftLabel, rightLabel, props, theme, pressable, iconLeftName, iconRightName, onPress }) => {

    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();


    return (
        <>
            {pressable &&
                <TouchableNativeFeedback onPress={onPress} >
                    <View style={appSettings.theme.style.list.listContainer}>
                        {iconLeftName && <IonIcons name={iconLeftName} size={18} color={appSettings.theme.style.colors.foreground || lightTheme.colors.foreground} style={{ paddingRight: 16 }} />}
                        <View
                            style={appSettings.theme.style.list.listItem}
                        >
                            {leftLabel && <TextPrimary label={leftLabel} />}
                            {rightLabel && <TextSecondary label={rightLabel} />}
                        </View>
                        {iconRightName && <IonIcons name={iconRightName} size={iconRightName === 'checkmark-circle' ? 22 : 18} color={appSettings.theme.style.colors.foreground || lightTheme.colors.foreground} style={{ paddingLeft: 16 }} />}
                    </View>
                </TouchableNativeFeedback>}

            {!pressable &&
                <View style={appSettings.theme.style.list.listContainer}>
                    {iconLeftName && <IonIcons name={iconLeftName} size={18} color={appSettings.theme.style.colors.foreground || lightTheme.colors.foreground} style={{ paddingRight: 16 }} />}
                    <View
                        style={appSettings.theme.style.list.listItem}
                    >
                        {leftLabel && <TextPrimary label={leftLabel} />}
                        {rightLabel && <TextSecondary label={rightLabel} />}
                    </View>
                    {iconRightName && <IonIcons name={iconRightName} size={iconRightName === 'checkmark-circle' ? 22 : 18} color={appSettings.theme.style.colors.foreground || lightTheme.colors.foreground} style={{ paddingLeft: 16 }} />}
                </View>}
        </>
    )
}