import { Text } from "react-native";
import { lightTheme } from "../assets/themes/lightTheme";
import { useGlobalAppSettings } from "../modules/GlobalContext";


// ! TEXT COMPONENT //


// ! Text Primary //
export const TextPrimary = ({ label, props, numberOfLines, theme, style }) => {
    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();


    return (
        <>
            <Text numberOfLines={numberOfLines} style={[{ ...appSettings.theme.style.text.textPrimary }, { ...style || null }]}>
                {label || 'Primary Text'}
            </Text>
        </>
    )
}


// ! Text Button Primary //
export const TextButtonPrimary = ({ label, props, numberOfLines, style }) => {
    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

    return (
        <>
            <Text
                numberOfLines={numberOfLines || null}
                style={[{ ...appSettings.theme.style.button.buttonPrimary.textStyle }, { ...style || null }]}
            >
                {label || 'Primary Text'}
            </Text>
        </>
    )
}

// ! Text Button Secondary //
export const TextButtonSecondary = ({ label, props, theme, style }) => {
    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();


    return (
        <>
            <Text style={appSettings.theme.style.button.buttonSecondary.textStyle}>
                {label || 'Secondary Text'}
            </Text>
        </>
    )
}

// ! Text Secondary //
export const TextSecondary = ({ label, props, theme, style }) => {
    const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

    return (
        <>
            <Text style={[{ ...appSettings.theme.style.text.textSecondary }, { ...style || null }]}>
                {label || 'Secondary Text'}
            </Text>
        </>
    )
}

// ! Text Disabled //
export const TextDisabled = ({ label, props, theme, style }) => {

    return (
        <>
            <Text style={[{ ...theme.text.textDisabled || lightTheme.text.textDisabled }, { ...style || null }]}>
                {label || 'Disabled Text'}
            </Text>
        </>
    )
}


// ! Text Success //
export const TextSuccess = ({ label, props, theme, style }) => {

    return (
        <>
            <Text style={[{ ...theme.text.textSuccess || lightTheme.text.textSuccess }, { ...style || null }]}>
                {label || 'Success Text'}
            </Text>
        </>
    )
}


// ! Text Warn //
export const TextWarn = ({ label, props, theme, style }) => {

    return (
        <>
            <Text style={[{ ...theme.text.textWarn || lightTheme.text.textWarn }, { ...style || null }]}>
                {label || 'Warn Text'}
            </Text>
        </>
    )
}


// ! Text Failure //
export const TextDanger = ({ label, props, theme, style }) => {

    return (
        <>
            <Text style={[{ ...theme.text.textFailure || lightTheme.text.textFailure }, { ...style || null }]}>
                {label || 'Failure Text'}
            </Text>
        </>
    )
}


