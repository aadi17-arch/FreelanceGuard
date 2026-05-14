import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Clean & Simple Input Component
 */
export const FormInput = ({ 
  label, 
  type = "text", 
  error, 
  success,
  icon: Icon, 
  placeholder, 
  required,
  autoFocus,
  name,
  value,
  onChange,
  onBlur,
  className = ""
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="text-[13px] font-semibold text-zinc-600 ml-1">
          {label} {required && <span className="text-emerald-500">*</span>}
        </label>
      )}
      
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors">
            <Icon size={16} strokeWidth={2} />
          </div>
        )}
        
        <input
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoFocus={autoFocus}
          required={required}
          className={`
            w-full bg-zinc-50 border-2 rounded-xl py-3.5 transition-all outline-none text-[15px] font-medium
            ${Icon ? 'pl-11' : 'px-5'}
            ${isPassword ? 'pr-11' : 'pr-5'}
            ${error 
              ? 'border-red-100 focus:border-red-200 text-red-600 placeholder:text-red-300' 
              : success
                ? 'border-emerald-100 focus:border-emerald-200 text-emerald-700'
                : 'border-zinc-50 focus:border-emerald-100 text-zinc-900 placeholder:text-zinc-400 focus:bg-white'}
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 ml-1 text-red-500">
          <AlertCircle size={12} />
          <span className="text-[12px] font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};

/**
 * Clean & Simple Button Component
 */
export const FormButton = ({ 
  children, 
  isLoading, 
  disabled, 
  type = "submit", 
  variant = "primary",
  className = ""
}) => {
  const baseStyles = "w-full py-3.5 rounded-xl font-bold text-[15px] transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-zinc-900 text-white hover:bg-emerald-600 shadow-lg shadow-black/5",
    secondary: "bg-white border-2 border-zinc-100 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900",
    success: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/10"
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 border-2 border-white border-t-white rounded-full animate-spin" />
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};





