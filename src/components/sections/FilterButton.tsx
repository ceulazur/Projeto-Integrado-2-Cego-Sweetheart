import React from 'react';

interface FilterButtonProps {
  onChange?: (value: string) => void;
  value?: string;
}

export const FilterButton: React.FC<FilterButtonProps> = ({ onChange, value }) => {
  return (
    <div className="flex w-full items-stretch gap-0.5 text-[10px] text-[rgba(27,30,132,1)] font-medium mt-3.5">
      <img
        src="https://api.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/0a1837e8ea5698e9dc31e07f096a1be0096fd0ca?placeholderIfAbsent=true"
        alt="Filter icon"
        className="aspect-[1] object-contain w-6 shrink-0 rounded-[50%]"
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        placeholder="Filtrar Pedido"
        className="bg-white border flex min-h-[26px] items-center gap-2.5 justify-center grow shrink basis-auto px-12 py-[7px] rounded-[20px] border-[rgba(27,30,132,1)] border-solid hover:bg-gray-50 transition-colors outline-none text-center"
        style={{ fontSize: '15px' }}
      />
    </div>
  );
}; 