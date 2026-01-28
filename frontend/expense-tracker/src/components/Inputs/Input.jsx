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
                className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary pr-10"
                value={value}
                onChange={(e) => onChange(e)}
                />


                {type === "password" && (
                    <>
                    {showpassword ? (
                        <FaRegEye
                        size={20}
                        className="text-primary cursor-pointer absolute right-3 top-1/2 -translate-y-1/2"
                        onClick={() => toggleShowPassword()}
                    />
                    ) : (
                        <FaRegEyeSlash
                        size={20}
                        className="text-slate-400 cursor-pointer absolute right-3 top-1/2 -translate-y-1/2"
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
