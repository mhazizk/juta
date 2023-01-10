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
