import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, Product } from "../../hooks/useProducts";

const Produtos = () => {
  const { data: produtos, isLoading, error } = useProducts();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Atualiza campos do formulário
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Salvar produto
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validar campos obrigatórios
    if (
      !formData.title ||
      !formData.artistHandle ||
      !formData.price ||
      !formData.description ||
      !formData.imageUrl
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const productData = {
        title: formData.title,
        artistHandle: formData.artistHandle,
        price: formData.price,
        imageUrl: formData.imageUrl,
        description: formData.description,
        quantity: parseInt(formData.quantity) || 0,
        dimensions: formData.dimensions,
        framed: formData.framed,
        artistUsername: formData.artistUsername,
        artistProfileImage: formData.artistProfileImage,
        availableSizes: formData.availableSizes
      };

      if (editingProduct) {
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
        {produtos?.map((produto) => (
          <div
            key={produto.id}
            className="border rounded shadow p-4 flex flex-col justify-between"
          >
            <div>
              <img
                src={produto.imageUrl}
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
              <button
                onClick={() => editarProduto(produto)}
                className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
              >
                Editar
              </button>
              <button
                onClick={() => excluirProduto(produto.id)}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para adicionar/editar produto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">
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
              <input
                type="text"
                name="artistHandle"
                placeholder="Handle do Artista"
                value={formData.artistHandle}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="price"
                placeholder="Preço"
                value={formData.price}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="url"
                name="imageUrl"
                placeholder="URL da Imagem"
                value={formData.imageUrl}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
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
              <input
                type="text"
                name="artistUsername"
                placeholder="Nome do Artista"
                value={formData.artistUsername}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="url"
                name="artistProfileImage"
                placeholder="URL da Foto do Artista"
                value={formData.artistProfileImage}
                onChange={handleChange}
                className="border p-2 rounded"
              />

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