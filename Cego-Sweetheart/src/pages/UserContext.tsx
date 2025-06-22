import React, { createContext, useState } from "react";
import type { ReactNode } from "react";

type Usuario = {
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  fotoUrl?: string;
};

type UserContextType = {
  usuario: Usuario;
  setUsuario: React.Dispatch<React.SetStateAction<Usuario>>;
};

const defaultUser: Usuario = {
  nome: "Jhordanna Gonçalves",
  email: "jhordanna@example.com",
  telefone: "(85) 99999-9999",
  endereco: "Rua Exemplo, 123, Quixadá - CE",
  fotoUrl: "/src/assets/3.png",
};

export const UserContext = createContext<UserContextType>({
  usuario: defaultUser,
  setUsuario: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario>(defaultUser);

  return (
    <UserContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
};
