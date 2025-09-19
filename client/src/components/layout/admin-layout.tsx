import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import BreadcrumbNavigation from "@/components/navigation/breadcrumb-navigation";
import ContextActions from "@/components/navigation/context-actions";
// import treeLogo from "@assets/TREE LOGO_1753399074765.png";
const treeLogo = "/tree-logo.png";
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  TrendingUp, 
  Settings,
  Bell,
  ExternalLink,
  Menu,
  X,
  Shirt,
  Building,
  ChevronDown,
  Mail
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user } = useAuth() as { user: any };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      
      // Redirect to login page
      setLocation("/login");
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
    { name: "Dashboard", href: "/", icon: BarChart3 },
    { name: "Ventas", href: "/admin/sales", icon: TrendingUp },
    { name: "Productos", href: "/admin/products", icon: Package },
    { name: "Pedidos", href: "/admin/orders", icon: ShoppingCart },
    { name: "Clientes", href: "/admin/customers", icon: Users },
    { name: "Empresas", href: "/admin/companies", icon: Building },
    { name: "Presupuestos", href: "/admin/quotes", icon: FileText },
    { name: "Mensajes", href: "/admin/contact-messages", icon: Mail },
    { name: "Promociones", href: "/admin/promotions", icon: Bell },
    { name: "Secciones", href: "/admin/industry-sections", icon: Building },
    { name: "Reportes", href: "/admin/reports", icon: TrendingUp },
    { name: "Configuración", href: "/admin/settings", icon: Settings },
  ];

  // Store navigation links for quick access
  const storeLinks = [
    { name: "Ver Tienda", href: "/store", icon: Shirt, description: "Vista pública de la tienda" },
    { name: "Catálogo", href: "/store/catalog", icon: Package, description: "Productos de la tienda" },
    { name: "Marcas", href: "/store/brands", icon: Building, description: "Página de marcas" },
  ];

  return (
    <div className="min-h-screen bg-uniform-neutral-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src={treeLogo} 
                alt="TREE Uniformes & Kodiak Industrial"
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">TREE Admin</h1>
                <p className="text-sm text-gray-600">Panel de Administración</p>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="flex items-center space-x-4">
              {/* Store Quick Access Dropdown */}
              <div className="relative group hidden md:block">
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 group-hover:bg-uniform-primary group-hover:text-white transition-colors"
                >
                  <Shirt className="h-4 w-4" />
                  <span>Tienda</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    {storeLinks.map((link) => (
                      <Link 
                        key={link.href}
                        href={link.href}
                        className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <link.icon className="h-4 w-4 text-uniform-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{link.name}</p>
                          <p className="text-xs text-gray-500">{link.description}</p>
                        </div>
                        <ExternalLink className="h-3 w-3 text-gray-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 avatar-gradient-1 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user && user.firstName ? user.firstName[0] : 'A'}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-uniform-neutral-900">
                    {user && user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "Administrador"}
                  </p>
                  <p className="text-xs text-uniform-secondary">Administrador</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? "Cerrando..." : "Salir"}
                </Button>
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:flex w-64 bg-white shadow-sm border-r flex-col fixed md:sticky top-16 h-[calc(100vh-4rem)] z-40`}>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location === item.href || 
                (item.href !== '/' && location.startsWith(item.href));
              
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-uniform-primary text-white'
                        : 'text-uniform-secondary hover:bg-uniform-neutral-100'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                    {item.name === 'Pedidos' && (
                      <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                        5
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 bg-uniform-neutral-50 min-h-[calc(100vh-4rem)]">
          <BreadcrumbNavigation showStoreLink={true} userRole="admin" />
          <ContextActions userRole="admin" />
          {children}
        </main>
      </div>
    </div>
  );
}

export { AdminLayout };
