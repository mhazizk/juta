const APP_SETTINGS = {
    THEME: {
        DEFAULT: 'light',
        USER: 'light',
        OPTIONS: ['light', 'dark']
    },
    FONT_SIZE: {
        DEFAULT: 'medium',
        USER: 'medium',
        OPTIONS: ['small', 'medium', 'large']
    },
    LANGUAGE: {
        DEFAULT: { name: 'english', locale: 'en-US' },
        USER: { name: 'english', locale: 'en-US' },
        OPTIONS: [{ name: 'english', locale: 'en-US' }]
    },
    CURRENCY: {
        DEFAULT: 'IDR',
        USER: 'IDR',
        OPTIONS: ['IDR', 'USD']
    },
    DECIMALS: {
        DEFAULT: true,
        USER: true,
        OPTIONS: [false, true]
    }
}

export default APP_SETTINGS;