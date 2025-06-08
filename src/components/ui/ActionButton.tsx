import React from "react";
import { cn } from "@/lib/utils";

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  variant = "primary",
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        "min-h-7 gap-2.5 text-[13px] font-medium px-8 py-1.5 rounded-[20px] border border-solid",
        variant === "primary" &&
          "bg-[rgba(27,30,132,1)] text-white border-[rgba(96,96,96,1)]",
        variant === "secondary" &&
          "bg-[rgba(245,0,0,0)] text-[rgba(245,0,0,1)] border-[rgba(245,0,0,1)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}; 