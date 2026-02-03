import { Check, X, Star, Zap, MapPin, TrendingUp, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "/sempre",
    description: "Comece a divulgar seu motel sem custos",
    features: [
      { text: "Cadastro completo do motel", included: true },
      { text: "Descrição e fotos", included: true },
      { text: "Links para redes sociais", included: true },
      { text: "WhatsApp e telefone clicáveis", included: true },
      { text: "Integração Google Maps", included: true },
      { text: "Posição por distância", included: true },
      { text: "Boost de prioridade 20km", included: false },
      { text: "Badge Premium destaque", included: false },
      { text: "Seção Premium exclusiva", included: false },
      { text: "Estatísticas avançadas", included: false },
    ],
    cta: "Começar Grátis",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "R$ 200",
    period: "/mês",
    description: "Máxima visibilidade para seu motel",
    features: [
      { text: "Cadastro completo do motel", included: true },
      { text: "Descrição e fotos", included: true },
      { text: "Links para redes sociais", included: true },
      { text: "WhatsApp e telefone clicáveis", included: true },
      { text: "Integração Google Maps", included: true },
      { text: "Posição por distância", included: true },
      { text: "Boost de prioridade 20km", included: true },
      { text: "Badge Premium destaque", included: true },
      { text: "Seção Premium exclusiva", included: true },
      { text: "Estatísticas avançadas", included: true },
    ],
    cta: "Assinar Premium",
    highlighted: true,
  },
];

const benefits = [
  {
    icon: MapPin,
    title: "Boost de 20km",
    description: "Seu motel aparece primeiro para clientes em um raio de 20km, mesmo que haja opções mais próximas.",
  },
  {
    icon: Star,
    title: "Badge Premium",
    description: "Selo dourado exclusivo que destaca seu motel e transmite confiança aos visitantes.",
  },
  {
    icon: TrendingUp,
    title: "Seção Destaque",
    description: "Aparição exclusiva na seção 'Premium em Destaque' no topo da página principal.",
  },
  {
    icon: Zap,
    title: "Mais Visibilidade",
    description: "Em média, motéis Premium recebem 5x mais visualizações e contatos.",
  },
];

export default function Premium() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePlanClick = (isPremium: boolean) => {
    if (!user) {
      navigate("/auth?mode=signup");
    } else if (isPremium) {
      navigate("/dashboard?upgrade=true");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-premium/10 border border-premium/30 rounded-full px-4 py-2 mb-6">
            <Crown className="w-4 h-4 text-premium" />
            <span className="text-sm font-medium text-premium">Planos e Preços</span>
          </div>
          
          <h1 className="font-orbitron text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            <span className="text-foreground">Escolha seu </span>
            <span className="text-premium">Plano</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Aumente a visibilidade do seu motel e atraia mais clientes. 
            Comece grátis ou escolha o Premium para máximo destaque.
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="container mx-auto px-4 mb-20">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? "glass-card neon-border scale-105 md:scale-110"
                    : "glass-card border border-border/30 hover:border-border/50"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="premium-badge px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Mais Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="font-orbitron text-2xl font-bold mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className={`font-orbitron text-4xl font-black ${plan.highlighted ? "text-premium" : "text-foreground"}`}>
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className={`p-1 rounded-full ${plan.highlighted ? "bg-premium/20" : "bg-primary/20"}`}>
                          <Check className={`w-4 h-4 ${plan.highlighted ? "text-premium" : "text-primary"}`} />
                        </div>
                      ) : (
                        <div className="p-1 rounded-full bg-muted/20">
                          <X className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      <span className={feature.included ? "text-foreground" : "text-muted-foreground"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePlanClick(plan.highlighted)}
                  className={`w-full h-12 font-semibold ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-premium to-yellow-500 text-premium-foreground hover:opacity-90"
                      : "neon-button text-white"
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center mb-12">
            <h2 className="font-orbitron text-3xl font-bold mb-4">
              <span className="text-foreground">Por que escolher o </span>
              <span className="text-premium">Premium</span>
              <span className="text-foreground">?</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Entenda como o plano Premium pode transformar a visibilidade do seu motel
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="glass-card rounded-xl p-6 text-center hover:neon-border-subtle transition-all duration-300"
              >
                <div className="inline-flex p-3 rounded-xl bg-premium/10 mb-4">
                  <benefit.icon className="w-6 h-6 text-premium" />
                </div>
                <h3 className="font-orbitron font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How Premium Boost Works */}
        <section className="container mx-auto px-4 mb-20">
          <div className="glass-card rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
            <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-center mb-8">
              <span className="text-foreground">Como funciona o </span>
              <span className="text-premium">Boost de 20km</span>
              <span className="text-foreground">?</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="font-orbitron font-bold text-primary">1</span>
                </div>
                <h4 className="font-semibold mb-2">Cliente acessa o site</h4>
                <p className="text-sm text-muted-foreground">
                  O visitante permite a geolocalização no navegador
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="font-orbitron font-bold text-primary">2</span>
                </div>
                <h4 className="font-semibold mb-2">Sistema calcula distância</h4>
                <p className="text-sm text-muted-foreground">
                  Motéis Premium em até 20km são identificados
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-premium/20 flex items-center justify-center mx-auto mb-4">
                  <span className="font-orbitron font-bold text-premium">3</span>
                </div>
                <h4 className="font-semibold mb-2">Boost aplicado</h4>
                <p className="text-sm text-muted-foreground">
                  Seu motel aparece primeiro, mesmo se houver opções mais próximas
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-premium/5 border border-premium/20 text-center">
              <p className="text-sm text-muted-foreground">
                <strong className="text-premium">Exemplo:</strong> Um cliente está a 15km do Motel A (gratuito) e a 18km do Motel B (Premium). 
                O Motel B aparecerá primeiro na lista porque está dentro do raio de 20km com boost ativo.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4">
          <div className="glass-card rounded-3xl p-8 md:p-12 text-center neon-border-subtle relative overflow-hidden max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-premium/5 via-premium/10 to-premium/5" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-premium/20 blur-[100px]" />
            
            <div className="relative z-10">
              <Crown className="w-12 h-12 text-premium mx-auto mb-4" />
              <h2 className="font-orbitron text-2xl md:text-3xl font-bold mb-4">
                Pronto para aumentar sua visibilidade?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Comece grátis e faça upgrade quando quiser. Sem compromisso, cancele a qualquer momento.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => handlePlanClick(false)}
                  variant="outline"
                  className="h-12 px-8 border-border/50"
                >
                  Começar Grátis
                </Button>
                <Button
                  onClick={() => handlePlanClick(true)}
                  className="h-12 px-8 bg-gradient-to-r from-premium to-yellow-500 text-premium-foreground hover:opacity-90 font-semibold"
                >
                  <Star className="w-4 h-4 mr-2 fill-current" />
                  Assinar Premium
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
