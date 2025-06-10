import React, { forwardRef } from 'react';

import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  theme?: 'green' | 'blue';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, theme = 'green', className = '', ...props }, ref) => {
    const themeColors = {
      green: 'focus:ring-[rgba(12,212,32,1)] focus:border-[rgba(12,212,32,1)]',
      blue: 'focus:ring-[rgba(12,135,212,1)] focus:border-[rgba(12,135,212,1)]'
    };

    return (
      <div className="w-full">
        <div className="relative">
          <input
            ref={ref}
            className={`
              bg-[rgba(255,255,255,0.4)] 
              border 
              min-h-[82px] 
              w-full 
              gap-2.5 
              px-12 
              py-[27px] 
              rounded-[20px] 
              border-[rgba(96,96,96,1)] 
              border-solid
              text-2xl
              font-normal
              placeholder:text-black
              focus:outline-none
              focus:ring-2
              ${themeColors[theme]}
              ${error ? 'border-red-500' : ''}
              ${className}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p 
            id={`${props.id}-error`}
            className="text-red-500 text-sm mt-2 px-4"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const FormInput = Input;
