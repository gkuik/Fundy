import { ExpenseApiResponse } from "./Expense";
import { MemberApiResponse } from "./Member";

type incomeList = MemberApiResponse & {
  part: number;
  partPercent: number;
};

type expenseList = ExpenseApiResponse & {
  part: number;
};

export interface Summary {
  incomes: {
    total: number;
    list: incomeList[]
  },
  expenses: {
    average: number,
    total: number,
    list: expenseList[]
  }
}