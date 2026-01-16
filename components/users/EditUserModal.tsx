"use client";

import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PerfilUsuario } from "@/app/generated/prisma/enums";

interface EditUserModalProps {
  user: {
    id: string;
    nome: string | null;
    sobrenome: string | null;
    email: string;
    telefone: string | null;
    dataNascimento: string | null;
    perfil: string | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated?: () => void;
}

export function EditUserModal({
  user,
  open,
  onOpenChange,
  onUserUpdated,
}: EditUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<{
    nome: string;
    sobrenome: string;
    email: string;
    password: string;
    telefone: string;
    dataNascimento: string;
    perfil: PerfilUsuario;
  }>({
    nome: "",
    sobrenome: "",
    email: "",
    password: "",
    telefone: "",
    dataNascimento: "",
    perfil: PerfilUsuario.USUARIO,
  });

  // Popula o formulário quando o modal abre ou o usuário muda
  useEffect(() => {
    if (user && open) {
      const dateValue = user.dataNascimento 
        ? new Date(user.dataNascimento).toISOString().split('T')[0]
        : "";

      setFormData({
        nome: user.nome || "",
        sobrenome: user.sobrenome || "",
        email: user.email || "",
        password: "", // Senha vazia para não alterar
        telefone: user.telefone || "",
        dataNascimento: dateValue,
        perfil: (user.perfil as PerfilUsuario) || PerfilUsuario.USUARIO,
      });
      setError("");
    }
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Remove campos vazios para não atualizar desnecessariamente
      const updateData: Record<string, string> = {};
      
      if (formData.nome) updateData.nome = formData.nome;
      if (formData.sobrenome) updateData.sobrenome = formData.sobrenome;
      if (formData.email) updateData.email = formData.email;
      if (formData.password) updateData.password = formData.password; // Só envia se preenchida
      if (formData.telefone) updateData.telefone = formData.telefone;
      if (formData.dataNascimento) updateData.dataNascimento = formData.dataNascimento;
      if (formData.perfil) updateData.perfil = formData.perfil;

      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Erro ao atualizar usuário");
        return;
      }

      // Sucesso
      toast.success("Usuário atualizado com sucesso!");
      onOpenChange(false);
      
      if (onUserUpdated) {
        onUserUpdated();
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
      console.error("Erro ao atualizar usuário:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize os dados do usuário. Deixe a senha em branco para não alterá-la.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Nome */}
            <div className="grid gap-2">
              <Label htmlFor="edit-nome">Nome *</Label>
              <Input
                id="edit-nome"
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                placeholder="Digite o nome"
                required
              />
            </div>

            {/* Sobrenome */}
            <div className="grid gap-2">
              <Label htmlFor="edit-sobrenome">Sobrenome *</Label>
              <Input
                id="edit-sobrenome"
                value={formData.sobrenome}
                onChange={(e) => handleChange("sobrenome", e.target.value)}
                placeholder="Digite o sobrenome"
                required
              />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="usuario@exemplo.com"
                required
              />
            </div>

            {/* Senha */}
            <div className="grid gap-2">
              <Label htmlFor="edit-password">Senha</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Deixe em branco para não alterar"
                minLength={6}
              />
              <span className="text-xs text-muted-foreground">
                Mínimo 6 caracteres. Deixe vazio para manter a senha atual.
              </span>
            </div>

            {/* Telefone */}
            <div className="grid gap-2">
              <Label htmlFor="edit-telefone">Telefone *</Label>
              <Input
                id="edit-telefone"
                type="tel"
                value={formData.telefone}
                onChange={(e) => handleChange("telefone", e.target.value)}
                placeholder="(11) 99999-9999"
                required
              />
            </div>

            {/* Data de Nascimento */}
            <div className="grid gap-2">
              <Label htmlFor="edit-dataNascimento">Data de Nascimento *</Label>
              <Input
                id="edit-dataNascimento"
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => handleChange("dataNascimento", e.target.value)}
                required
              />
            </div>

            {/* Perfil */}
            <div className="grid gap-2">
              <Label htmlFor="edit-perfil">Perfil *</Label>
              <Select
                value={formData.perfil}
                onValueChange={(value) => handleChange("perfil", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PerfilUsuario.USUARIO}>Usuário</SelectItem>
                  <SelectItem value={PerfilUsuario.ADMIN}>Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Erro */}
            {error && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              <Pencil className="w-4 h-4" />
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
