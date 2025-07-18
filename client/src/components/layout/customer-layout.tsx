import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { 
  ShoppingCart, 
  User, 
  Menu, 
  Home, 
  Package, 
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
  const { user, isAuthenticated } = useAuth();
  const { items } = useCart();
  const [location] = useLocation();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const navigation = [
    { name: "Inicio", href: "/store", icon: Home },
    { name: "Catálogo", href: "/store/catalog", icon: Package },
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
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/store" className="flex items-center space-x-2">
                <div className="bg-uniform-primary rounded-lg p-2">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-uniform-neutral-900">
                    Uniformes Laguna
                  </h1>
                  <p className="text-xs text-gray-500">Tu tienda de uniformes</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-uniform-primary text-white"
                        : "text-gray-700 hover:text-uniform-primary hover:bg-gray-100"
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
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-2">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      {user?.firstName || "Cliente"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email}
                    </p>
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
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="border-b border-gray-200 pb-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="bg-uniform-primary rounded-lg p-2">
                          <Building className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h1 className="text-lg font-bold text-uniform-neutral-900">
                            Uniformes Laguna
                          </h1>
                          <p className="text-xs text-gray-500">Tu tienda de uniformes</p>
                        </div>
                      </div>
                    </div>

                    {/* User Info */}
                    {isAuthenticated && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-uniform-primary text-white rounded-full p-2">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user?.firstName || "Cliente"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                      {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = location === item.href;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                              isActive
                                ? "bg-uniform-primary text-white"
                                : "text-gray-700 hover:text-uniform-primary hover:bg-gray-100"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </nav>

                    {/* Footer Actions */}
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      {isAuthenticated ? (
                        <Button
                          variant="ghost"
                          onClick={handleLogout}
                          className="w-full justify-start text-red-600 hover:text-red-700"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Cerrar Sesión
                        </Button>
                      ) : (
                        <Link href="/login">
                          <Button className="w-full bg-uniform-primary hover:bg-blue-700">
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

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-uniform-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-uniform-primary rounded-lg p-2">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Uniformes Laguna</h3>
                  <p className="text-sm text-gray-400">Calidad que viste profesionalismo</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                Especializados en uniformes corporativos, escolares y de trabajo. 
                Ofrecemos productos de la más alta calidad con diseños modernos y funcionales.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-uniform-primary" />
                  <span className="text-sm">+52 (871) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-uniform-primary" />
                  <span className="text-sm">contacto@uniformeslaguna.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/store" className="text-gray-300 hover:text-white">Inicio</Link></li>
                <li><Link href="/store/catalog" className="text-gray-300 hover:text-white">Catálogo</Link></li>
                <li><Link href="/customer/quotes" className="text-gray-300 hover:text-white">Cotizaciones</Link></li>
                <li><Link href="/about" className="text-gray-300 hover:text-white">Nosotros</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-semibold mb-4">Atención al Cliente</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/customer/support" className="text-gray-300 hover:text-white">Soporte</Link></li>
                <li><Link href="/shipping" className="text-gray-300 hover:text-white">Envíos</Link></li>
                <li><Link href="/returns" className="text-gray-300 hover:text-white">Devoluciones</Link></li>
                <li><Link href="/faq" className="text-gray-300 hover:text-white">FAQ</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Uniformes Laguna. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}