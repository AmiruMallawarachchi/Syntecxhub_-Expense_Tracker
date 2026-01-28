import xlsx from "xlsx";

export const generateExcel = (rows, sheetName) => {
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(rows);
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
  return xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });
};
