import React, { useState } from "react";

const CadastrarVendedor = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    handle: "",
    telefone: "",
    endereco: "",
    fotoUrl: "",
    senha: ""
  });
  const [fotoPreview, setFotoPreview] = useState<string | undefined>("");
  const [erro, setErro] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "firstName" && !formData.handle) {
      setFormData((prev) => ({ ...prev, handle: `@${e.target.value.toLowerCase()}` }));
    }
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFotoPreview(URL.createObjectURL(file));
      // Não faz upload real, só preview
    }
  };

  const validar = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.handle.trim() || !formData.senha.trim()) {
      setErro("Preencha todos os campos obrigatórios.");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setErro("Email inválido.");
      return false;
    }
    if (formData.senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return false;
    }
    setErro("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;
    // Integração com backend
    try {
      const response = await fetch('http://localhost:3000/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          telefone: formData.telefone,
          endereco: formData.endereco,
          fotoUrl: formData.fotoUrl,
          handle: formData.handle,
          password: formData.senha
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Vendedor cadastrado com sucesso!');
      } else {
        setErro(data.error || 'Erro ao cadastrar vendedor');
      }
    } catch (err) {
      setErro('Erro ao conectar com o servidor');
    }
  };

  return (
    <div className="p-8 pt-24 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Cadastrar Novo Vendedor</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 flex flex-col gap-5">
        {erro && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm text-center">{erro}</div>}
        <div className="flex flex-col gap-2">
          <label htmlFor="firstName" className="font-medium">Nome *</label>
          <input id="firstName" type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="border p-2 rounded" required />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="lastName" className="font-medium">Sobrenome *</label>
          <input id="lastName" type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="border p-2 rounded" required />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-medium">Email *</label>
          <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} className="border p-2 rounded" required />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="handle" className="font-medium">Handle *</label>
          <input id="handle" type="text" name="handle" value={formData.handle} onChange={handleChange} className="border p-2 rounded" required />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="telefone" className="font-medium">Telefone</label>
          <input id="telefone" type="text" name="telefone" value={formData.telefone} onChange={handleChange} className="border p-2 rounded" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="endereco" className="font-medium">Endereço</label>
          <input id="endereco" type="text" name="endereco" value={formData.endereco} onChange={handleChange} className="border p-2 rounded" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="senha" className="font-medium">Senha *</label>
          <input id="senha" type="password" name="senha" value={formData.senha} onChange={handleChange} className="border p-2 rounded" required minLength={6} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="foto" className="font-medium">Foto de Perfil</label>
          <input id="foto" type="file" accept="image/*" onChange={handleFotoChange} />
          {fotoPreview && <img src={fotoPreview} alt="Preview" className="w-24 h-24 rounded-full object-cover mt-2 mx-auto" />}
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4">Cadastrar</button>
      </form>
    </div>
  );
};

export default CadastrarVendedor; 