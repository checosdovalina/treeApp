import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ShoppingCart, Package, Users, Store, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboardSimple() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();

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

  const getMessageStatusBadge = (isRead: boolean) => {
    return isRead ? (
      <Badge variant="outline">Leído</Badge>
    ) : (
      <Badge variant="default">Nuevo</Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uniform-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Acceso Denegado</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No tienes permisos para acceder a esta página.</p>
            <Button 
              onClick={() => window.location.href = '/auth/login'} 
              className="mt-4 w-full"
            >
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-3 sm:p-4 lg:p-6">
        {/* Page Header */}
        <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-uniform-neutral-900">Dashboard Administrativo</h1>
            <p className="text-uniform-secondary mt-1 sm:mt-2 text-sm sm:text-base">Bienvenido, {user.firstName} {user.lastName}</p>
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-uniform-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">Sistema en desarrollo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
              <ShoppingCart className="h-4 w-4 text-uniform-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Nuevos pedidos hoy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos</CardTitle>
              <Package className="h-4 w-4 text-uniform-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Varios</div>
              <p className="text-xs text-muted-foreground">Productos disponibles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes</CardTitle>
              <Users className="h-4 w-4 text-uniform-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1+</div>
              <p className="text-xs text-muted-foreground">Usuario administrador activo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensajes de Contacto</CardTitle>
              <Mail className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {unreadMessagesLoading ? "0" : String((unreadMessagesCount as any)?.count || 0)}
              </div>
              <p className="text-xs text-muted-foreground">nuevos sin leer</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Gestión de Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Administra tu catálogo de uniformes</p>
              <Button 
                onClick={() => window.location.href = '/admin/products'}
                className="w-full text-sm sm:text-base"
                data-testid="button-manage-products"
              >
                Ver Productos
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Pedidos y Ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Revisa pedidos y genera reportes</p>
              <Button 
                onClick={() => window.location.href = '/admin/orders'}
                className="w-full text-sm sm:text-base"
                data-testid="button-manage-orders"
              >
                Ver Pedidos
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Cotizaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Gestiona cotizaciones de clientes</p>
              <Button 
                onClick={() => window.location.href = '/admin/quotes'}
                className="w-full text-sm sm:text-base"
                data-testid="button-manage-quotes"
              >
                Ver Cotizaciones
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Messages */}
        <Card className="mt-4 lg:mt-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-base sm:text-lg">Mensajes de Contacto Recientes</CardTitle>
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