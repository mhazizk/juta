const APP_SETTINGS = {
    THEME: {
        DEFAULT: 'light',
        USER: 'light',
        OPTIONS: ['light', 'dark', 'colorOfTheYear2023', 'colorOfTheYear2022']
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
    },
    LOGBOOKS: {
        DAILY_CALCULATE: {
            DEFAULT: 'expense-income',
            USER: 'expense-incomell',
            OPTIONS: ['expense-only', 'income-only', 'expense-income', 'income-expense']
        },
        SHOW_TIME: {
            DEFAULT: 1,
            USER: 1,
            OPTIONS: [1, 0]
        },
        SHOW_NOTES: {
            DEFAULT: 1,
            USER: 1,
            OPTIONS: [1, 0]
        },

    }
}

export default APP_SETTINGS;