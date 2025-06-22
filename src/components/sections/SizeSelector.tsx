import React, { useState } from 'react';

interface SizeSelectorProps {
  sizes: string[];
  defaultSize?: string;
  onSizeChange?: (size: string) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  defaultSize = sizes[0],
  onSizeChange
}) => {
  const [selectedSize, setSelectedSize] = useState(defaultSize);

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    onSizeChange?.(size);
  };

  return (
    <div className="flex gap-2 mt-3.5 max-w-full text-sm text-black whitespace-nowrap w-[154px]">
      <div className="flex gap-1">
        <label className="grow my-auto font-light">
          Tamanho:
        </label>
        <button
          className={`overflow-hidden px-2 py-1.5 font-bold rounded-md border border-solid border-zinc-800 ${
            selectedSize === sizes[0] ? 'bg-gray-200' : ''
          }`}
          onClick={() => handleSizeChange(sizes[0])}
        >
          {sizes[0]}
        </button>
      </div>
      <div className="flex gap-1 font-bold">
        {sizes.slice(1).map((size) => (
          <button
            key={size}
            className={`overflow-hidden px-2 py-1.5 rounded-md border border-solid border-zinc-800 ${
              selectedSize === size ? 'bg-gray-200' : ''
            }`}
            onClick={() => handleSizeChange(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}; 