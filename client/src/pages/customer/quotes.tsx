import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CustomerLayout from "@/components/layout/customer-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Search, Calendar, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function CustomerQuotes() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
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
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: quotes, isLoading: quotesLoading } = useQuery({
    queryKey: ["/api/quotes"],
    retry: false,
  });

  if (isLoading || quotesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uniform-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando cotizaciones...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'customer') {
    return null;
  }

  const filteredQuotes = quotes?.filter((quote: any) => 
    quote.quoteNumber?.toLowerCase().includes(search.toLowerCase()) ||
    quote.notes?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleViewQuote = (quote: any) => {
    setSelectedQuote(quote);
    setIsDetailOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="default" className="bg-yellow-500">Pendiente</Badge>;
      case 'accepted':
        return <Badge variant="default" className="bg-green-500">Aceptada</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-500">Rechazada</Badge>;
      case 'expired':
        return <Badge variant="secondary" className="bg-gray-500">Expirada</Badge>;
      default:
        return <Badge variant="secondary">Borrador</Badge>;
    }
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  const parseItems = (itemsJson: string) => {
    try {
      return JSON.parse(itemsJson || '[]');
    } catch {
      return [];
    }
  };

  return (
    <CustomerLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-uniform-neutral-900">Mis Cotizaciones</h1>
          <p className="text-uniform-secondary mt-2">Revisa el estado de tus solicitudes de presupuesto</p>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-uniform-neutral-900 mb-2">
                  Buscar cotizaciones
                </label>
                <div className="relative">
                  <Input
                    placeholder="Buscar por número o notas..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-uniform-secondary h-4 w-4" />
                </div>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Solicitar Nueva Cotización
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-uniform-neutral-900">{quotes?.length || 0}</div>
                <div className="text-sm text-uniform-secondary">Total</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-uniform-neutral-900">
                  {quotes?.filter((q: any) => q.status === 'pending').length || 0}
                </div>
                <div className="text-sm text-uniform-secondary">Pendientes</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-uniform-neutral-900">
                  {quotes?.filter((q: any) => q.status === 'accepted').length || 0}
                </div>
                <div className="text-sm text-uniform-secondary">Aceptadas</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-uniform-neutral-900">
                  {quotes?.reduce((sum: number, q: any) => sum + (parseFloat(q.total || '0')), 0).toLocaleString('es-MX', {
                    style: 'currency',
                    currency: 'MXN'
                  })}
                </div>
                <div className="text-sm text-uniform-secondary">Valor Total</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quotes Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Cotizaciones ({filteredQuotes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-uniform-secondary py-8">
                        No tienes cotizaciones que coincidan con la búsqueda
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredQuotes.map((quote: any) => (
                      <TableRow key={quote.id}>
                        <TableCell>
                          <div className="font-medium">{quote.quoteNumber}</div>
                          <div className="text-sm text-uniform-secondary">ID: {quote.id}</div>
                        </TableCell>
                        <TableCell className="text-uniform-secondary">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(quote.status || 'draft')}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {parseItems(quote.items).length} productos
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(quote.total || 0)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewQuote(quote)}
                              data-testid={`button-view-quote-${quote.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`/api/quotes/${quote.id}/pdf`, '_blank')}
                              data-testid={`button-download-quote-${quote.id}`}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quote Detail Modal */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                Cotización {selectedQuote?.quoteNumber}
              </DialogTitle>
            </DialogHeader>
            {selectedQuote && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Información General</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-uniform-secondary">Número:</span>
                        <span className="font-medium">{selectedQuote.quoteNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-uniform-secondary">Fecha:</span>
                        <span className="font-medium">
                          {selectedQuote.createdAt ? new Date(selectedQuote.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-uniform-secondary">Estado:</span>
                        {getStatusBadge(selectedQuote.status || 'draft')}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Totales</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-uniform-secondary">Subtotal:</span>
                        <span className="font-medium">{formatCurrency(selectedQuote.subtotal || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-uniform-secondary">Impuestos:</span>
                        <span className="font-medium">{formatCurrency(selectedQuote.tax || 0)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>{formatCurrency(selectedQuote.total || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedQuote.notes && (
                  <div>
                    <h3 className="font-semibold mb-3">Notas</h3>
                    <p className="text-uniform-secondary bg-gray-50 p-4 rounded-lg">
                      {selectedQuote.notes}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-3">Productos Cotizados</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Producto</TableHead>
                          <TableHead>Cantidad</TableHead>
                          <TableHead>Talla</TableHead>
                          <TableHead>Color</TableHead>
                          <TableHead>Precio Unit.</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parseItems(selectedQuote.items).map((item: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.productName}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.size}</TableCell>
                            <TableCell>{item.color}</TableCell>
                            <TableCell>{formatCurrency(item.unitPrice || 0)}</TableCell>
                            <TableCell className="font-medium">{formatCurrency(item.total || 0)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline"
                    onClick={() => window.open(`/api/quotes/${selectedQuote.id}/pdf`, '_blank')}
                    data-testid="button-download-pdf-modal"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </Button>
                  <Button className="bg-uniform-primary hover:bg-blue-700">
                    Contactar Vendedor
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </CustomerLayout>
  );
}