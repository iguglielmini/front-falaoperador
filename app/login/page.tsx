"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Radio, Lock, AlertCircle } from "lucide-react";
import { TacticalCard } from "@/components/shared/TaticalCard";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: authError } = await signIn.email({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "Email ou senha inválidos");
        return;
      }

      // Login bem-sucedido
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Erro ao conectar com o servidor");
      console.error("Erro no login:", err);
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
              <Radio className="w-6 h-6 text-sand -rotate-45" />
            </div>
          </div>
          <h1 className="font-orbitron text-2xl text-foreground mb-2">
            CENTRAL DE COMANDO
          </h1>
          <p className="text-sm text-muted-foreground">
            Área restrita - Identificação necessária
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 mb-6 bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-orbitron text-muted-foreground mb-2 uppercase tracking-wider">
              Identificação
            </label>
            <Input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Usuário"
              required
              className="bg-navy-dark border-border focus:border-sand"
            />
          </div>

          <div>
            <label className="block text-xs font-orbitron text-muted-foreground mb-2 uppercase tracking-wider">
              Código de Acesso
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-navy-dark border-border focus:border-sand"
            />
          </div>

          <Button
            type="submit"
            variant="tactical"
            size="lg"
            className="w-full gap-2"
            disabled={loading}
          >
            <Lock className="w-4 h-4" />
            {loading ? "Autenticando..." : "Acessar Sistema"}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Não possui acesso ao sistema?{" "}
            <Link
              href="/register"
              className="text-sand hover:text-sand/80 font-medium transition-colors"
            >
              Solicitar Credenciais
            </Link>
          </p>
          <p className="text-xs text-muted-foreground font-orbitron tracking-wider">
            SISTEMA PROTEGIDO • FALA OPERADOR
          </p>
        </div>
      </TacticalCard>
    </div>
  );
}
