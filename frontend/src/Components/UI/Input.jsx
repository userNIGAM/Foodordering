import React from "react";

const Input = ({
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  name,
  autoComplete,
  rightIcon,
  onRightIconClick,
  disabled = false,
}) => (
  <div className="group relative">
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
      <Icon className="h-5 w-5 text-slate-400" />
    </div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      disabled={disabled}
      className="w-full rounded-2xl border border-slate-200 bg-white/80 pl-12 pr-12 py-3 text-slate-800 placeholder-slate-400 shadow-sm outline-none ring-0 transition focus:border-indigo-400 focus:bg-white focus:shadow-md disabled:opacity-70"
    />
    {rightIcon && (
      <button
        type="button"
        onClick={onRightIconClick}
        className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600"
        aria-label="toggle visibility"
      >
        {rightIcon}
      </button>
    )}
  </div>
);

export default Input;
