import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CartModal from "@/components/store/cart-modal";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Shirt,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import treeLogo from "@assets/TREE LOGO_1753399074765.png";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/useAuth";

interface StoreLayoutProps {
  children: React.ReactNode;
}

export default function StoreLayout({ children }: StoreLayoutProps) {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { itemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      // Clear all auth-related cache
      queryClient.invalidateQueries({ queryKey: ["/api/auth/current"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });
      
      // Redirect to store page
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al cerrar sesión",
        variant: "destructive",
      });
    },
  });

  const navigation = [
    { name: "Inicio", href: "/store" },
    { name: "Catálogo", href: "/store/catalog" },
    { name: "Corporativo", href: "/store/corporate" },
    { name: "Contacto", href: "/store/contact" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/store" className="flex items-center space-x-3">
              <img 
                src={treeLogo} 
                alt="TREE Uniformes & Kodiak Industrial"
                className="h-10 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-uniform-neutral-900">TREE Uniformes</h1>
                <p className="text-sm text-gray-600">& Kodiak Industrial</p>
              </div>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`transition-colors ${
                    location === item.href
                      ? 'text-uniform-primary font-medium'
                      : 'text-uniform-neutral-900 hover:text-uniform-primary'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hidden md:flex"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* User Account */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  if (isAuthenticated) {
                    setLocation('/customer/dashboard');
                  } else {
                    setLocation('/login');
                  }
                }}
                data-testid="button-user-account"
              >
                <User className="h-5 w-5" />
              </Button>

              {/* Cart */}
              <Button 
                variant="ghost" 
                size="sm"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-uniform-primary"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>

              {/* Mobile Menu Toggle */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-10 h-10 bg-uniform-primary rounded-lg flex items-center justify-center">
                      <Shirt className="text-white h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-bold">Uniformes Laguna</h2>
                  </div>
                  
                  <nav className="space-y-4">
                    {navigation.map((item) => (
                      <Link 
                        key={item.name} 
                        href={item.href}
                        className="block py-2 text-lg text-uniform-neutral-900 hover:text-uniform-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-8 pt-8 border-t">
                    {isAuthenticated ? (
                      <div className="space-y-4">
                        <p className="font-medium">Hola, {(user as any)?.firstName || 'Usuario'}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setLocation('/customer/dashboard');
                          }}
                          data-testid="button-my-account"
                        >
                          Mi Cuenta
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => logoutMutation.mutate()}
                          disabled={logoutMutation.isPending}
                        >
                          {logoutMutation.isPending ? "Cerrando..." : "Cerrar Sesión"}
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        className="w-full bg-uniform-primary hover:bg-blue-700"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setLocation('/login');
                        }}
                      >
                        Iniciar Sesión
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Search Bar - Mobile/Expanded */}
          {isSearchOpen && (
            <div className="py-4 border-t">
              <div className="flex items-center space-x-2">
                <Input 
                  placeholder="Buscar productos..."
                  className="flex-1"
                />
                <Button size="sm" className="bg-uniform-primary hover:bg-blue-700">
                  Buscar
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-uniform-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={treeLogo} 
                  alt="TREE Uniformes & Kodiak Industrial"
                  className="h-10 w-auto filter brightness-0 invert"
                />
                <div>
                  <h3 className="text-xl font-bold">TREE Uniformes</h3>
                  <p className="text-sm text-gray-400">& Kodiak Industrial</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                Equipamos a tu empresa con uniformes industriales y corporativos que reflejan profesionalismo y calidad. 
                Más de 10 años de experiencia en el sector.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  📘 Facebook
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  📷 Instagram
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  💼 LinkedIn
                </a>
              </div>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Productos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Uniformes Corporativos</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Uniformes Médicos</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Uniformes de Servicios</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Accesorios</a></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Atención al Cliente</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Guía de Tallas</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Envíos y Devoluciones</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Preguntas Frecuentes</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-uniform-primary flex-shrink-0" />
                  <span className="text-gray-300">Laguna, Coahuila, México</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-uniform-primary flex-shrink-0" />
                  <span className="text-gray-300">+52 1 871 104 7637</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-uniform-primary flex-shrink-0" />
                  <span className="text-gray-300">info@treeuniformes.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">© 2024 TREE Uniformes & Kodiak Industrial. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
