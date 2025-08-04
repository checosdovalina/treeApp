import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  X, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Edit, 
  Save,
  Palette,
  Star,
  Move
} from "lucide-react";
import type { Color } from "@shared/schema";

interface ProductColorImage {
  id: number;
  productId: number;
  colorId: number;
  images: string[];
  isPrimary: boolean;
  sortOrder: number;
  color?: Color;
}

interface ProductColorImagesProps {
  productId: number;
  availableColors: Color[];
}

export function ProductColorImages({ productId, availableColors }: ProductColorImagesProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingColorImage, setEditingColorImage] = useState<ProductColorImage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isPrimary, setIsPrimary] = useState(false);

  // Fetch product color images
  const { data: colorImages = [], isLoading } = useQuery({
    queryKey: [`/api/products/${productId}/color-images`],
    enabled: !!productId,
  });

  // Create color image mutation
  const createColorImageMutation = useMutation({
    mutationFn: async (data: {
      colorId: number;
      images: string[];
      isPrimary: boolean;
      sortOrder: number;
    }) => {
      return apiRequest(`/api/products/${productId}/color-images`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/color-images`] });
      toast({
        title: "Éxito",
        description: "Imágenes por color creadas correctamente",
      });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al crear las imágenes por color",
        variant: "destructive",
      });
    },
  });

  // Update color image mutation
  const updateColorImageMutation = useMutation({
    mutationFn: async ({ id, data }: { 
      id: number; 
      data: {
        colorId?: number;
        images?: string[];
        isPrimary?: boolean;
        sortOrder?: number;
      }
    }) => {
      return apiRequest(`/api/products/${productId}/color-images/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/color-images`] });
      toast({
        title: "Éxito",
        description: "Imágenes por color actualizadas correctamente",
      });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar las imágenes por color",
        variant: "destructive",
      });
    },
  });

  // Delete color image mutation
  const deleteColorImageMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/products/${productId}/color-images/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/color-images`] });
      toast({
        title: "Éxito",
        description: "Imágenes por color eliminadas correctamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar las imágenes por color",
        variant: "destructive",
      });
    },
  });

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingColorImage(null);
    setSelectedColorId(null);
    setImageUrls([]);
    setIsPrimary(false);
  };

  const handleEdit = (colorImage: ProductColorImage) => {
    setEditingColorImage(colorImage);
    setSelectedColorId(colorImage.colorId);
    setImageUrls(colorImage.images);
    setIsPrimary(colorImage.isPrimary);
    setIsDialogOpen(true);
  };

  const handleAddImageUrl = (url: string) => {
    if (url.trim() && !imageUrls.includes(url.trim())) {
      setImageUrls([...imageUrls, url.trim()]);
    }
  };

  const handleRemoveImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!selectedColorId || imageUrls.length === 0) {
      toast({
        title: "Error",
        description: "Debes seleccionar un color y agregar al menos una imagen",
        variant: "destructive",
      });
      return;
    }

    const data = {
      colorId: selectedColorId,
      images: imageUrls,
      isPrimary,
      sortOrder: colorImages.length,
    };

    if (editingColorImage) {
      updateColorImageMutation.mutate({ id: editingColorImage.id, data });
    } else {
      createColorImageMutation.mutate(data);
    }
  };

  const getColorName = (colorId: number) => {
    const color = availableColors.find(c => c.id === colorId);
    return color?.name || "Color desconocido";
  };

  const getColorHex = (colorId: number) => {
    const color = availableColors.find(c => c.id === colorId);
    return color?.hexCode || "#000000";
  };

  if (isLoading) {
    return <div className="p-4">Cargando imágenes por color...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Imágenes por Color
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Color
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingColorImage ? "Editar Imágenes por Color" : "Agregar Imágenes por Color"}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Color Selector */}
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Select 
                    value={selectedColorId?.toString()} 
                    onValueChange={(value) => setSelectedColorId(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un color" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableColors.map((color) => (
                        <SelectItem key={color.id} value={color.id.toString()}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: color.hexCode }}
                            />
                            {color.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Primary Color Toggle */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPrimary"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="isPrimary" className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Color principal del producto
                  </Label>
                </div>

                {/* Image URLs */}
                <div className="space-y-2">
                  <Label>URLs de Imágenes</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://ejemplo.com/imagen.jpg"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddImageUrl(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button 
                      type="button"
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        if (input) {
                          handleAddImageUrl(input.value);
                          input.value = '';
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Preview Images */}
                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded border"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSI+SW1hZ2VuPC90ZXh0Pjwvc3ZnPg==';
                            }}
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveImageUrl(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleSubmit}
                    disabled={createColorImageMutation.isPending || updateColorImageMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingColorImage ? "Actualizar" : "Crear"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCloseDialog}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {colorImages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay imágenes por color configuradas</p>
            <p className="text-sm">Agrega imágenes específicas para cada color del producto</p>
          </div>
        ) : (
          <div className="space-y-4">
            {colorImages.map((colorImage: ProductColorImage) => (
              <Card key={colorImage.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: getColorHex(colorImage.colorId) }}
                      />
                      <div>
                        <h4 className="font-medium">{getColorName(colorImage.colorId)}</h4>
                        <p className="text-sm text-gray-500">
                          {colorImage.images.length} imagen{colorImage.images.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      {colorImage.isPrimary && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          Principal
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(colorImage)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteColorImageMutation.mutate(colorImage.id)}
                        disabled={deleteColorImageMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-4 gap-2">
                    {colorImage.images.map((imageUrl, index) => (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`${getColorName(colorImage.colorId)} ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSI+SW1hZ2VuPC90ZXh0Pjwvc3ZnPg==';
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}