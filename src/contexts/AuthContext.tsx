import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Tenta carregar o usuário do localStorage ao iniciar a aplicação
    const storedUser = localStorage.getItem('admin-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erro ao parsear usuário do localStorage", error);
        localStorage.removeItem('admin-user');
      }
    }
  }, []);

  const logout = () => {
    setUser(null);
    // Limpa o usuário do localStorage ao fazer logout
    localStorage.removeItem('admin-user');
  };

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 