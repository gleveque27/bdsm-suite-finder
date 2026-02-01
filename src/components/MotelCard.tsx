import { MapPin, Phone, MessageCircle, ExternalLink, Star, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SocialLinks } from "./SocialLinks";

interface MotelCardProps {
  id: string;
  name: string;
  description: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  whatsapp: string;
  website?: string;
  imageUrl?: string;
  isPremium?: boolean;
  viewsCount?: number;
  distance?: number;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
  onlyfans?: string;
  privacyLink?: string;
  latitude?: number;
  longitude?: number;
  onClick?: () => void;
}

export function MotelCard({
  name,
  description,
  city,
  state,
  address,
  phone,
  whatsapp,
  website,
  imageUrl,
  isPremium = false,
  viewsCount = 0,
  distance,
  instagram,
  facebook,
  twitter,
  tiktok,
  youtube,
  onlyfans,
  privacyLink,
  latitude,
  longitude,
  onClick,
}: MotelCardProps) {
  const whatsappLink = `https://wa.me/55${whatsapp.replace(/\D/g, "")}`;
  const mapsLink = latitude && longitude 
    ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + ", " + city + " - " + state)}`;

  return (
    <div 
      className="glass-card glass-card-hover rounded-xl overflow-hidden transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        
        {/* Premium Badge */}
        {isPremium && (
          <Badge className="absolute top-3 left-3 premium-badge font-orbitron text-xs px-3 py-1">
            <Star className="w-3 h-3 mr-1 fill-current" />
            PREMIUM
          </Badge>
        )}
        
        {/* Views */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-background/70 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs">
          <Eye className="w-3.5 h-3.5 text-primary" />
          <span>{viewsCount.toLocaleString()}</span>
        </div>
        
        {/* Distance */}
        {distance !== undefined && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-background/70 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>{distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`}</span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-orbitron text-lg font-bold text-foreground mb-1 neon-text-subtle group-hover:neon-text transition-all duration-300">
          {name}
        </h3>
        
        {/* Location */}
        <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          {city}, {state}
        </p>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {description}
        </p>
        
        {/* Social Links */}
        <SocialLinks
          instagram={instagram}
          facebook={facebook}
          twitter={twitter}
          tiktok={tiktok}
          youtube={youtube}
          onlyfans={onlyfans}
          privacyLink={privacyLink}
          className="mb-4"
        />
        
        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 min-w-[100px] border-primary/30 hover:border-primary hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`tel:${phone}`, "_self");
            }}
          >
            <Phone className="w-4 h-4 mr-1.5" />
            Ligar
          </Button>
          
          <Button
            size="sm"
            className="flex-1 min-w-[100px] neon-button text-white"
            onClick={(e) => {
              e.stopPropagation();
              window.open(whatsappLink, "_blank");
            }}
          >
            <MessageCircle className="w-4 h-4 mr-1.5" />
            WhatsApp
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex-1 min-w-[100px] border-primary/30 hover:border-primary hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation();
              window.open(mapsLink, "_blank");
            }}
          >
            <MapPin className="w-4 h-4 mr-1.5" />
            Rota
          </Button>
          
          {website && (
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 min-w-[100px] hover:text-primary"
              onClick={(e) => {
                e.stopPropagation();
                window.open(website, "_blank");
              }}
            >
              <ExternalLink className="w-4 h-4 mr-1.5" />
              Site
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
