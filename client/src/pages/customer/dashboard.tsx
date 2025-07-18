import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import CustomerLayout from "@/components/layout/customer-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  ShoppingBag, 
  Package, 
  Clock, 
  User, 
  FileText, 
  TrendingUp,
  Heart,
  Star,
  ArrowRight
} from "lucide-react";

export default function CustomerDashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Acceso requerido",
        description: "Debes iniciar sesión para acceder a tu cuenta.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: recentOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/customer/orders'],
    enabled: isAuthenticated,
    retry: false,
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sesión expirada",
          description: "Redirigiendo al login...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
    },
  });

  const { data: favorites, isLoading: favoritesLoading } = useQuery({
    queryKey: ['/api/customer/favorites'],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: customerStats } = useQuery({
    queryKey: ['/api/customer/stats'],
    enabled: isAuthenticated,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uniform-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu cuenta...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-uniform-primary to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                  ¡Bienvenido de vuelta!
                </h1>
                <p className="text-blue-100 text-lg">
                  Hola {user?.firstName || 'Cliente'}, gestiona tu cuenta y explora nuestros uniformes
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="secondary" 
                  className="bg-white text-uniform-primary hover:bg-gray-100"
                  onClick={() => window.location.href = '/store/catalog'}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Explorar Catálogo
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-uniform-primary"
                  onClick={() => window.location.href = '/store/cart'}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Ver Carrito
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Pedidos Realizados</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {customerStats?.totalOrders || 0}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <ShoppingBag className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Gastado</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                      ${customerStats?.totalSpent || '0.00'}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Productos Favoritos</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {customerStats?.favoritesCount || 0}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Heart className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Nivel Cliente</p>
                    <p className="text-lg lg:text-xl font-bold text-gray-900">
                      {customerStats?.customerLevel || 'Nuevo'}
                    </p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Star className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Pedidos Recientes
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = '/customer/orders'}
                    >
                      Ver todos
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-uniform-primary mx-auto mb-4"></div>
                      <p className="text-gray-600">Cargando pedidos...</p>
                    </div>
                  ) : !recentOrders || recentOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No tienes pedidos aún
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Explora nuestro catálogo y realiza tu primera compra
                      </p>
                      <Button 
                        className="bg-uniform-primary hover:bg-blue-700"
                        onClick={() => window.location.href = '/store/catalog'}
                      >
                        Explorar Productos
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentOrders.slice(0, 5).map((order: any) => (
                        <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <p className="font-medium text-gray-900">
                                  Pedido #{order.id}
                                </p>
                                <Badge variant={
                                  order.status === 'delivered' ? 'default' :
                                  order.status === 'processing' ? 'secondary' :
                                  order.status === 'pending' ? 'outline' : 'destructive'
                                }>
                                  {order.status === 'delivered' ? 'Entregado' :
                                   order.status === 'processing' ? 'Procesando' :
                                   order.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-600">
                                {order.items?.length || 0} productos
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">
                                ${order.totalAmount}
                              </p>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.location.href = `/customer/orders/${order.id}`}
                              >
                                Ver detalles
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Mi Perfil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-uniform-primary text-white rounded-full p-3">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.location.href = '/customer/profile'}
                    >
                      Editar Perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => window.location.href = '/customer/quotes'}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Solicitar Cotización
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => window.location.href = '/customer/favorites'}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Mis Favoritos
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => window.location.href = '/customer/support'}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Soporte
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Favorites Preview */}
              {favorites && favorites.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Favoritos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {favorites.slice(0, 3).map((item: any) => (
                        <div key={item.id} className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              ${item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                      {favorites.length > 3 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => window.location.href = '/customer/favorites'}
                        >
                          Ver todos ({favorites.length})
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}