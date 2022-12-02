import { TouchableOpacity, View, Text } from "react-native"
import { globalStyles, globalTheme } from "../assets/globalStyles"

// ! Button Primary //
export const ButtonPrimary = ({ label, props, onPress, condition, theme, width }) => {

    let buttonStyle;
    let buttonTheme;
    let textButtonTheme;
    let textButtonStyle;

    switch (true) {
        case theme === 'light':
            buttonStyle = globalStyles.lightTheme.buttonPrimary;
            buttonTheme = globalTheme.lightTheme.buttonPrimary;
            textButtonTheme = globalTheme.lightTheme.textButtonPrimary;
            textButtonStyle = globalStyles.lightTheme.textButtonPrimary;
            break;
        case theme === 'dark':
            buttonStyle = globalStyles.darkTheme.buttonPrimary;
            buttonTheme = globalTheme.darkTheme.buttonPrimary
            textButtonTheme = globalTheme.darkTheme.textButtonPrimary;
            textButtonStyle = globalStyles.darkTheme.textButtonPrimary;
            break;
        default:
            buttonStyle = globalStyles.lightTheme.buttonPrimary;
            buttonTheme = globalTheme.lightTheme.buttonPrimary
            textButtonTheme = globalTheme.lightTheme.textButtonPrimary;
            textButtonStyle = globalStyles.lightTheme.textButtonPrimary;
            break;
    }

    return (
        <>
            <TouchableOpacity onPress={onPress}>
                <View style={[{
                    ...buttonStyle,
                    minWidth: 80,
                    width: (width ? width : null),
                    paddingHorizontal: 16,
                    // margin: 4
                }, buttonTheme]}>
                    <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ ...textButtonTheme }}>{label}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </>
    )
}

// ! Button Secondary //
export const ButtonSecondary = ({ label, props, type, onPress, condition, theme, width }) => {

    let buttonStyle;
    let buttonTheme;
    let textButtonTheme;
    let textButtonStyle;

    switch (true) {
        case theme === 'light':
            buttonStyle = globalStyles.lightTheme.buttonSecondary;
            buttonTheme = globalTheme.lightTheme.buttonSecondary;
            textButtonTheme = globalTheme.lightTheme.textbuttonSecondary;
            textButtonStyle = globalStyles.lightTheme.textButtonSecondary;
            break;
        case theme === 'dark':
            buttonStyle = globalStyles.darkTheme.buttonSecondary;
            buttonTheme = globalTheme.darkTheme.buttonSecondary
            textButtonTheme = globalTheme.darkTheme.textbuttonSecondary;
            textButtonStyle = globalStyles.darkTheme.textButtonSecondary;
            break;
        default:
            buttonStyle = globalStyles.lightTheme.buttonSecondary;
            buttonTheme = globalTheme.lightTheme.buttonSecondary
            textButtonTheme = globalTheme.lightTheme.textbuttonSecondary;
            textButtonStyle = globalStyles.lightTheme.textButtonSecondary;
            break;
    }

    return (
        <>
            <TouchableOpacity onPress={onPress}>
                <View style={[{
                    ...buttonStyle,
                    minWidth: 80,
                    width: (width ? width : null),
                    paddingHorizontal: 16,
                    // margin: 4
                }, buttonTheme]}>
                    <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ ...textButtonTheme }}>{label}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </>
    )
}

// ! Button Switch //
export const ButtonSwitch = ({ label, condition, onPress, props, theme, width }) => {

    let buttonDidFocusStyle;
    let buttonNotFocusStyle;
    let buttonDidFocusTheme;
    let buttonNotFocusTheme;
    let textButtonDidFocusTheme;
    let textButtonNotFocusTheme;
    let textButtonStyle;


    switch (true) {
        case theme === 'light':
            // Did Focus
            buttonDidFocusStyle = globalStyles.lightTheme.buttonPrimary;
            buttonDidFocusTheme = globalTheme.lightTheme.buttonPrimary;
            textButtonStyle = globalStyles.lightTheme.textButtonPrimary;
            textButtonDidFocusTheme = globalTheme.lightTheme.textButtonPrimary;
            // Not Focus
            buttonNotFocusStyle = globalStyles.lightTheme.buttonSecondary;
            buttonNotFocusTheme = globalTheme.lightTheme.buttonSecondary;
            textButtonStyle = globalStyles.lightTheme.textButtonSecondary;
            textButtonNotFocusTheme = globalTheme.lightTheme.textButtonSecondary;
            break;
        case theme === 'dark':
            // Did Focus
            buttonDidFocusStyle = globalStyles.darkTheme.buttonPrimary;
            buttonDidFocusTheme = globalTheme.darkTheme.buttonPrimary;
            textButtonStyle = globalStyles.darkTheme.textButtonSecondary;
            textButtonDidFocusTheme = globalTheme.darkTheme.textButtonPrimary;
            // Not Focus
            buttonNotFocusStyle = globalStyles.darkTheme.buttonSecondary;
            buttonNotFocusTheme = globalTheme.darkTheme.buttonSecondary;
            textButtonStyle = globalStyles.darkTheme.textButtonSecondary;
            textButtonNotFocusTheme = globalTheme.darkTheme.textButtonSecondary;
            break;
        default:
            // Did Focus
            buttonDidFocusStyle = globalStyles.lightTheme.buttonPrimary;
            buttonDidFocusTheme = globalTheme.lightTheme.buttonPrimary;
            textButtonStyle = globalStyles.lightTheme.textButtonSecondary;
            textButtonDidFocusTheme = globalTheme.lightTheme.textButtonPrimary;
            // Not Focus
            buttonNotFocusStyle = globalStyles.lightTheme.buttonSecondary;
            buttonNotFocusTheme = globalTheme.lightTheme.buttonSecondary;
            textButtonStyle = globalStyles.lightTheme.textButtonSecondary;
            textButtonNotFocusTheme = globalTheme.lightTheme.textButtonSecondary;
            break;
    }

    const isButtonFocusStyle = condition ? buttonDidFocusStyle : buttonNotFocusStyle
    const isButtonFocusTheme = condition ? buttonDidFocusTheme : buttonNotFocusTheme
    const isTextFocusTheme = condition ? textButtonDidFocusTheme : textButtonNotFocusTheme


    return (
        <>
            <TouchableOpacity onPress={onPress}>
                <View style={
                    [{
                        ...isButtonFocusStyle,
                        minWidth: 80,
                        width: (width ? width : null),
                        paddingHorizontal: 16,
                        // margin: 4,
                    },
                        isButtonFocusTheme
                    ]} >
                    <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={isTextFocusTheme}>{label}</Text>
                    </View>
                </View >
            </TouchableOpacity>
        </>

    )
}