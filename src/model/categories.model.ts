import { ICategories } from "../@types/categories";
import initialCategories from "../reducers/initial-state/initialCategories";

interface newCategoriesProps {
  uid: string | number[];
}


/**
 * create new categories
 *
 * @param props uid
 * @returns new categories
 */
const newCategories = (props: newCategoriesProps) => {
  const initCategories = initialCategories;

  return {
    uid: props.uid,
    expense: initCategories.categories.expense.map((category) => {
      return {
        ...category,
        _timestamps: {
          ...category._timestamps,
          created_by: props.uid,
          updated_by: props.uid,
        },
      };
    }),
    income: initCategories.categories.income.map((category) => {
      return {
        ...category,
        _timestamps: {
          ...category._timestamps,
          created_by: props.uid,
          updated_by: props.uid,
        },
      };
    }),
  } satisfies ICategories;
};
export default newCategories;
