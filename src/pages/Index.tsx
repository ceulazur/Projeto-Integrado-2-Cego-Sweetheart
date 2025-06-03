import React from 'react';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { InfoSection } from '@/components/sections/InfoSection';

const Index: React.FC = () => {
  return (
    <main className="bg-white max-w-[480px] w-full overflow-hidden mx-auto pb-[184px] px-[9px]">
      <Header />
      <Hero />
      <InfoSection />
    </main>
  );
};

export default Index;
