import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import BreadcrumbNavigation from "@/components/navigation/breadcrumb-navigation";
import ContextActions from "@/components/navigation/context-actions";
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
  Mail,
  ChevronDown
} from "lucide-react";

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCatalogSubmenu, setShowCatalogSubmenu] = useState(false);
  const [showMobileCatalogSubmenu, setShowMobileCatalogSubmenu] = useState(false);
  const [showBrandsSubmenu, setShowBrandsSubmenu] = useState(false);
  const [showMobileBrandsSubmenu, setShowMobileBrandsSubmenu] = useState(false);
  const { user, isAuthenticated } = useAuth() as { user: any; isAuthenticated: boolean };
  const { items, itemCount } = useCart();
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const totalItems = itemCount;

  // Obtener datos para submenús
  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ['/api/categories'],
  });

  const { data: brands = [] } = useQuery<any[]>({
    queryKey: ['/api/brands'],
  });

  const { data: garmentTypes = [] } = useQuery<any[]>({
    queryKey: ['/api/garment-types'],
  });

  const navigation = [
    { name: "Inicio", href: "/store", icon: Home },
    { name: "Catálogo", href: "/store/catalog", icon: Package },
    { name: "Marcas", href: "/store/brands", icon: Tag },
    { name: "Presupuesto", href: "/store/quote-request", icon: FileText },
    { name: "Mi Cuenta", href: "/customer/dashboard", icon: User },
    { name: "Favoritos", href: "/customer/favorites", icon: Heart },
    { name: "Cotizaciones", href: "/customer/quotes", icon: FileText },
  ];

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

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white border-b-2 border-uniform-gold shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center mr-8">
              <Link href="/store" className="flex items-center">
                <img 
                  src={treeLogo} 
                  alt="TREE Uniformes & Kodiak Industrial"
                  className="h-14 w-auto max-w-[120px] object-contain"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                
                // Catálogo con submenú
                if (item.name === "Catálogo") {
                  return (
                    <div 
                      key={item.name}
                      className="relative group"
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-poppins font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-uniform-blue text-white shadow-md"
                            : "text-uniform-dark hover:text-uniform-blue hover:bg-uniform-gold/10 hover:shadow-sm"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                        <ChevronDown className="h-3 w-3" />
                      </Link>
                      
                      {/* Submenú - aparece con hover */}
                      <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="p-4">
                          <div className="grid grid-cols-2 gap-4">
                            {/* Tipos de Prenda */}
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Tipos de Prenda</h3>
                              <div className="space-y-2">
                                <Link 
                                  href="/store/catalog" 
                                  className="block text-sm text-gray-600 hover:text-uniform-blue transition-colors"
                                >
                                  Ver Todos
                                </Link>
                                <Link 
                                  href="/store/polos" 
                                  className="block text-sm text-gray-600 hover:text-uniform-blue transition-colors"
                                >
                                  Polos
                                </Link>
                                <Link 
                                  href="/store/playeras" 
                                  className="block text-sm text-gray-600 hover:text-uniform-blue transition-colors"
                                >
                                  Playeras
                                </Link>
                                {garmentTypes.slice(0, 2).map((type: any) => (
                                  <Link 
                                    key={type.id}
                                    href={`/store/catalog?garmentType=${type.id}`}
                                    className="block text-sm text-gray-600 hover:text-uniform-blue transition-colors"
                                  >
                                    {type.displayName}
                                  </Link>
                                ))}
                              </div>
                            </div>
                            
                            {/* Marcas */}
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Marcas</h3>
                              <div className="space-y-2">
                                <Link 
                                  href="/store/brands" 
                                  className="block text-sm text-gray-600 hover:text-uniform-blue transition-colors"
                                >
                                  Ver Todas
                                </Link>
                                {brands.slice(0, 4).map((brand: any) => (
                                  <Link 
                                    key={brand.id}
                                    href={`/store/catalog?brand=${brand.id}`}
                                    className="block text-sm text-gray-600 hover:text-uniform-blue transition-colors"
                                  >
                                    {brand.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {/* Sección adicional */}
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Categorías</h3>
                            <div className="flex flex-wrap gap-2">
                              {categories.slice(0, 3).map((category: any) => (
                                <Link 
                                  key={category.id}
                                  href={`/store/catalog?category=${category.id}`}
                                  className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-uniform-gold/20 hover:text-uniform-blue transition-colors"
                                >
                                  {category.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                // Marcas con submenú
                if (item.name === "Marcas") {
                  return (
                    <div 
                      key={item.name}
                      className="relative group"
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-poppins font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-uniform-blue text-white shadow-md"
                            : "text-uniform-dark hover:text-uniform-blue hover:bg-uniform-gold/10 hover:shadow-sm"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                        <ChevronDown className="h-3 w-3" />
                      </Link>
                      
                      {/* Submenú de Marcas - aparece con hover */}
                      <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Marcas Disponibles</h3>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            <Link 
                              href="/store/brands" 
                              className="block text-sm text-gray-600 hover:text-uniform-blue transition-colors font-medium"
                            >
                              Ver Todas las Marcas
                            </Link>
                            <div className="border-t pt-2 mt-2">
                              {brands.map((brand: any) => (
                                <Link 
                                  key={brand.id}
                                  href={`/store/catalog?brand=${brand.id}`}
                                  className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:text-uniform-blue hover:bg-gray-50 rounded transition-colors"
                                >
                                  <span>{brand.name}</span>
                                  {brand.description && (
                                    <span className="text-xs text-gray-400 ml-2">
                                      {brand.description.length > 20 ? 
                                        `${brand.description.substring(0, 20)}...` : 
                                        brand.description
                                      }
                                    </span>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                // Otros elementos del menú normales
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

              {/* Admin Access */}
              {isAuthenticated && (user as any)?.role === 'admin' && (
                <Link href="/admin">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hidden lg:flex items-center space-x-2 bg-uniform-primary text-white hover:bg-uniform-primary/90 border-uniform-primary"
                  >
                    <Building className="h-4 w-4" />
                    <span>Panel Admin</span>
                  </Button>
                </Link>
              )}

              {/* User Menu */}
              {isAuthenticated && user ? (
                <div className="hidden lg:flex items-center space-x-3">
                  <div className="text-sm">
                    <p className="font-poppins font-medium text-uniform-blue">
                      {user.firstName || "Cliente"}
                    </p>
                    <p className="text-xs text-uniform-dark font-roboto">
                      {(user as any)?.role === 'admin' ? 'Administrador' : user.email}
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
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="bg-uniform-blue text-white rounded-full p-2">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-poppins font-medium text-uniform-blue">
                                {user.firstName || "Cliente"}
                              </p>
                              <p className="text-sm text-uniform-dark font-roboto">
                                {(user as any)?.role === 'admin' ? 'Administrador' : user.email}
                              </p>
                            </div>
                          </div>
                          {/* Admin Button for Mobile */}
                          {(user as any)?.role === 'admin' && (
                            <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                              <Button 
                                size="sm" 
                                className="bg-uniform-primary text-white hover:bg-uniform-primary/90"
                              >
                                <Building className="h-4 w-4 mr-2" />
                                Panel Admin
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Navigation */}
                    <nav className="flex-1 space-y-3">
                      {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = location === item.href;
                        
                        // Catálogo con submenú expandible
                        if (item.name === "Catálogo") {
                          return (
                            <div key={item.name}>
                              <div
                                onClick={() => setShowMobileCatalogSubmenu(!showMobileCatalogSubmenu)}
                                className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-poppins font-medium transition-all duration-200 cursor-pointer ${
                                  isActive
                                    ? "bg-uniform-blue text-white shadow-md"
                                    : "text-uniform-dark hover:text-uniform-blue hover:bg-uniform-gold/10"
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <Icon className="h-5 w-5" />
                                  <span>{item.name}</span>
                                </div>
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showMobileCatalogSubmenu ? 'rotate-180' : ''}`} />
                              </div>
                              
                              {/* Submenú expandible */}
                              {showMobileCatalogSubmenu && (
                                <div className="ml-8 mt-2 space-y-2">
                                  <Link
                                    href="/store/catalog"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-3 py-2 text-sm text-gray-600 hover:text-uniform-blue rounded"
                                  >
                                    Ver Todo el Catálogo
                                  </Link>
                                  
                                  {/* Tipos de Prenda */}
                                  <div className="border-l-2 border-gray-200 pl-3">
                                    <p className="text-xs font-semibold text-gray-500 mb-2">TIPOS DE PRENDA</p>
                                    <Link
                                      href="/store/polos"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                      className="block px-2 py-1 text-sm text-gray-600 hover:text-uniform-blue rounded font-medium"
                                    >
                                      Polos
                                    </Link>
                                    <Link
                                      href="/store/playeras"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                      className="block px-2 py-1 text-sm text-gray-600 hover:text-uniform-blue rounded font-medium"
                                    >
                                      Playeras
                                    </Link>
                                    {garmentTypes.slice(0, 3).map((type: any) => (
                                      <Link
                                        key={type.id}
                                        href={`/store/catalog?garmentType=${type.id}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-2 py-1 text-sm text-gray-600 hover:text-uniform-blue rounded"
                                      >
                                        {type.displayName}
                                      </Link>
                                    ))}
                                  </div>
                                  
                                  {/* Marcas */}
                                  <div className="border-l-2 border-gray-200 pl-3">
                                    <p className="text-xs font-semibold text-gray-500 mb-2">MARCAS</p>
                                    {brands.slice(0, 4).map((brand: any) => (
                                      <Link
                                        key={brand.id}
                                        href={`/store/catalog?brand=${brand.id}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-2 py-1 text-sm text-gray-600 hover:text-uniform-blue rounded"
                                      >
                                        {brand.name}
                                      </Link>
                                    ))}
                                  </div>
                                  
                                  {/* Categorías */}
                                  <div className="border-l-2 border-gray-200 pl-3">
                                    <p className="text-xs font-semibold text-gray-500 mb-2">CATEGORÍAS</p>
                                    {categories.slice(0, 3).map((category: any) => (
                                      <Link
                                        key={category.id}
                                        href={`/store/catalog?category=${category.id}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-2 py-1 text-sm text-gray-600 hover:text-uniform-blue rounded"
                                      >
                                        {category.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        }
                        
                        // Marcas con submenú expandible
                        if (item.name === "Marcas") {
                          return (
                            <div key={item.name}>
                              <div
                                onClick={() => setShowMobileBrandsSubmenu(!showMobileBrandsSubmenu)}
                                className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-poppins font-medium transition-all duration-200 cursor-pointer ${
                                  isActive
                                    ? "bg-uniform-blue text-white shadow-md"
                                    : "text-uniform-dark hover:text-uniform-blue hover:bg-uniform-gold/10"
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <Icon className="h-5 w-5" />
                                  <span>{item.name}</span>
                                </div>
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showMobileBrandsSubmenu ? 'rotate-180' : ''}`} />
                              </div>
                              
                              {/* Submenú de marcas expandible */}
                              {showMobileBrandsSubmenu && (
                                <div className="ml-8 mt-2 space-y-2">
                                  <Link
                                    href="/store/brands"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-3 py-2 text-sm text-gray-600 hover:text-uniform-blue rounded font-medium"
                                  >
                                    Ver Todas las Marcas
                                  </Link>
                                  
                                  {/* Lista de marcas */}
                                  <div className="border-l-2 border-gray-200 pl-3 max-h-48 overflow-y-auto">
                                    <p className="text-xs font-semibold text-gray-500 mb-2">MARCAS DISPONIBLES</p>
                                    {brands.map((brand: any) => (
                                      <Link
                                        key={brand.id}
                                        href={`/store/catalog?brand=${brand.id}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-2 py-1 text-sm text-gray-600 hover:text-uniform-blue rounded"
                                      >
                                        {brand.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        }
                        
                        // Otros elementos del menú normales
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
                        <Link href="/auth/login">
                          <Button className="w-full bg-uniform-blue hover:bg-uniform-blue-light text-white font-poppins">
                            Iniciar Sesión
                          </Button>
                        </Link>
                      )}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <Link href="/auth/admin-register">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full border-uniform-primary text-uniform-primary hover:bg-uniform-primary hover:text-white"
                          >
                            <Building className="h-4 w-4 mr-2" />
                            Registrarse como Admin
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with proper spacing to avoid header overlap */}
      <main className="flex-1 pt-20">
        <BreadcrumbNavigation showAdminLink={true} userRole={(user as any)?.role} />
        <ContextActions userRole={(user as any)?.role} />
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