import { useState, useEffect, useMemo, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { ChangeEvent, FormEvent } from "react";
import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, Product } from "../../hooks/useProducts";
import { useFilters } from "../../contexts/FilterContext";
import { UserContext } from "../../contexts/UserContext";
import type { Usuario } from "../../contexts/UserContext";
import { useQueryClient } from '@tanstack/react-query';

const Produtos = () => {
  const { data: produtos, isLoading, error } = useProducts();
  const { filters } = useFilters();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario } = useContext(UserContext);
  const queryClient = useQueryClient();

  // Estado do formulário de produto
  const [formData, setFormData] = useState({
    title: "",
    artistHandle: "",
    price: "",
    imageUrl: "",
    description: "",
    quantity: "",
    dimensions: "",
    framed: false,
    artistUsername: "",
    artistProfileImage: "",
    availableSizes: ['P', 'M', 'G'] as string[]
  });

  const [productImagePreview, setProductImagePreview] = useState<string>("");
  const serverUrl = "http://localhost:3000";

  // Identificação de admin
  const isAdmin = usuario && (usuario.nome === "admin" || usuario.email === "admin");
  // Dados fixos dos vendedores
  const getArtistData = (usuario: Usuario | null) => {
    if (!usuario) return { artistHandle: '', artistUsername: '', artistProfileImage: '' };
    if (usuario.nome === 'Ceulazur' || usuario.email === 'ceulazur') {
      return {
        artistHandle: '@ceulazur',
        artistUsername: 'Ceulazur',
        artistProfileImage: usuario.fotoUrl || ''
      };
    }
    if (usuario.nome === 'Artemisia' || usuario.email === 'artemisia') {
      return {
        artistHandle: '@artemisia',
        artistUsername: 'Artemisia Gentileschi',
        artistProfileImage: usuario.fotoUrl || ''
      };
    }
    return { artistHandle: '', artistUsername: '', artistProfileImage: '' };
  };
  const artistData = getArtistData(usuario);

  // Efeito para abrir o modal se um produto for passado via state da rota
  useEffect(() => {
    if (location.state?.productToEdit) {
      // O React Router v6 usa `location.state`
      const product = location.state.productToEdit as Product;
      editarProduto(product);

      // Limpa o state para não reabrir o modal em re-renderizações
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const editarProduto = (produto: Product) => {
    setEditingProduct(produto);
    setFormData({
      title: produto.title,
      artistHandle: produto.artistHandle,
      price: produto.price,
      imageUrl: produto.imageUrl,
      description: produto.description,
      quantity: produto.quantity.toString(),
      dimensions: produto.dimensions,
      framed: produto.framed,
      artistUsername: produto.artistUsername,
      artistProfileImage: produto.artistProfileImage,
      availableSizes: produto.availableSizes
    });
    setProductImagePreview(produto.imageUrl ? (produto.imageUrl.startsWith('http') ? produto.imageUrl : `${serverUrl}${produto.imageUrl}`) : "");
    setIsModalOpen(true);
  };

  const excluirProduto = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deleteProductMutation.mutateAsync(id);
        alert("Produto excluído com sucesso!");
      } catch (error) {
        alert("Erro ao excluir produto");
      }
    }
  };

  const abrirModal = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      artistHandle: "",
      price: "",
      imageUrl: "",
      description: "",
      quantity: "",
      dimensions: "",
      framed: false,
      artistUsername: "",
      artistProfileImage: "",
      availableSizes: ['P', 'M', 'G']
    });
    setProductImagePreview("");
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Função utilitária para formatar preço
  function formatarPreco(valor: string) {
    const num = valor.replace(/[^\d,.]/g, '').replace(',', '.');
    const float = parseFloat(num);
    if (isNaN(float)) return '';
    return `R$ ${float.toFixed(2).replace('.', ',')}`;
  }

  // Função utilitária para formatar dimensões
  function formatarDimensoes(valor: string) {
    // Remove espaços, troca X/x por x, separa por x
    return valor
      .replace(/[^\dxX]/g, '')
      .replace(/[xX]+/g, 'x')
      .replace(/(\d+)x(\d+)/g, (m, a, b) => `${parseInt(a)}x${parseInt(b)}`)
      .replace(/x+$/, '');
  }

  // Atualiza campos do formulário com máscara
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let newValue = value;
    if (name === 'price') {
      newValue = formatarPreco(value);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : newValue,
    }));
  };

  // Formata dimensões ao sair do campo
  const handleDimensionsBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      dimensions: formatarDimensoes(prev.dimensions),
    }));
  };

  // Função para upload de imagem de produto
  const handleProductImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // Mostra preview local imediatamente
      setProductImagePreview(URL.createObjectURL(file));
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      try {
        const res = await fetch(`${serverUrl}/api/upload/product-image`, {
          method: 'POST',
          body: uploadFormData,
        });
        const data = await res.json();
        if (res.ok && data.url) {
          // Preview já do backend
          setProductImagePreview(`${serverUrl}${data.url}`);
          setFormData((prev) => ({ ...prev, imageUrl: data.url }));
        } else {
          alert('Erro ao fazer upload da imagem');
          setProductImagePreview("");
          setFormData((prev) => ({ ...prev, imageUrl: "" }));
        }
      } catch {
        alert('Erro ao conectar com o servidor de upload');
        setProductImagePreview("");
        setFormData((prev) => ({ ...prev, imageUrl: "" }));
      }
    }
  };

  // Filtragem de produtos conforme usuário
  const filteredAndSortedProducts = useMemo(() => {
    if (!produtos) return [];
    let items = [...produtos];
    // Se não for admin, só mostra produtos do próprio vendedor
    if (!isAdmin && usuario) {
      items = items.filter(p => p.artistHandle === artistData.artistHandle);
    }
    // Preço
    items = items.filter(p => {
      const price = parseFloat(p.price.replace('R$', '').replace(',', '.'));
      if (price > filters.priceRange.max) return false;
      if (filters.inStockOnly && p.quantity === 0) return false;
      if (filters.frameStatus === 'framed' && !p.framed) return false;
      if (filters.frameStatus === 'unframed' && p.framed) return false;
      return true;
    });
    // Ordenação
    items.sort((a, b) => {
      const priceA = parseFloat(a.price.replace('R$', '').replace(',', '.'));
      const priceB = parseFloat(b.price.replace('R$', '').replace(',', '.'));
      switch (filters.sortBy) {
        case 'price-asc': return priceA - priceB;
        case 'price-desc': return priceB - priceA;
        case 'title-asc': return a.title.localeCompare(b.title);
        case 'title-desc': return b.title.localeCompare(a.title);
        default: return 0;
      }
    });
    return items;
  }, [produtos, filters, isAdmin, usuario, artistData.artistHandle]);

  // Salvar produto
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Validações obrigatórias
    if (!formData.title.trim()) {
      alert('O nome do produto é obrigatório.');
      return;
    }
    if (!formData.quantity || isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0) {
      alert('A quantidade deve ser maior que zero.');
      return;
    }
    if (!formData.dimensions.trim()) {
      alert('As dimensões são obrigatórias.');
      return;
    }
    // Imagem obrigatória só ao criar
    if (!editingProduct && !formData.imageUrl) {
      alert('A imagem do produto é obrigatória ao criar.');
      return;
    }
    // Validar campos obrigatórios
    if (
      !formData.title ||
      (!isAdmin && !artistData.artistHandle) ||
      !formData.price ||
      !formData.description ||
      (isAdmin && !formData.imageUrl)
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    try {
      // Garante que imageUrl está correto
      const imageUrlFinal = formData.imageUrl;
      const productData = {
        title: formData.title,
        artistHandle: isAdmin ? formData.artistHandle : artistData.artistHandle,
        price: formData.price,
        imageUrl: imageUrlFinal,
        description: formData.description,
        quantity: parseInt(formData.quantity) || 0,
        dimensions: formData.dimensions,
        framed: formData.framed,
        artistUsername: isAdmin ? formData.artistUsername : artistData.artistUsername,
        artistProfileImage: isAdmin ? formData.artistProfileImage : artistData.artistProfileImage,
        availableSizes: formData.availableSizes
      };
      if (editingProduct) {
        if (!isAdmin && editingProduct.artistHandle !== artistData.artistHandle) {
          alert("Você não pode editar produtos de outros vendedores.");
          return;
        }
        await updateProductMutation.mutateAsync({
          ...productData,
          id: editingProduct.id
        });
        alert("Produto atualizado com sucesso!");
      } else {
        await createProductMutation.mutateAsync(productData);
        alert("Produto criado com sucesso!");
      }
      fecharModal();
      // Força recarregamento da lista de produtos
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error) {
      alert("Erro ao salvar produto");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 pt-24">
        <div className="text-center">
          <p>Carregando produtos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 pt-24">
        <div className="text-center text-red-600">
          <p>Erro ao carregar produtos: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 pt-24">
      {/* Cabeçalho com título e botão adicionar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <button
          onClick={abrirModal}
          className="text-green-600 hover:text-green-800"
          aria-label="Adicionar Produto"
        >
          <PlusCircleIcon className="h-8 w-8" />
        </button>
      </div>

      {/* Grid de produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredAndSortedProducts.length > 0 ? (
          filteredAndSortedProducts.map((produto) => {
            let imgSrc = '';
            if (produto.imageUrl) {
              if (produto.imageUrl.startsWith('http')) {
                imgSrc = produto.imageUrl;
              } else {
                imgSrc = `http://localhost:3000${produto.imageUrl}`;
              }
            } else {
              imgSrc = 'https://via.placeholder.com/300x200?text=Sem+Imagem';
            }
            console.log('imageUrl do produto:', produto.imageUrl);
            return (
              <div
                key={produto.id}
                className="border rounded shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <img
                    src={imgSrc}
                    alt={produto.title}
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                  <h2 className="text-lg font-semibold">{produto.title}</h2>
                  <p className="text-sm text-gray-500 mb-2">
                    Artista: {produto.artistHandle}
                  </p>
                  <p className="text-gray-600 mb-2">{produto.description}</p>
                  <p className="font-bold">{produto.price}</p>
                  <p className="text-sm text-gray-500">Quantidade: {produto.quantity}</p>
                </div>
                <div className="mt-4 flex gap-3 justify-end">
                  {(isAdmin || produto.artistHandle === artistData.artistHandle) && (
                    <button
                      onClick={() => editarProduto(produto)}
                      className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
                    >
                      Editar
                    </button>
                  )}
                  {(isAdmin || produto.artistHandle === artistData.artistHandle) && (
                    <button
                      onClick={() => excluirProduto(produto.id)}
                      className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                    >
                      Excluir
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-semibold">Nenhum produto encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros para encontrar o que procura.</p>
          </div>
        )}
      </div>

      {/* Modal para adicionar/editar produto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg max-h-[90vh] overflow-y-auto">
            <button
              onClick={fecharModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              aria-label="Fechar modal"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? 'Editar Produto' : 'Adicionar Produto'}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="title"
                placeholder="Título"
                value={formData.title}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              {isAdmin && (
                <input
                  type="text"
                  name="artistHandle"
                  placeholder="Handle do Artista"
                  value={formData.artistHandle}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  required
                />
              )}
              <input
                type="text"
                name="price"
                placeholder="Preço"
                value={formData.price}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              {isAdmin ? (
                <>
                  <input
                    type="url"
                    name="imageUrl"
                    placeholder="URL da Imagem"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="border p-2 rounded"
                  />
                  <div className="flex flex-col gap-2">
                    <label className="font-medium">Ou envie uma imagem:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProductImageChange}
                    />
                    {productImagePreview && (
                      <img
                        src={productImagePreview}
                        alt="Preview da imagem do produto"
                        className="w-full h-40 object-cover rounded border"
                      />
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <label className="font-medium">Imagem do Produto</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageChange}
                  />
                  {productImagePreview && (
                    <img
                      src={productImagePreview}
                      alt="Preview da imagem do produto"
                      className="w-full h-40 object-cover rounded border"
                    />
                  )}
                </div>
              )}
              <textarea
                name="description"
                placeholder="Descrição"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 rounded resize-none"
                rows={3}
                required
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantidade"
                value={formData.quantity}
                onChange={handleChange}
                className="border p-2 rounded"
                min="0"
              />
              <input
                type="text"
                name="dimensions"
                placeholder="Dimensões"
                value={formData.dimensions}
                onChange={handleChange}
                onBlur={handleDimensionsBlur}
                className="border p-2 rounded"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="framed"
                  checked={formData.framed}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
                <label>Emoldurado</label>
              </div>
              {isAdmin && (
                <input
                  type="text"
                  name="artistUsername"
                  placeholder="Nome do Artista"
                  value={formData.artistUsername}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
              )}
              {isAdmin && (
                <input
                  type="url"
                  name="artistProfileImage"
                  placeholder="URL da Foto do Artista"
                  value={formData.artistProfileImage}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
              )}

              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  disabled={createProductMutation.isPending || updateProductMutation.isPending}
                >
                  {createProductMutation.isPending || updateProductMutation.isPending 
                    ? 'Salvando...' 
                    : (editingProduct ? 'Atualizar' : 'Salvar')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produtos; 