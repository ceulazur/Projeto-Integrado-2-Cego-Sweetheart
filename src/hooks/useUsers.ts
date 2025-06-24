import { useQuery } from '@tanstack/react-query';

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  telefone?: string;
  endereco?: string;
  fotoUrl?: string;
  created_at: string;
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      const response = await fetch('http://localhost:3000/api/users');
      if (!response.ok) {
        throw new Error('Falha ao buscar usuários');
      }
      return response.json();
    },
  });
}; 