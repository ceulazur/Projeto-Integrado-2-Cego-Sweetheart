import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className,
  ...props 
}) => {
  return (
    <button
      className={cn(
        'min-h-7 gap-2.5 text-[13px] font-medium rounded-[20px] px-8 py-1.5',
        variant === 'primary' && 'bg-[rgba(27,30,132,1)] text-white border-[rgba(96,96,96,1)]',
        variant === 'outline' && 'bg-[rgba(245,0,0,0)] text-[rgba(245,0,0,1)] border-[rgba(245,0,0,1)]',
        'border border-solid',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
