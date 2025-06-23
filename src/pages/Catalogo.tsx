import * as React from "react";
import { Header } from "../components/layout/Header";
import { CatalogSection } from "../components/sections/CatalogSection";

interface CatalogoProps {
  className?: string;
}

const Catalogo: React.FC<CatalogoProps> = ({ className = "" }) => {
  return (
    <main className={`flex overflow-hidden flex-col pt-4 pb-7 mx-auto w-full bg-white max-w-[480px] ${className}`}>
      <Header />
      <CatalogSection />
    </main>
  );
};

export default Catalogo; 