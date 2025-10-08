import React from "react";

export default function Input({
                                  type = "text",
                                  placeholder,
                                  hasFocusStyles = true,
                                  value,
                                  onChange,
                                  icon,
                                  defaultValue,
                                  rows,
                                  multiline,
                                  readonly,
                                  autoComplete,
                                  onClick,
                                  children,
                                  className = "",
                              }) {
    const InputTag = multiline ? "textarea" : "input";

    // Definisci la classe che verrà applicata solo se hasFocusStyles è true
    const focusStyles = hasFocusStyles ? "focus:outline-none focus:border-myColor-default focus:ring-myColor-light focus:ring-4 transition duration-400 ease-in-out" : "";

    return (
        <div className="relative w-full">
            <InputTag
                type={type}
                placeholder={placeholder}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                autoComplete={autoComplete}
                readOnly={readonly}
                rows={rows}
                onClick={onClick}
                className={`border-2 border-gray-100 p-2 text-[0.9rem] rounded-md w-full shadow-sm ${focusStyles} ${className}`}
            />
            {icon && (
                <div className="absolute left-2 top-2">
                    {icon}
                </div>
            )}
            {children && (
                <div className="flex flex-row space-x-2 absolute right-2 bottom-2 mb-2.5">
                    {children}
                </div>
            )}
        </div>
    );
}
