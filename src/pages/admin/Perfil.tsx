import React, { useState } from "react";
import type { ChangeEvent } from "react";

type Usuario = {
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  fotoUrl?: string;
};

const Perfil = () => {
  const [usuario, setUsuario] = useState<Usuario>({
    nome: "Jhordanna Gonçalves",
    email: "jhordanna@example.com",
    telefone: "(85) 99999-9999",
    endereco: "Rua Exemplo, 123, Quixadá - CE",
    fotoUrl: "/src/assets/3.png", // avatar placeholder
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState<Usuario>(usuario);
  const [fotoPreview, setFotoPreview] = useState<string | undefined>(usuario.fotoUrl);

  // Atualiza os campos de texto
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Atualiza preview da foto ao selecionar arquivo
  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Opcionalmente, você pode salvar o arquivo para enviar no backend depois
    }
  };

  const salvarEdicao = () => {
    // Atualiza o usuario com os dados do formulário e a nova foto (preview)
    setUsuario({ ...formData, fotoUrl: fotoPreview });
    setIsEditOpen(false);
  };

  return (
    <div className="p-8 pt-24 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

      <div className="flex flex-col items-center gap-6 border rounded p-6 shadow">
        <img
          src={usuario.fotoUrl || "https://via.placeholder.com/150"}
          alt="Foto do usuário"
          className="w-32 h-32 rounded-full object-cover"
        />
        <div className="text-center">
          <h2 className="text-xl font-semibold">{usuario.nome}</h2>
          <p className="text-gray-600">{usuario.email}</p>
          {usuario.telefone && <p className="text-gray-600">Telefone: {usuario.telefone}</p>}
          {usuario.endereco && <p className="text-gray-600">Endereço: {usuario.endereco}</p>}
        </div>
        <button
          onClick={() => {
            setIsEditOpen(true);
            setFormData(usuario);
            setFotoPreview(usuario.fotoUrl);
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Editar Perfil
        </button>
      </div>

      {/* Modal de edição */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Editar Perfil</h3>

            {/* Preview e upload da foto */}
            <div className="flex justify-center mb-4">
              <img
                src={fotoPreview || "https://via.placeholder.com/150"}
                alt="Preview da foto"
                className="w-28 h-28 rounded-full object-cover border"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              className="mb-4"
            />

            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Nome"
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="telefone"
                value={formData.telefone || ""}
                onChange={handleChange}
                placeholder="Telefone"
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="endereco"
                value={formData.endereco || ""}
                onChange={handleChange}
                placeholder="Endereço"
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={salvarEdicao}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil; 