"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserPlus, AlertCircle } from "lucide-react";
import { TacticalCard } from "@/components/shared/TaticalCard";
import { signIn } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    password: "",
    telefone: "",
    dataNascimento: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Primeiro criar o usuário na API
      const userData = {
        nome: formData.nome,
        sobrenome: formData.sobrenome,
        email: formData.email,
        password: formData.password,
        telefone: formData.telefone,
        dataNascimento: formData.dataNascimento,
        perfil: "USUARIO", // Sempre criar como USUARIO no registro público
      };

      const userResponse = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        setError(errorData.error || "Erro ao criar conta");
        return;
      }

      // Usuário criado com sucesso, agora fazer login automaticamente
      const { data, error: authError } = await signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        setError("Conta criada com sucesso! Redirecionando para login...");
        // Aguarda 2 segundos e redireciona para login
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return;
      }

      // Registro e login bem-sucedidos - redireciona para dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Erro ao conectar com o servidor");
      console.error("Erro no registro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-radar-gradient opacity-30" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(38, 40%, 55%) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(38, 40%, 55%) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <TacticalCard className="w-full max-w-md mx-4 p-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 bg-sand/10 rounded-lg rotate-45" />
            <div className="absolute inset-2 bg-navy-dark rounded-lg rotate-45 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-sand -rotate-45deg" />
            </div>
          </div>
          <h1 className="font-orbitron text-2xl text-foreground mb-2">
            NOVO OPERADOR
          </h1>
          <p className="text-sm text-muted-foreground">
            Cadastro de novo usuário no sistema
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 mb-6 bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="nome"
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                Nome
              </Label>
              <Input
                id="nome"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleChange}
                required
                disabled={loading}
                className="bg-input/50 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="sobrenome"
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                Sobrenome
              </Label>
              <Input
                id="sobrenome"
                name="sobrenome"
                type="text"
                value={formData.sobrenome}
                onChange={handleChange}
                required
                disabled={loading}
                className="bg-input/50 border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="bg-input/50 border-border"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Senha
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              className="bg-input/50 border-border"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="telefone"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Telefone
            </Label>
            <Input
              id="telefone"
              name="telefone"
              type="tel"
              value={formData.telefone}
              onChange={handleChange}
              required
              disabled={loading}
              className="bg-input/50 border-border"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="dataNascimento"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Data de Nascimento
            </Label>
            <Input
              id="dataNascimento"
              name="dataNascimento"
              type="date"
              value={formData.dataNascimento}
              onChange={handleChange}
              required
              disabled={loading}
              className="bg-input/50 border-border"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-sand hover:bg-sand-light text-navy font-orbitron uppercase tracking-wider"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrar"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Já possui conta?{" "}
            <a
              href="/login"
              className="text-sand hover:text-sand-light underline"
            >
              Fazer login
            </a>
          </p>
        </div>
      </TacticalCard>
    </div>
  );
}
