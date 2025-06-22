import * as React from "react";
import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  title: string;
  artistHandle: string;
  price: string;
  imageUrl: string;
}

interface CatalogSectionProps {
  products?: Product[];
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({ products }) => {
  const defaultProducts: Product[] = [
    {
      id: "1",
      title: "Vulk",
      artistHandle: "@ceulazur",
      price: "R$ 50.00",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/45610d9b421b9212bc929c32d87b7875fab83345?placeholderIfAbsent=true"
    },
    {
      id: "2",
      title: "Vulk",
      artistHandle: "@ceulazur",
      price: "R$ 50.00",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/45610d9b421b9212bc929c32d87b7875fab83345?placeholderIfAbsent=true"
    },
    {
      id: "3",
      title: "Vulk",
      artistHandle: "@ceulazur",
      price: "R$ 50.00",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/45610d9b421b9212bc929c32d87b7875fab83345?placeholderIfAbsent=true"
    },
    {
      id: "4",
      title: "Vulk",
      artistHandle: "@ceulazur",
      price: "R$ 50.00",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/45610d9b421b9212bc929c32d87b7875fab83345?placeholderIfAbsent=true"
    }
  ];

  const productsToShow = products || defaultProducts;

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
      <div className="flex gap-4 justify-between items-center mt-3.5">
        <ProductCard
          title={productsToShow[0].title}
          artistHandle={productsToShow[0].artistHandle}
          price={productsToShow[0].price}
          imageUrl={productsToShow[0].imageUrl}
          productId={productsToShow[0].id}
          className="my-auto"
        />
        <ProductCard
          title={productsToShow[1].title}
          artistHandle={productsToShow[1].artistHandle}
          price={productsToShow[1].price}
          imageUrl={productsToShow[1].imageUrl}
          productId={productsToShow[1].id}
          shadowClass="shadow-[4px_4px_4px_rgba(0,0,0,1)]"
          className="my-auto"
        />
      </div>
      <div className="flex gap-4 justify-between items-center mt-3">
        <ProductCard
          title={productsToShow[2].title}
          artistHandle={productsToShow[2].artistHandle}
          price={productsToShow[2].price}
          imageUrl={productsToShow[2].imageUrl}
          productId={productsToShow[2].id}
          className="my-auto"
        />
        <ProductCard
          title={productsToShow[3].title}
          artistHandle={productsToShow[3].artistHandle}
          price={productsToShow[3].price}
          imageUrl={productsToShow[3].imageUrl}
          productId={productsToShow[3].id}
          shadowClass="shadow-[4px_4px_4px_rgba(0,0,0,1)]"
          className="my-auto"
        />
      </div>
    </section>
  );
}; 