import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
const Input = ({ value, onChange, placeholder,label, type }) => {
    const [showpassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showpassword);
    };
  return (
    <div>
        <label className="text-[13px] text-slate-800">{label}</label>

        <div className="mt-2 relative">
            <input 
                type={type === "password" ? (showpassword ? "text" : "password") : type}
                placeholder={placeholder}
                className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                value={value}
                onChange={(e) => onChange(e)}
                />


                {type === "password" && (
                    <>
                    {showpassword ? (
                        <FaRegEye
                        size={22}
                        className="text-primary cursor-pointer"
                        onClick={() => toggleShowPassword()}
                    />
                    ) : (
                        <FaRegEyeSlash
                        size={22}
                        className="text-slate-400 cursor-pointer"
                        onClick={() => toggleShowPassword()}
                        />
                    )}
                </>
            )}  
        </div>
    </div>   
  )
}

export default Input
