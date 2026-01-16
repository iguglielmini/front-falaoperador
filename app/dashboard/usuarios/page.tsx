"use client";

import { useEffect, useState } from "react";
import { Users, Mail, Calendar } from "lucide-react";

interface User {
  id: string;
  nome: string | null;
  sobrenome: string | null;
  email: string;
  telefone: string | null;
  dataNascimento: string | null;
  perfil: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const result = await response.json();
        // A API retorna { data: users }
        setUsers(Array.isArray(result.data) ? result.data : []);
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-sand" />
          <h1 className="text-3xl font-orbitron font-bold">Usuários</h1>
        </div>
        <p className="text-muted-foreground">
          Gerenciar usuários do sistema
        </p>
      </div>

      {/* Users List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Nome
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Perfil
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Cadastro
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    Carregando...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-sand/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-sand" />
                        </div>
                        <span className="font-medium">
                          {user.nome && user.sobrenome 
                            ? `${user.nome} ${user.sobrenome}` 
                            : user.nome || user.sobrenome || "Sem nome"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.perfil === 'admin'
                            ? "bg-purple-500/10 text-purple-500"
                            : "bg-blue-500/10 text-blue-500"
                        }`}
                      >
                        {user.perfil || "Usuário"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
