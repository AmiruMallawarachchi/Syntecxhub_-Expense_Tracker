import express from "express";
import Income from "../models/Income.js";
import authMiddleware from "../middleware/auth.js";
import { generateExcel } from "../utils/excel.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, amount, date, icon } = req.body;
    if (!title || !amount || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const income = await Income.create({
      userId: req.user._id,
      title,
      amount,
      date,
      icon: icon || ""
    });

    res.status(201).json({ income });
  } catch (error) {
    res.status(500).json({ message: "Unable to add income" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const incomes = await Income.find({ userId: req.user._id }).sort({ date: -1 });
  res.json({ incomes });
});

router.delete("/:id", authMiddleware, async (req, res) => {
  await Income.deleteOne({ _id: req.params.id, userId: req.user._id });
  res.json({ message: "Income deleted" });
});

router.get("/download", authMiddleware, async (req, res) => {
  const incomes = await Income.find({ userId: req.user._id }).sort({ date: -1 });
  const rows = incomes.map((item) => ({
    Title: item.title,
    Amount: item.amount,
    Date: item.date,
    Icon: item.icon
  }));

  const buffer = generateExcel(rows, "Income");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=income-report.xlsx"
  );
  res.setHeader("Content-Type", "application/vnd.openxmlformats");
  res.end(buffer);
});

export default router;
