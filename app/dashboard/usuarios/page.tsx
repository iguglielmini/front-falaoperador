"use client";

import { useEffect, useState } from "react";
import { Users, Mail, Calendar, Pencil, Trash2 } from "lucide-react";
import { CreateUserModal } from "@/components/users/CreateUserModal";
import { DeleteUserModal } from "@/components/users/DeleteUserModal";
import { EditUserModal } from "@/components/users/EditUserModal";
import { Button } from "@/components/ui/button";

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
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    user: User | null;
  }>({ open: false, user: null });
  const [editModal, setEditModal] = useState<{
    open: boolean;
    user: User | null;
  }>({ open: false, user: null });

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

  const handleEdit = (user: User) => {
    setEditModal({ open: true, user });
  };

  const handleDelete = (user: User) => {
    setDeleteModal({ open: true, user });
  };

  const confirmDelete = async () => {
    if (!deleteModal.user) return;

    try {
      const response = await fetch(`/api/users/${deleteModal.user.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Atualiza a lista removendo o usuário excluído
        setUsers((prev) => prev.filter((u) => u.id !== deleteModal.user!.id));
        setDeleteModal({ open: false, user: null });
      } else {
        const result = await response.json();
        alert(result.error || "Erro ao excluir usuário");
      }
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      alert("Erro ao excluir usuário");
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-sand" />
            <h1 className="text-3xl font-orbitron font-bold">Usuários</h1>
          </div>
          <CreateUserModal onUserCreated={fetchUsers} />
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
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Carregando...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
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
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(user)}
                          className="h-8 w-8"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user)}
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editModal.user && (
        <EditUserModal
          user={editModal.user}
          open={editModal.open}
          onOpenChange={(open) => setEditModal({ open, user: null })}
          onUserUpdated={fetchUsers}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.user && (
        <DeleteUserModal
          user={deleteModal.user}
          open={deleteModal.open}
          onOpenChange={(open) => setDeleteModal({ open, user: null })}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
