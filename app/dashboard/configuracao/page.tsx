"use client";

import { useEffect, useState } from "react";
import { Settings, User, Mail, Calendar, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  createdAt: string;
}

export default function ConfiguracaoPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Aqui você pode fazer uma chamada para obter os dados do usuário atual
      // Por enquanto vamos usar dados mockados
      setUserData({
        id: "1",
        name: "Usuário Admin",
        email: "admin@falaoperador.com",
        emailVerified: true,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-12">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-8 h-8 text-sand" />
          <h1 className="text-3xl font-orbitron font-bold">Configuração</h1>
        </div>
        <p className="text-muted-foreground">
          Gerenciar suas informações e preferências
        </p>
      </div>

      <div className="max-w-2xl">
        {/* User Profile Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-sand/20 flex items-center justify-center">
              <User className="w-10 h-10 text-sand" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">
                {userData?.name || "Sem nome"}
              </h2>
              <p className="text-sm text-muted-foreground">{userData?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                Nome
              </Label>
              <Input
                id="name"
                defaultValue={userData?.name || ""}
                placeholder="Seu nome"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                Email
              </Label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  defaultValue={userData?.email}
                  disabled
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Status da conta</span>
              </div>
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  userData?.emailVerified
                    ? "bg-green-500/10 text-green-500"
                    : "bg-yellow-500/10 text-yellow-500"
                }`}
              >
                {userData?.emailVerified ? "Verificada" : "Pendente"}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Membro desde</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {userData?.createdAt && 
                  new Date(userData.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button className="flex-1">Salvar Alterações</Button>
            <Button variant="outline">Cancelar</Button>
          </div>
        </Card>

        {/* Security Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Segurança</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Alterar Senha
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600">
              Excluir Conta
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
