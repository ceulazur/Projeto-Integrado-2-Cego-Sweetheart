import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useUpdateAdminUser } from "../../hooks/useAdminUser";

const Perfil = () => {
  const { usuario, setUsuario, loading } = useContext(UserContext);
  const updateUser = useUpdateAdminUser();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    fotoUrl: "",
  });
  const [fotoPreview, setFotoPreview] = useState<string | undefined>("");
  const serverUrl = "http://localhost:3000";
  const [telefoneErro, setTelefoneErro] = useState<string>("");
  const [isTelefoneFocused, setIsTelefoneFocused] = useState(false);

  useEffect(() => {
    if (usuario) {
      setFormData({
        nome: usuario.nome || "",
        email: usuario.email || "",
        telefone: usuario.telefone || "",
        endereco: usuario.endereco || "",
        fotoUrl: usuario.fotoUrl || "",
      });
      setFotoPreview(usuario.fotoUrl ? `${serverUrl}${usuario.fotoUrl}` : "");
    }
  }, [usuario]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setFotoPreview(preview);
      
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      try {
        const res = await fetch(`${serverUrl}/api/upload`, {
          method: 'POST',
          body: uploadFormData,
        });
        const data = await res.json();
        if (res.ok && data.url) {
          setFormData((prev) => ({ ...prev, fotoUrl: data.url }));
        } else {
          alert('Erro ao fazer upload da imagem');
          setFotoPreview(usuario?.fotoUrl ? `${serverUrl}${usuario.fotoUrl}` : "");
        }
      } catch {
        alert('Erro ao conectar com o servidor de upload');
        setFotoPreview(usuario?.fotoUrl ? `${serverUrl}${usuario.fotoUrl}` : "");
      }
    }
  };

  function formatarTelefoneMascara(valor: string) {
    // Permite apenas números
    return valor.replace(/\D/g, '');
  }

  function formatarTelefoneFinal(valor: string) {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length === 11) {
      // Celular: (99) 99999-9999
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numeros.length === 10) {
      // Fixo: (99) 9999-9999
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return valor;
  }

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    newValue = isTelefoneFocused ? formatarTelefoneMascara(newValue) : formatarTelefoneFinal(newValue);
    setFormData((prev) => ({ ...prev, telefone: newValue }));
  };

  const handleTelefoneBlur = () => {
    setIsTelefoneFocused(false);
    setFormData((prev) => ({ ...prev, telefone: formatarTelefoneFinal(prev.telefone) }));
  };

  const handleTelefoneFocus = () => {
    setIsTelefoneFocused(true);
  };

  function validarTelefone(telefone: string) {
    // Aceita formatos (11) 91234-5678, 11912345678, 1123456789
    const regex = /^(\(?\d{2}\)?\s?)?(9?\d{4})-?\d{4}$/;
    return regex.test(telefone.replace(/\D/g, ""));
  }

  const salvarEdicao = async () => {
    if (!usuario) return;

    // Validação do telefone
    if (formData.telefone && !validarTelefone(formData.telefone)) {
      setTelefoneErro("Telefone inválido. Use o formato (11) 91234-5678 ou 11912345678.");
      const telInput = document.querySelector('input[name="telefone"]') as HTMLInputElement | null;
      telInput?.focus();
      return;
    } else {
      setTelefoneErro("");
    }

    const [firstName, ...lastNameParts] = formData.nome.split(' ');
    const lastName = lastNameParts.join(' ');

    try {
      await updateUser.mutateAsync({
        id: usuario.id.toString(),
        firstName: firstName,
        lastName: lastName,
        telefone: formData.telefone,
        endereco: formData.endereco,
        fotoUrl: formData.fotoUrl,
      });

      const updatedUser = {
        ...usuario,
        nome: formData.nome,
        telefone: formData.telefone,
        endereco: formData.endereco,
        fotoUrl: formData.fotoUrl,
      };
      setUsuario(updatedUser);
      
      setIsEditOpen(false);
    } catch {
      alert("Erro ao atualizar perfil");
    }
  };

  if (loading) {
    return <div className="p-8 pt-24 max-w-3xl mx-auto">Carregando perfil...</div>;
  }
  if (!usuario) {
    return <div className="p-8 pt-24 max-w-3xl mx-auto text-red-600">Erro ao carregar perfil. Faça login novamente.</div>;
  }

  const displayFotoUrl = usuario.fotoUrl ? `${serverUrl}${usuario.fotoUrl}` : "https://via.placeholder.com/150";

  return (
    <div className="p-8 pt-24 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

      <div className="flex flex-col items-center gap-6 border rounded p-6 shadow">
        <img
          src={displayFotoUrl}
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
            setFotoPreview(displayFotoUrl);
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

            {telefoneErro && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2 text-sm text-center">
                {telefoneErro}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Nome Completo"
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="border p-2 rounded bg-gray-100 cursor-not-allowed"
              />
              <input
                type="text"
                name="telefone"
                value={formData.telefone || ""}
                onChange={handleTelefoneChange}
                onFocus={handleTelefoneFocus}
                onBlur={handleTelefoneBlur}
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
                disabled={updateUser.isPending}
              >
                {updateUser.isPending ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;