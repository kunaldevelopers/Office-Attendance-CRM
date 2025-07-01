import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { demoData, mockCredentials } from '../data/demoData';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
  department: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('enegix-crm-token');
    const userData = localStorage.getItem('enegix-crm-user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check credentials
    const isValidAdmin = email === mockCredentials.admin.email && password === mockCredentials.admin.password;
    const isValidEmployee = email === mockCredentials.employee.email && password === mockCredentials.employee.password;
    
    if (isValidAdmin || isValidEmployee) {
      const userData = demoData.users.find(u => u.email === email);
      if (userData) {
        const mockToken = `mock-jwt-token-${Date.now()}`;
        localStorage.setItem('enegix-crm-token', mockToken);
        localStorage.setItem('enegix-crm-user', JSON.stringify(userData));
        setUser(userData);
        setIsLoading(false);
        return true;
      }
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    localStorage.removeItem('enegix-crm-token');
    localStorage.removeItem('enegix-crm-user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};