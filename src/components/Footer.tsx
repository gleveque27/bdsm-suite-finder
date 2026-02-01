import { Link } from "react-router-dom";
import { Heart, Mail, Shield } from "lucide-react";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="border-t border-border/30 bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="font-orbitron text-2xl font-black">
                <span className="text-primary neon-text-subtle">RED</span>
                <span className="text-foreground">ROOM</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4 max-w-md">
              O maior portal de motéis com suítes temáticas BDSM do Brasil. 
              Encontre experiências únicas e exclusivas perto de você.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>Conteúdo para maiores de 18 anos</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-orbitron text-sm font-bold mb-4 text-foreground">
              Navegação
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  to="/moteis"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Motéis
                </Link>
              </li>
              <li>
                <Link
                  to="/auth"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Cadastrar Motel
                </Link>
              </li>
              <li>
                <Link
                  to="/sobre"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Sobre
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-orbitron text-sm font-bold mb-4 text-foreground">
              Contato
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:contato@redroom.com.br"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  contato@redroom.com.br
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-xs text-muted-foreground mb-3">Siga-nos</p>
              <SocialLinks
                instagram="https://instagram.com"
                twitter="https://twitter.com"
                size="md"
              />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} RedRoom. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Feito com</span>
            <Heart className="w-3 h-3 text-primary fill-primary" />
            <span>no Brasil</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
