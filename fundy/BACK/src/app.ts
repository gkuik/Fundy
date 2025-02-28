import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors"

const app = express();
const PORT = 3005;

const prisma = new PrismaClient();

app.use(express.json());
app.use(cors())

const round = (number: number) => {
  return Math.round(number * 100) / 100;
}

const ratio = (value: number, total: number) => {
  if (total === 0) return 0;
  return value / total;
}

app.get("/summary", async (req: Request, res: Response) => {
  try {
    const [members, expenses] = await Promise.all([
      prisma.member.findMany(),
      prisma.expense.findMany(),
    ]);

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalIncomes = members.reduce((sum, member) => sum + member.income, 0);

    const membersWithContribution = members.map(
      (member) => ({
        ...member,
        part: round(ratio(member.income, totalIncomes) * totalExpenses),
        partPercent: round(ratio(member.income, totalIncomes) * 100)
      })
    )

    const expensesWithPart = expenses.map(
      (expense) => {
        return {
          ...expense,
          part: round(ratio(expense.amount, totalExpenses) * 100)
        }
      }
    )

    res.json({
      incomes: {
        total: round(totalIncomes),
        list: membersWithContribution
      },
      expenses: {
        average: round(totalExpenses / expenses.length),
        total: round(totalExpenses),
        list: expensesWithPart
      }
    })
  } catch (e) {
    res.status(500).send("Something went wrong");
  }
})

app.post("/member", async (req: Request, res: Response) => {
  try {
    const newMember = await prisma.member.create({ data: req.body });
    res.json(newMember)
  } catch (e) {
    res.status(500).send("Something went wrong");
  }
})

app.delete("/member", async (req: Request, res: Response) => {
  try {
    const newMember = await prisma.member.delete({ where: { id: req.body.id } })
    res.json(newMember)
  } catch (e) {
    res.status(500).send("Something went wrong");
  }
})

app.get("/member", async (req: Request, res: Response) => {
  try {
    const memberList = await prisma.member.findMany()
    res.json(memberList)
  } catch (e) {
    res.status(500).send("Something went wrong");
  }
})

app.put("/member/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedMember = await prisma.member.update({ where: { id: Number(id) }, data: req.body })
    res.json(updatedMember)
  } catch (e) {
    res.status(500).send("Something went wrong");
  }
})

app.delete("/member/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.member.delete({ where: { id: Number(id) } });
    res.json({ message: "Member deleted successfully" });
  } catch (e) {
    res.status(500).send("Something went wrong");
  }
});

app.post("/expense", async (req: Request, res: Response) => {
  try {
    const newExpense = await prisma.expense.create({ data: req.body });
    res.json(newExpense)
  } catch (e) {
    console.log(e);
    res.status(500).send("Something went wrong");
  }
})

app.delete("/expense/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.expense.delete({ where: { id: Number(id) } });
    res.json({ message: "Expense deleted successfully" });
  } catch (e) {
    res.status(500).send("Something went wrong");
  }
});

app.put("/expense/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedExpense = await prisma.expense.update({ where: { id: Number(id) }, data: req.body });
    res.status(200).json(updatedExpense);
  } catch (e) {
    res.status(500).send("Something went wrong");
  }
});

app.get("/expense", async (req: Request, res: Response) => {
  try {
    const expenseList = await prisma.expense.findMany()
    res.json(expenseList)
  } catch (e) {
    res.status(500).send("Something went wrong");
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
