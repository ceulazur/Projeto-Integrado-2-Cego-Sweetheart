import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
}

const API_BASE_URL = 'http://localhost:3000/api';

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
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error('Produto não encontrado');
  }
  return response.json();
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

// Hook to get single product
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });
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