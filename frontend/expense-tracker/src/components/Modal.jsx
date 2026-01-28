const Modal = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[92%] max-w-[520px] rounded-2xl shadow-xl p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
        >
          ✕
        </button>
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
