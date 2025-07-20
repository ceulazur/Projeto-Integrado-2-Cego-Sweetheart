import React, { useState, useEffect } from 'react';
import { TruckIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

interface FreteOption {
  codigo: string;
  nome: string;
  preco: number;
  prazo: number;
}

interface FreteCalculatorProps {
  onFreteSelect: (frete: FreteOption) => void;
  selectedFrete?: FreteOption | null;
  cepOrigem?: string;
}

export const FreteCalculator: React.FC<FreteCalculatorProps> = ({
  onFreteSelect,
  selectedFrete,
  cepOrigem = '01001-000' // CEP padrão de São Paulo
}) => {
  const [cepDestino, setCepDestino] = useState('');
  const [endereco, setEndereco] = useState<any>(null);
  const [freteOptions, setFreteOptions] = useState<FreteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Buscar endereço quando CEP for digitado
  useEffect(() => {
    if (cepDestino.length === 9) {
      buscarEndereco();
    } else {
      setEndereco(null);
    }
  }, [cepDestino]);

  const buscarEndereco = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/cep/${cepDestino.replace(/\D/g, '')}`);
      const data = await response.json();
      
      if (response.ok) {
        setEndereco(data);
        calcularFrete();
      } else {
        setError(data.error || 'CEP não encontrado');
        setEndereco(null);
      }
    } catch (error) {
      setError('Erro ao buscar CEP');
      setEndereco(null);
    } finally {
      setLoading(false);
    }
  };

  const calcularFrete = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/frete/calcular', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cepOrigem,
          cepDestino: cepDestino.replace(/\D/g, ''),
          peso: 1000, // 1kg
          comprimento: 20,
          altura: 20,
          largura: 20
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setFreteOptions(data.servicos);
      } else {
        setError(data.error || 'Erro ao calcular frete');
      }
    } catch (error) {
      setError('Erro ao calcular frete');
    } finally {
      setLoading(false);
    }
  };

  const formatarCep = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 9) {
      setCepDestino(formatarCep(value));
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <TruckIcon className="w-5 h-5" />
        Calcular Frete
      </h3>

      {/* Campo CEP */}
      <div className="mb-4">
        <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">
          CEP de Destino
        </label>
        <div className="relative">
          <input
            type="text"
            id="cep"
            value={cepDestino}
            onChange={handleCepChange}
            placeholder="00000-000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={9}
          />
          {loading && (
            <div className="absolute right-3 top-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>

      {/* Endereço encontrado */}
      {endereco && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-start gap-2">
            <MapPinIcon className="w-4 h-4 text-green-600 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-medium">{endereco.logradouro}</p>
              <p>{endereco.bairro}, {endereco.localidade} - {endereco.uf}</p>
            </div>
          </div>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Opções de frete */}
      {freteOptions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Opções de Entrega:</h4>
          {freteOptions.map((frete) => (
            <div
              key={frete.codigo}
              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                selectedFrete?.codigo === frete.codigo
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onFreteSelect(frete)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TruckIcon className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{frete.nome}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {frete.prazo} dia{frete.prazo > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    R$ {frete.preco.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Frete selecionado */}
      {selectedFrete && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Frete selecionado:</span> {selectedFrete.nome} - 
            R$ {selectedFrete.preco.toFixed(2).replace('.', ',')} 
            ({selectedFrete.prazo} dia{selectedFrete.prazo > 1 ? 's' : ''})
          </p>
        </div>
      )}
    </div>
  );
}; 