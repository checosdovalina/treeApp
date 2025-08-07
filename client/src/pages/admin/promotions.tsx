import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Calendar, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from "@/components/layout/admin-layout";
import type { Promotion } from "@shared/schema";

interface PromotionFormData {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  discountType: string;
  discountValue: string;
  promoCode: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  sortOrder: number;
  targetAudience: string;
  backgroundColor: string;
  textColor: string;
}

const initialFormData: PromotionFormData = {
  title: "",
  description: "",
  imageUrl: "",
  linkUrl: "",
  discountType: "percentage",
  discountValue: "",
  promoCode: "",
  startDate: "",
  endDate: "",
  isActive: true,
  sortOrder: 0,
  targetAudience: "all",
  backgroundColor: "#1F4287",
  textColor: "#FFFFFF",
};

export default function PromotionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState<PromotionFormData>(initialFormData);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: promotions = [], isLoading } = useQuery({
    queryKey: ["/api/promotions"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: PromotionFormData) => {
      const payload = {
        ...data,
        discountValue: data.discountValue ? parseFloat(data.discountValue) : null,
        startDate: data.startDate,
        endDate: data.endDate,
      };
      return apiRequest("POST", "/api/promotions", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions"] });
      setIsDialogOpen(false);
      setFormData(initialFormData);
      toast({
        title: "Promoción creada",
        description: "La promoción se ha creado exitosamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear la promoción.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<PromotionFormData> }) => {
      const payload = {
        ...data,
        discountValue: data.discountValue ? parseFloat(data.discountValue) : null,
        startDate: data.startDate,
        endDate: data.endDate,
      };
      return apiRequest("PUT", `/api/promotions/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions"] });
      setIsDialogOpen(false);
      setEditingPromotion(null);
      setFormData(initialFormData);
      toast({
        title: "Promoción actualizada",
        description: "La promoción se ha actualizado exitosamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la promoción.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/promotions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions"] });
      toast({
        title: "Promoción eliminada",
        description: "La promoción se ha eliminado exitosamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la promoción.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPromotion) {
      updateMutation.mutate({ id: editingPromotion.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      title: promotion.title,
      description: promotion.description || "",
      imageUrl: promotion.imageUrl || "",
      linkUrl: promotion.linkUrl || "",
      discountType: promotion.discountType || "percentage",
      discountValue: promotion.discountValue?.toString() || "",
      promoCode: promotion.promoCode || "",
      startDate: new Date(promotion.startDate).toISOString().slice(0, 16),
      endDate: new Date(promotion.endDate).toISOString().slice(0, 16),
      isActive: promotion.isActive,
      sortOrder: promotion.sortOrder || 0,
      targetAudience: promotion.targetAudience || "all",
      backgroundColor: promotion.backgroundColor || "#1F4287",
      textColor: promotion.textColor || "#FFFFFF",
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPromotion(null);
    setFormData(initialFormData);
  };

  const isPromotionActive = (promotion: Promotion) => {
    const now = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);
    return promotion.isActive && start <= now && end >= now;
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-uniform-neutral-900">Gestión de Promociones</h1>
            <p className="text-uniform-secondary mt-2">
              Administra banners promocionales y ofertas especiales
            </p>
          </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleCloseDialog()}
              className="bg-uniform-primary hover:bg-uniform-darker text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Promoción
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPromotion ? "Editar Promoción" : "Nueva Promoción"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Orden</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL de Imagen</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkUrl">URL de Enlace</Label>
                  <Input
                    id="linkUrl"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountType">Tipo de Descuento</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value) => setFormData({ ...formData, discountType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Porcentaje</SelectItem>
                      <SelectItem value="fixed">Cantidad Fija</SelectItem>
                      <SelectItem value="free_shipping">Envío Gratis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountValue">Valor del Descuento</Label>
                  <Input
                    id="discountValue"
                    type="number"
                    step="0.01"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder={formData.discountType === "percentage" ? "10" : "50.00"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promoCode">Código Promocional</Label>
                  <Input
                    id="promoCode"
                    value={formData.promoCode}
                    onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                    placeholder="DESCUENTO10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de Inicio *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Fecha de Fin *</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Audiencia Objetivo</Label>
                  <Select
                    value={formData.targetAudience}
                    onValueChange={(value) => setFormData({ ...formData, targetAudience: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="new_customers">Clientes Nuevos</SelectItem>
                      <SelectItem value="returning_customers">Clientes Recurrentes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Color de Fondo</Label>
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="textColor">Color del Texto</Label>
                  <Input
                    id="textColor"
                    type="color"
                    value={formData.textColor}
                    onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Promoción Activa</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-[#1F4287] hover:bg-[#1a3a75]"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingPromotion ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promotion: Promotion) => (
            <Card key={promotion.id} className="relative overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{promotion.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {promotion.description && (
                        <span className="line-clamp-2">{promotion.description}</span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    {isPromotionActive(promotion) ? (
                      <Badge className="bg-green-100 text-green-800">
                        <Eye className="w-3 h-3 mr-1" />
                        Activa
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <EyeOff className="w-3 h-3 mr-1" />
                        Inactiva
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {promotion.imageUrl && (
                  <div
                    className="h-32 w-full rounded-md mb-4 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${promotion.imageUrl})`,
                      backgroundColor: promotion.backgroundColor,
                    }}
                  />
                )}
                
                <div className="space-y-2 text-sm text-gray-600">
                  {promotion.discountValue && (
                    <div className="flex justify-between">
                      <span>Descuento:</span>
                      <span className="font-semibold">
                        {promotion.discountType === "percentage" 
                          ? `${promotion.discountValue}%`
                          : promotion.discountType === "fixed"
                          ? `$${promotion.discountValue}`
                          : "Envío Gratis"
                        }
                      </span>
                    </div>
                  )}
                  {promotion.promoCode && (
                    <div className="flex justify-between">
                      <span>Código:</span>
                      <span className="font-mono font-semibold">{promotion.promoCode}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Inicio:</span>
                    <span>{formatDate(promotion.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fin:</span>
                    <span>{formatDate(promotion.endDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Audiencia:</span>
                    <span className="capitalize">
                      {promotion.targetAudience === "all" ? "Todos" :
                       promotion.targetAudience === "new_customers" ? "Nuevos" : "Recurrentes"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(promotion)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar promoción?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. La promoción "{promotion.title}" será eliminada permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(promotion.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && promotions.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay promociones creadas
            </h3>
            <p className="text-gray-600 mb-4">
              Crea tu primera promoción para mostrar banners en la tienda
            </p>
          </CardContent>
        </Card>
      )}
      </div>
    </AdminLayout>
  );
}