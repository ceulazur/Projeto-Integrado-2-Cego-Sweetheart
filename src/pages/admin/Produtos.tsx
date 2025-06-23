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
    imagemUrl: "/src/assets/3.png",
  },
  {
    id: 2,
    nome: "Medroso",
    tag: "Jhordanna",
    preco: 39.9,
    descricao: "Medrosos",
    imagemUrl: "/src/assets/1.png",
  },
  {
    id: 3,
    nome: "NotionMe",
    tag: "Jhordanna",
    preco: 49.9,
    descricao: "Retrato exclusivo",
    imagemUrl: "/src/assets/3.png",
  },
  {
    id: 4,
    nome: "Medroso",
    tag: "Jhordanna",
    preco: 39.9,
    descricao: "Medrosos",
    imagemUrl: "/src/assets/1.png",
  },
];

const Produtos = () => {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado do formulário de novo produto
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    tag: "",
    preco: "",
    descricao: "",
    imagemFile: null as File | null,
    imagemPreview: "",
  });

  const editarProduto = (id: number) => {
    alert(`Editar produto ${id}`);
  };

  const excluirProduto = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      setProdutos(produtos.filter((p) => p.id !== id));
    }
  };

  const abrirModal = () => {
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setNovoProduto({
      nome: "",
      tag: "",
      preco: "",
      descricao: "",
      imagemFile: null,
      imagemPreview: "",
    });
  };

  // Atualiza campos do formulário
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNovoProduto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Upload e preview da imagem
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  // Salvar novo produto
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validar campos obrigatórios
    if (
      !novoProduto.nome ||
      !novoProduto.tag ||
      !novoProduto.preco ||
      !novoProduto.descricao ||
      !novoProduto.imagemFile
    ) {
      alert("Por favor, preencha todos os campos e envie uma imagem.");
      return;
    }

    const novoId =
      produtos.length > 0
        ? Math.max(...produtos.map((p) => p.id)) + 1
        : 1;

    const novoProd: Produto = {
      id: novoId,
      nome: novoProduto.nome,
      tag: novoProduto.tag,
      preco: parseFloat(novoProduto.preco),
      descricao: novoProduto.descricao,
      imagemUrl: novoProduto.imagemPreview, // usar preview local
    };

    setProdutos([...produtos, novoProd]);
    fecharModal();
  };

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
              <p className="text-sm text-gray-500 mb-2">
                Artista: {produto.tag}
              </p>
              <p className="text-gray-600 mb-2">{produto.descricao}</p>
              <p className="font-bold">R$ {produto.preco.toFixed(2)}</p>
            </div>

            <div className="mt-4 flex gap-3 justify-end">
              <button
                onClick={() => editarProduto(produto.id)}
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

      {/* Modal para adicionar produto */}
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

            <h2 className="text-xl font-bold mb-4">Adicionar Produto</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={novoProduto.nome}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="tag"
                placeholder="Tag / Artista"
                value={novoProduto.tag}
                onChange={handleChange}
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
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <textarea
                name="descricao"
                placeholder="Descrição"
                value={novoProduto.descricao}
                onChange={handleChange}
                className="border p-2 rounded resize-none"
                rows={3}
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
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
                  onClick={fecharModal}
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
    </div>
  );
};

export default Produtos; 