const sortedTransactions = {
  reducerUpdatedAt: 1674292802082,
  logbookToOpen: null,
  groupSorted: [
    {
      logbook_id: "a27a63db-bfcb-4b43-8b22-62bf54bb2104",
      transactions: [
        {
          title: "Thu Jan 19 2023",
          customDate: "2023/01/19",
          data: [
            {
              _id: 1674288193250,
              uid: "Ueig1wSa5RXaEyjiC5S8cxRI53c2",
              logbook_id: "a27a63db-bfcb-4b43-8b22-62bf54bb2104",
              repeat_id: "5fd8f9dd-166e-425f-8e38-ccd55f8824f7",
              transaction_id: "2fbc86f3-729f-4f72-b6bb-dc80fc157442",
              details: {
                type: "cash",
                date: 1674115393250,
                amount: 111,
                in_out: "expense",
                category_id: "2",
                notes: null,
              },
              _timestamps: {
                updated_at: 1674288193250,
                created_at: 1674288193250,
                created_by: "Ueig1wSa5RXaEyjiC5S8cxRI53c2",
                updated_by: "Ueig1wSa5RXaEyjiC5S8cxRI53c2",
              },
            },
          ],
        },
      ],
    },
  ],
};

const afterPatchSortedTransactions = {
  logbookToOpen: null,
  reducerUpdatedAt: 1674294011917,
  groupSorted: [
    {
      logbook_id: "a27a63db-bfcb-4b43-8b22-62bf54bb2104",
      transactions: [
        {
          title: "Sat Jan 21 2023",
          customDate: "2023/01/21",
          data: [
            {
              logbook_id: "a27a63db-bfcb-4b43-8b22-62bf54bb2104",
              transaction_id: "2fbc86f3-729f-4f72-b6bb-dc80fc157442",
              uid: "Ueig1wSa5RXaEyjiC5S8cxRI53c2",
              repeat_id: "5fd8f9dd-166e-425f-8e38-ccd55f8824f7",
              _id: 1674288193250,
              details: {
                in_out: "expense",
                notes: null,
                category_id: "2",
                amount: 111,
                type: "cash",
                date: 1674288193250,
              },
              _timestamps: {
                created_by: "Ueig1wSa5RXaEyjiC5S8cxRI53c2",
                updated_by: "Ueig1wSa5RXaEyjiC5S8cxRI53c2",
                created_at: 1674288193250,
                updated_at: 1674294011917,
              },
            },
          ],
        },
      ],
    },
  ],
};

const insertPatch = {
  newInsertedTransactions: [
    {
      uid: "Ueig1wSa5RXaEyjiC5S8cxRI53c2",
      transaction_id: "982d4a01-c6d6-48c0-9df8-df8035dff47d",
      logbook_id: "a27a63db-bfcb-4b43-8b22-62bf54bb2104",
      details: {
        amount: 999,
        category_id: "2",
        in_out: "expense",
        notes: "Listrik",
        date: 1674210063429,
      },
      _timestamps: {
        created_at: 1674302946269,
        created_by: "Ueig1wSa5RXaEyjiC5S8cxRI53c2",
        updated_at: 1674302946269,
        updated_by: "Ueig1wSa5RXaEyjiC5S8cxRI53c2",
      },
    },
  ],
};

const patchTransaction = {
  newPatchedTransactions: [
    {
      _id: 1674296463429,
      transaction_id: "9a245c9f-b9a0-43cf-922e-b455d4bc0df6",
      repeat_id: "6ebce551-07a7-4164-b814-3d52e688e12d",
      logbook_id: "a27a63db-bfcb-4b43-8b22-62bf54bb2104",
      uid: "Ueig1wSa5RXaEyjiC5S8cxRI53c2",
      details: {
        in_out: "expense",
        amount: 999,
        category_id: "2",
        type: "cash",
        notes: "Listrik",
        date: 1674123663429,
      },
      _timestamps: {
        created_by: "Ueig1wSa5RXaEyjiC5S8cxRI53c2",
        created_at: 1674296463429,
        updated_by: "Ueig1wSa5RXaEyjiC5S8cxRI53c2",
        updated_at: 1674302946268,
      },
    },
  ],
};
