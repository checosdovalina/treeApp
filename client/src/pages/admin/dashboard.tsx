import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, Store } from "lucide-react";
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

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-uniform-neutral-900">Dashboard</h1>
            <p className="text-uniform-secondary mt-2">Resumen general de tu tienda de uniformes</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button 
              onClick={() => window.open('/store', '_blank')}
              className="bg-uniform-primary hover:bg-uniform-darker text-white flex items-center gap-2"
            >
              <Store className="h-4 w-4" />
              Ver Tienda
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        </div>

        {/* Charts and Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart Placeholder */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Ventas Últimos 7 Días</CardTitle>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-1">
                  <option>Últimos 7 días</option>
                  <option>Último mes</option>
                  <option>Último año</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-uniform-neutral-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Gráfico de ventas</p>
                  <p className="text-xs text-gray-400">Chart.js o similar</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Productos Más Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              {topProductsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-uniform-secondary">Cargando productos...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {(topProducts as any)?.length === 0 ? (
                    <div className="text-center text-uniform-secondary py-8">
                      No hay datos de productos vendidos
                    </div>
                  ) : (
                    (topProducts as any)?.map((product: any) => (
                      <div key={product.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-uniform-neutral-900">{product.name}</h4>
                          <p className="text-sm text-uniform-secondary">{product.salesCount} vendidas</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-uniform-neutral-900">${product.revenue}</p>
                          <p className="text-sm text-uniform-accent">+15%</p>
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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pedidos Recientes</CardTitle>
              <Button variant="outline" size="sm">
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentOrdersLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-uniform-secondary">Cargando pedidos...</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(recentOrders as any)?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-uniform-secondary py-8">
                          No hay pedidos recientes
                        </TableCell>
                      </TableRow>
                    ) : (
                      (recentOrders as any)?.map((order: any) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.orderNumber}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-8 h-8 avatar-gradient-2 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-xs font-medium">
                                  {order.customerName?.[0] || 'C'}
                                </span>
                              </div>
                              {order.customerName || order.customerEmail}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="font-medium">${order.total}</TableCell>
                          <TableCell className="text-uniform-secondary">
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
      </div>
    </AdminLayout>
  );
}
