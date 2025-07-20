import * as React from "react";
import { ProductCard } from "./ProductCard";
import { useProducts } from "../../hooks/useProducts";
import { Skeleton } from "../ui/skeleton";
import { useVendors } from "../../hooks/useVendors";
import { FunnelIcon } from "@heroicons/react/24/solid";

const CatalogSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="flex flex-col space-y-3">
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
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
    const map = new Map<string, string>();
    // Adiciona todos os vendedores
    if (vendors) {
      vendors.forEach(v => {
        // @ts-expect-error: alguns vendors podem não ter handle explicitamente tipado
        const handle = v.handle || `@${v.firstName.toLowerCase()}`;
        if (handle && !map.has(handle)) {
          map.set(handle, v.firstName + (v.lastName ? ' ' + v.lastName : ''));
        }
      });
    }
    // Adiciona todos os artistas dos produtos (caso algum produto tenha handle diferente)
    if (products) {
      products.forEach(p => {
        if (!map.has(p.artistHandle)) {
          map.set(p.artistHandle, p.artistUsername);
        }
      });
    }
    return Array.from(map.entries()).map(([handle, username]) => ({ handle, username }));
  }, [vendors, products]);

  // Filtra produtos pelo artista selecionado
  const filteredProducts = React.useMemo(() => {
    if (!selectedArtist) return products || [];
    return (products || []).filter(
      (product) => product.artistHandle === selectedArtist
    );
  }, [products, selectedArtist]);

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
            Catálogo de Arte
          </h1>
          <p className="text-lg text-gray-600">
            Descubra peças únicas dos melhores artistas independentes
          </p>
        </div>
        
        {/* Filtro de Artista */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen((v) => !v)}
            className="flex items-center gap-3 border-2 border-gray-300 rounded-lg px-4 py-3 hover:border-red-500 bg-white min-w-[200px] transition-colors"
            aria-label="Filtrar por artista"
            type="button"
          >
            <FunnelIcon className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <span className="text-gray-700 font-medium truncate">
              {selectedArtist ? artistOptions.find(opt => opt.handle === selectedArtist)?.username : "Todos os artistas"}
            </span>
            <svg className="w-4 h-4 text-gray-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Dropdown */}
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[200px]">
              <ul className="py-2">
                <li>
                  <button
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${selectedArtist === "" ? "bg-red-50 text-red-600 font-semibold" : "text-gray-700"}`}
                    onClick={() => { setSelectedArtist(""); setIsFilterOpen(false); }}
                  >
                    Todos os artistas
                  </button>
                </li>
                {artistOptions.map(opt => (
                  <li key={opt.handle}>
                    <button
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${selectedArtist === opt.handle ? "bg-red-50 text-red-600 font-semibold" : "text-gray-700"}`}
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

      {/* Contador de resultados */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          {selectedArtist && ` para ${artistOptions.find(opt => opt.handle === selectedArtist)?.username}`}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && <CatalogSkeleton />}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">
            Erro ao carregar produtos. Tente novamente mais tarde.
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && !error && filteredProducts && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              title={product.title}
              artistHandle={product.artistHandle}
              price={product.price}
              imageUrl={product.imageUrl}
              productId={product.id}
              quantity={product.quantity}
              shadowClass="shadow-lg hover:shadow-xl transition-shadow"
              className="bg-white rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && (!filteredProducts || filteredProducts.length === 0) && (
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            {selectedArtist 
              ? `Não há produtos disponíveis para ${artistOptions.find(opt => opt.handle === selectedArtist)?.username} no momento.`
              : 'Não há produtos disponíveis no momento.'
            }
          </p>
          {selectedArtist && (
            <button
              onClick={() => setSelectedArtist("")}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Ver todos os produtos
            </button>
          )}
        </div>
      )}
    </section>
  );
}; 