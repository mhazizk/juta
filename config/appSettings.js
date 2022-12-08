const APP_SETTINGS = {
    THEME: {
        DEFAULT: { name: 'Light Theme', id: 'light' },
        USER: { name: 'Light Theme', id: 'light' },
        OPTIONS: [
            { name: 'Light Theme', id: 'light' },
            { name: 'Dark Theme', id: 'dark' },
            { name: 'Color of The Year 2023', id: 'colorOfTheYear2023' },
            { name: 'Color of The Year 2022', id: 'colorOfTheYear2022' }
        ]
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
        DEFAULT: { name: 'IDR', symbol: 'Rp', isoCode: 'id' },
        USER: { name: 'IDR', symbol: 'Rp', isoCode: 'id' },
        OPTIONS: [{ name: 'IDR', symbol: 'Rp', isoCode: 'id' }, { name: 'USD', symbol: '$', isoCode: 'us' }]
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