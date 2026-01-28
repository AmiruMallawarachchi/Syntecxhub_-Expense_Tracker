import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Modal from "../../components/Modal";
import Input from "../../components/Inputs/Input";
import IconPicker from "../../components/IconPicker";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { formatCurrency, formatDate } from "../../utils/helper";
import { incomeIconOptions } from "../../utils/data";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";

const Income = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    date: "",
    icon: ""
  });
  const [incomes, setIncomes] = useState([]);

  const fetchIncome = async () => {
    const response = await axiosInstance.get(API_PATHS.INCOME.LIST);
    setIncomes(response.data.incomes || []);
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.title || !formData.amount || !formData.date) {
      toast.error("Please fill all required fields.");
      return;
    }
    await axiosInstance.post(API_PATHS.INCOME.ADD, {
      ...formData,
      amount: Number(formData.amount)
    });
    toast.success("Income added");
    setShowModal(false);
    setFormData({ title: "", amount: "", date: "", icon: "" });
    fetchIncome();
  };

  const handleDelete = async (id) => {
    await axiosInstance.delete(API_PATHS.INCOME.DELETE(id));
    toast.success("Income deleted");
    fetchIncome();
  };

  const handleDownload = async () => {
    const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD, {
      responseType: "blob"
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "income-report.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const chartData = incomes.map((item) => ({
    ...item,
    label: formatDate(item.date)
  }));

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-800">Income Overview</h3>
            <p className="text-xs text-slate-500 mt-1">
              Track your earnings over time and analyze your income trends.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-purple-100 text-primary px-4 py-2 rounded-lg text-sm font-semibold"
          >
            + Add Income
          </button>
        </div>
        <div className="h-[300px] mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="amount" fill="#7C3AED" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5 mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-800">Income Sources</h3>
          <button
            type="button"
            onClick={handleDownload}
            className="text-sm text-slate-600 hover:text-primary"
          >
            Download
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {incomes.map((item) => (
            <div
              key={item._id}
              className="group flex items-center justify-between bg-slate-50 rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center text-lg">
                  {item.icon || "💼"}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500">{formatDate(item.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-green-600">
                  +{formatCurrency(item.amount)}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(item._id)}
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
        <Modal title="Add Income" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <IconPicker
              label="Pick Icon"
              options={incomeIconOptions}
              value={formData.icon}
              onChange={(icon) => setFormData((prev) => ({ ...prev, icon }))}
            />
            <Input
              value={formData.title}
              onChange={({ target }) => setFormData((prev) => ({ ...prev, title: target.value }))}
              label="Income Source"
              placeholder="Freelance, Salary, etc"
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
                Add Income
              </button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default Income;
