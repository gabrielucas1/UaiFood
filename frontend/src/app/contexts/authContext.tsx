'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definir o tipo do usuário (igual ao backend)
interface User {
  id: string;
  nome: string;
  phone: string;
  type: 'CLIENT' | 'ADMIN';
}

// Definir o que o contexto vai fornecer
interface AuthContextType {
  user: User | null;           // Dados do usuário logado
  isLoggedIn: boolean;         // Se está logado ou não
  isLoading: boolean;          // Se está carregando
  login: (token: string, user: User) => void;   // Função para fazer login
  logout: () => void;          // Função para fazer logout
}

// Criar o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provedor que vai envolver toda a aplicação
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se já tem usuário logado quando carregar a página
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');



    if (savedToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Função para fazer login
  const login = (newToken: string, userData: User) => {
    
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    

  };

  // Função para fazer logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isLoggedIn = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}