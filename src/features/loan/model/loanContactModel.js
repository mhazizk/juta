const loanContactModel = {
  uid: null,
  loan_id: null,
  contacts: [
    {
      name: "John Doe",
      uid: "1234567890",
      type: "individual",
      payment_due_date: null,
      is_paid: false,
      icon: {
        name: "fast-food",
        color: "default",
        pack: "IonIcons",
      },
      transactions_id: [],
    },
  ],
  _timestamps: {
    created_at: Date.now(),
    created_by: null,
    updated_at: Date.now(),
    updated_by: null,
  },
};

export default loanContactModel;
