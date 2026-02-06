import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Star, MapPin, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons
const createIcon = (isPremium: boolean) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="relative flex items-center justify-center">
        <div class="${isPremium ? "bg-gradient-to-r from-yellow-400 to-orange-500" : "bg-primary"} 
          w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3" fill="${isPremium ? "#1a1a1a" : "#fff"}"></circle>
          </svg>
        </div>
        ${isPremium ? '<div class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="#1a1a1a"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></div>' : ""}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const userIcon = L.divIcon({
  className: "user-marker",
  html: `
    <div class="relative">
      <div class="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
      <div class="absolute inset-0 w-6 h-6 bg-blue-500 rounded-full animate-ping opacity-75"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface Motel {
  id: string;
  name: string;
  city: string;
  state: string;
  phone: string;
  whatsapp: string;
  latitude: number | null;
  longitude: number | null;
  is_premium: boolean;
  distance?: number;
  imageUrl?: string;
}

interface MotelMapProps {
  motels: Motel[];
  userLocation: { lat: number; lng: number } | null;
  onMotelClick: (id: string) => void;
  className?: string;
}

function MapController({ userLocation }: { userLocation: { lat: number; lng: number } | null }) {
  const map = useMap();
  const hasSetView = useRef(false);

  useEffect(() => {
    if (userLocation && !hasSetView.current) {
      map.setView([userLocation.lat, userLocation.lng], 13);
      hasSetView.current = true;
    }
  }, [map, userLocation]);

  return null;
}

export function MotelMap({ motels, userLocation, onMotelClick, className = "" }: MotelMapProps) {
  const defaultCenter: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [-23.5505, -46.6333]; // São Paulo default

  const motelsWithCoords = motels.filter((m) => m.latitude && m.longitude);

  const renderMapContent = () => (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <MapController userLocation={userLocation} />
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup className="custom-popup">
            <div className="text-center p-2">
              <p className="font-semibold text-foreground">Você está aqui</p>
            </div>
          </Popup>
        </Marker>
      )}
      {motelsWithCoords.map((motel) => (
        <Marker
          key={motel.id}
          position={[motel.latitude!, motel.longitude!]}
          icon={createIcon(motel.is_premium)}
        >
          <Popup className="custom-popup">
            <div className="p-2 min-w-[200px]">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-orbitron font-bold text-foreground text-sm">
                  {motel.name}
                </h3>
                {motel.is_premium && (
                  <Badge className="premium-badge text-xs px-2 py-0.5 shrink-0">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    PREMIUM
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {motel.city}, {motel.state}
              </p>
              {motel.distance !== undefined && (
                <p className="text-xs text-primary mb-3">
                  📍 {motel.distance < 1 ? `${(motel.distance * 1000).toFixed(0)}m` : `${motel.distance.toFixed(1)}km`} de distância
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 neon-button text-white text-xs h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://wa.me/55${motel.whatsapp.replace(/\D/g, "")}`, "_blank");
                  }}
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  WhatsApp
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs h-8 border-primary/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMotelClick(motel.id);
                  }}
                >
                  Ver Detalhes
                </Button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );

  return (
    <div className={`rounded-2xl overflow-hidden glass-card ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={12}
        className="h-full w-full min-h-[400px]"
        style={{ background: "#1a1a2e" }}
      >
        {renderMapContent()}
      </MapContainer>
    </div>
  );
}
