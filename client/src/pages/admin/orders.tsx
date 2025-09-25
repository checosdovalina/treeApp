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
import { Eye, Search, Filter, Download } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function AdminOrders() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/orders', { status, limit: 50 }],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest('PUT', `/api/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Estado actualizado",
        description: "El estado del pedido ha sido actualizado correctamente.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del pedido.",
        variant: "destructive",
      });
    },
  });

  const { data: orderDetail } = useQuery<any>({
    queryKey: [`/api/orders/${selectedOrder?.id}`],
    enabled: !!selectedOrder?.id,
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

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  const handleDownloadPDF = async (orderId: number, orderNumber: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/pdf`);
      if (!response.ok) {
        throw new Error('Error al generar PDF');
      }
      
      const htmlContent = await response.text();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `pedido-${orderNumber}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "PDF descargado",
        description: "El PDF del pedido se ha descargado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo descargar el PDF del pedido.",
        variant: "destructive",
      });
    }
  };

  const filteredOrders = orders?.filter((order: any) => 
    order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    order.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    order.customerEmail?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-uniform-neutral-900">Gestión de Pedidos</h1>
          <p className="text-uniform-secondary mt-2">Administra todos los pedidos de la tienda</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-uniform-neutral-900 mb-2">
                  Buscar pedidos
                </label>
                <div className="relative">
                  <Input
                    placeholder="Buscar por número, cliente..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-uniform-secondary h-4 w-4" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-uniform-neutral-900 mb-2">
                  Estado
                </label>
                <Select value={status || "all"} onValueChange={(value) => setStatus(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="processing">Procesando</SelectItem>
                    <SelectItem value="shipped">Enviado</SelectItem>
                    <SelectItem value="delivered">Entregado</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros Avanzados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Pedidos ({filteredOrders?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-uniform-secondary">Cargando pedidos...</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-uniform-secondary py-8">
                          No hay pedidos que coincidan con los filtros
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders?.map((order: any) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.orderNumber}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.customerName || "Cliente Invitado"}</div>
                              <div className="text-sm text-uniform-secondary">{order.customerEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={order.status} 
                              onValueChange={(value) => handleStatusChange(order.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pendiente</SelectItem>
                                <SelectItem value="processing">Procesando</SelectItem>
                                <SelectItem value="shipped">Enviado</SelectItem>
                                <SelectItem value="delivered">Entregado</SelectItem>
                                <SelectItem value="cancelled">Cancelado</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="font-medium">${order.total}</TableCell>
                          <TableCell className="text-uniform-secondary">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewOrder(order)}
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

        {/* Order Detail Modal */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="shrink-0">
              <DialogTitle>
                Detalle del Pedido {selectedOrder?.orderNumber}
              </DialogTitle>
            </DialogHeader>
            {orderDetail && (
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-6 p-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Información del Cliente</h3>
                      <div className="space-y-1">
                        <p><strong>Nombre:</strong> {orderDetail.customerName || "No especificado"}</p>
                        <p><strong>Email:</strong> {orderDetail.customerEmail}</p>
                        <p><strong>Teléfono:</strong> {orderDetail.customerPhone || "No especificado"}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Información del Pedido</h3>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <strong>Estado:</strong> 
                          {getStatusBadge(orderDetail.status)}
                        </div>
                        <p><strong>Fecha:</strong> {new Date(orderDetail.createdAt).toLocaleString()}</p>
                        <p><strong>Total:</strong> ${orderDetail.total}</p>
                      </div>
                    </div>
                  </div>
                  
                  {orderDetail.shippingAddress && (
                    <div>
                      <h3 className="font-semibold mb-2">Dirección de Envío</h3>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p>{JSON.stringify(orderDetail.shippingAddress)}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Productos</h3>
                      {selectedOrder && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadPDF(selectedOrder.id, selectedOrder.orderNumber)}
                          className="flex items-center space-x-2"
                        >
                          <Download className="h-4 w-4" />
                          <span>Descargar PDF</span>
                        </Button>
                      )}
                    </div>
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Precio Unit.</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orderDetail.items?.map((item: any) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{item.productName}</div>
                                  <div className="text-sm text-uniform-secondary">
                                    {item.size && `Talla: ${item.size}`} {item.color && `Color: ${item.color}`}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>${item.unitPrice}</TableCell>
                              <TableCell>${item.totalPrice}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-end">
                      <div className="text-right space-y-1">
                        <p><strong>Subtotal:</strong> ${orderDetail.subtotal || orderDetail.total}</p>
                        <p><strong>Envío:</strong> ${orderDetail.shipping || "0.00"}</p>
                        <p><strong>Impuestos:</strong> ${orderDetail.tax || "0.00"}</p>
                        <p className="text-lg font-bold border-t pt-1">
                          <strong>Total:</strong> ${orderDetail.total}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
