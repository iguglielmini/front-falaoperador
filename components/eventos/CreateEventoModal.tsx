"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Calendar, MapPin, Upload, X, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEventos } from "@/contexts/EventosContext";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComboboxMultiple } from "@/components/ui/combobox-multiple";
import { toast } from "sonner";

interface CreateEventoModalProps {
  trigger?: React.ReactNode;
}

interface User {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
}

export function CreateEventoModal({ trigger }: CreateEventoModalProps) {
  const { createEvento } = useEventos();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    endereco: "",
    numero: "",
    cep: "",
    dataInicio: "",
    dataFim: "",
    visibilidade: "PUBLICA" as "PUBLICA" | "PRIVADA",
    categoria: "EVENTO" as "PODCAST" | "EVENTO" | "ENTREVISTA" | "LIVE" | "OUTRO",
    linkYoutube: "",
    participantes: [] as string[],
  });

  // Buscar usuários
  useEffect(() => {
    const fetchUsers = async () => {
      if (!open) return;
      
      setLoadingUsers(true);
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const result = await response.json();
          setUsers(Array.isArray(result.data) ? result.data : []);
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        toast.error("Erro ao carregar lista de usuários");
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [open]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validações
      if (!formData.titulo.trim()) {
        toast.error("Título é obrigatório");
        setLoading(false);
        return;
      }

      if (!formData.endereco.trim() || !formData.numero.trim() || !formData.cep.trim()) {
        toast.error("Endereço completo é obrigatório");
        setLoading(false);
        return;
      }

      if (!formData.dataInicio || !formData.dataFim) {
        toast.error("Datas de início e fim são obrigatórias");
        setLoading(false);
        return;
      }

      // Validar se data fim é maior que data início
      if (new Date(formData.dataFim) <= new Date(formData.dataInicio)) {
        toast.error("Data de fim deve ser posterior à data de início");
        setLoading(false);
        return;
      }

      // Converter datas para formato ISO 8601 com timezone
      const dataInicioISO = new Date(formData.dataInicio).toISOString();
      const dataFimISO = new Date(formData.dataFim).toISOString();

      // Preparar dados
      const dataToSend = {
        titulo: formData.titulo,
        descricao: formData.descricao || null,
        imagem: imageFile,
        endereco: formData.endereco,
        numero: formData.numero,
        cep: formData.cep,
        dataInicio: dataInicioISO,
        dataFim: dataFimISO,
        visibilidade: formData.visibilidade,
        categoria: formData.categoria,
        linkYoutube: formData.linkYoutube || null,
        participantes: formData.participantes,
      };

      const novoEvento = await createEvento(dataToSend);

      if (!novoEvento) {
        setLoading(false);
        return;
      }

      // Sucesso - resetar form
      setOpen(false);
      setFormData({
        titulo: "",
        descricao: "",
        endereco: "",
        numero: "",
        cep: "",
        dataInicio: "",
        dataFim: "",
        visibilidade: "PUBLICA",
        categoria: "EVENTO",
        linkYoutube: "",
        participantes: [],
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      toast.error("Erro ao criar evento");
    } finally {
      setLoading(false);
    }
  };

  const userOptions = users.map((user) => ({
    value: user.id,
    label: `${user.nome} ${user.sobrenome} (${user.email})`,
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Evento
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Evento</DialogTitle>
          <DialogDescription>
            Preencha os dados do evento. Campos obrigatórios marcados com *
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              placeholder="Ex: Podcast: Tecnologia e Inovação"
              value={formData.titulo}
              onChange={(e) =>
                setFormData({ ...formData, titulo: e.target.value })
              }
              required
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <textarea
              id="descricao"
              placeholder="Descreva o evento..."
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground">
              {formData.descricao.length}/1000 caracteres
            </p>
          </div>

          {/* Imagem */}
          <div className="space-y-2">
            <Label htmlFor="imagem">Imagem do Evento</Label>
            {imagePreview ? (
              <div className="relative w-full h-48">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
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
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <Label
                  htmlFor="imagem"
                  className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                >
                  Clique para fazer upload
                  <br />
                  <span className="text-xs">
                    JPEG, PNG ou WebP (máx. 5MB)
                  </span>
                </Label>
                <Input
                  id="imagem"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Endereço */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="endereco">Endereço *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="endereco"
                  placeholder="Av. Paulista"
                  value={formData.endereco}
                  onChange={(e) =>
                    setFormData({ ...formData, endereco: e.target.value })
                  }
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero">Número *</Label>
              <Input
                id="numero"
                placeholder="1000"
                value={formData.numero}
                onChange={(e) =>
                  setFormData({ ...formData, numero: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cep">CEP *</Label>
              <Input
                id="cep"
                placeholder="01310-100"
                value={formData.cep}
                onChange={(e) =>
                  setFormData({ ...formData, cep: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data/Hora Início *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="dataInicio"
                  type="datetime-local"
                  value={formData.dataInicio}
                  onChange={(e) =>
                    setFormData({ ...formData, dataInicio: e.target.value })
                  }
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFim">Data/Hora Fim *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="dataFim"
                  type="datetime-local"
                  value={formData.dataFim}
                  onChange={(e) =>
                    setFormData({ ...formData, dataFim: e.target.value })
                  }
                  className="pl-9"
                  required
                />
              </div>
            </div>
          </div>

          {/* Categoria e Visibilidade */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value: "PODCAST" | "EVENTO" | "ENTREVISTA" | "LIVE" | "OUTRO") =>
                  setFormData({ ...formData, categoria: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PODCAST">Podcast</SelectItem>
                  <SelectItem value="EVENTO">Evento</SelectItem>
                  <SelectItem value="ENTREVISTA">Entrevista</SelectItem>
                  <SelectItem value="LIVE">Live</SelectItem>
                  <SelectItem value="OUTRO">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibilidade">Visibilidade</Label>
              <Select
                value={formData.visibilidade}
                onValueChange={(value: "PUBLICA" | "PRIVADA") =>
                  setFormData({ ...formData, visibilidade: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLICA">Pública</SelectItem>
                  <SelectItem value="PRIVADA">Privada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Link YouTube */}
          <div className="space-y-2">
            <Label htmlFor="linkYoutube">Link do YouTube</Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="linkYoutube"
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={formData.linkYoutube}
                onChange={(e) =>
                  setFormData({ ...formData, linkYoutube: e.target.value })
                }
                className="pl-9"
              />
            </div>
          </div>

          {/* Participantes */}
          <div className="space-y-2">
            <Label>Participantes</Label>
            {loadingUsers ? (
              <div className="text-sm text-muted-foreground">
                Carregando usuários...
              </div>
            ) : (
              <ComboboxMultiple
                options={userOptions}
                selected={formData.participantes}
                onChange={(selected) =>
                  setFormData({ ...formData, participantes: selected })
                }
                placeholder="Selecione os participantes"
                emptyText="Nenhum usuário encontrado"
                searchPlaceholder="Buscar usuários..."
              />
            )}
          </div>

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
              {loading ? "Criando..." : "Criar Evento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
