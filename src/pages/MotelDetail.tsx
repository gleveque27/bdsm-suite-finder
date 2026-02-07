import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, MapPin, Phone, MessageCircle, ExternalLink, Star, Eye, Clock, CreditCard, Sparkles, ChevronLeft, ChevronRight, Navigation } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SocialLinks } from "@/components/SocialLinks";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  operating_hours: string | null;
  payment_methods: string[] | null;
  services: string[] | null;
  suite_periods: string[] | null;
  photos: { url: string; display_order: number }[];
}

const MotelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [motel, setMotel] = useState<Motel | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  useEffect(() => {
    if (id) {
      fetchMotel(id);
      incrementViews(id);
    }
  }, [id]);

  const fetchMotel = async (motelId: string) => {
    try {
      const { data, error } = await supabase
        .from("motels")
        .select(`
          *,
          motel_photos (url, display_order)
        `)
        .eq("id", motelId)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          variant: "destructive",
          title: "Motel não encontrado",
          description: "Este motel não existe ou foi desativado.",
        });
        navigate("/");
        return;
      }

      setMotel({
        ...data,
        photos: (data.motel_photos || []).sort((a: any, b: any) => a.display_order - b.display_order),
      });
    } catch (error) {
      console.error("Error fetching motel:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as informações do motel.",
      });
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async (motelId: string) => {
    try {
      await supabase.rpc("increment_motel_views", { motel_uuid: motelId });
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const whatsappLink = motel
    ? `https://wa.me/55${motel.whatsapp.replace(/\D/g, "")}`
    : "";
  
  const getGoogleMapsLink = () => {
    if (!motel) return "";
    return motel.latitude && motel.longitude
      ? `https://www.google.com/maps/dir/?api=1&destination=${motel.latitude},${motel.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(motel.address + ", " + motel.city + " - " + motel.state)}`;
  };

  const getWazeLink = () => {
    if (!motel) return "";
    return motel.latitude && motel.longitude
      ? `https://waze.com/ul?ll=${motel.latitude},${motel.longitude}&navigate=yes`
      : `https://waze.com/ul?q=${encodeURIComponent(motel.address + ", " + motel.city + " - " + motel.state)}&navigate=yes`;
  };

  const goToPreviousPhoto = () => {
    if (motel && motel.photos.length > 1) {
      setSelectedPhoto((prev) => (prev === 0 ? motel.photos.length - 1 : prev - 1));
    }
  };

  const goToNextPhoto = () => {
    if (motel && motel.photos.length > 1) {
      setSelectedPhoto((prev) => (prev === motel.photos.length - 1 ? 0 : prev + 1));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="aspect-video rounded-2xl" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!motel) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Photo Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden glass-card group">
                <img
                  src={motel.photos[selectedPhoto]?.url || "/placeholder.svg"}
                  alt={motel.name}
                  className="w-full h-full object-cover"
                />
                {motel.is_premium && (
                  <Badge className="absolute top-4 left-4 premium-badge font-orbitron text-sm px-4 py-2">
                    <Star className="w-4 h-4 mr-2 fill-current" />
                    PREMIUM
                  </Badge>
                )}
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/70 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Eye className="w-4 h-4 text-primary" />
                  <span className="text-sm">{motel.views_count.toLocaleString()} views</span>
                </div>
                
                {/* Navigation Arrows */}
                {motel.photos.length > 1 && (
                  <>
                    <button
                      onClick={goToPreviousPhoto}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100"
                      aria-label="Photo précédente"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={goToNextPhoto}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100"
                      aria-label="Photo suivante"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    {/* Photo Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/70 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
                      {selectedPhoto + 1} / {motel.photos.length}
                    </div>
                  </>
                )}
              </div>

              {motel.photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {motel.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPhoto(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedPhoto === index
                          ? "border-primary"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={`${motel.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h1 className="font-orbitron text-3xl md:text-4xl font-bold text-foreground mb-2 neon-text-subtle">
                  {motel.name}
                </h1>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  {motel.address}, {motel.city} - {motel.state}
                  {motel.zip_code && `, ${motel.zip_code}`}
                </p>
              </div>

              <p className="text-foreground/80 leading-relaxed">
                {motel.description}
              </p>

              {/* Social Links */}
              <SocialLinks
                instagram={motel.instagram || undefined}
                facebook={motel.facebook || undefined}
                twitter={motel.twitter || undefined}
                tiktok={motel.tiktok || undefined}
                youtube={motel.youtube || undefined}
                onlyfans={motel.onlyfans || undefined}
                privacyLink={motel.privacy_link || undefined}
              />

              {/* Operating Hours */}
              {motel.operating_hours && (
                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Horário de Funcionamento</span>
                  </div>
                  <p className="text-muted-foreground">{motel.operating_hours}</p>
                </div>
              )}

              {/* Suite Periods */}
              {motel.suite_periods && motel.suite_periods.length > 0 && (
                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Períodos de Suíte</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {motel.suite_periods.map((period, index) => (
                      <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                        {period}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {motel.services && motel.services.length > 0 && (
                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Serviços</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {motel.services.map((service, index) => (
                      <Badge key={index} variant="outline" className="border-primary/30">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Methods */}
              {motel.payment_methods && motel.payment_methods.length > 0 && (
                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Formas de Pagamento</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {motel.payment_methods.map((method, index) => (
                      <Badge key={index} variant="secondary">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Button
                  size="lg"
                  className="flex-1 neon-button text-white"
                  onClick={() => window.open(whatsappLink, "_blank")}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 border-primary/30 hover:border-primary hover:bg-primary/10"
                  onClick={() => window.open(`tel:${motel.phone}`, "_self")}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Ligar
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1 border-primary/30 hover:border-primary hover:bg-primary/10"
                    >
                      <Navigation className="w-5 h-5 mr-2" />
                      Ir
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-48">
                    <DropdownMenuItem onClick={() => window.open(getWazeLink(), "_blank")} className="cursor-pointer">
                      <img src="https://www.waze.com/favicon.ico" alt="Waze" className="w-4 h-4 mr-2" />
                      Waze
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.open(getGoogleMapsLink(), "_blank")} className="cursor-pointer">
                      <img src="https://www.google.com/images/branding/product/ico/maps15_bnuw3a_32dp.ico" alt="Google Maps" className="w-4 h-4 mr-2" />
                      Google Maps
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {motel.website && (
                  <Button
                    size="lg"
                    variant="ghost"
                    className="flex-1 hover:text-primary"
                    onClick={() => window.open(motel.website!, "_blank")}
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Site
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MotelDetail;
