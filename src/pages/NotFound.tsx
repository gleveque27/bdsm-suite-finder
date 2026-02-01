import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
      
      <div className="relative z-10 text-center px-4">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-8">
          <AlertCircle className="w-12 h-12 text-primary" />
        </div>
        
        <h1 className="font-orbitron text-7xl md:text-9xl font-black text-primary neon-text mb-4">
          404
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
          Ops! Esta página não foi encontrada
        </p>
        
        <Button asChild className="neon-button text-white">
          <Link to="/">
            <Home className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
