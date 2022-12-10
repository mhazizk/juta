import { Text } from "react-native";
import { lightTheme } from "../assets/themes/lightTheme";


// ! TEXT COMPONENT //


// ! Text Primary //
export const TextPrimary = ({ label, props, theme, style }) => {

    return (
        <>
            <Text style={[{ ...theme.text.textPrimary || lightTheme.text.textPrimary }, { ...style || null }]}>
                {label || 'Primary Text'}
            </Text>
        </>
    )
}

// ! Text Secondary //
export const TextSecondary = ({ label, props, theme, style }) => {

    return (
        <>
            <Text style={[{ ...theme.text.textSecondary || lightTheme.text.textSecondary }, { ...style || null }]}>
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


