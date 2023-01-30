import { GlobalCategoriesType } from "../../@types/categories";

const initialCategories = {
  reducerUpdatedAt: Date.now(),
  categories: {
    uid: null,
    expense: [
      {
        name: "food and drink",
        id: "1",
        icon: { name: "fast-food", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now(),
          updated_at: Date.now(),
          created_by: null,
          updated_by: null,
        },
      },
      {
        name: "bills and utilities",
        id: "2",
        icon: { name: "flash", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now(),
          updated_at: Date.now(),
          created_by: null,
          updated_by: null,
        },
      },
      {
        name: "transportation",
        id: "3",
        icon: { name: "bus", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now(),
          updated_at: Date.now(),
          created_by: null,
          updated_by: null,
        },
      },
      {
        name: "shopping",
        id: "4",
        icon: { name: "cart", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now(),
          updated_at: Date.now(),
          created_by: null,
          updated_by: null,
        },
      },
      {
        name: "entertainment",
        id: "5",
        icon: { name: "game-controller", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now(),
          updated_at: Date.now(),
          created_by: null,
          updated_by: null,
        },
      },
      {
        name: "travel",
        id: "6",
        icon: { name: "airplane", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now(),
          updated_at: Date.now(),
          created_by: null,
          updated_by: null,
        },
      },
      {
        name: "health",
        id: "7",
        icon: { name: "medical", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now(),
          updated_at: Date.now(),
          created_by: null,
          updated_by: null,
        },
      },
      {
        name: "sport",
        id: "8",
        icon: { name: "football", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now(),
          updated_at: Date.now(),
          created_by: null,
          updated_by: null,
        },
      },
      {
        name: "donations",
        id: "9",
        icon: { name: "heart", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now(),
          updated_at: Date.now(),
          created_by: null,
          updated_by: null,
        },
      },
      {
        name: "education",
        id: "10",
        icon: { name: "school", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now(),
          updated_at: Date.now(),
          created_by: null,
          updated_by: null,
        },
      },
      {
        name: "subscription",
        id: "11",
        icon: { name: "receipt", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now(),
          updated_at: Date.now(),
          created_by: null,
          updated_by: null,
        },
      },
      {
        name: "gadget",
        id: "12",
        icon: { name: "phone-portrait", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now(),
          updated_at: Date.now(),
          created_by: null,
          updated_by: null,
        },
      },
    ],
    income: [
      {
        name: "salary",
        id: "13",
        icon: { name: "cash", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now(),
          updated_at: Date.now(),
          created_by: null,
          updated_by: null,
        },
      },
      {
        name: "bonus",
        id: "14",
        icon: { name: "gift", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now(),
          updated_at: Date.now(),
          created_by: null,
          updated_by: null,
        },
      },
      {
        name: "interest",
        id: "15",
        icon: { name: "trending-up", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now(),
          updated_at: Date.now(),
          created_by: null,
          updated_by: null,
        },
      },
      {
        name: "selling",
        id: "16",
        icon: { name: "basket", color: "default", pack: "IonIcons" },
        _timestamps: {
          created_at: Date.now(),
          updated_at: Date.now(),
          created_by: null,
          updated_by: null,
        },
      },
    ],
  },
} satisfies GlobalCategoriesType;

export default initialCategories;
