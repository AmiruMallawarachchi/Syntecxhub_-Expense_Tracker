import { useRef } from "react";
import { FiUpload } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

const ProfilePhotoSelector = ({ value, onChange }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex justify-center">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden border">
          {value ? (
            <img src={value} alt="profile" className="w-full h-full object-cover" />
          ) : (
            <FiUpload className="text-purple-600 text-2xl" />
          )}
        </div>
        <button
          type="button"
          onClick={() => (value ? onChange("") : fileInputRef.current?.click())}
          className="absolute -right-1 -bottom-1 w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center"
        >
          {value ? <MdDelete size={16} /> : <FiUpload size={14} />}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ProfilePhotoSelector;
