import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Building2,
  Eye,
  Star,
  Pencil,
  Trash2,
  Loader2,
  LogOut,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const BRAZILIAN_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

interface Motel {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string | null;
  phone: string;
  whatsapp: string;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  twitter: string | null;
  tiktok: string | null;
  youtube: string | null;
  onlyfans: string | null;
  privacy_link: string | null;
  latitude: number | null;
  longitude: number | null;
  is_premium: boolean;
  views_count: number;
  is_active: boolean;
}

const initialFormData = {
  name: "",
  description: "",
  address: "",
  city: "",
  state: "",
  zip_code: "",
  phone: "",
  whatsapp: "",
  website: "",
  instagram: "",
  facebook: "",
  twitter: "",
  tiktok: "",
  youtube: "",
  onlyfans: "",
  privacy_link: "",
};

export default function Dashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const [motels, setMotels] = useState<Motel[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingMotel, setEditingMotel] = useState<Motel | null>(null);
  const [deletingMotelId, setDeletingMotelId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchMotels();
    }
  }, [user]);

  const fetchMotels = async () => {
    try {
      const { data, error } = await supabase
        .from("motels")
        .select("*")
        .eq("owner_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMotels(data || []);
    } catch (error) {
      console.error("Error fetching motels:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar seus motéis.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStateChange = (value: string) => {
    setFormData((prev) => ({ ...prev, state: value }));
  };

  const openCreateDialog = () => {
    setEditingMotel(null);
    setFormData(initialFormData);
    setDialogOpen(true);
  };

  const openEditDialog = (motel: Motel) => {
    setEditingMotel(motel);
    setFormData({
      name: motel.name,
      description: motel.description,
      address: motel.address,
      city: motel.city,
      state: motel.state,
      zip_code: motel.zip_code || "",
      phone: motel.phone,
      whatsapp: motel.whatsapp,
      website: motel.website || "",
      instagram: motel.instagram || "",
      facebook: motel.facebook || "",
      twitter: motel.twitter || "",
      tiktok: motel.tiktok || "",
      youtube: motel.youtube || "",
      onlyfans: motel.onlyfans || "",
      privacy_link: motel.privacy_link || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const motelData = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code || null,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        website: formData.website || null,
        instagram: formData.instagram || null,
        facebook: formData.facebook || null,
        twitter: formData.twitter || null,
        tiktok: formData.tiktok || null,
        youtube: formData.youtube || null,
        onlyfans: formData.onlyfans || null,
        privacy_link: formData.privacy_link || null,
        owner_id: user!.id,
      };

      if (editingMotel) {
        const { error } = await supabase
          .from("motels")
          .update(motelData)
          .eq("id", editingMotel.id);

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Motel atualizado com sucesso.",
        });
      } else {
        const { error } = await supabase.from("motels").insert(motelData);

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Motel cadastrado com sucesso.",
        });
      }

      setDialogOpen(false);
      fetchMotels();
    } catch (error) {
      console.error("Error saving motel:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar o motel.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingMotelId) return;

    try {
      const { error } = await supabase
        .from("motels")
        .delete()
        .eq("id", deletingMotelId);

      if (error) throw error;

      toast({
        title: "Motel excluído",
        description: "O motel foi removido com sucesso.",
      });

      setDeleteDialogOpen(false);
      setDeletingMotelId(null);
      fetchMotels();
    } catch (error) {
      console.error("Error deleting motel:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o motel.",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/30 bg-card/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-orbitron text-xl font-black">
              <span className="text-primary neon-text-subtle">BDSM</span>
              <span className="text-foreground">BRAZIL</span>
            </span>
            <span className="text-muted-foreground text-sm">Painel</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")}>
              Ver Site
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-border/50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-orbitron">{motels.length}</p>
                <p className="text-sm text-muted-foreground">Motéis cadastrados</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-orbitron">
                  {motels.reduce((acc, m) => acc + m.views_count, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total de visualizações</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-premium/10">
                <Star className="w-6 h-6 text-premium" />
              </div>
              <div>
                <p className="text-2xl font-bold font-orbitron">
                  {motels.filter((m) => m.is_premium).length}
                </p>
                <p className="text-sm text-muted-foreground">Motéis Premium</p>
              </div>
            </div>
          </div>
        </div>

        {/* Motels list */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-orbitron text-xl font-bold">Meus Motéis</h2>
          <Button onClick={openCreateDialog} className="neon-button text-white">
            <Plus className="w-4 h-4 mr-2" />
            Novo Motel
          </Button>
        </div>

        {motels.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-orbitron text-xl font-bold mb-2">
              Nenhum motel cadastrado
            </h3>
            <p className="text-muted-foreground mb-6">
              Comece cadastrando seu primeiro motel
            </p>
            <Button onClick={openCreateDialog} className="neon-button text-white">
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Motel
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {motels.map((motel) => (
              <div
                key={motel.id}
                className="glass-card rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-orbitron text-lg font-bold">{motel.name}</h3>
                    {motel.is_premium && (
                      <Badge className="premium-badge">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {motel.city}, {motel.state}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {motel.views_count.toLocaleString()} views
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(motel)}
                    className="border-border/50"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDeletingMotelId(motel.id);
                      setDeleteDialogOpen(true);
                    }}
                    className="border-destructive/50 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-orbitron">
              {editingMotel ? "Editar Motel" : "Novo Motel"}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do seu motel
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic info */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Informações Básicas
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Motel *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="(11) 99999-9999"
                    className="bg-secondary/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="bg-secondary/50"
                  placeholder="Descreva a suíte temática, equipamentos e diferenciais..."
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Endereço
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Endereço completo *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado *</Label>
                  <Select value={formData.state} onValueChange={handleStateChange}>
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRAZILIAN_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip_code">CEP</Label>
                  <Input
                    id="zip_code"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleChange}
                    placeholder="00000-000"
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp *</Label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    required
                    placeholder="11999999999"
                    className="bg-secondary/50"
                  />
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Links e Redes Sociais
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Site</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/..."
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    placeholder="https://facebook.com/..."
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter/X</Label>
                  <Input
                    id="twitter"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    placeholder="https://x.com/..."
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiktok">TikTok</Label>
                  <Input
                    id="tiktok"
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleChange}
                    placeholder="https://tiktok.com/..."
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleChange}
                    placeholder="https://youtube.com/..."
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="onlyfans">OnlyFans</Label>
                  <Input
                    id="onlyfans"
                    name="onlyfans"
                    value={formData.onlyfans}
                    onChange={handleChange}
                    placeholder="https://onlyfans.com/..."
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="privacy_link">Privacy</Label>
                  <Input
                    id="privacy_link"
                    name="privacy_link"
                    value={formData.privacy_link}
                    onChange={handleChange}
                    placeholder="https://privacy.com.br/..."
                    className="bg-secondary/50"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="neon-button text-white" disabled={saving}>
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {editingMotel ? "Salvar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir motel?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O motel será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
