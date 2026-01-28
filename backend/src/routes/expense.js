import express from "express";
import Expense from "../models/Expense.js";
import authMiddleware from "../middleware/auth.js";
import { generateExcel } from "../utils/excel.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { category, amount, date, icon } = req.body;
    if (!category || !amount || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const expense = await Expense.create({
      userId: req.user._id,
      category,
      amount,
      date,
      icon: icon || ""
    });

    res.status(201).json({ expense });
  } catch (error) {
    res.status(500).json({ message: "Unable to add expense" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const expenses = await Expense.find({ userId: req.user._id }).sort({
    date: -1
  });
  res.json({ expenses });
});

router.delete("/:id", authMiddleware, async (req, res) => {
  await Expense.deleteOne({ _id: req.params.id, userId: req.user._id });
  res.json({ message: "Expense deleted" });
});

router.get("/download", authMiddleware, async (req, res) => {
  const expenses = await Expense.find({ userId: req.user._id }).sort({
    date: -1
  });
  const rows = expenses.map((item) => ({
    Category: item.category,
    Amount: item.amount,
    Date: item.date,
    Icon: item.icon
  }));

  const buffer = generateExcel(rows, "Expense");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=expense-report.xlsx"
  );
  res.setHeader("Content-Type", "application/vnd.openxmlformats");
  res.end(buffer);
});

export default router;
