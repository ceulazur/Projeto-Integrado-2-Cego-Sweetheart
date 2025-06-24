import { useQuery } from '@tanstack/react-query';

export type Vendor = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  telefone?: string;
  endereco?: string;
  fotoUrl?: string;
  created_at: string;
};

export const useVendors = () => {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: async (): Promise<Vendor[]> => {
      const response = await fetch('http://localhost:3000/api/vendors');
      if (!response.ok) {
        throw new Error('Falha ao buscar vendedores');
      }
      return response.json();
    },
  });
}; 