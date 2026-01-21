"use client";

import { useState } from "react";
import { Settings, User, Mail, Calendar, Shield, Phone } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { ChangePasswordModal } from "@/components/users/ChangePasswordModal";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ConfiguracaoPage() {
  const { user, loading, updateUser } = useUser();
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    telefone: "",
    dataNascimento: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Atualizar formData quando user carregar
  useState(() => {
    if (user) {
      setFormData({
        nome: user.nome,
        sobrenome: user.sobrenome,
        telefone: user.telefone,
        dataNascimento: user.dataNascimento,
      });
    }
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await updateUser(formData);

    setIsSubmitting(false);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        nome: user.nome,
        sobrenome: user.sobrenome,
        telefone: user.telefone,
        dataNascimento: user.dataNascimento,
      });
    }
  };

  if (loading || !user) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-12">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in-down">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-8 h-8 text-sand" />
          <h1 className="text-3xl font-orbitron font-bold">Configuração</h1>
        </div>
        <p className="text-muted-foreground">
          Gerenciar suas informações e preferências
        </p>
      </div>

      <div className="w-full">
        {/* User Profile Card */}
        <Card className="p-6 mb-6 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-sand/20 flex items-center justify-center">
              <User className="w-10 h-10 text-sand" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">
                {user.nome} {user.sobrenome}
              </h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="nome"
                    className="text-sm font-medium mb-2 block"
                  >
                    Nome
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleChange("nome", e.target.value)}
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="sobrenome"
                    className="text-sm font-medium mb-2 block"
                  >
                    Sobrenome
                  </Label>
                  <Input
                    id="sobrenome"
                    value={formData.sobrenome}
                    onChange={(e) => handleChange("sobrenome", e.target.value)}
                    placeholder="Seu sobrenome"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium mb-2 block"
                >
                  Email
                </Label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="telefone"
                    className="text-sm font-medium mb-2 block"
                  >
                    Telefone
                  </Label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="telefone"
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => handleChange("telefone", e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="dataNascimento"
                    className="text-sm font-medium mb-2 block"
                  >
                    Data de Nascimento
                  </Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={
                      formData.dataNascimento
                        ? new Date(formData.dataNascimento)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleChange("dataNascimento", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Perfil</span>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    user.perfil === "ADMIN"
                      ? "bg-purple-500/10 text-purple-500"
                      : "bg-blue-500/10 text-blue-500"
                  }`}
                >
                  {user.perfil === "ADMIN" ? "Administrador" : "Usuário"}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Status da conta</span>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    user.emailVerified
                      ? "bg-green-500/10 text-green-500"
                      : "bg-yellow-500/10 text-yellow-500"
                  }`}
                >
                  {user.emailVerified ? "Verificada" : "Pendente"}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Membro desde</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button type="submit"  disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>

        {/* Security Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Segurança</h3>
          <div className="space-y-3">
            <ChangePasswordModal />
            <Button
              variant="outline"
              className="w-full justify-start text-red-500 hover:text-red-600"
            >
              Excluir Conta
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
