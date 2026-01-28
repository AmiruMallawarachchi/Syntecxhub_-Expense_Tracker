import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Modal from "../../components/Modal";
import Input from "../../components/Inputs/Input";
import IconPicker from "../../components/IconPicker";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { formatCurrency, formatDate } from "../../utils/helper";
import { expenseIconOptions } from "../../utils/data";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";

const Expense = () => {
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    date: "",
    icon: ""
  });
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    const response = await axiosInstance.get(API_PATHS.EXPENSE.LIST);
    setExpenses(response.data.expenses || []);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.category || !formData.amount || !formData.date) {
      toast.error("Please fill all required fields.");
      return;
    }
    await axiosInstance.post(API_PATHS.EXPENSE.ADD, {
      ...formData,
      amount: Number(formData.amount)
    });
    toast.success("Expense added");
    setShowModal(false);
    setFormData({ category: "", amount: "", date: "", icon: "" });
    fetchExpenses();
  };

  const handleDelete = async () => {
    await axiosInstance.delete(API_PATHS.EXPENSE.DELETE(confirmDelete));
    toast.success("Expense deleted");
    setConfirmDelete(null);
    fetchExpenses();
  };

  const handleDownload = async () => {
    const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD, {
      responseType: "blob"
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "expense-report.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const chartData = expenses.map((item) => ({
    ...item,
    label: formatDate(item.date)
  }));

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-800">Expense Overview</h3>
            <p className="text-xs text-slate-500 mt-1">
              Track your spending trends over time and gain insights into where your money goes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-purple-100 text-primary px-4 py-2 rounded-lg text-sm font-semibold"
          >
            + Add Expense
          </button>
        </div>
        <div className="h-[300px] mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#7C3AED" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5 mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-800">All Expenses</h3>
          <button
            type="button"
            onClick={handleDownload}
            className="text-sm text-slate-600 hover:text-primary"
          >
            Download
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {expenses.map((item) => (
            <div
              key={item._id}
              className="group flex items-center justify-between bg-slate-50 rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center text-lg">
                  {item.icon || "🛍️"}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.category}</p>
                  <p className="text-xs text-slate-500">{formatDate(item.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-red-500">
                  -{formatCurrency(item.amount)}
                </span>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(item._id)}
                  className="opacity-0 group-hover:opacity-100 text-red-500 text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <Modal title="Add Expense" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <IconPicker
              label="Pick Icon"
              options={expenseIconOptions}
              value={formData.icon}
              onChange={(icon) => setFormData((prev) => ({ ...prev, icon }))}
            />
            <Input
              value={formData.category}
              onChange={({ target }) => setFormData((prev) => ({ ...prev, category: target.value }))}
              label="Category"
              placeholder="Rent, Groceries, etc"
              type="text"
            />
            <Input
              value={formData.amount}
              onChange={({ target }) => setFormData((prev) => ({ ...prev, amount: target.value }))}
              label="Amount"
              placeholder="0"
              type="number"
            />
            <Input
              value={formData.date}
              onChange={({ target }) => setFormData((prev) => ({ ...prev, date: target.value }))}
              label="Date"
              placeholder="dd/mm/yyyy"
              type="date"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg"
              >
                Add Expense
              </button>
            </div>
          </form>
        </Modal>
      )}

      {confirmDelete && (
        <Modal title="Delete Expense" onClose={() => setConfirmDelete(null)}>
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this expense detail?
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setConfirmDelete(null)}
              className="text-sm text-slate-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default Expense;
