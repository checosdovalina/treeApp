import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, TrendingUp, DollarSign, Package, Users, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminReports() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState("7days");
  const [reportType, setReportType] = useState("sales");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: topProducts } = useQuery({
    queryKey: ['/api/dashboard/top-products', { limit: 10 }],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  // Mock sales data for demonstration
  const salesData = [
    { date: '2024-01-15', sales: 2450, orders: 12, avgTicket: 204.17 },
    { date: '2024-01-14', sales: 1890, orders: 8, avgTicket: 236.25 },
    { date: '2024-01-13', sales: 3200, orders: 15, avgTicket: 213.33 },
    { date: '2024-01-12', sales: 1650, orders: 6, avgTicket: 275.00 },
    { date: '2024-01-11', sales: 2800, orders: 11, avgTicket: 254.55 },
    { date: '2024-01-10', sales: 2100, orders: 9, avgTicket: 233.33 },
    { date: '2024-01-09', sales: 1750, orders: 7, avgTicket: 250.00 },
  ];

  const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const avgTicket = totalSales / totalOrders;

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-uniform-neutral-900">Reportes y Analíticas</h1>
            <p className="text-uniform-secondary mt-2">Estadísticas detalladas de ventas y rendimiento</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Reporte
            </Button>
            <Button className="bg-uniform-primary hover:bg-blue-700">
              <Calendar className="h-4 w-4 mr-2" />
              Programar Reporte
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-uniform-neutral-900 mb-2">
                  Período de Tiempo
                </label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Últimos 7 días</SelectItem>
                    <SelectItem value="30days">Últimos 30 días</SelectItem>
                    <SelectItem value="3months">Últimos 3 meses</SelectItem>
                    <SelectItem value="year">Este año</SelectItem>
                    <SelectItem value="custom">Período personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-uniform-neutral-900 mb-2">
                  Tipo de Reporte
                </label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Ventas</SelectItem>
                    <SelectItem value="products">Productos</SelectItem>
                    <SelectItem value="customers">Clientes</SelectItem>
                    <SelectItem value="inventory">Inventario</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button className="w-full bg-uniform-primary hover:bg-blue-700">
                  Generar Reporte
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-uniform-secondary">Ventas Totales</p>
                  <p className="text-2xl font-bold text-uniform-neutral-900">${totalSales.toLocaleString()}</p>
                  <p className="text-sm text-uniform-accent mt-1">+15% vs período anterior</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-uniform-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-uniform-secondary">Pedidos</p>
                  <p className="text-2xl font-bold text-uniform-neutral-900">{totalOrders}</p>
                  <p className="text-sm text-blue-600 mt-1">+8% vs período anterior</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-uniform-secondary">Ticket Promedio</p>
                  <p className="text-2xl font-bold text-uniform-neutral-900">${avgTicket.toFixed(2)}</p>
                  <p className="text-sm text-uniform-accent mt-1">+5% vs período anterior</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-uniform-secondary">Clientes Activos</p>
                  <p className="text-2xl font-bold text-uniform-neutral-900">{stats?.totalCustomers || 0}</p>
                  <p className="text-sm text-orange-600 mt-1">+12% vs período anterior</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Ventas por Día</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-uniform-neutral-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Gráfico de ventas diarias</p>
                  <p className="text-xs text-gray-400">Chart.js o Recharts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Products by Revenue */}
          <Card>
            <CardHeader>
              <CardTitle>Productos Más Rentables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts?.slice(0, 5).map((product: any, index: number) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-uniform-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-uniform-secondary">{product.salesCount} unidades vendidas</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${product.revenue}</div>
                      <div className="text-sm text-uniform-accent">+{Math.floor(Math.random() * 20 + 5)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Detail Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detalle de Ventas por Día</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Ventas</TableHead>
                  <TableHead>Pedidos</TableHead>
                  <TableHead>Ticket Promedio</TableHead>
                  <TableHead>Variación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesData.map((day, index) => {
                  const prevDay = salesData[index + 1];
                  const variation = prevDay ? ((day.sales - prevDay.sales) / prevDay.sales) * 100 : 0;
                  
                  return (
                    <TableRow key={day.date}>
                      <TableCell>{new Date(day.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">${day.sales.toLocaleString()}</TableCell>
                      <TableCell>{day.orders}</TableCell>
                      <TableCell>${day.avgTicket.toFixed(2)}</TableCell>
                      <TableCell>
                        {prevDay && (
                          <Badge variant={variation >= 0 ? "default" : "destructive"}>
                            {variation >= 0 ? "+" : ""}{variation.toFixed(1)}%
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
