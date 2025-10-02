import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye, Download, Send, Edit, Save, X } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function AdminQuotes() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuote, setEditingQuote] = useState<any>(null);

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

  const { data: quotes, isLoading: quotesLoading } = useQuery({
    queryKey: ['/api/quotes'],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Borrador', variant: 'secondary' as const },
      sent: { label: 'Enviado', variant: 'default' as const },
      accepted: { label: 'Aceptado', variant: 'default' as const },
      expired: { label: 'Expirado', variant: 'destructive' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleViewQuote = (quote: any) => {
    setSelectedQuote(quote);
    setIsDetailOpen(true);
  };

  const handleEditQuote = (quote: any) => {
    setEditingQuote({ ...quote });
    setIsEditing(true);
  };

  const updateQuoteMutation = useMutation({
    mutationFn: async (data: { id: number; updates: any }) => {
      return await apiRequest('PUT', `/api/quotes/${data.id}`, data.updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quotes'] });
      setIsEditing(false);
      setEditingQuote(null);
      toast({
        title: "Presupuesto actualizado",
        description: "Los cambios se han guardado correctamente.",
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
        description: "No se pudo actualizar el presupuesto.",
        variant: "destructive",
      });
    },
  });

  const handleSaveQuote = () => {
    if (!editingQuote) return;
    
    updateQuoteMutation.mutate({
      id: editingQuote.id,
      updates: {
        customerName: editingQuote.customerName,
        customerEmail: editingQuote.customerEmail,
        customerCompany: editingQuote.customerCompany,
        items: editingQuote.items,
        subtotal: editingQuote.subtotal,
        tax: editingQuote.tax,
        total: editingQuote.total,
        status: editingQuote.status,
        notes: editingQuote.notes,
        validUntil: editingQuote.validUntil ? new Date(editingQuote.validUntil) : null,
      },
    });
  };

  // Mock quotes data for demonstration
  const mockQuotes = [
    {
      id: 1,
      quoteNumber: 'QT-2024-001',
      customerName: 'Empresa Corporativa SA',
      customerEmail: 'compras@corporativa.com',
      status: 'sent',
      total: '15,500.00',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      items: [
        { productName: 'Camisa Ejecutiva Blanca', quantity: 50, unitPrice: '150.00', total: '7,500.00' },
        { productName: 'Pantalón Formal Negro', quantity: 50, unitPrice: '180.00', total: '9,000.00' },
      ]
    },
    {
      id: 2,
      quoteNumber: 'QT-2024-002',
      customerName: 'Hospital San José',
      customerEmail: 'administracion@hsj.com',
      status: 'draft',
      total: '8,400.00',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      items: [
        { productName: 'Uniforme Médico Azul', quantity: 30, unitPrice: '280.00', total: '8,400.00' },
      ]
    }
  ];

  const displayQuotes = quotes?.length ? quotes : mockQuotes;

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-uniform-neutral-900">Presupuestos y Cotizaciones</h1>
            <p className="text-uniform-secondary mt-2">Gestiona cotizaciones para clientes corporativos</p>
          </div>
          <Button 
            className="bg-uniform-primary hover:bg-blue-700"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Presupuesto
          </Button>
        </div>

        {/* Quote Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-uniform-neutral-900">{displayQuotes.length}</div>
                <div className="text-sm text-uniform-secondary">Total Presupuestos</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-uniform-neutral-900">
                  {displayQuotes.filter((q: any) => q.status === 'sent').length}
                </div>
                <div className="text-sm text-uniform-secondary">Enviados</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-uniform-neutral-900">
                  {displayQuotes.filter((q: any) => q.status === 'accepted').length}
                </div>
                <div className="text-sm text-uniform-secondary">Aceptados</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-uniform-accent">
                  ${displayQuotes.reduce((sum: number, q: any) => sum + parseFloat(q.total), 0).toLocaleString()}
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
              Presupuestos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {quotesLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-uniform-secondary">Cargando presupuestos...</div>
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
                      <TableHead>Válido Hasta</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayQuotes?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-uniform-secondary py-8">
                          No hay presupuestos creados
                        </TableCell>
                      </TableRow>
                    ) : (
                      displayQuotes?.map((quote: any) => (
                        <TableRow key={quote.id}>
                          <TableCell className="font-medium">{quote.quoteNumber}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{quote.customerName || `Cliente ID: ${quote.customerId}`}</div>
                              <div className="text-sm text-uniform-secondary">{quote.customerEmail || 'Email no disponible'}</div>
                              {quote.customerCompany && (
                                <div className="text-xs text-uniform-secondary">{quote.customerCompany}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(quote.status)}</TableCell>
                          <TableCell className="font-medium">${quote.total}</TableCell>
                          <TableCell className="text-uniform-secondary">
                            {new Date(quote.validUntil).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-uniform-secondary">
                            {new Date(quote.createdAt).toLocaleDateString()}
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
                                onClick={() => handleEditQuote(quote)}
                                data-testid={`button-edit-quote-${quote.id}`}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`/api/quotes/${quote.id}/pdf`, '_blank')}
                                data-testid={`button-download-quote-${quote.id}`}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                data-testid={`button-send-quote-${quote.id}`}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
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

        {/* Quote Detail Modal */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                Presupuesto {selectedQuote?.quoteNumber}
              </DialogTitle>
            </DialogHeader>
            {selectedQuote && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Información del Cliente</h3>
                    <div className="space-y-2">
                      <p><strong>Cliente:</strong> {selectedQuote.customerName || `Cliente ID: ${selectedQuote.customerId}`}</p>
                      <p><strong>Email:</strong> {selectedQuote.customerEmail || 'Email no disponible'}</p>
                      {selectedQuote.customerCompany && (
                        <p><strong>Empresa:</strong> {selectedQuote.customerCompany}</p>
                      )}
                      <p><strong>Estado:</strong> {getStatusBadge(selectedQuote.status)}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Información del Presupuesto</h3>
                    <div className="space-y-2">
                      <p><strong>Número:</strong> {selectedQuote.quoteNumber}</p>
                      <p><strong>Fecha:</strong> {new Date(selectedQuote.createdAt).toLocaleDateString()}</p>
                      <p><strong>Válido hasta:</strong> {selectedQuote.validUntil ? new Date(selectedQuote.validUntil).toLocaleDateString() : 'No definido'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Productos Cotizados</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio Unitario</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedQuote.items?.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.productName}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.unitPrice}</TableCell>
                          <TableCell>${item.total}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-end">
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        Total: ${selectedQuote.total}
                      </div>
                      <div className="text-sm text-uniform-secondary">
                        IVA incluido
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline"
                    onClick={() => window.open(`/api/quotes/${selectedQuote.id}/pdf`, '_blank')}
                    data-testid="button-download-pdf"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </Button>
                  <Button variant="outline">
                    <Send className="h-4 w-4 mr-2" />
                    Enviar por Email
                  </Button>
                  <Button 
                    className="bg-uniform-primary hover:bg-blue-700"
                    onClick={() => handleEditQuote(selectedQuote)}
                    data-testid="button-edit-quote-modal"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Presupuesto
                  </Button>
                </div>

                {selectedQuote.notes && (
                  <div>
                    <h3 className="font-semibold mb-3">Notas del Administrador</h3>
                    <p className="text-sm text-uniform-secondary bg-gray-50 p-3 rounded-md">{selectedQuote.notes}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Quote Edit Modal */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Presupuesto {editingQuote?.quoteNumber}</DialogTitle>
            </DialogHeader>
            {editingQuote && (
              <div className="space-y-4">
                {/* Customer Information */}
                <div>
                  <h3 className="font-semibold mb-3">Información del Cliente</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Nombre del Cliente</label>
                      <Input
                        value={editingQuote.customerName || ''}
                        onChange={(e) => setEditingQuote({...editingQuote, customerName: e.target.value})}
                        placeholder="Nombre o empresa"
                        data-testid="input-customer-name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        type="email"
                        value={editingQuote.customerEmail || ''}
                        onChange={(e) => setEditingQuote({...editingQuote, customerEmail: e.target.value})}
                        placeholder="cliente@ejemplo.com"
                        data-testid="input-customer-email"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium">Empresa</label>
                      <Input
                        value={editingQuote.customerCompany || ''}
                        onChange={(e) => setEditingQuote({...editingQuote, customerCompany: e.target.value})}
                        placeholder="Nombre de la empresa (opcional)"
                        data-testid="input-customer-company"
                      />
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div>
                  <h3 className="font-semibold mb-3">Productos del Presupuesto</h3>
                  <div className="space-y-2">
                    {editingQuote.items?.map((item: any, index: number) => (
                      <div key={index} className="grid grid-cols-6 gap-2 items-end bg-gray-50 p-3 rounded-md">
                        <div className="col-span-2">
                          <label className="text-xs font-medium">Producto</label>
                          <Input
                            value={item.productName || ''}
                            onChange={(e) => {
                              const newItems = [...editingQuote.items];
                              newItems[index].productName = e.target.value;
                              setEditingQuote({...editingQuote, items: newItems});
                            }}
                            placeholder="Nombre del producto"
                            data-testid={`input-item-name-${index}`}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium">Cantidad</label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity || 1}
                            onChange={(e) => {
                              const newItems = [...editingQuote.items];
                              newItems[index].quantity = parseInt(e.target.value) || 1;
                              newItems[index].total = (newItems[index].quantity * parseFloat(newItems[index].unitPrice || '0')).toFixed(2);
                              
                              // Recalculate totals
                              const subtotal = newItems.reduce((sum, i) => sum + parseFloat(i.total || '0'), 0);
                              const tax = subtotal * 0.16;
                              const total = subtotal + tax;
                              
                              setEditingQuote({
                                ...editingQuote, 
                                items: newItems,
                                subtotal: subtotal.toFixed(2),
                                tax: tax.toFixed(2),
                                total: total.toFixed(2)
                              });
                            }}
                            data-testid={`input-item-quantity-${index}`}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium">Precio Unit.</label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice || '0'}
                            onChange={(e) => {
                              const newItems = [...editingQuote.items];
                              newItems[index].unitPrice = e.target.value;
                              newItems[index].total = (newItems[index].quantity * parseFloat(e.target.value || '0')).toFixed(2);
                              
                              // Recalculate totals
                              const subtotal = newItems.reduce((sum, i) => sum + parseFloat(i.total || '0'), 0);
                              const tax = subtotal * 0.16;
                              const total = subtotal + tax;
                              
                              setEditingQuote({
                                ...editingQuote, 
                                items: newItems,
                                subtotal: subtotal.toFixed(2),
                                tax: tax.toFixed(2),
                                total: total.toFixed(2)
                              });
                            }}
                            data-testid={`input-item-price-${index}`}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium">Total</label>
                          <Input
                            value={`$${item.total || '0.00'}`}
                            disabled
                            className="bg-gray-100"
                            data-testid={`text-item-total-${index}`}
                          />
                        </div>
                        <div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const newItems = editingQuote.items.filter((_: any, i: number) => i !== index);
                              const subtotal = newItems.reduce((sum: number, i: any) => sum + parseFloat(i.total || '0'), 0);
                              const tax = subtotal * 0.16;
                              const total = subtotal + tax;
                              
                              setEditingQuote({
                                ...editingQuote, 
                                items: newItems,
                                subtotal: subtotal.toFixed(2),
                                tax: tax.toFixed(2),
                                total: total.toFixed(2)
                              });
                            }}
                            data-testid={`button-remove-item-${index}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newItems = [...(editingQuote.items || []), { 
                          productName: '', 
                          quantity: 1, 
                          unitPrice: '0', 
                          total: '0' 
                        }];
                        setEditingQuote({...editingQuote, items: newItems});
                      }}
                      data-testid="button-add-item"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Producto
                    </Button>
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span className="font-medium">${editingQuote.subtotal || '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>IVA (16%):</span>
                      <span className="font-medium">${editingQuote.tax || '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span className="text-uniform-primary">${editingQuote.total || '0.00'}</span>
                    </div>
                  </div>
                </div>

                {/* Status and Validity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Estado</label>
                    <Select 
                      value={editingQuote.status} 
                      onValueChange={(value) => setEditingQuote({...editingQuote, status: value})}
                    >
                      <SelectTrigger data-testid="select-quote-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Borrador</SelectItem>
                        <SelectItem value="sent">Enviado</SelectItem>
                        <SelectItem value="accepted">Aceptado</SelectItem>
                        <SelectItem value="expired">Expirado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Válido hasta</label>
                    <Input
                      type="date"
                      value={editingQuote.validUntil ? new Date(editingQuote.validUntil).toISOString().split('T')[0] : ''}
                      onChange={(e) => setEditingQuote({...editingQuote, validUntil: e.target.value})}
                      data-testid="input-valid-until"
                    />
                  </div>
                </div>
                
                {/* Notes */}
                <div>
                  <label className="text-sm font-medium">Notas para el cliente</label>
                  <Textarea
                    placeholder="Agregar notas que el cliente podrá ver..."
                    value={editingQuote.notes || ''}
                    onChange={(e) => setEditingQuote({...editingQuote, notes: e.target.value})}
                    className="mt-1"
                    rows={4}
                    data-testid="textarea-customer-notes"
                  />
                  <p className="text-xs text-uniform-secondary mt-1">
                    Estas notas serán visibles para el cliente cuando vea el presupuesto
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    data-testid="button-cancel-edit"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSaveQuote}
                    disabled={updateQuoteMutation.isPending}
                    className="bg-uniform-primary hover:bg-blue-700"
                    data-testid="button-save-quote"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateQuoteMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Quote Modal */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Nuevo Presupuesto
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre de la Empresa</label>
                  <Input placeholder="Ej: Corporativo ABC SA" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email de Contacto</label>
                  <Input type="email" placeholder="contacto@empresa.com" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Productos</label>
                <div className="text-center text-uniform-secondary py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  Funcionalidad de agregar productos disponible próximamente
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-uniform-primary hover:bg-blue-700">
                  Crear Presupuesto
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
