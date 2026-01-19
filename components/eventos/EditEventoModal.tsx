"use client";

import { useState, useEffect } from "react";
import {
  Pencil,
  Calendar,
  MapPin,
  Upload,
  X,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEventos, Evento } from "@/contexts/EventosContext";
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
import Image from "next/image";

interface EditEventoModalProps {
  evento: Evento;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface User {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
}

export function EditEventoModal({ evento, trigger, open: controlledOpen, onOpenChange }: EditEventoModalProps) {
  const { updateEvento } = useEventos();
  const [internalOpen, setInternalOpen] = useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    evento.imagem || null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    titulo: evento.titulo,
    descricao: evento.descricao || "",
    endereco: evento.endereco,
    numero: evento.numero,
    cep: evento.cep,
    dataInicio: evento.dataInicio.substring(0, 16), // formato datetime-local
    dataFim: evento.dataFim.substring(0, 16),
    visibilidade: evento.visibilidade as "PUBLICA" | "PRIVADA",
    categoria: evento.categoria as
      | "PODCAST"
      | "EVENTO"
      | "ENTREVISTA"
      | "LIVE"
      | "OUTRO",
    linkYoutube: evento.linkYoutube || "",
    participantes:
      evento.participantes?.map((p) => p.userId) || ([] as string[]),
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

      if (
        !formData.endereco.trim() ||
        !formData.numero.trim() ||
        !formData.cep.trim()
      ) {
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

      // Criar objeto de dados
      const data: {
        titulo: string;
        endereco: string;
        numero: string;
        cep: string;
        dataInicio: string;
        dataFim: string;
        visibilidade: "PUBLICA" | "PRIVADA";
        categoria: "PODCAST" | "EVENTO" | "ENTREVISTA" | "LIVE" | "OUTRO";
        participantes: string[];
        descricao?: string;
        linkYoutube?: string;
        imagem?: File;
      } = {
        titulo: formData.titulo,
        endereco: formData.endereco,
        numero: formData.numero,
        cep: formData.cep,
        dataInicio: dataInicioISO,
        dataFim: dataFimISO,
        visibilidade: formData.visibilidade,
        categoria: formData.categoria,
        participantes: formData.participantes,
      };

      if (formData.descricao) {
        data.descricao = formData.descricao;
      }

      if (formData.linkYoutube) {
        data.linkYoutube = formData.linkYoutube;
      }

      // Adicionar imagem se houver nova
      if (imageFile) {
        data.imagem = imageFile;
      }

      await updateEvento(evento.id, data);
      setOpen(false);

      // Reset form
      setImageFile(null);
    } catch (error) {
      console.error("Erro ao editar evento:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Preparar opções de usuários para o ComboboxMultiple
  const userOptions = users.map((user) => ({
    value: user.id,
    label: `${user.nome} ${user.sobrenome} (${user.email})`,
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Editar Evento</DialogTitle>
          <DialogDescription>
            Atualize as informações do evento.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="grid gap-4 py-4 overflow-y-auto flex-1">
            {/* Título */}
            <div className="grid gap-2">
              <Label htmlFor="titulo">
                Título <span className="text-destructive">*</span>
              </Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => handleChange("titulo", e.target.value)}
                placeholder="Digite o título do evento"
                required
                maxLength={200}
              />
            </div>

            {/* Descrição */}
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => handleChange("descricao", e.target.value)}
                placeholder="Descreva o evento"
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                maxLength={1000}
              />
            </div>

            {/* Categoria e Visibilidade */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="categoria">
                  Categoria <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => handleChange("categoria", value)}
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

              <div className="grid gap-2">
                <Label htmlFor="visibilidade">
                  Visibilidade <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.visibilidade}
                  onValueChange={(value) => handleChange("visibilidade", value)}
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

            {/* Endereço */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 grid gap-2">
                <Label htmlFor="endereco">
                  Endereço <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => handleChange("endereco", e.target.value)}
                  placeholder="Rua, Av, etc"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="numero">
                  Número <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => handleChange("numero", e.target.value)}
                  placeholder="123"
                  required
                />
              </div>
            </div>

            {/* CEP */}
            <div className="grid gap-2">
              <Label htmlFor="cep">
                CEP <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cep"
                value={formData.cep}
                onChange={(e) => handleChange("cep", e.target.value)}
                placeholder="00000-000"
                required
                maxLength={9}
              />
            </div>

            {/* Datas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dataInicio">
                  Data de Início <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dataInicio"
                  type="datetime-local"
                  value={formData.dataInicio}
                  onChange={(e) => handleChange("dataInicio", e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dataFim">
                  Data de Término <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dataFim"
                  type="datetime-local"
                  value={formData.dataFim}
                  onChange={(e) => handleChange("dataFim", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Link YouTube */}
            <div className="grid gap-2">
              <Label htmlFor="linkYoutube" className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Link do YouTube
              </Label>
              <Input
                id="linkYoutube"
                type="url"
                value={formData.linkYoutube}
                onChange={(e) => handleChange("linkYoutube", e.target.value)}
                placeholder="https://youtube.com/..."
              />
            </div>

            {/* Participantes */}
            <div className="grid gap-2">
              <Label>Participantes</Label>
              {loadingUsers ? (
                <div className="text-sm text-muted-foreground">
                  Carregando usuários...
                </div>
              ) : (
                <ComboboxMultiple
                  options={userOptions}
                  selected={formData.participantes}
                  onChange={(values) => handleChange("participantes", values)}
                  placeholder="Selecione os participantes"
                  emptyText="Nenhum usuário encontrado"
                />
              )}
            </div>

            {/* Imagem */}
            <div className="grid gap-2">
              <Label htmlFor="imagem" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Imagem do Evento
              </Label>

              {imagePreview ? (
                <div className="relative w-full h-48 border-2 border-dashed border-border rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="imagem"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">
                          Clique para enviar
                        </span>{" "}
                        ou arraste
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG ou WebP (máx. 5MB)
                      </p>
                    </div>
                    <Input
                      id="imagem"
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Atualizando..." : "Atualizar Evento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
