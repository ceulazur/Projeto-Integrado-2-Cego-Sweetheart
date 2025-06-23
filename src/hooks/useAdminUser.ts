import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  telefone?: string;
  endereco?: string;
  fotoUrl?: string;
}

const API_BASE_URL = 'http://localhost:3000/api';

export const useAdminUser = (id: string) => {
  return useQuery<AdminUser>({
    queryKey: ['admin-user', id],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/users/${id}`);
      if (!res.ok) throw new Error('Erro ao buscar usuário');
      return res.json();
    },
    enabled: !!id,
  });
};

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<AdminUser> & { id: string }) => {
      const res = await fetch(`${API_BASE_URL}/users/${id}` , {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao atualizar usuário');
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-user', variables.id] });
    },
  });
}; 