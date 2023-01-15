const categoriesFallback = ({
  uid = null,
  created_at = null,
  created_by = null,
  updated_at = null,
  updated_by = null,
}) => {
  return {
    uid: uid,
    expense: [
      {
        name: "food and drink",
        id: "1",
        icon: { name: "fast-food", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now() || created_at,
          created_by: null || created_by,
          updated_at: Date.now() || updated_at,
          updated_by: null || updated_by,
        },
      },
      {
        name: "bills and utilities",
        id: "2",
        icon: { name: "flash", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now() || created_at,
          created_by: null || created_by,
          updated_at: Date.now() || updated_at,
          updated_by: null || updated_by,
        },
      },
      {
        name: "transportation",
        id: "3",
        icon: { name: "bus", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now() || created_at,
          created_by: null || created_by,
          updated_at: Date.now() || updated_at,
          updated_by: null || updated_by,
        },
      },
      {
        name: "shopping",
        id: "4",
        icon: { name: "cart", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now() || created_at,
          created_by: null || created_by,
          updated_at: Date.now() || updated_at,
          updated_by: null || updated_by,
        },
      },
      {
        name: "entertainment",
        id: "5",
        icon: { name: "game-controller", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now() || created_at,
          created_by: null || created_by,
          updated_at: Date.now() || updated_at,
          updated_by: null || updated_by,
        },
      },
      {
        name: "travel",
        id: "6",
        icon: { name: "airplane", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now() || created_at,
          created_by: null || created_by,
          updated_at: Date.now() || updated_at,
          updated_by: null || updated_by,
        },
      },
      {
        name: "health",
        id: "7",
        icon: { name: "medical", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now() || created_at,
          created_by: null || created_by,
          updated_at: Date.now() || updated_at,
          updated_by: null || updated_by,
        },
      },
      {
        name: "sport",
        id: "8",
        icon: { name: "football", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now() || created_at,
          created_by: null || created_by,
          updated_at: Date.now() || updated_at,
          updated_by: null || updated_by,
        },
      },
      {
        name: "donations",
        id: "9",
        icon: { name: "heart", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now() || created_at,
          created_by: null || created_by,
          updated_at: Date.now() || updated_at,
          updated_by: null || updated_by,
        },
      },
      {
        name: "education",
        id: "10",
        icon: { name: "school", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now() || created_at,
          created_by: null || created_by,
          updated_at: Date.now() || updated_at,
          updated_by: null || updated_by,
        },
      },
      {
        name: "subscription",
        id: "11",
        icon: { name: "receipt", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now() || created_at,
          created_by: null || created_by,
          updated_at: Date.now() || updated_at,
          updated_by: null || updated_by,
        },
      },
      {
        name: "gadget",
        id: "12",
        icon: { name: "phone-portrait", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now() || created_at,
          created_by: null || created_by,
          updated_at: Date.now() || updated_at,
          updated_by: null || updated_by,
        },
      },
    ],
    income: [
      {
        name: "salary",
        id: "13",
        icon: { name: "cash", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now() || created_at,
          created_by: null || created_by,
          updated_at: Date.now() || updated_at,
          updated_by: null || updated_by,
        },
      },
      {
        name: "bonus",
        id: "14",
        icon: { name: "gift", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now() || created_at,
          created_by: null || created_by,
          updated_at: Date.now() || updated_at,
          updated_by: null || updated_by,
        },
      },
      {
        name: "interest",
        id: "15",
        icon: { name: "trending-up", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now() || created_at,
          created_by: null || created_by,
          updated_at: Date.now() || updated_at,
          updated_by: null || updated_by,
        },
      },
      {
        name: "selling",
        id: "16",
        icon: { name: "basket", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now() || created_at,
          created_by: null || created_by,
          updated_at: Date.now() || updated_at,
          updated_by: null || updated_by,
        },
      },
    ],
  };
};
export default categoriesFallback;
