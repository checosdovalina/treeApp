import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, Store, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function AdminDashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    enabled: isAuthenticated && user?.role === 'admin',
    retry: false,
  });

  const { data: topProducts, isLoading: topProductsLoading } = useQuery({
    queryKey: ['/api/dashboard/top-products'],
    enabled: isAuthenticated && user?.role === 'admin',
    retry: false,
  });

  const { data: recentOrders, isLoading: recentOrdersLoading } = useQuery({
    queryKey: ['/api/dashboard/recent-orders'],
    enabled: isAuthenticated && user?.role === 'admin',
    retry: false,
  });

  const { data: unreadMessagesCount, isLoading: unreadMessagesLoading } = useQuery({
    queryKey: ['/api/contact-messages/unread-count'],
    enabled: isAuthenticated && user?.role === 'admin',
    retry: false,
  });

  const { data: recentContactMessages, isLoading: contactMessagesLoading } = useQuery({
    queryKey: ['/api/contact-messages'],
    enabled: isAuthenticated && user?.role === 'admin',
    retry: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendiente', variant: 'secondary' as const },
      processing: { label: 'Procesando', variant: 'default' as const },
      shipped: { label: 'Enviado', variant: 'outline' as const },
      delivered: { label: 'Entregado', variant: 'default' as const },
      cancelled: { label: 'Cancelado', variant: 'destructive' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getMessageStatusBadge = (isRead: boolean) => {
    return isRead ? (
      <Badge variant="outline">Leído</Badge>
    ) : (
      <Badge variant="default">Nuevo</Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="p-3 sm:p-4 lg:p-6">
        {/* Page Header */}
        <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-uniform-neutral-900">Dashboard Administrativo</h1>
            <p className="text-uniform-secondary mt-1 sm:mt-2 text-sm sm:text-base">Bienvenido, {user?.firstName || 'Administrador'}</p>
          </div>
          <div className="w-full sm:w-auto">
            <Button 
              onClick={() => window.open('/store', '_blank')}
              className="bg-uniform-primary hover:bg-uniform-darker text-white flex items-center justify-center gap-2 w-full sm:w-auto"
              data-testid="button-view-store"
            >
              <Store className="h-4 w-4" />
              Ver Tienda
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          <StatCard
            title="Ventas Hoy"
            value={statsLoading ? "$0" : `$${(stats as any)?.totalSales || "0"}`}
            change="+12% vs ayer"
            changeType="positive"
            icon={DollarSign}
            iconColor="text-uniform-accent"
          />
          
          <StatCard
            title="Pedidos Nuevos"
            value={statsLoading ? "0" : String((stats as any)?.newOrders || 0)}
            change="5 pendientes"
            changeType="neutral"
            icon={ShoppingCart}
            iconColor="text-blue-600"
          />
          
          <StatCard
            title="Productos Activos"
            value={statsLoading ? "0" : String((stats as any)?.activeProducts || 0)}
            change="12 sin stock"
            changeType="negative"
            icon={Package}
            iconColor="text-orange-600"
          />
          
          <StatCard
            title="Clientes Totales"
            value={statsLoading ? "0" : String((stats as any)?.totalCustomers || 0)}
            change="+8 esta semana"
            changeType="positive"
            icon={Users}
            iconColor="text-purple-600"
          />

          <StatCard
            title="Mensajes de Contacto"
            value={unreadMessagesLoading ? "0" : String((unreadMessagesCount as any)?.count || 0)}
            change="nuevos sin leer"
            changeType="neutral"
            icon={Mail}
            iconColor="text-green-600"
          />
        </div>

        {/* Charts and Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {/* Sales Chart Placeholder */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="text-lg sm:text-xl">Ventas Últimos 7 Días</CardTitle>
                <select className="text-xs sm:text-sm border border-gray-200 rounded-lg px-2 sm:px-3 py-1 w-full sm:w-auto">
                  <option>Últimos 7 días</option>
                  <option>Último mes</option>
                  <option>Último año</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-48 sm:h-64 bg-uniform-neutral-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                <div className="text-center">
                  <TrendingUp className="h-8 sm:h-12 w-8 sm:w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm sm:text-base text-gray-500">Gráfico de ventas</p>
                  <p className="text-xs text-gray-400">Sistema en desarrollo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Productos Más Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              {topProductsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-uniform-secondary text-sm sm:text-base">Cargando productos...</div>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {(topProducts as any)?.length === 0 ? (
                    <div className="text-center text-uniform-secondary py-6 sm:py-8">
                      <p className="text-sm sm:text-base">Varios</p>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">Productos disponibles</p>
                    </div>
                  ) : (
                    (topProducts as any)?.map((product: any) => (
                      <div key={product.id} className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 border border-gray-200 rounded-lg">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-uniform-neutral-900 text-sm sm:text-base truncate">{product.name}</h4>
                          <p className="text-xs sm:text-sm text-uniform-secondary">{product.salesCount} vendidas</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold text-uniform-neutral-900 text-sm sm:text-base">${product.revenue}</p>
                          <p className="text-xs sm:text-sm text-uniform-accent">+15%</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="mt-4 lg:mt-0">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-lg sm:text-xl">Pedidos Recientes</CardTitle>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentOrdersLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-uniform-secondary text-sm sm:text-base">Cargando pedidos...</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Pedido</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Cliente</TableHead>
                      <TableHead className="text-xs sm:text-sm">Estado</TableHead>
                      <TableHead className="text-xs sm:text-sm">Total</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden md:table-cell">Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(recentOrders as any)?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-uniform-secondary py-6 sm:py-8 text-sm sm:text-base">
                          $0
                          <div className="text-xs text-gray-400 mt-1">Sistema en desarrollo</div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      (recentOrders as any)?.map((order: any) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium text-xs sm:text-sm">{order.orderNumber}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div className="flex items-center">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 avatar-gradient-2 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                                <span className="text-white text-xs font-medium">
                                  {order.customerName?.[0] || 'C'}
                                </span>
                              </div>
                              <span className="text-xs sm:text-sm truncate max-w-24 sm:max-w-none">
                                {order.customerName || order.customerEmail}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="font-medium text-xs sm:text-sm">${order.total}</TableCell>
                          <TableCell className="text-uniform-secondary text-xs sm:text-sm hidden md:table-cell">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Messages */}
        <Card className="mt-4 lg:mt-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-lg sm:text-xl">Clientes</CardTitle>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {contactMessagesLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-uniform-secondary text-sm sm:text-base">Cargando mensajes...</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Remitente</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden md:table-cell">Asunto</TableHead>
                      <TableHead className="text-xs sm:text-sm">Estado</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Fecha</TableHead>
                      <TableHead className="text-xs sm:text-sm">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(!recentContactMessages || (recentContactMessages as any)?.length === 0) ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-uniform-secondary py-6 sm:py-8 text-sm sm:text-base">
                          No hay mensajes de contacto
                        </TableCell>
                      </TableRow>
                    ) : (
                      (recentContactMessages as any)?.slice(0, 5).map((message: any) => (
                        <TableRow key={message.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                                <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-uniform-neutral-900 text-xs sm:text-sm truncate">{message.name}</p>
                                <p className="text-xs text-uniform-secondary truncate">{message.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <p className="font-medium text-uniform-neutral-900 truncate max-w-32 lg:max-w-48 text-xs sm:text-sm">
                              {message.subject}
                            </p>
                            <p className="text-xs text-uniform-secondary truncate max-w-32 lg:max-w-48">
                              {message.message}
                            </p>
                          </TableCell>
                          <TableCell>{getMessageStatusBadge(message.isRead)}</TableCell>
                          <TableCell className="text-uniform-secondary text-xs sm:text-sm hidden lg:table-cell">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                // TODO: Implementar función para marcar como leído/responder
                                toast({
                                  title: "Función próximamente",
                                  description: "La función de respuesta estará disponible pronto.",
                                });
                              }}
                              data-testid={`button-respond-${message.id}`}
                              className="text-xs sm:text-sm px-2 sm:px-3"
                            >
                              <span className="hidden sm:inline">{message.isRead ? "Responder" : "Marcar leído"}</span>
                              <span className="sm:hidden">📝</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
