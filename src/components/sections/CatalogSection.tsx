import * as React from "react";
import { ProductCard } from "./ProductCard";
import { useProducts } from "../../hooks/useProducts";
import { Skeleton } from "../ui/skeleton";
import { useVendors } from "../../hooks/useVendors";
import { FunnelIcon } from "@heroicons/react/24/solid";

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
  const { data: vendors } = useVendors();
  const [selectedArtist, setSelectedArtist] = React.useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const filterRef = React.useRef<HTMLDivElement>(null);

  // Fecha o dropdown ao clicar fora
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);

  // Gera lista única de artistHandle dos produtos, junto com o nome do artista
  const artistOptions = React.useMemo(() => {
    if (!products) return [];
    const map = new Map<string, string>();
    products.forEach(p => {
      if (!map.has(p.artistHandle)) {
        map.set(p.artistHandle, p.artistUsername);
      }
    });
    return Array.from(map.entries()).map(([handle, username]) => ({ handle, username }));
  }, [products]);

  // Filtra produtos pelo artista selecionado
  const filteredProducts = React.useMemo(() => {
    if (!selectedArtist) return products || [];
    return (products || []).filter(
      (product) => product.artistHandle === selectedArtist
    );
  }, [products, selectedArtist]);

  // Função para ajustar o tamanho da fonte do nome do artista
  function getArtistFontSize(username: string) {
    if (!username) return "text-base";
    if (username.length > 22) return "text-xs";
    if (username.length > 16) return "text-sm";
    return "text-base";
  }

  return (
    <section className="mt-6 w-full">
      {/* Linha com título à esquerda e botão de filtro à direita */}
      <div className="flex flex-row items-center justify-between w-full relative">
        <h2 className="text-4xl font-extrabold text-red-600">
          CATÁLOGO
        </h2>
        <div className="relative mr-7" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen((v) => !v)}
            className="flex items-center gap-1 border border-red-600 rounded px-3 py-1 hover:bg-red-50 bg-white min-w-[140px]"
            aria-label="Abrir filtros"
            type="button"
            style={{ maxWidth: 220 }}
          >
            <FunnelIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className={`text-red-600 truncate ${getArtistFontSize(selectedArtist ? artistOptions.find(opt => opt.handle === selectedArtist)?.username || '' : '')}`}
              style={{ maxWidth: 140, display: 'inline-block' }}
            >
              {selectedArtist ? artistOptions.find(opt => opt.handle === selectedArtist)?.username : "Artista"}
            </span>
          </button>
          {/* Dropdown abaixo do botão, ocupando toda a largura do botão */}
          {isFilterOpen && (
            <div className="absolute left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[140px] max-w-[220px]">
              <ul className="py-1">
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedArtist === "" ? "font-bold" : ""}`}
                    onClick={() => { setSelectedArtist(""); setIsFilterOpen(false); }}
                  >
                    Todos os artistas
                  </button>
                </li>
                {artistOptions.map(opt => (
                  <li key={opt.handle}>
                    <button
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedArtist === opt.handle ? "font-bold" : ""}`}
                      onClick={() => { setSelectedArtist(opt.handle); setIsFilterOpen(false); }}
                    >
                      {opt.username || opt.handle}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-start text-center text-red-600">
        <p className="mt-2.5 text-base">
          Aqui ficam os produtos dos seus artistas preferidos
        </p>
        <div className="self-stretch mt-2.5 w-full max-w-[449px] mr-auto border border-black border-solid min-h-px" />
      </div>

      {isLoading && <CatalogSkeleton />}

      {error && (
         <p className="mt-4 text-center text-red-500">
           Erro ao carregar produtos. Tente novamente mais tarde.
         </p>
      )}

      {!isLoading && !error && filteredProducts && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3.5">
          {filteredProducts.map((product, index) => (
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

      {!isLoading && !error && (!filteredProducts || filteredProducts.length === 0) && (
        <p className="mt-4 text-center text-gray-500">
          Nenhum produto disponível no momento.
        </p>
      )}
    </section>
  );
}; 