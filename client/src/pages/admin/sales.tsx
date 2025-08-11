import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Calendar,
  Eye,
  Plus,
  Download,
  Search,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  FileText,
  Send,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";

interface SalesSummary {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  salesGrowth: number;
  topProducts: Array<{
    id: number;
    name: string;
    totalSold: number;
    revenue: number;
  }>;
  salesByPeriod: Array<{
    period: string;
    sales: number;
    orders: number;
  }>;
  salesByCategory: Array<{
    category: string;
    sales: number;
    percentage: number;
  }>;
}

export default function AdminSales() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState("30days");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateSaleOpen, setIsCreateSaleOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "No autorizado",
        description: "Debes iniciar sesión para acceder.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch sales summary with date range
  const { data: salesSummary, isLoading: summaryLoading } = useQuery<SalesSummary>({
    queryKey: ['/api/sales/summary', { dateRange }],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  // Fetch orders with filters
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/orders', { status: statusFilter, search: searchTerm, limit: 100 }],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  // Fetch quotes
  const { data: quotes, isLoading: quotesLoading } = useQuery({
    queryKey: ['/api/quotes', { limit: 50 }],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return await apiRequest('POST', '/api/orders', orderData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sales/summary'] });
      toast({
        title: "Pedido creado",
        description: "El pedido ha sido creado correctamente.",
      });
      setIsCreateSaleOpen(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "No autorizado",
          description: "Sesión expirada. Redirigiendo...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "No se pudo crear el pedido.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendiente', variant: 'secondary' as const, icon: Clock },
      processing: { label: 'Procesando', variant: 'default' as const, icon: AlertCircle },
      shipped: { label: 'Enviado', variant: 'outline' as const, icon: ShoppingCart },
      delivered: { label: 'Entregado', variant: 'default' as const, icon: CheckCircle },
      cancelled: { label: 'Cancelado', variant: 'destructive' as const, icon: XCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const filteredOrders = (orders && Array.isArray(orders)) ? orders.filter((order: any) => {
    const matchesSearch = searchTerm === "" || 
      (order.orderNumber && order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customerEmail && order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) : [];

  return (
    <AdminLayout>
      <div className="p-6 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-uniform-neutral-900">Centro de Ventas</h1>
            <p className="text-uniform-secondary mt-2">Gestiona pedidos, cotizaciones y analiza el rendimiento de ventas</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setIsCreateSaleOpen(true)}
              className="bg-uniform-blue hover:bg-uniform-blue/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Pedido
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Date Range Selector */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Período de análisis</CardTitle>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Últimos 7 días</SelectItem>
                  <SelectItem value="30days">Últimos 30 días</SelectItem>
                  <SelectItem value="90days">Últimos 90 días</SelectItem>
                  <SelectItem value="1year">Último año</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        {/* Sales Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-uniform-secondary">Ventas Totales</p>
                  <h3 className="text-2xl font-bold text-uniform-neutral-900">
                    {formatCurrency(salesSummary?.totalSales || 0)}
                  </h3>
                  {salesSummary?.salesGrowth && (
                    <p className="text-sm text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +{salesSummary.salesGrowth}%
                    </p>
                  )}
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-uniform-secondary">Pedidos Totales</p>
                  <h3 className="text-2xl font-bold text-uniform-neutral-900">
                    {salesSummary?.totalOrders || 0}
                  </h3>
                  <p className="text-sm text-uniform-secondary">
                    Este período
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-uniform-secondary">Ticket Promedio</p>
                  <h3 className="text-2xl font-bold text-uniform-neutral-900">
                    {formatCurrency(salesSummary?.averageOrderValue || 0)}
                  </h3>
                  <p className="text-sm text-uniform-secondary">
                    Por pedido
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-uniform-secondary">Cotizaciones</p>
                  <h3 className="text-2xl font-bold text-uniform-neutral-900">
                    {quotes?.length || 0}
                  </h3>
                  <p className="text-sm text-uniform-secondary">
                    Activas
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
            <TabsTrigger value="quotes">Cotizaciones</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle>Gestión de Pedidos</CardTitle>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar pedidos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="pending">Pendientes</SelectItem>
                        <SelectItem value="processing">Procesando</SelectItem>
                        <SelectItem value="shipped">Enviados</SelectItem>
                        <SelectItem value="delivered">Entregados</SelectItem>
                        <SelectItem value="cancelled">Cancelados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="text-center py-8">Cargando pedidos...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Número</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-uniform-secondary">
                              No se encontraron pedidos
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredOrders.map((order: any) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">
                                {order.orderNumber}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{order.customerName}</div>
                                  <div className="text-sm text-uniform-secondary">{order.customerEmail}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {new Date(order.createdAt).toLocaleDateString('es-MX')}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(order.status)}
                              </TableCell>
                              <TableCell className="font-medium">
                                {formatCurrency(parseFloat(order.total))}
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setIsDetailOpen(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Ver
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
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Productos Más Vendidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {salesSummary?.topProducts ? (
                    <div className="space-y-4">
                      {salesSummary.topProducts.slice(0, 5).map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-uniform-blue text-white rounded-lg flex items-center justify-center font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-uniform-secondary">
                                {product.totalSold} vendidos
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(product.revenue)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-uniform-secondary text-center py-8">
                      No hay datos disponibles
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Ventas por Categoría
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {salesSummary?.salesByCategory ? (
                    <div className="space-y-4">
                      {salesSummary.salesByCategory.map((category) => (
                        <div key={category.category} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{category.category}</span>
                            <span className="text-sm text-uniform-secondary">
                              {category.percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-uniform-blue h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${category.percentage}%` }}
                            />
                          </div>
                          <div className="text-sm text-uniform-secondary">
                            {formatCurrency(category.sales)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-uniform-secondary text-center py-8">
                      No hay datos disponibles
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Quotes Tab */}
          <TabsContent value="quotes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cotizaciones Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                {quotesLoading ? (
                  <div className="text-center py-8">Cargando cotizaciones...</div>
                ) : quotes && Array.isArray(quotes) && quotes.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Número</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Empresa</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Fecha</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {quotes.slice(0, 10).map((quote: any) => (
                          <TableRow key={quote.id}>
                            <TableCell className="font-medium">
                              {quote.quoteNumber}
                            </TableCell>
                            <TableCell>{quote.customerName}</TableCell>
                            <TableCell>{quote.customerCompany || '-'}</TableCell>
                            <TableCell>{formatCurrency(parseFloat(quote.total))}</TableCell>
                            <TableCell>
                              <Badge variant={quote.status === 'sent' ? 'default' : 'secondary'}>
                                {quote.status === 'draft' ? 'Borrador' : 
                                 quote.status === 'sent' ? 'Enviado' : 
                                 quote.status === 'accepted' ? 'Aceptado' : 'Expirado'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(quote.createdAt).toLocaleDateString('es-MX')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-uniform-secondary text-center py-8">
                    No hay cotizaciones disponibles
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reportes de Ventas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Download className="h-6 w-6 mb-2" />
                    Reporte Mensual
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    Análisis de Productos
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Users className="h-6 w-6 mb-2" />
                    Reporte de Clientes
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    Tendencias de Ventas
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Calendar className="h-6 w-6 mb-2" />
                    Reporte Personalizado
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <FileText className="h-6 w-6 mb-2" />
                    Inventario vs Ventas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Order Detail Modal */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalle del Pedido #{selectedOrder?.orderNumber}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Información del Cliente</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Nombre:</span> {selectedOrder.customerName}</p>
                      <p><span className="font-medium">Email:</span> {selectedOrder.customerEmail}</p>
                      <p><span className="font-medium">Teléfono:</span> {selectedOrder.customerPhone || 'No proporcionado'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Información del Pedido</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Estado:</span> {getStatusBadge(selectedOrder.status)}</p>
                      <p><span className="font-medium">Fecha:</span> {new Date(selectedOrder.createdAt).toLocaleDateString('es-MX')}</p>
                      <p><span className="font-medium">Total:</span> {formatCurrency(parseFloat(selectedOrder.total))}</p>
                    </div>
                  </div>
                </div>
                {selectedOrder.notes && (
                  <div>
                    <h3 className="font-semibold mb-2">Notas</h3>
                    <p className="text-uniform-secondary bg-gray-50 p-3 rounded-lg">
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Sale Modal */}
        <Dialog open={isCreateSaleOpen} onOpenChange={setIsCreateSaleOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Pedido</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-uniform-secondary">
                Funcionalidad de creación de pedidos en desarrollo. 
                Por ahora los pedidos se crean desde la tienda online.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateSaleOpen(false)}>
                  Cancelar
                </Button>
                <Button disabled>
                  Crear Pedido
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}