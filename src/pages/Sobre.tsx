import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageCircle, 
  ExternalLink, 
  Store, 
  Crown, 
  Bot, 
  MessageSquare,
  MapPin,
  Mail,
  Building2,
  Heart
} from "lucide-react";

export default function Sobre() {
  const whatsappNumber = "5513955517904";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  const services = [
    {
      icon: Store,
      title: "Loja Online",
      description: "Boutique de produtos BDSM com entrega em todo Brasil",
      link: "https://bdsmbrazil.com.br/loja",
      linkText: "Visitar Loja"
    },
    {
      icon: Crown,
      title: "Portal das Dominatrix",
      description: "Encontre dominatrizes profissionais verificadas",
      link: "https://bdsmbrazil.com.br/dominas",
      linkText: "Ver Dominas"
    },
    {
      icon: Bot,
      title: "Chatbot IA",
      description: "Converse com uma dominatriz virtual sem censura, powered by IA",
      link: "https://bdsmbrazil.com.br",
      linkText: "Experimentar"
    },
    {
      icon: MessageSquare,
      title: "Anúncios Anônimos",
      description: "Serviço de classificados anônimos via aplicativo Session",
      link: "https://bdsmbrazil.com.br",
      linkText: "Saiba Mais"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-20 md:pt-24">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-orbitron text-3xl md:text-5xl font-black mb-6">
                <span className="text-primary neon-text-subtle">Sobre</span>{" "}
                <span className="text-foreground">Nós</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                O portal de motéis BDSM faz parte do grupo{" "}
                <a 
                  href="https://bdsmbrazil.com.br" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold"
                >
                  BDSMBRAZIL
                </a>
                , a maior plataforma de conteúdo e serviços BDSM do Brasil.
              </p>

              {/* WhatsApp CTA */}
              <Button
                asChild
                size="lg"
                className="neon-button text-white text-lg px-8 py-6"
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Fale Conosco no WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-center mb-12">
              <span className="text-foreground">Nossos</span>{" "}
              <span className="text-primary neon-text-subtle">Serviços</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {services.map((service, index) => (
                <Card 
                  key={index} 
                  className="glass-card glass-card-hover border-border/30 overflow-hidden group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                        <service.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-orbitron text-lg font-bold mb-2 text-foreground">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {service.description}
                        </p>
                        <a
                          href={service.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                        >
                          {service.linkText}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Company Info Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="glass-card border-border/30">
                <CardContent className="p-8">
                  <h2 className="font-orbitron text-xl font-bold mb-6 text-center text-foreground">
                    Informações da Empresa
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Building2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground/70">CNPJ</p>
                        <p className="text-foreground font-mono">64.465.357/0001-28</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-muted-foreground">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground/70">Localização</p>
                        <p className="text-foreground">Guarujá - SP, Brasil</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground/70">E-mail</p>
                        <a 
                          href="mailto:moteis@bdsmbrazil.com.br"
                          className="text-primary hover:underline"
                        >
                          moteis@bdsmbrazil.com.br
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-muted-foreground">
                      <MessageCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground/70">WhatsApp</p>
                        <a 
                          href={whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          (13) 95551-7904
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Visit Main Site */}
                  <div className="mt-8 pt-6 border-t border-border/30 text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Visite nosso portal principal
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      className="border-primary/30 hover:border-primary hover:bg-primary/10"
                    >
                      <a 
                        href="https://bdsmbrazil.com.br" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        bdsmbrazil.com.br
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Heart className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="font-orbitron text-2xl md:text-3xl font-bold mb-6">
                <span className="text-foreground">Nossa</span>{" "}
                <span className="text-primary neon-text-subtle">Missão</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Conectar pessoas a experiências únicas e seguras no universo BDSM, 
                oferecendo uma plataforma confiável para encontrar os melhores motéis 
                com suítes temáticas do Brasil. Prezamos pela discrição, segurança 
                e qualidade em todos os nossos serviços.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
