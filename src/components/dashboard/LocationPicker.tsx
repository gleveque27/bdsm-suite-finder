import { useState } from "react";
import { MapPin, Loader2, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface LocationPickerProps {
  latitude: string;
  longitude: string;
  onLatitudeChange: (value: string) => void;
  onLongitudeChange: (value: string) => void;
}

export function LocationPicker({
  latitude,
  longitude,
  onLatitudeChange,
  onLongitudeChange,
}: LocationPickerProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Geolocalização não é suportada pelo seu navegador.",
      });
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLatitudeChange(position.coords.latitude.toFixed(6));
        onLongitudeChange(position.coords.longitude.toFixed(6));
        setLoading(false);
        toast({
          title: "Localização obtida!",
          description: "Coordenadas atualizadas com sucesso.",
        });
      },
      (error) => {
        setLoading(false);
        let message = "Não foi possível obter sua localização.";
        if (error.code === error.PERMISSION_DENIED) {
          message = "Permissão de localização negada.";
        }
        toast({
          variant: "destructive",
          title: "Erro",
          description: message,
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
          Localização GPS
        </h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentPosition}
          disabled={loading}
          className="border-border/50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Navigation className="w-4 h-4 mr-2" />
          )}
          Usar posição atual
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">
            <MapPin className="w-3 h-3 inline mr-1" />
            Latitude
          </Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => onLatitudeChange(e.target.value)}
            placeholder="-23.550520"
            className="bg-secondary/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">
            <MapPin className="w-3 h-3 inline mr-1" />
            Longitude
          </Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => onLongitudeChange(e.target.value)}
            placeholder="-46.633308"
            className="bg-secondary/50"
          />
        </div>
      </div>

      {latitude && longitude && (
        <p className="text-xs text-muted-foreground">
          <a
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Ver no Google Maps →
          </a>
        </p>
      )}
    </div>
  );
}
