import { TimestampsType } from "./timestamps";

/**
 * Global categories type
 *
 * @type GlobalCategoriesType
 * @property {string} category_id
 * @property {string} category_name
 * @property {string} category_icon
 * @property {string} category_color
 * @property {string} category_pack
 * @property {string} category_type
 *
 */
export type GlobalCategoriesType = {
  reducerUpdatedAt: number;
  categories: Categories;
};

/**
 * Categories type
 *
 * @type Categories
 * @property {string} uid
 * @property {array} expense
 * @property {array} income
 *
 */
type Categories = {
  uid: string | number[];
  expense: CategoryType[];
  income: CategoryType[];
};

/**
 * Categories type
 *
 * @type Categories
 * @property {string} id
 * @property {string} name
 * @property {object} _timestamps
 * @property {object} icon
 *
 */
export type CategoryType = {
  id: string | number[];
  name: string;
  _timestamps: TimestampsType;
  icon: {
    name: string;
    color: string;
    pack: string;
  };
};
