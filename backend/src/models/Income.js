import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    icon: { type: String, default: "" }
  },
  { timestamps: true }
);

const Income = mongoose.model("Income", incomeSchema);

export default Income;
