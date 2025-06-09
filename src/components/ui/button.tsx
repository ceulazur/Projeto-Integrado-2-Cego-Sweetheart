import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary', 
  children,
  className = '',
  ...props
}) => {
  const baseClasses = `
    border 
    min-h-[81px] 
    w-full 
    gap-2.5 
    px-12 
    py-[26px] 
    rounded-[20px] 
    border-[rgba(96,96,96,1)] 
    border-solid
    text-2xl
    font-normal
    transition-all
    duration-200
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
    disabled:opacity-50
    disabled:cursor-not-allowed
  `;
  
  const variantClasses = {
    primary: `
      bg-[rgba(12,212,32,1)] 
      text-white 
      hover:bg-[rgba(10,190,28,1)]
      focus:ring-[rgba(12,212,32,1)]
      active:bg-[rgba(8,170,25,1)]
    `,
    secondary: `
      bg-white 
      text-black 
      hover:bg-gray-50
      focus:ring-gray-300
    `
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
