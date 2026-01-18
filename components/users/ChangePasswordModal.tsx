"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ChangePasswordModalProps {
  trigger?: React.ReactNode;
}

export function ChangePasswordModal({ trigger }: ChangePasswordModalProps) {
  const { updatePassword } = useUser();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    novaSenha: "",
    confirmarSenha: "",
  });
  const [errors, setErrors] = useState({
    novaSenha: "",
    confirmarSenha: "",
  });

  const validateForm = (): boolean => {
    const newErrors = {
      novaSenha: "",
      confirmarSenha: "",
    };

    // Validar senha mínima
    if (formData.novaSenha.length < 6) {
      newErrors.novaSenha = "A senha deve ter no mínimo 6 caracteres";
    }

    // Validar se as senhas coincidem
    if (formData.novaSenha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return !newErrors.novaSenha && !newErrors.confirmarSenha;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const success = await updatePassword(formData.novaSenha);

      if (success) {
        setOpen(false);
        setFormData({
          novaSenha: "",
          confirmarSenha: "",
        });
        setErrors({
          novaSenha: "",
          confirmarSenha: "",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao digitar
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleCancel = () => {
    setOpen(false);
    setFormData({
      novaSenha: "",
      confirmarSenha: "",
    });
    setErrors({
      novaSenha: "",
      confirmarSenha: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full justify-start">
            <Lock className="w-4 h-4 mr-2" />
            Alterar Senha
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Alterar Senha</DialogTitle>
          <DialogDescription>
            Digite sua nova senha e confirme para alterar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Nova Senha */}
            <div className="grid gap-2">
              <Label htmlFor="novaSenha">Nova Senha *</Label>
              <Input
                id="novaSenha"
                type="password"
                value={formData.novaSenha}
                onChange={(e) => handleChange("novaSenha", e.target.value)}
                placeholder="Digite a nova senha"
                required
                minLength={6}
                className={errors.novaSenha ? "border-red-500" : ""}
              />
              {errors.novaSenha && (
                <span className="text-xs text-red-500">{errors.novaSenha}</span>
              )}
              <span className="text-xs text-muted-foreground">
                Mínimo 6 caracteres
              </span>
            </div>

            {/* Confirmar Senha */}
            <div className="grid gap-2">
              <Label htmlFor="confirmarSenha">Confirmar Nova Senha *</Label>
              <Input
                id="confirmarSenha"
                type="password"
                value={formData.confirmarSenha}
                onChange={(e) => handleChange("confirmarSenha", e.target.value)}
                placeholder="Digite a senha novamente"
                required
                minLength={6}
                className={errors.confirmarSenha ? "border-red-500" : ""}
              />
              {errors.confirmarSenha && (
                <span className="text-xs text-red-500">{errors.confirmarSenha}</span>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Alterando..." : "Alterar Senha"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
