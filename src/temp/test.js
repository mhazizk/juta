const sorted = {
  sortedTransactionsPatchCounter: 0,
  sortedTransactionsDeleteCounter: 0,
  sortedLogbookInsertCounter: 0,
  sortedLogbookDeleteCounter: 0,
  sortedTransactionsInitCounter: 1,
  groupSorted: [
    {
      logbook_id: "11ca3f4a-dea9-48e6-b058-ca1935cf6b65",
      transactions: [
        {
          title: "01/10/23",
          customDate: "2023/01/10",
          data: [
            {
              _timestamps: {
                created_at: 1673328449531,
                updated_at: 1673328449531,
              },
              _id: 1673328449531,
              logbook_id: "11ca3f4a-dea9-48e6-b058-ca1935cf6b65",
              transaction_id: "67dd2f7d-2414-4c15-a4d1-4f8c47703a0a",
              uid: "3tC6Pyal8rM54ssy11TBy2o8Kh52",
              details: {
                in_out: "expense",
                type: "cash",
                date: 1673328449531,
                notes: null,
                amount: 350000,
                category_id: "6",
              },
            },
          ],
        },
      ],
    },
  ],
  logbookToOpen: {
    name: "My Logbook",
    logbook_id: "11ca3f4a-dea9-48e6-b058-ca1935cf6b65",
    logbook_currency: { name: "IDR", symbol: "Rp", isoCode: "id" },
  },
  sortedTransactionsInsertCounter: 1,
};

const result = [
  {
    logbook_id: "logbook1",
    transactions: [
      {
        title: "Tue Jan 03 2023",
        customDate: "2023/01/03",
        data: [
          {
            _timestamps: {
              created_at: 1673328449531,
              updated_at: 1673328449531,
            },
            _id: 1673328449531,
            logbook_id: "logbook1",
            transaction_id: "67dd2f7d-2414-4c15-a4d1-4f8c47703a0a",
            uid: "3tC6Pyal8rM54ssy11TBy2o8Kh52",
            details: {
              in_out: "expense",
              type: "cash",
              date: 1672704000000,
              notes: null,
              amount: 100,
              category_id: "6",
            },
          },
        ],
      },
      {
        title: "Mon Jan 02 2023",
        customDate: "2023/01/02",
        data: [
          {
            _timestamps: {
              created_at: 1673328449531,
              updated_at: 1673328449531,
            },
            _id: 1673328449531,
            logbook_id: "logbook1",
            transaction_id: "67dd2f70-2414-4c15-a4d1-4f8c47703a0a",
            uid: "3tC6Pyal8rM54ssy11TBy2o8Kh52",
            details: {
              in_out: "expense",
              type: "cash",
              date: 1672632000000,
              notes: null,
              amount: 300,
              category_id: "6",
            },
          },
          {
            _timestamps: {
              created_at: 1673328449531,
              updated_at: 1673328449531,
            },
            _id: 1673328449531,
            logbook_id: "logbook1",
            transaction_id: "67dd2f70-2414-4c15-a4d1-4f8c47703a0a",
            uid: "3tC6Pyal8rM54ssy11TBy2o8Kh52",
            details: {
              in_out: "expense",
              type: "cash",
              date: 1672617600000,
              notes: null,
              amount: 400,
              category_id: "6",
            },
          },
        ],
      },
    ],
  },
  {
    logbook_id: "logbook2",
    transactions: [
      {
        title: "Sun Jan 01 2023",
        customDate: "2023/01/01",
        data: [
          {
            _timestamps: {
              created_at: 1672531200000,
              updated_at: 1672531200000,
            },
            _id: 1673328449531,
            logbook_id: "logbook2",
            transaction_id: "67dd2f7d-2414-4c15-a4d1-4f8c47703a0a",
            uid: "3tC6Pyal8rM54ssy11TBy2o8Kh52",
            details: {
              in_out: "expense",
              type: "cash",
              date: 1672531200000,
              notes: null,
              amount: 900,
              category_id: "6",
            },
          },
        ],
      },
    ],
  },
  { logbook_id: "logbook3", transactions: [] },
];

const coba = {
  status: "done",
  result: [
    {
      transaction: {
        uid: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
        details: {
          amount: 600000,
          type: "cash",
          in_out: "income",
          date: 1673508572594,
          category_id: "13",
          notes: null,
        },
        logbook_id: "37608b84-d8bd-493e-af7b-b8aeb40c43a5",
        _id: 1673508572594,
        transaction_id: "c3d79c41-90e4-4e15-9ddc-96e729a0c943",
        _timestamps: { updated_at: 1673508572594, created_at: 1673508572594 },
      },
      category: {
        categoryName: "Salary",
        categoryId: "13",
        icon: { iconPack: "IonIcons", iconColor: "#F5F5F5", iconName: "cash" },
      },
      logbook: {
        logbookName: "My Logbook",
        logbookId: "37608b84-d8bd-493e-af7b-b8aeb40c43a5",
        logbookCurrency: { isoCode: "id", symbol: "Rp", name: "IDR" },
      },
    },
    {
      transaction: {
        logbook_id: "37608b84-d8bd-493e-af7b-b8aeb40c43a5",
        details: {
          category_id: "4",
          notes: null,
          type: "cash",
          in_out: "expense",
          amount: 300000,
          date: 1673508557211,
        },
        _timestamps: { created_at: 1673508557211, updated_at: 1673508557211 },
        uid: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
        _id: 1673508557211,
        transaction_id: "de88abb1-e73b-4f34-9164-66000c247d45",
      },
      category: {
        categoryName: "Shopping",
        categoryId: "4",
        icon: { iconPack: "IonIcons", iconColor: "#F5F5F5", iconName: "cart" },
      },
      logbook: {
        logbookName: "My Logbook",
        logbookId: "37608b84-d8bd-493e-af7b-b8aeb40c43a5",
        logbookCurrency: { isoCode: "id", symbol: "Rp", name: "IDR" },
      },
    },
  ],
};

