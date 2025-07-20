import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

export interface Product {
  id: string;
  title: string;
  artistHandle: string;
  price: string;
  imageUrl: string;
  description: string;
  quantity: number;
  dimensions: string;
  framed: boolean;
  artistUsername: string;
  artistProfileImage: string;
  availableSizes: string[];
  category: string;
}

const API_BASE_URL = '/api';

// Fetch all products
const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Falha ao buscar produtos');
  }
  return response.json();
};

// Fetch single product
const fetchProduct = async (id: string): Promise<Product> => {
  console.log('🔍 Buscando produto com ID:', id);
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  console.log('📡 Resposta da API:', response.status, response.statusText);
  
  if (!response.ok) {
    throw new Error('Produto não encontrado');
  }
  
  const data = await response.json();
  console.log('📦 Dados do produto:', data);
  return data;
};

// Create product
const createProduct = async (productData: Omit<Product, 'id'>): Promise<{ message: string; id: number }> => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    throw new Error('Falha ao criar produto');
  }
  return response.json();
};

// Update product
const updateProduct = async ({ id, ...productData }: Product): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    throw new Error('Falha ao atualizar produto');
  }
  return response.json();
};

// Delete product
const deleteProduct = async (id: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Falha ao deletar produto');
  }
  return response.json();
};

// Hook to get all products
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get single product (versão com fetch direto para debug)
export const useProduct = (id: string) => {
  const [data, setData] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('🔄 Iniciando busca do produto:', id);
        const productData = await fetchProduct(id);
        console.log('✅ Produto carregado com sucesso:', productData.title);
        setData(productData);
      } catch (err) {
        console.error('❌ Erro ao buscar produto:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, isLoading, error };
};

// Hook to create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Hook to update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
    },
  });
};

// Hook to delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}; 