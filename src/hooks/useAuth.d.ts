declare module '@/hooks/useAuth' {
  interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    address?: string;
    avatar?: string;
    createdAt?: string;
  }

  interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginUser: (email: string, password: string) => Promise<any>;
    registerUser: (data: any) => Promise<any>;
    logoutUser: () => Promise<void>;
    updateUser: (data: any) => Promise<any>;
    checkAuth: () => Promise<void>;
  }

  export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element;
  export function useAuth(): AuthContextType;
}
