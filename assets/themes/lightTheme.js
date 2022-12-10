const palette = {
    white: {
        600: '#F5F5F5',
        500: '#E5E5E5',
        400: '#D5D5D5',
        300: '#C5C5C5',
        200: '#B5B5B5',
        100: '#A5A5A5'
    },
    black: {
        600: '#151515',
        500: '#252525',
        400: '#353535',
        300: '#454545',
        200: '#555555',
        100: '#656565'
    },
    red: '#CD0E61',
    purple: '#5A31F4',
    green: '#0ECD9D',
    orange: '#F49D1A'
}

export const lightTheme = {
    colors: {
        background: palette.white[200],
        foreground: palette.black[600],
        primary: palette.black[600],
        success: palette.green,
        warn: palette.orange,
        danger: palette.red,
        failure: palette.red
    },
    text: {
        textPrimary: {
            size: 16,
            color: palette.black[500]
        },
        textSecondary: {
            size: 16,
            color: palette.white[200]
        },
        textDisabled: {
            size: 16,
            color: palette.white[200]
        },
        textSuccess: {
            size: 16,
            color: palette.green
        },
        textWarn: {
            size: 16,
            color: palette.orange
        },
        textDanger: {
            size: 16,
            color: palette.red
        },
        textFailure: {
            size: 16,
            color: palette.red
        }
    }
}