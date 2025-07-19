import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface Vendor {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  telefone: string;
  endereco: string;
  fotoUrl: string;
  handle: string;
  created_at: string;
}

export default function Vendedores() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vendedores, setVendedores] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('todos');

  useEffect(() => {
    if (!user?.id) {
      navigate('/admin/login');
      return;
    }

    // Verificar se é admin
    if (user.email !== 'admin') {
      navigate('/admin/home');
      return;
    }

    fetchVendedores();
  }, [user?.id, navigate]);

  const fetchVendedores = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/vendors');
      if (response.ok) {
        const data = await response.json();
        setVendedores(data);
      } else {
        setError('Erro ao carregar vendedores');
      }
    } catch (err) {
      setError('Erro ao carregar vendedores');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVendor = async (vendorId: number, vendorName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o vendedor "${vendorName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/vendors/${vendorId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setVendedores(vendedores.filter(v => v.id !== vendorId));
      } else {
        setError('Erro ao excluir vendedor');
      }
    } catch (err) {
      setError('Erro ao excluir vendedor');
    }
  };

  const filteredVendedores = vendedores.filter(vendedor => {
    const matchesSearch = 
      vendedor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendedor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendedor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendedor.handle.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'todos') return matchesSearch;
    if (filter === 'com-telefone') return matchesSearch && vendedor.telefone;
    if (filter === 'com-endereco') return matchesSearch && vendedor.endereco;
    if (filter === 'sem-foto') return matchesSearch && !vendedor.fotoUrl;
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando vendedores...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Gerenciar Vendedores</h1>
            <p className="text-gray-600">Visualize e gerencie todos os vendedores cadastrados</p>
          </div>
          <button
            onClick={() => navigate('/admin/cadastrar-vendedor')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Novo Vendedor
          </button>
        </div>



        {/* Filtros e Busca */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar vendedores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos</option>
              <option value="com-telefone">Com Telefone</option>
              <option value="com-endereco">Com Endereço</option>
              <option value="sem-foto">Sem Foto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Vendedores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendedores.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            {searchTerm || filter !== 'todos' 
              ? 'Nenhum vendedor encontrado com os filtros aplicados'
              : 'Nenhum vendedor cadastrado'
            }
          </div>
        ) : (
          filteredVendedores.map((vendedor) => (
            <div
              key={vendedor.id}
              className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
            >
              {/* Header do Card */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {vendedor.fotoUrl ? (
                    <img
                      src={`http://localhost:3000${vendedor.fotoUrl}`}
                      alt={`${vendedor.firstName} ${vendedor.lastName}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserCircleIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {vendedor.firstName} {vendedor.lastName}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium">{vendedor.handle}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/editar-vendedor/${vendedor.id}`)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar vendedor"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteVendor(vendedor.id, `${vendedor.firstName} ${vendedor.lastName}`)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir vendedor"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Informações do Vendedor */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span className="truncate">{vendedor.email}</span>
                </div>
                
                {vendedor.telefone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <PhoneIcon className="w-4 h-4" />
                    <span>{vendedor.telefone}</span>
                  </div>
                )}
                
                {vendedor.endereco && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="truncate">{vendedor.endereco}</span>
                  </div>
                )}
              </div>

              {/* Footer do Card */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>ID: {vendedor.id}</span>
                  <span>
                    Cadastrado em {new Date(vendedor.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 