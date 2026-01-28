import express from "express";
import authMiddleware from "../middleware/auth.js";
import Income from "../models/Income.js";
import Expense from "../models/Expense.js";

const router = express.Router();

const getStartDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
};

router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user._id;

  const [incomes, expenses] = await Promise.all([
    Income.find({ userId }).sort({ date: -1 }),
    Expense.find({ userId }).sort({ date: -1 })
  ]);

  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  const recentTransactions = [
    ...incomes.map((item) => ({
      ...item.toObject(),
      type: "income",
      title: item.title
    })),
    ...expenses.map((item) => ({
      ...item.toObject(),
      type: "expense",
      title: item.category
    }))
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const last30DaysStart = getStartDate(30);
  const last30DaysExpenses = expenses
    .filter((item) => new Date(item.date) >= last30DaysStart)
    .map((item) => ({
      date: item.date,
      amount: item.amount
    }));

  const last60DaysStart = getStartDate(60);
  const last60DaysIncome = incomes
    .filter((item) => new Date(item.date) >= last60DaysStart)
    .map((item) => ({
      title: item.title,
      amount: item.amount
    }));

  res.json({
    summary: {
      totalIncome,
      totalExpense,
      totalBalance
    },
    recentTransactions,
    last30DaysExpenses,
    last60DaysIncome,
    incomeList: incomes.slice(0, 6),
    expenseList: expenses.slice(0, 6)
  });
});

export default router;
