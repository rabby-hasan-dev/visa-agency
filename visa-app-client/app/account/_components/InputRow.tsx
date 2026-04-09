import { UseFormRegisterReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

interface InputRowProps {
  label: string;
  isRequired?: boolean;
  type?: string;
  registerProps?: Partial<UseFormRegisterReturn>;
  error?: string;
  placeholder?: string;
  onTogglePassword?: () => void;
  showPassword?: boolean;
  className?: string;
}

export const InputRow = ({
  label,
  isRequired = false,
  type = "text",
  registerProps = {},
  error,
  placeholder = "",
  onTogglePassword,
  showPassword,
  className = "",
}: InputRowProps) => (
  <div className={`flex flex-col mb-4 ${className}`}>
    <div className="flex flex-col sm:flex-row sm:items-center">
      <label className="w-full sm:w-[180px] text-[13px] text-gray-800 font-sans mb-1.5 sm:mb-0">
        {label} {isRequired && <span className="text-[#c41a1f]">*</span>}
      </label>
      <div className="flex-1 flex items-center w-full">
        {type === "select" ? (
          <select
            {...registerProps}
            className={`border ${error ? "border-[#c41a1f]" : "border-gray-400"} px-2 py-1.5 w-full sm:w-[280px] text-[13px] rounded-none focus:outline-none bg-white`}
          >
            <option></option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Ms">Ms</option>
            <option value="Miss">Miss</option>
            <option value="Dr">Dr</option>
          </select>
        ) : (
          <div className="relative w-full sm:w-[280px]">
            <input
              type={showPassword !== undefined ? (showPassword ? "text" : "password") : type}
              {...registerProps}
              placeholder={placeholder}
              className={`border ${error ? "border-[#c41a1f]" : "border-gray-400"} px-2 py-1.5 w-full text-[13px] rounded-none focus:outline-none pr-8 bg-white`}
            />
            {onTogglePassword && (
              <button
                type="button"
                onClick={onTogglePassword}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1b3564]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>
        )}
        {isRequired && type !== "password" && type !== "select" && (
          <div className="w-4 h-4 rounded-full bg-[#1b3564] text-white text-[10px] flex items-center justify-center font-bold ml-2 cursor-pointer">
            ?
          </div>
        )}
      </div>
    </div>
    {error && (
      <div className="sm:ml-[180px] text-[#c41a1f] text-[11px] mt-1 font-medium">
        {error}
      </div>
    )}
  </div>
);
