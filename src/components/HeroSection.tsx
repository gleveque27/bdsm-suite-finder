import { Search, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import heroBg from "@/assets/hero-bg.jpg";

const BRAZILIAN_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

interface HeroSectionProps {
  searchQuery: string;
  selectedState: string;
  onSearchChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onSearch: () => void;
  onUseLocation: () => void;
  isLoadingLocation?: boolean;
}

export function HeroSection({
  searchQuery,
  selectedState,
  onSearchChange,
  onStateChange,
  onSearch,
  onUseLocation,
  isLoadingLocation = false,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      {/* Animated glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: "1s" }} />
      
      <div className="container relative z-10 px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-8 animate-glow-border">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Experiências Exclusivas</span>
          </div>
          
          {/* Main title */}
          <h1 className="font-orbitron text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
            <span className="text-foreground">Descubra o </span>
            <span className="text-primary neon-text-subtle">Prazer</span>
            <br />
            <span className="text-foreground">Mais Próximo</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            O maior portal de motéis com suítes temáticas BDSM do Brasil.
            Encontre experiências únicas perto de você.
          </p>
          
          {/* Search box */}
          <div className="glass-card rounded-2xl p-6 max-w-3xl mx-auto neon-border-subtle">
            <div className="flex flex-col md:flex-row gap-4">
              {/* City search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por cidade..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border/50 focus:border-primary h-12"
                  onKeyDown={(e) => e.key === "Enter" && onSearch()}
                />
              </div>
              
              {/* State select */}
              <Select value={selectedState} onValueChange={onStateChange}>
                <SelectTrigger className="w-full md:w-40 bg-secondary/50 border-border/50 focus:border-primary h-12">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {BRAZILIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Search button */}
              <Button
                onClick={onSearch}
                className="neon-button h-12 px-8 font-semibold text-white"
              >
                <Search className="w-5 h-5 mr-2" />
                Buscar
              </Button>
            </div>
            
            {/* Use my location button */}
            <div className="mt-4 flex justify-center">
              <Button
                variant="ghost"
                onClick={onUseLocation}
                disabled={isLoadingLocation}
                className="text-primary hover:text-primary hover:bg-primary/10"
              >
                <MapPin className="w-4 h-4 mr-2" />
                {isLoadingLocation ? "Localizando..." : "Usar minha localização"}
              </Button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12">
            <div className="text-center">
              <div className="font-orbitron text-3xl md:text-4xl font-bold text-primary neon-text-subtle">50+</div>
              <div className="text-sm text-muted-foreground mt-1">Motéis Cadastrados</div>
            </div>
            <div className="text-center">
              <div className="font-orbitron text-3xl md:text-4xl font-bold text-primary neon-text-subtle">27</div>
              <div className="text-sm text-muted-foreground mt-1">Estados</div>
            </div>
            <div className="text-center">
              <div className="font-orbitron text-3xl md:text-4xl font-bold text-primary neon-text-subtle">10k+</div>
              <div className="text-sm text-muted-foreground mt-1">Visitantes/mês</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
