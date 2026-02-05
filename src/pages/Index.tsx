import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Star, TrendingUp, MapPin, Loader2, Map, LayoutGrid } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { MotelCard } from "@/components/MotelCard";
import { MotelMap } from "@/components/MotelMap";
import { useGeolocation } from "@/hooks/useGeolocation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Motel {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  whatsapp: string;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  twitter: string | null;
  tiktok: string | null;
  youtube: string | null;
  distance?: number | null;
  onlyfans: string | null;
  privacy_link: string | null;
  latitude: number | null;
  longitude: number | null;
  is_premium: boolean;
  views_count: number;
  photos: { url: string; display_order: number }[];
}

const Index = () => {
  const [motels, setMotels] = useState<Motel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const { getCurrentPosition, calculateDistance, hasLocation, latitude, longitude, loading: locationLoading, error: locationError } = useGeolocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchMotels();
  }, []);

  useEffect(() => {
    if (locationError) {
      toast({
        variant: "destructive",
        title: "Erro de localização",
        description: locationError,
      });
    }
  }, [locationError, toast]);

  const fetchMotels = async () => {
    try {
      const { data, error } = await supabase
        .from("motels")
        .select(`
          id,
          name,
          description,
          address,
          city,
          state,
          phone,
          whatsapp,
          website,
          instagram,
          facebook,
          twitter,
          tiktok,
          youtube,
          onlyfans,
          privacy_link,
          latitude,
          longitude,
          is_premium,
          views_count,
          motel_photos (url, display_order)
        `)
        .eq("is_active", true)
        .order("is_premium", { ascending: false })
        .order("views_count", { ascending: false });

      if (error) throw error;

      const formattedMotels = (data || []).map((motel) => ({
        ...motel,
        photos: motel.motel_photos || [],
      }));

      setMotels(formattedMotels);
    } catch (error) {
      console.error("Error fetching motels:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os motéis.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMotels = useMemo(() => {
    let filtered = [...motels];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (motel) =>
          motel.name.toLowerCase().includes(query) ||
          motel.city.toLowerCase().includes(query)
      );
    }

    // Filter by state
    if (selectedState && selectedState !== "all") {
      filtered = filtered.filter((motel) => motel.state === selectedState);
    }

    // Add distance if location is available
    if (hasLocation) {
      filtered = filtered.map((motel) => ({
        ...motel,
        distance:
          motel.latitude && motel.longitude
            ? calculateDistance(motel.latitude, motel.longitude)
            : null,
      }));

      // Sort by distance if location is available
      filtered.sort((a, b) => {
        // Premium first
        if (a.is_premium !== b.is_premium) {
          return a.is_premium ? -1 : 1;
        }
        // Then by distance
        if (a.distance != null && b.distance != null) {
          return a.distance - b.distance;
        }
        return 0;
      });
    }

    return filtered;
  }, [motels, searchQuery, selectedState, hasLocation, calculateDistance]);

  const premiumMotels = filteredMotels.filter((m) => m.is_premium);
  const regularMotels = filteredMotels.filter((m) => !m.is_premium);

  const handleSearch = () => {
    // Search is already reactive through filteredMotels
  };

  const handleUseLocation = () => {
    getCurrentPosition();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <HeroSection
          searchQuery={searchQuery}
          selectedState={selectedState}
          onSearchChange={setSearchQuery}
          onStateChange={setSelectedState}
          onSearch={handleSearch}
          onUseLocation={handleUseLocation}
          isLoadingLocation={locationLoading}
        />

        {/* Premium Motels Section */}
        {premiumMotels.length > 0 && (
          <section className="py-16 border-t border-border/30">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-premium/10 animate-glow-border">
                  <Star className="w-5 h-5 text-premium fill-premium" />
                </div>
                <h2 className="font-orbitron text-2xl md:text-3xl font-bold">
                  <span className="text-premium">Premium</span>
                  <span className="text-foreground ml-2">em Destaque</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {premiumMotels.map((motel, index) => (
                  <div
                    key={motel.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <MotelCard
                      id={motel.id}
                      name={motel.name}
                      description={motel.description}
                      city={motel.city}
                      state={motel.state}
                      address={motel.address}
                      phone={motel.phone}
                      whatsapp={motel.whatsapp}
                      website={motel.website || undefined}
                      imageUrl={motel.photos[0]?.url}
                      isPremium={motel.is_premium}
                      viewsCount={motel.views_count}
                      distance={(motel as any).distance}
                      instagram={motel.instagram || undefined}
                      facebook={motel.facebook || undefined}
                      twitter={motel.twitter || undefined}
                      tiktok={motel.tiktok || undefined}
                      youtube={motel.youtube || undefined}
                      onlyfans={motel.onlyfans || undefined}
                      privacyLink={motel.privacy_link || undefined}
                      latitude={motel.latitude || undefined}
                      longitude={motel.longitude || undefined}
                      onClick={() => navigate(`/motel/${motel.id}`)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Motels Section */}
        <section className="py-16 border-t border-border/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-foreground">
                  {hasLocation ? "Perto de Você" : "Todos os Motéis"}
                </h2>
              </div>
              
              <div className="flex items-center gap-2 sm:ml-auto">
                {hasLocation && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    Ordenado por distância
                  </span>
                )}
                
                {/* View Toggle */}
                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg ml-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 px-3"
                  >
                    <LayoutGrid className="w-4 h-4 mr-1" />
                    Lista
                  </Button>
                  <Button
                    variant={viewMode === "map" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("map")}
                    className="h-8 px-3"
                  >
                    <Map className="w-4 h-4 mr-1" />
                    Mapa
                  </Button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : viewMode === "map" ? (
              <MotelMap
                motels={filteredMotels.map((m) => ({
                  id: m.id,
                  name: m.name,
                  city: m.city,
                  state: m.state,
                  phone: m.phone,
                  whatsapp: m.whatsapp,
                  latitude: m.latitude,
                  longitude: m.longitude,
                  is_premium: m.is_premium,
                  distance: m.distance ?? undefined,
                  imageUrl: m.photos[0]?.url,
                }))}
                userLocation={hasLocation ? { lat: latitude!, lng: longitude! } : null}
                onMotelClick={(id) => navigate(`/motel/${id}`)}
                className="h-[600px]"
              />
            ) : regularMotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularMotels.map((motel, index) => (
                  <div
                    key={motel.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <MotelCard
                      id={motel.id}
                      name={motel.name}
                      description={motel.description}
                      city={motel.city}
                      state={motel.state}
                      address={motel.address}
                      phone={motel.phone}
                      whatsapp={motel.whatsapp}
                      website={motel.website || undefined}
                      imageUrl={motel.photos[0]?.url}
                      isPremium={motel.is_premium}
                      viewsCount={motel.views_count}
                      distance={(motel as any).distance}
                      instagram={motel.instagram || undefined}
                      facebook={motel.facebook || undefined}
                      twitter={motel.twitter || undefined}
                      tiktok={motel.tiktok || undefined}
                      youtube={motel.youtube || undefined}
                      onlyfans={motel.onlyfans || undefined}
                      privacyLink={motel.privacy_link || undefined}
                      latitude={motel.latitude || undefined}
                      longitude={motel.longitude || undefined}
                      onClick={() => navigate(`/motel/${motel.id}`)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="glass-card inline-block p-8 rounded-2xl">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-orbitron text-xl font-bold mb-2">
                    Nenhum motel encontrado
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery || selectedState !== "all"
                      ? "Tente ajustar os filtros de busca"
                      : "Seja o primeiro a cadastrar seu motel!"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 border-t border-border/30">
          <div className="container mx-auto px-4">
            <div className="glass-card rounded-3xl p-8 md:p-12 text-center neon-border-subtle relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-primary/20 blur-[100px]" />
              
              <div className="relative z-10">
                <h2 className="font-orbitron text-2xl md:text-4xl font-bold mb-4">
                  <span className="text-foreground">Tem um motel?</span>
                  <span className="text-primary ml-2 neon-text-subtle">Cadastre-se!</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                  Aumente sua visibilidade e atraia mais clientes. 
                  Cadastre seu motel gratuitamente ou escolha o plano Premium para ficar em destaque.
                </p>
                <button
                  onClick={() => navigate("/auth?mode=signup")}
                  className="neon-button px-8 py-4 rounded-xl font-orbitron font-bold text-white"
                >
                  Cadastrar Agora
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
