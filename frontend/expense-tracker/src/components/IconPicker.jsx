import { useState } from "react";
import { FiImage } from "react-icons/fi";

const IconPicker = ({ label, options, value, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <label className="text-[13px] text-slate-800">{label}</label>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-slate-700 bg-slate-50"
        >
          <FiImage className="text-primary" />
          {value || "Pick Icon"}
        </button>
      </div>
      {open && (
        <div className="mt-3 grid grid-cols-6 gap-2">
          {options.map((icon) => (
            <button
              type="button"
              key={icon}
              onClick={() => {
                onChange(icon);
                setOpen(false);
              }}
              className="w-10 h-10 rounded-lg border bg-white text-lg hover:bg-slate-50"
            >
              {icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default IconPicker;
