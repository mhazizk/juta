import { IBudget } from "../@types/budgets";
import uuid from "react-native-uuid";

interface newBudgetProps {
  uid: string | number[];
}

/**
 * create new budget
 *
 * @param props uid
 * @returns new budget
 */
const newBudget = (props: newBudgetProps) => {
  return {
    uid: props.uid,
    budget_uid: uuid.v4(),
    budget_name: "Monthly Budget",
    limit: 0,
    start_date: +new Date().setHours(0, 0, 0, 0),
    end_date: new Date(Date.now() + 2629746000).setHours(0, 0, 0, 0),
    repeat: false,
  } satisfies IBudget;
};

export default newBudget;
