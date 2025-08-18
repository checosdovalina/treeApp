import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Settings, 
  Eye, 
  ShoppingBag, 
  FileText, 
  Store,
  Building,
  ArrowLeft
} from "lucide-react";

interface ContextActionsProps {
  userRole?: 'admin' | 'customer';
}

export default function ContextActions({ userRole }: ContextActionsProps) {
  const [location] = useLocation();

  // Define context-specific actions based on current page
  const getContextActions = () => {
    const actions = [];

    // Admin context actions
    if (userRole === 'admin' && location.startsWith('/admin')) {
      if (location === '/admin' || location === '/admin/') {
        actions.push(
          { label: 'Ver Tienda', href: '/store', icon: Store, variant: 'outline' as const },
          { label: 'Nuevo Producto', href: '/admin/products/new', icon: Plus, variant: 'default' as const }
        );
      } else if (location.startsWith('/admin/products')) {
        actions.push(
          { label: 'Dashboard', href: '/admin', icon: ArrowLeft, variant: 'outline' as const },
          { label: 'Nuevo Producto', href: '/admin/products/new', icon: Plus, variant: 'default' as const },
          { label: 'Ver en Tienda', href: '/store/catalog', icon: Eye, variant: 'outline' as const }
        );
      } else if (location.startsWith('/admin/orders')) {
        actions.push(
          { label: 'Dashboard', href: '/admin', icon: ArrowLeft, variant: 'outline' as const },
          { label: 'Crear Presupuesto', href: '/admin/quotes/new', icon: FileText, variant: 'default' as const },
          { label: 'Ver Tienda', href: '/store', icon: Store, variant: 'outline' as const }
        );
      } else if (location.startsWith('/admin/customers')) {
        actions.push(
          { label: 'Dashboard', href: '/admin', icon: ArrowLeft, variant: 'outline' as const },
          { label: 'Ver Tienda', href: '/store', icon: Store, variant: 'outline' as const }
        );
      } else if (location.startsWith('/admin/quotes')) {
        actions.push(
          { label: 'Dashboard', href: '/admin', icon: ArrowLeft, variant: 'outline' as const },
          { label: 'Nuevo Presupuesto', href: '/admin/quotes/new', icon: Plus, variant: 'default' as const }
        );
      } else if (location.startsWith('/admin/promotions')) {
        actions.push(
          { label: 'Dashboard', href: '/admin', icon: ArrowLeft, variant: 'outline' as const },
          { label: 'Nueva Promoción', href: '/admin/promotions/new', icon: Plus, variant: 'default' as const },
          { label: 'Ver en Tienda', href: '/store', icon: Eye, variant: 'outline' as const }
        );
      } else if (location.startsWith('/admin/settings')) {
        actions.push(
          { label: 'Dashboard', href: '/admin', icon: ArrowLeft, variant: 'outline' as const }
        );
      } else {
        actions.push(
          { label: 'Dashboard', href: '/admin', icon: ArrowLeft, variant: 'outline' as const },
          { label: 'Ver Tienda', href: '/store', icon: Store, variant: 'outline' as const }
        );
      }
    }

    // Store/Customer context actions
    if (location.startsWith('/store')) {
      if (userRole === 'admin') {
        actions.push(
          { label: 'Panel Admin', href: '/admin', icon: Building, variant: 'default' as const }
        );
      }
      
      if (location === '/store' || location === '/store/') {
        actions.push(
          { label: 'Ver Catálogo', href: '/store/catalog', icon: ShoppingBag, variant: 'default' as const },
          { label: 'Solicitar Presupuesto', href: '/store/quote-request', icon: FileText, variant: 'outline' as const }
        );
      } else if (location.startsWith('/store/catalog')) {
        actions.push(
          { label: 'Inicio', href: '/store', icon: ArrowLeft, variant: 'outline' as const },
          { label: 'Solicitar Presupuesto', href: '/store/quote-request', icon: FileText, variant: 'default' as const }
        );
      } else if (location.startsWith('/store/brands')) {
        actions.push(
          { label: 'Inicio', href: '/store', icon: ArrowLeft, variant: 'outline' as const },
          { label: 'Ver Catálogo', href: '/store/catalog', icon: ShoppingBag, variant: 'default' as const }
        );
      } else if (location.startsWith('/store/cart')) {
        actions.push(
          { label: 'Seguir Comprando', href: '/store/catalog', icon: ArrowLeft, variant: 'outline' as const },
          { label: 'Solicitar Presupuesto', href: '/store/quote-request', icon: FileText, variant: 'default' as const }
        );
      }
    }

    // Customer dashboard context actions
    if (location.startsWith('/customer')) {
      if (userRole === 'admin') {
        actions.push(
          { label: 'Panel Admin', href: '/admin', icon: Building, variant: 'default' as const }
        );
      }
      
      actions.push(
        { label: 'Ir a Tienda', href: '/store', icon: Store, variant: 'outline' as const }
      );
    }

    return actions;
  };

  const actions = getContextActions();

  if (actions.length === 0) return null;

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-end space-x-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link key={index} href={action.href}>
              <Button 
                variant={action.variant} 
                size="sm"
                className={`flex items-center space-x-2 text-xs ${
                  action.variant === 'default' 
                    ? 'bg-uniform-primary hover:bg-uniform-primary/90 text-white' 
                    : ''
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{action.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}