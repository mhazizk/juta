const logbooks = [
  {
    _timestamps: { created_at: 1673328383358, updated_at: 1673328383358 },
    _id: "11ca3f4a-dea9-48e6-b058-ca1935cf6b65",
    uid: "3tC6Pyal8rM54ssy11TBy2o8Kh52",
    logbook_currency: { name: "IDR", symbol: "Rp", isoCode: "id" },
    logbook_type: "basic",
    logbook_id: "logbook1",
    logbook_name: "My Logbook 1",
    logbook_records: [],
    logbook_categories: [],
    __v: 0,
  },
  {
    _timestamps: { created_at: 1673328383358, updated_at: 1673328383358 },
    _id: "11ca3f4a-dea9-48e6-b058-ca1935cf6b65",
    uid: "3tC6Pyal8rM54ssy11TBy2o8Kh52",
    logbook_currency: { name: "IDR", symbol: "Rp", isoCode: "id" },
    logbook_type: "basic",
    logbook_id: "logbook2",
    logbook_name: "My Logbook 2",
    logbook_records: [],
    logbook_categories: [],
    __v: 0,
  },
  {
    _timestamps: { created_at: 1673328383358, updated_at: 1673328383358 },
    _id: "11ca3f4a-dea9-48e6-b058-ca1935cf6b65",
    uid: "3tC6Pyal8rM54ssy11TBy2o8Kh52",
    logbook_currency: { name: "IDR", symbol: "Rp", isoCode: "id" },
    logbook_type: "basic",
    logbook_id: "logbook3",
    logbook_name: "My Logbook 3",
    logbook_records: [],
    logbook_categories: [],
    __v: 0,
  },
];

const transactions = [
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
];

const testing = {
  transactions,
  logbooks,
};

export default testing;
