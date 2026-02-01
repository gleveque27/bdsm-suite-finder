import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialLinksProps {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
  onlyfans?: string;
  privacyLink?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Custom TikTok icon
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
    </svg>
  );
}

// OnlyFans icon
function OnlyFansIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm0-14a6 6 0 100 12 6 6 0 000-12zm0 10a4 4 0 110-8 4 4 0 010 8z"/>
    </svg>
  );
}

// Privacy icon
function PrivacyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
    </svg>
  );
}

export function SocialLinks({
  instagram,
  facebook,
  twitter,
  tiktok,
  youtube,
  onlyfans,
  privacyLink,
  className,
  size = "sm",
}: SocialLinksProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const links = [
    { url: instagram, icon: Instagram, label: "Instagram" },
    { url: facebook, icon: Facebook, label: "Facebook" },
    { url: twitter, icon: Twitter, label: "Twitter/X" },
    { url: tiktok, icon: TikTokIcon, label: "TikTok" },
    { url: youtube, icon: Youtube, label: "YouTube" },
    { url: onlyfans, icon: OnlyFansIcon, label: "OnlyFans" },
    { url: privacyLink, icon: PrivacyIcon, label: "Privacy" },
  ].filter((link) => link.url);

  if (links.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {links.map(({ url, icon: Icon, label }) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          title={label}
          onClick={(e) => e.stopPropagation()}
        >
          <Icon className={sizeClasses[size]} />
        </a>
      ))}
    </div>
  );
}
