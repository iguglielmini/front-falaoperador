"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

interface User {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  perfil: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UpdateUserData {
  nome?: string;
  sobrenome?: string;
  telefone?: string;
  dataNascimento?: string;
}

interface UserContextData {
  user: User | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  updateUser: (data: UpdateUserData) => Promise<User | null>;
  updatePassword: (newPassword: string) => Promise<boolean>;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/users/${session.user.id}`);

      if (response.ok) {
        const result = await response.json();
        setUser(result.data);
      } else {
        toast.error("Erro ao carregar dados do usuário");
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      toast.error("Erro ao conectar com o servidor");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  const updateUser = useCallback(
    async (data: UpdateUserData): Promise<User | null> => {
      if (!session?.user?.id) {
        toast.error("Usuário não autenticado");
        return null;
      }

      try {
        const response = await fetch(`/api/users/${session.user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.error || "Erro ao atualizar perfil");
          return null;
        }

        toast.success("Perfil atualizado com sucesso!");

        // Atualiza o usuário no estado
        setUser(result.data);

        return result.data;
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        toast.error("Erro ao conectar com o servidor");
        return null;
      }
    },
    [session?.user?.id],
  );
  const updatePassword = useCallback(
    async (newPassword: string): Promise<boolean> => {
      if (!session?.user?.id) {
        toast.error("Usuário não autenticado");
        return false;
      }

      try {
        const response = await fetch(`/api/users/${session.user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: newPassword }),
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.error || "Erro ao alterar senha");
          return false;
        }

        toast.success("Senha alterada com sucesso!");
        return true;
      } catch (error) {
        console.error("Erro ao alterar senha:", error);
        toast.error("Erro ao conectar com o servidor");
        return false;
      }
    },
    [session?.user?.id],
  );

  // Buscar dados do usuário quando a sessão estiver disponível
  useEffect(() => {
    if (session?.user?.id) {
      fetchUser();
    }
  }, [session?.user?.id, fetchUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        fetchUser,
        updateUser,
        updatePassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

export type { User, UpdateUserData };
