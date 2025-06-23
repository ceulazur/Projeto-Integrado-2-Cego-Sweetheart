import React, { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext"; // Importar o hook useAuth

type Usuario = {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  fotoUrl?: string;
};

type UserContextType = {
  usuario: Usuario | null;
  setUsuario: React.Dispatch<React.SetStateAction<Usuario | null>>;
  loading: boolean;
};

export const UserContext = createContext<UserContextType>({
  usuario: null,
  setUsuario: () => {},
  loading: true,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const { user: authUser } = useAuth(); // Usar o hook useAuth

  useEffect(() => {
    const fetchUserData = async () => {
      // Tenta obter o usuário do AuthContext, que deve ser populado no login
      if (authUser?.id) {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:3000/api/users/${authUser.id}`);
          if (response.ok) {
            const data = await response.json();
            // O backend retorna `firstName` e `lastName`, vamos combinar para `nome`
            setUsuario({
              id: data.id,
              nome: `${data.firstName} ${data.lastName}`,
              email: data.email,
              telefone: data.telefone,
              endereco: data.endereco,
              fotoUrl: data.fotoUrl,
            });
          } else {
             // Se falhar, talvez deslogar o usuário ou tratar o erro
             console.error("Falha ao buscar dados do usuário");
             setUsuario(null);
          }
        } catch (error) {
          console.error("Erro ao conectar com a API:", error);
          setUsuario(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // Não há usuário logado
      }
    };

    fetchUserData();
  }, [authUser]); // Re-executa quando o usuário do AuthContext mudar

  return (
    <UserContext.Provider value={{ usuario, setUsuario, loading }}>
      {children}
    </UserContext.Provider>
  );
}; 