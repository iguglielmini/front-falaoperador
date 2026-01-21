"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Upload, X, Link as LinkIcon, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePatrocinadores } from "@/contexts/PatrocinadoresContext";
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
import { toast } from "sonner";

interface CreatePatrocinadorModalProps {
  trigger?: React.ReactNode;
}

export function CreatePatrocinadorModal({ trigger }: CreatePatrocinadorModalProps) {
  const { createPatrocinador } = usePatrocinadores();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [links, setLinks] = useState<string[]>([""]);

  const [formData, setFormData] = useState({
    nomeEmpresa: "",
    telefone: "",
    email: "",
    endereco: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Imagem muito grande. Tamanho máximo: 5MB");
        return;
      }

      // Validar tipo
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error("Formato inválido. Use JPEG, PNG ou WebP");
        return;
      }

      setImageFile(file);

      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleAddLink = () => {
    setLinks([...links, ""]);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validações
      if (!formData.nomeEmpresa.trim()) {
        toast.error("Nome da empresa é obrigatório");
        setLoading(false);
        return;
      }

      if (!imageFile) {
        toast.error("Imagem é obrigatória");
        setLoading(false);
        return;
      }

      // Validar e filtrar links válidos
      const validLinks = links.filter((link) => link.trim() !== "");
      
      // Validar formato dos links
      for (const link of validLinks) {
        try {
          new URL(link);
        } catch {
          toast.error(`Link inválido: ${link}`);
          setLoading(false);
          return;
        }
      }

      // Preparar dados
      const dataToSend = {
        nomeEmpresa: formData.nomeEmpresa,
        links: validLinks,
        telefone: formData.telefone || null,
        email: formData.email || null,
        endereco: formData.endereco || null,
        imagem: imageFile,
      };

      const novoPatrocinador = await createPatrocinador(dataToSend);

      if (!novoPatrocinador) {
        setLoading(false);
        return;
      }

      // Sucesso - resetar form
      setOpen(false);
      setFormData({
        nomeEmpresa: "",
        telefone: "",
        email: "",
        endereco: "",
      });
      setLinks([""]);
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Erro ao criar patrocinador:", error);
      toast.error("Erro ao criar patrocinador");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Patrocinador
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col p-0">
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Novo Patrocinador
            </DialogTitle>
            <DialogDescription>
              Adicione um novo patrocinador do podcast
            </DialogDescription>
          </DialogHeader>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Nome da Empresa */}
          <div className="space-y-2">
            <Label htmlFor="nomeEmpresa">
              Nome da Empresa <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nomeEmpresa"
              placeholder="Digite o nome da empresa"
              value={formData.nomeEmpresa}
              onChange={(e) =>
                setFormData({ ...formData, nomeEmpresa: e.target.value })
              }
              required
            />
          </div>

          {/* Imagem */}
          <div className="space-y-2">
            <Label htmlFor="imagem">
              Logo/Imagem <span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-col gap-2">
              {imagePreview ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <label
                    htmlFor="imagem"
                    className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                  >
                    <Upload className="w-10 h-10 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Clique para fazer upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPEG, PNG ou WebP (máx. 5MB)
                    </p>
                  </label>
                  <input
                    id="imagem"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Links (Website, Redes Sociais)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddLink}
                className="gap-2"
              >
                <Plus className="w-3 h-3" />
                Adicionar Link
              </Button>
            </div>
            <div className="space-y-2">
              {links.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1 relative">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="https://exemplo.com"
                      value={link}
                      onChange={(e) => handleLinkChange(index, e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  {links.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveLink(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="contato@empresa.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={formData.telefone}
              onChange={(e) =>
                setFormData({ ...formData, telefone: e.target.value })
              }
            />
          </div>

          {/* Endereço */}
          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              placeholder="Rua Exemplo, 123 - Cidade/Estado"
              value={formData.endereco}
              onChange={(e) =>
                setFormData({ ...formData, endereco: e.target.value })
              }
            />
          </div>
        </form>
        <div className="sticky bottom-0 z-10 bg-background border-t px-6 py-4">
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Patrocinador"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