const tset = {
  uid: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
  expense: [
    {
      name: "food and drink",
      id: "1",
      icon: { name: "fast-food", color: "default", pack: "IonIcons" },
      _timestamps: {
        created_at: 1673795905972,
        created_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
        updated_at: 1673795905972,
        updated_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
      },
    },
    {
      name: "bills and utilities",
      id: "2",
      icon: { name: "flash", color: "default", pack: "IonIcons" },
      _timestamps: {
        created_at: 1673795905972,
        created_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
        updated_at: 1673795905972,
        updated_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
      },
    },
    {
      name: "transportation",
      id: "3",
      icon: { name: "bus", color: "default", pack: "IonIcons" },
      _timestamps: {
        created_at: 1673795905972,
        created_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
        updated_at: 1673795905972,
        updated_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
      },
    },
    {
      name: "shopping",
      id: "4",
      icon: { name: "cart", color: "default", pack: "IonIcons" },
      _timestamps: {
        created_at: 1673795905972,
        created_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
        updated_at: 1673795905972,
        updated_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
      },
    },
    {
      name: "entertainment",
      id: "5",
      icon: { name: "game-controller", color: "default", pack: "IonIcons" },
      _timestamps: {
        created_at: 1673795905972,
        created_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
        updated_at: 1673795905972,
        updated_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
      },
    },
    {
      name: "travel",
      id: "6",
      icon: { name: "airplane", color: "default", pack: "IonIcons" },
      _timestamps: {
        created_at: 1673795905972,
        created_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
        updated_at: 1673795905972,
        updated_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
      },
    },
    {
      name: "health",
      id: "7",
      icon: { name: "medical", color: "default", pack: "IonIcons" },
      _timestamps: {
        created_at: 1673795905972,
        created_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
        updated_at: 1673795905972,
        updated_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
      },
    },
    {
      name: "sport",
      id: "8",
      icon: { name: "football", color: "default", pack: "IonIcons" },
      _timestamps: {
        created_at: 1673795905972,
        created_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
        updated_at: 1673795905972,
        updated_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
      },
    },
    {
      name: "donations",
      id: "9",
      icon: { name: "heart", color: "default", pack: "IonIcons" },
      _timestamps: {
        created_at: 1673795905972,
        created_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
        updated_at: 1673795905972,
        updated_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
      },
    },
    {
      name: "education",
      id: "10",
      icon: { name: "school", color: "default", pack: "IonIcons" },
      _timestamps: {
        created_at: 1673795905972,
        created_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
        updated_at: 1673795905972,
        updated_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
      },
    },
    {
      name: "subscription",
      id: "11",
      icon: { name: "receipt", color: "default", pack: "IonIcons" },
      _timestamps: {
        created_at: 1673795905972,
        created_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
        updated_at: 1673795905972,
        updated_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
      },
    },
    {
      name: "gadget",
      id: "12",
      icon: { name: "phone-portrait", color: "default", pack: "IonIcons" },
      _timestamps: {
        created_at: 1673795905972,
        created_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
        updated_at: 1673795905972,
        updated_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
      },
    },
  ],
  income: [
    {
      name: "salary",
      id: "13",
      icon: { name: "cash", color: "default", pack: "IonIcons" },
      _timestamps: {
        created_at: 1673795905972,
        created_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
        updated_at: 1673795905972,
        updated_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
      },
    },
    {
      name: "bonus",
      id: "14",
      icon: { name: "gift", color: "default", pack: "IonIcons" },
      _timestamps: {
        created_at: 1673795905972,
        created_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
        updated_at: 1673795905972,
        updated_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
      },
    },
    {
      name: "interest",
      id: "15",
      icon: { name: "trending-up", color: "default", pack: "IonIcons" },
      _timestamps: {
        created_at: 1673795905972,
        created_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
        updated_at: 1673795905972,
        updated_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
      },
    },
    {
      name: "selling",
      id: "16",
      icon: { name: "basket", color: "default", pack: "IonIcons" },
      _timestamps: {
        created_at: 1673795905972,
        created_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
        updated_at: 1673795905972,
        updated_by: "wZHyjSIETQgnVnHQ3IKCHOVqGU82",
      },
    },
  ],
};
