import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/hooks/useCart";
// import treeLogo from "@assets/TREE LOGO_1753399074765.png";
const treeLogo = "/tree-logo.png";
import { 
  ShoppingCart, 
  User, 
  Menu, 
  Home, 
  Package, 
  Tag,
  Heart, 
  FileText, 
  LogOut,
  Building,
  Phone,
  Mail
} from "lucide-react";

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth() as { user: any; isAuthenticated: boolean };
  const { items } = useCart();
  const [location] = useLocation();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const navigation = [
    { name: "Inicio", href: "/store", icon: Home },
    { name: "Catálogo", href: "/store/catalog", icon: Package },
    { name: "Marcas", href: "/store/brands", icon: Tag },
    { name: "Presupuesto", href: "/store/quote-request", icon: FileText },
    { name: "Mi Cuenta", href: "/customer/dashboard", icon: User },
    { name: "Favoritos", href: "/customer/favorites", icon: Heart },
    { name: "Cotizaciones", href: "/customer/quotes", icon: FileText },
  ];

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white border-b-2 border-uniform-gold shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/store" className="flex items-center">
                <img 
                  src={treeLogo} 
                  alt="TREE Uniformes & Kodiak Industrial"
                  className="h-12 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-poppins font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-uniform-blue text-white shadow-md"
                        : "text-uniform-dark hover:text-uniform-blue hover:bg-uniform-gold/10 hover:shadow-sm"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link href="/store/cart" className="relative">
                <Button variant="ghost" size="sm" className="relative hover:bg-uniform-gold/10 text-uniform-blue">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-uniform-gold text-uniform-blue text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full font-bold">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Menu */}
              {isAuthenticated && user ? (
                <div className="hidden lg:flex items-center space-x-3">
                  <div className="text-sm">
                    <p className="font-poppins font-medium text-uniform-blue">
                      {user.firstName || "Cliente"}
                    </p>
                    <p className="text-xs text-uniform-dark font-roboto">
                      {user.email}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-2">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Cliente</p>
                    <p className="text-xs text-gray-500">No autenticado</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
              )}

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden text-uniform-blue hover:bg-uniform-gold/10">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-white border-l-4 border-uniform-gold">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="border-b-2 border-uniform-gold pb-4 mb-6">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={treeLogo} 
                          alt="TREE Uniformes & Kodiak Industrial"
                          className="h-12 w-auto"
                        />
                        <div>
                          <h1 className="text-lg font-poppins font-bold text-uniform-blue">
                            TREE UNIFORMES
                          </h1>
                          <p className="text-sm text-uniform-gold font-poppins font-semibold">& KODIAK INDUSTRIAL</p>
                        </div>
                      </div>
                    </div>

                    {/* User Info */}
                    {isAuthenticated && user && (
                      <div className="bg-uniform-gold/10 border border-uniform-gold/20 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="bg-uniform-blue text-white rounded-full p-2">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-poppins font-medium text-uniform-blue">
                              {user.firstName || "Cliente"}
                            </p>
                            <p className="text-sm text-uniform-dark font-roboto">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation */}
                    <nav className="flex-1 space-y-3">
                      {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = location === item.href;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-poppins font-medium transition-all duration-200 ${
                              isActive
                                ? "bg-uniform-blue text-white shadow-md"
                                : "text-uniform-dark hover:text-uniform-blue hover:bg-uniform-gold/10"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </nav>

                    {/* Footer Actions */}
                    <div className="border-t-2 border-uniform-gold/20 pt-4 space-y-3">
                      {isAuthenticated ? (
                        <Button
                          variant="ghost"
                          onClick={handleLogout}
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 font-poppins"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Cerrar Sesión
                        </Button>
                      ) : (
                        <Link href="/login">
                          <Button className="w-full bg-uniform-blue hover:bg-uniform-blue-light text-white font-poppins">
                            Iniciar Sesión
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with proper spacing to avoid header overlap */}
      <main className="flex-1 pt-20" style={{ marginTop: '80px' }}>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-uniform-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={treeLogo} 
                  alt="TREE Uniformes & Kodiak Industrial"
                  className="h-12 w-auto"
                />
                <div>
                  <h3 className="text-xl font-poppins font-bold text-white">TREE UNIFORMES</h3>
                  <p className="text-sm text-uniform-gold font-poppins font-semibold">& KODIAK INDUSTRIAL</p>
                </div>
              </div>
              <p className="text-blue-100 mb-4 font-roboto">
                Especialistas en uniformes industriales y corporativos de la más alta calidad. 
                Ofrecemos soluciones integrales para todas las industrias con más de 10 años de experiencia.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-uniform-gold" />
                  <span className="text-sm text-blue-100 font-roboto">+52 55 1234 5678</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-uniform-gold" />
                  <span className="text-sm text-blue-100 font-roboto">admin@uniformeslaguna.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-poppins font-semibold mb-4 text-uniform-gold">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/store" className="text-blue-100 hover:text-uniform-gold transition-colors font-roboto">Inicio</Link></li>
                <li><Link href="/store/catalog" className="text-blue-100 hover:text-uniform-gold transition-colors font-roboto">Catálogo</Link></li>
                <li><Link href="/customer/quotes" className="text-blue-100 hover:text-uniform-gold transition-colors font-roboto">Cotizaciones</Link></li>
                <li><Link href="/about" className="text-blue-100 hover:text-uniform-gold transition-colors font-roboto">Nosotros</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-poppins font-semibold mb-4 text-uniform-gold">Atención al Cliente</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/customer/support" className="text-blue-100 hover:text-uniform-gold transition-colors font-roboto">Soporte</Link></li>
                <li><Link href="/shipping" className="text-blue-100 hover:text-uniform-gold transition-colors font-roboto">Envíos</Link></li>
                <li><Link href="/returns" className="text-blue-100 hover:text-uniform-gold transition-colors font-roboto">Devoluciones</Link></li>
                <li><Link href="/faq" className="text-blue-100 hover:text-uniform-gold transition-colors font-roboto">FAQ</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-uniform-gold/30 mt-8 pt-8 text-center text-sm text-blue-200 font-roboto">
            <p>&copy; 2025 TREE Uniformes & Kodiak Industrial. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}