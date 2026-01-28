import moment from "moment";

export const formatCurrency = (value) => {
  if (Number.isNaN(Number(value))) return "$0";
  return `$${Number(value).toLocaleString()}`;
};

export const formatDate = (date) => {
  return moment(date).format("DD MMM YYYY");
};

export const groupLast30Days = (items) => {
  const map = new Map();
  items.forEach((item) => {
    const key = moment(item.date).format("DD MMM");
    map.set(key, (map.get(key) || 0) + item.amount);
  });
  return Array.from(map.entries()).map(([date, amount]) => ({ date, amount }));
};
