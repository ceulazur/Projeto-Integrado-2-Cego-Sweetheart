import React from 'react';
import { Header } from '@/components/layout/Header';
import { InfoSection } from '@/components/sections/InfoSection';

export default function Index() {
  return (
    <div className="bg-white flex max-w-[480px] w-full flex-col overflow-hidden items-stretch text-2xl font-normal mx-auto pt-4 pb-[122px]">
      <Header />
      
      <div className="z-10 w-full text-black font-medium -mt-2.5 px-[5px]">
        <InfoSection />
      </div>
    </div>
  );
}
