import * as React from "react";
import { ProductCard } from "./ProductCard";
import { useProducts } from "../../hooks/useProducts";
import { Skeleton } from "../ui/skeleton";

const CatalogSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3.5">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="flex flex-col space-y-3">
        <Skeleton className="h-[175px] w-[190px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
    ))}
  </div>
);

export const CatalogSection: React.FC = () => {
  const { data: products, isLoading, error } = useProducts();

  return (
    <section className="mt-6 w-full">
      <div className="flex flex-col items-start text-center text-red-600">
        <h2 className="text-4xl font-extrabold">
          CATÁLOGO
        </h2>
        <p className="mt-2.5 text-base">
          Aqui ficam os produtos dos seus artistas preferidos
        </p>
        <div className="self-stretch mt-2.5 w-full border border-black border-solid min-h-px" />
      </div>

      {isLoading && <CatalogSkeleton />}

      {error && (
         <p className="mt-4 text-center text-red-500">
           Erro ao carregar produtos. Tente novamente mais tarde.
         </p>
      )}

      {!isLoading && !error && products && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3.5">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              title={product.title}
              artistHandle={product.artistHandle}
              price={product.price}
              imageUrl={product.imageUrl}
              productId={product.id}
              shadowClass={index % 2 === 1 ? "shadow-[4px_4px_4px_rgba(0,0,0,1)]" : "shadow-[4px_4px_10px_rgba(0,0,0,1)]"}
              className="my-auto"
            />
          ))}
        </div>
      )}

      {!isLoading && !error && (!products || products.length === 0) && (
        <p className="mt-4 text-center text-gray-500">
          Nenhum produto disponível no momento.
        </p>
      )}
    </section>
  );
}; 