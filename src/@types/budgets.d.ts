import { TimestampsType } from "./timestamps";

/**
 * interface for global budgets
 *
 * @interface IGlobalBudgets
 *
 */
export type GlobalBudgetsType = {
  reducerUpdatedAt: number;
  budgets: Budget[];
};

type Budget = {
  uid: string | number[];
  budget_uid: string | number[];
  budget_name: string;
  limit: number;
  start_date: number;
  end_date: number;
  repeat: boolean;
  _timestamps: TimestampsType;
};
