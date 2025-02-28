import { WithApiMetadata } from "./BaseApi";

export interface Expense {
  recipient: string;
  description: string;
  amount: number;
}

export type ExpenseApiResponse = WithApiMetadata<Expense>;
