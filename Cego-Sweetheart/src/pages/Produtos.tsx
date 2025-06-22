import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

type Produto = {
  id: number;
  nome: string;
  tag: string;
  preco: number;
  descricao: string;
  imagemUrl: string;
};

const produtosIniciais: Produto[] = [
  {
    id: 1,
    nome: "NotionMe",
    tag: "Jhordanna",
    preco: 49.9,
    descricao: "Retrato exclusivo",
    imagemUrl: "src/assets/3.png",
  },
  {
    id: 2,
    nome: "Medroso",
    tag: "Jhordanna",
    preco: 39.9,
    descricao: "Medrosos",
    imagemUrl: "src/assets/1.png",
  },
];

const Produtos = () => {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais);

  // Modal adicionar produto
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    tag: "",
    preco: "",
    descricao: "",
    imagemFile: null as File | null,
    imagemPreview: "",
  });

  // Modal editar produto
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [editProdutoData, setEditProdutoData] = useState({
    nome: "",
    tag: "",
    preco: "",
    descricao: "",
    imagemPreview: "",
    imagemFile: null as File | null,
  });

  // Modal excluir produto
  const [isModalExcluirOpen, setIsModalExcluirOpen] = useState(false);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState<Produto | null>(null);

  // Abrir modal adicionar
  const abrirModalAdd = () => {
    setIsModalAddOpen(true);
  };

  // Fechar modal adicionar
  const fecharModalAdd = () => {
    setIsModalAddOpen(false);
    setNovoProduto({
      nome: "",
      tag: "",
      preco: "",
      descricao: "",
      imagemFile: null,
      imagemPreview: "",
    });
  };

  // Abrir modal editar
  const abrirModalEdit = (produto: Produto) => {
    setProdutoEditando(produto);
    setEditProdutoData({
      nome: produto.nome,
      tag: produto.tag,
      preco: produto.preco.toString(),
      descricao: produto.descricao,
      imagemPreview: produto.imagemUrl,
      imagemFile: null,
    });
    setIsModalEditOpen(true);
  };

  // Fechar modal editar
  const fecharModalEdit = () => {
    setIsModalEditOpen(false);
    setProdutoEditando(null);
  };

  // Abrir modal excluir
  const abrirModalExcluir = (produto: Produto) => {
    setProdutoParaExcluir(produto);
    setIsModalExcluirOpen(true);
  };

  // Fechar modal excluir
  const fecharModalExcluir = () => {
    setIsModalExcluirOpen(false);
    setProdutoParaExcluir(null);
  };

  // Atualizar campos novo produto
  const handleNovoProdutoChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNovoProduto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Atualizar campos editar produto
  const handleEditProdutoChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditProdutoData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Upload imagem novo produto
  const handleNovoProdutoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      setNovoProduto((prev) => ({
        ...prev,
        imagemFile: file,
        imagemPreview: preview,
      }));
    }
  };

  // Upload imagem editar produto
  const handleEditProdutoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      setEditProdutoData((prev) => ({
        ...prev,
        imagemFile: file,
        imagemPreview: preview,
      }));
    }
  };

  // Salvar novo produto
  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (
      !novoProduto.nome ||
      !novoProduto.tag ||
      !novoProduto.preco ||
      !novoProduto.descricao ||
      !novoProduto.imagemFile
    ) {
      alert("Preencha todos os campos e envie uma imagem.");
      return;
    }

    const novoId =
      produtos.length > 0 ? Math.max(...produtos.map((p) => p.id)) + 1 : 1;

    const novoProd: Produto = {
      id: novoId,
      nome: novoProduto.nome,
      tag: novoProduto.tag,
      preco: parseFloat(novoProduto.preco),
      descricao: novoProduto.descricao,
      imagemUrl: novoProduto.imagemPreview,
    };

    setProdutos([...produtos, novoProd]);
    fecharModalAdd();
  };

  // Salvar edição produto
  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (
      !editProdutoData.nome ||
      !editProdutoData.tag ||
      !editProdutoData.preco ||
      !editProdutoData.descricao
    ) {
      alert("Preencha todos os campos.");
      return;
    }

    if (!produtoEditando) return;

    setProdutos((prev) =>
      prev.map((p) =>
        p.id === produtoEditando.id
          ? {
              ...p,
              nome: editProdutoData.nome,
              tag: editProdutoData.tag,
              preco: parseFloat(editProdutoData.preco),
              descricao: editProdutoData.descricao,
              imagemUrl: editProdutoData.imagemPreview,
            }
          : p
      )
    );

    fecharModalEdit();
  };

  // Confirmar exclusão
  const confirmarExcluir = () => {
    if (produtoParaExcluir) {
      setProdutos((prev) => prev.filter((p) => p.id !== produtoParaExcluir.id));
      fecharModalExcluir();
    }
  };

  return (
    <div className="p-8 pt-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <button
          onClick={abrirModalAdd}
          className="text-green-600 hover:text-green-800"
          aria-label="Adicionar Produto"
        >
          <PlusCircleIcon className="h-8 w-8" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {produtos.map((produto) => (
          <div
            key={produto.id}
            className="border rounded shadow p-4 flex flex-col justify-between"
          >
            <div>
              <img
                src={produto.imagemUrl}
                alt={produto.nome}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h2 className="text-lg font-semibold">{produto.nome}</h2>
              <p className="text-sm text-gray-500 mb-2">Artista: {produto.tag}</p>
              <p className="text-gray-600 mb-2">{produto.descricao}</p>
              <p className="font-bold">R$ {produto.preco.toFixed(2)}</p>
            </div>

            <div className="mt-4 flex gap-3 justify-end">
              <button
                onClick={() => abrirModalEdit(produto)}
                className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
              >
                Editar
              </button>
              <button
                onClick={() => abrirModalExcluir(produto)}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Adicionar Produto */}
      {isModalAddOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">
            <button
              onClick={fecharModalAdd}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              aria-label="Fechar modal"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h2 className="text-xl font-bold mb-4">Adicionar Produto</h2>

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={novoProduto.nome}
                onChange={handleNovoProdutoChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="tag"
                placeholder="Tag / Artista"
                value={novoProduto.tag}
                onChange={handleNovoProdutoChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                step="0.01"
                min="0"
                name="preco"
                placeholder="Preço"
                value={novoProduto.preco}
                onChange={handleNovoProdutoChange}
                className="border p-2 rounded"
                required
              />
              <textarea
                name="descricao"
                placeholder="Descrição"
                value={novoProduto.descricao}
                onChange={handleNovoProdutoChange}
                className="border p-2 rounded resize-none"
                rows={3}
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleNovoProdutoFileChange}
                className="border p-2 rounded"
                required
              />
              {novoProduto.imagemPreview && (
                <img
                  src={novoProduto.imagemPreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                />
              )}

              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={fecharModalAdd}
                  className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Produto */}
      {isModalEditOpen && produtoEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">
            <button
              onClick={fecharModalEdit}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              aria-label="Fechar modal"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h2 className="text-xl font-bold mb-4">Editar Produto</h2>

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={editProdutoData.nome}
                onChange={handleEditProdutoChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="tag"
                placeholder="Tag / Artista"
                value={editProdutoData.tag}
                onChange={handleEditProdutoChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                step="0.01"
                min="0"
                name="preco"
                placeholder="Preço"
                value={editProdutoData.preco}
                onChange={handleEditProdutoChange}
                className="border p-2 rounded"
                required
              />
              <textarea
                name="descricao"
                placeholder="Descrição"
                value={editProdutoData.descricao}
                onChange={handleEditProdutoChange}
                className="border p-2 rounded resize-none"
                rows={3}
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleEditProdutoFileChange}
                className="border p-2 rounded"
              />
              {editProdutoData.imagemPreview && (
                <img
                  src={editProdutoData.imagemPreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                />
              )}

              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={fecharModalEdit}
                  className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Excluir Produto */}
      {isModalExcluirOpen && produtoParaExcluir && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-sm p-6 relative shadow-lg">
            <p className="mb-4">
              Tem certeza que deseja excluir o produto{" "}
              <strong>{produtoParaExcluir.nome}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={fecharModalExcluir}
                className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExcluir}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produtos;
