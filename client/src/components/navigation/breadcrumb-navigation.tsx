import { Link, useLocation } from "wouter";
import { ChevronRight, Home, Building, Package, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbNavigationProps {
  items?: BreadcrumbItem[];
  showStoreLink?: boolean;
  showAdminLink?: boolean;
  userRole?: 'admin' | 'customer';
}

export default function BreadcrumbNavigation({ 
  items, 
  showStoreLink = false, 
  showAdminLink = false,
  userRole 
}: BreadcrumbNavigationProps) {
  const [location] = useLocation();

  // Auto-generate breadcrumbs based on current location if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    if (pathSegments[0] === 'admin') {
      breadcrumbs.push({ label: 'Admin', href: '/admin', icon: Building });
      
      if (pathSegments[1]) {
        const adminPages: Record<string, string> = {
          'products': 'Productos',
          'orders': 'Pedidos',
          'customers': 'Clientes',
          'quotes': 'Presupuestos',
          'promotions': 'Promociones',
          'sales': 'Ventas',
          'reports': 'Reportes',
          'settings': 'Configuración',
          'industry-sections': 'Secciones'
        };
        
        if (adminPages[pathSegments[1]]) {
          breadcrumbs.push({ 
            label: adminPages[pathSegments[1]], 
            href: `/admin/${pathSegments[1]}`,
            icon: Package
          });
        }
      }
    } else if (pathSegments[0] === 'store') {
      breadcrumbs.push({ label: 'Tienda', href: '/store', icon: Store });
      
      if (pathSegments[1]) {
        const storePages: Record<string, string> = {
          'catalog': 'Catálogo',
          'brands': 'Marcas',
          'cart': 'Carrito',
          'quote-request': 'Solicitar Presupuesto'
        };
        
        if (storePages[pathSegments[1]]) {
          breadcrumbs.push({ 
            label: storePages[pathSegments[1]], 
            href: `/store/${pathSegments[1]}`,
            icon: Package
          });
        }
      }
    } else if (pathSegments[0] === 'customer') {
      breadcrumbs.push({ label: 'Mi Cuenta', href: '/customer/dashboard', icon: Home });
      
      if (pathSegments[1]) {
        const customerPages: Record<string, string> = {
          'quotes': 'Mis Cotizaciones',
          'favorites': 'Favoritos',
          'orders': 'Mis Pedidos'
        };
        
        if (customerPages[pathSegments[1]]) {
          breadcrumbs.push({ 
            label: customerPages[pathSegments[1]], 
            href: `/customer/${pathSegments[1]}`,
            icon: Package
          });
        }
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = items || generateBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === breadcrumbs.length - 1;
            
            return (
              <div key={item.href} className="flex items-center">
                {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />}
                <Link
                  href={item.href}
                  className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                    isLast 
                      ? 'text-uniform-primary font-medium' 
                      : 'text-gray-600 hover:text-uniform-primary hover:bg-gray-50'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Quick Navigation Links */}
        <div className="flex items-center space-x-2">
          {/* Store Link (when in admin) */}
          {showStoreLink && (
            <Link href="/store">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-2 text-xs"
              >
                <Store className="h-3 w-3" />
                <span>Ver Tienda</span>
              </Button>
            </Link>
          )}
          
          {/* Admin Link (when in store and user is admin) */}
          {showAdminLink && userRole === 'admin' && (
            <Link href="/admin">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-2 text-xs bg-uniform-primary text-white hover:bg-uniform-primary/90 border-uniform-primary"
              >
                <Building className="h-3 w-3" />
                <span>Panel Admin</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}