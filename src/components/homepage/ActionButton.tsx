import React from "react";

interface ActionButtonProps {
  variant: "primary" | "secondary";
  children: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ variant, children }) => {
  const baseStyles = "px-4 py-2 font-bold text-[15px] transition-all duration-300";
  const variantStyles = {
    primary: "bg-[rgba(27,30,132,1)] text-white hover:bg-[rgba(27,30,132,0.9)]",
    secondary: "bg-[rgba(245,0,0,1)] text-white hover:bg-[rgba(245,0,0,0.9)]"
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]}`}>
      {children}
    </button>
  );
}; 