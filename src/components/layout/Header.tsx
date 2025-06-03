import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full">
      <div className="flex min-h-[45px] w-full gap-[40px_66px] text-2xl text-[rgba(245,0,0,1)] font-normal justify-between mt-1">
        <div className="flex min-w-60 h-[45px] items-center gap-2.5 w-[293px]">
          <div className="self-stretch flex w-56 items-stretch my-auto">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/38b306e209efe8e1d8b31598829d8ef393b83299?placeholderIfAbsent=true"
              alt="CEGO Logo"
              className="aspect-[1.17] object-contain w-[75px] shrink-0"
            />
            <div className="grow shrink w-[145px] mt-[15px]">
              CEGO <span className="text-[rgba(27,30,132,1)]">SWEETHEART</span>
            </div>
          </div>
        </div>
        <button aria-label="Menu" className="focus:outline-none">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/f41bb419ef66d4b6555ac235fcba6024f11f162c?placeholderIfAbsent=true"
            alt="Menu"
            className="aspect-[1] object-contain w-7 shrink-0"
          />
        </button>
      </div>
      <div className="border w-[389px] shrink-0 max-w-full h-0.5 mt-2 border-black border-solid" />
      <nav className="flex w-full items-stretch gap-5 justify-between">
        <div className="flex items-center justify-between">
          <div className="self-stretch flex w-[13px] items-center gap-0.5 justify-center my-auto">
            <div className="bg-[rgba(27,30,132,1)] self-stretch flex min-h-[13px] w-[13px] items-center gap-2.5 justify-center h-[13px] my-auto px-px rounded-md">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/e12debdbb7b683508e966ada7827870d604439f4?placeholderIfAbsent=true"
                alt="Navigation icon"
                className="aspect-[1] object-contain w-2 self-stretch my-auto"
              />
            </div>
          </div>
        </div>
        <button className="flex items-stretch gap-0.5 text-[11px] text-[rgba(27,30,132,1)] font-bold">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/1a51f03046039b4f997452b54e692067dd12856f?placeholderIfAbsent=true"
            alt="Account icon"
            className="aspect-[1] object-contain w-[7px] shrink-0 my-auto"
          />
          <span>Minha conta</span>
        </button>
      </nav>
    </header>
  );
};
