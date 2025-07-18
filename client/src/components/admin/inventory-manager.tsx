import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Package, Plus, Edit, Trash2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface InventoryItem {
  id: number;
  productId: number;
  size: string;
  color: string;
  quantity: number;
  reservedQuantity: number;
  product?: {
    name: string;
    price: string;
  };
}

interface InventoryManagerProps {
  productId: number;
  productName: string;
}

export default function InventoryManager({ productId, productName }: InventoryManagerProps) {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newQuantity, setNewQuantity] = useState("");

  const { data: inventory, isLoading } = useQuery({
    queryKey: ['/api/inventory', productId],
    queryFn: () => apiRequest('GET', `/api/inventory?productId=${productId}`),
  });

  const createInventoryMutation = useMutation({
    mutationFn: async (data: { size: string; color: string; quantity: number }) => {
      return await apiRequest('POST', '/api/inventory', {
        productId,
        ...data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory', productId] });
      toast({
        title: "Inventario actualizado",
        description: "Nueva variante agregada al inventario.",
      });
      setIsFormOpen(false);
      setNewSize("");
      setNewColor("");
      setNewQuantity("");
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
        description: "No se pudo agregar la variante al inventario.",
        variant: "destructive",
      });
    },
  });

  const updateInventoryMutation = useMutation({
    mutationFn: async (data: { id: number; quantity: number }) => {
      return await apiRequest('PUT', `/api/inventory/${data.id}`, {
        quantity: data.quantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory', productId] });
      toast({
        title: "Inventario actualizado",
        description: "La cantidad ha sido actualizada correctamente.",
      });
      setEditingItem(null);
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
        description: "No se pudo actualizar la cantidad.",
        variant: "destructive",
      });
    },
  });

  const deleteInventoryMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('DELETE', `/api/inventory/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory', productId] });
      toast({
        title: "Variante eliminada",
        description: "La variante ha sido eliminada del inventario.",
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
        description: "No se pudo eliminar la variante.",
        variant: "destructive",
      });
    },
  });

  const handleAddVariant = () => {
    if (!newSize || !newColor || !newQuantity) {
      toast({
        title: "Campos incompletos",
        description: "Por favor complete todos los campos.",
        variant: "destructive",
      });
      return;
    }

    createInventoryMutation.mutate({
      size: newSize,
      color: newColor,
      quantity: parseInt(newQuantity),
    });
  };

  const handleUpdateQuantity = (item: InventoryItem, newQuantity: number) => {
    updateInventoryMutation.mutate({
      id: item.id,
      quantity: newQuantity,
    });
  };

  const handleDeleteVariant = (id: number) => {
    if (confirm('¿Está seguro de que desea eliminar esta variante?')) {
      deleteInventoryMutation.mutate(id);
    }
  };

  const getStockStatus = (quantity: number, reserved: number) => {
    const available = quantity - reserved;
    if (available <= 0) {
      return <Badge variant="destructive">Sin stock</Badge>;
    }
    if (available <= 5) {
      return <Badge variant="outline" className="text-orange-600 border-orange-600">Bajo stock</Badge>;
    }
    return <Badge variant="default">En stock</Badge>;
  };

  const totalStock = inventory?.reduce((sum: number, item: InventoryItem) => 
    sum + (item.quantity - item.reservedQuantity), 0) || 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Cargando inventario...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Inventario - {productName}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Total disponible: {totalStock} unidades
            </p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-uniform-primary hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Variante
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nueva Variante</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="size">Talla</Label>
                  <Input
                    id="size"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="Ej: S, M, L, XL"
                  />
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Ej: Blanco, Azul, Negro"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Cantidad</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    placeholder="Cantidad inicial"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAddVariant}
                    disabled={createInventoryMutation.isPending}
                    className="bg-uniform-primary hover:bg-blue-700"
                  >
                    {createInventoryMutation.isPending ? "Agregando..." : "Agregar"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {!inventory || inventory.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay variantes en el inventario</p>
            <p className="text-sm text-gray-400 mb-4">
              Agrega tallas y colores para gestionar el stock
            </p>
            <Button 
              onClick={() => setIsFormOpen(true)}
              className="bg-uniform-primary hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Primera Variante
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {inventory.map((item: InventoryItem) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium">
                      {item.size} - {item.color}
                    </div>
                    {getStockStatus(item.quantity, item.reservedQuantity)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingItem(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteVariant(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Total:</span>
                    <span className="ml-2 font-medium">{item.quantity}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Reservado:</span>
                    <span className="ml-2 font-medium">{item.reservedQuantity}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Disponible:</span>
                    <span className="ml-2 font-medium text-green-600">
                      {item.quantity - item.reservedQuantity}
                    </span>
                  </div>
                </div>
                {item.quantity - item.reservedQuantity <= 5 && (
                  <div className="mt-2 flex items-center text-orange-600 text-sm">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Stock bajo - considerar reabastecer
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quick Edit Dialog */}
        {editingItem && (
          <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Actualizar Stock - {editingItem.size} {editingItem.color}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editQuantity">Nueva Cantidad</Label>
                  <Input
                    id="editQuantity"
                    type="number"
                    defaultValue={editingItem.quantity}
                    onChange={(e) => {
                      setEditingItem({
                        ...editingItem,
                        quantity: parseInt(e.target.value) || 0,
                      });
                    }}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Cantidad reservada: {editingItem.reservedQuantity}
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingItem(null)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => handleUpdateQuantity(editingItem, editingItem.quantity)}
                    disabled={updateInventoryMutation.isPending}
                    className="bg-uniform-primary hover:bg-blue-700"
                  >
                    {updateInventoryMutation.isPending ? "Actualizando..." : "Actualizar"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}