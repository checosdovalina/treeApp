import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Palette, Save, Image as ImageIcon } from "lucide-react";
import type { Color } from "@shared/schema";

interface SimpleColorImagesProps {
  productId: number;
  availableColors: Color[];
  productImages: string[];
}

export function SimpleColorImages({ productId, availableColors, productImages }: SimpleColorImagesProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageColorMap, setImageColorMap] = useState<{[imageUrl: string]: number}>({});

  // Load existing color assignments
  const { data: colorImages } = useQuery({
    queryKey: [`/api/products/${productId}/color-images`],
    enabled: !!productId
  });

  // Initialize imageColorMap with existing assignments
  useEffect(() => {
    if (colorImages && Array.isArray(colorImages) && productImages.length > 0) {
      const newImageColorMap: {[imageUrl: string]: number} = {};
      
      colorImages.forEach((colorImage: any) => {
        if (colorImage.images && Array.isArray(colorImage.images)) {
          colorImage.images.forEach((imageUrl: string) => {
            if (productImages.includes(imageUrl)) {
              newImageColorMap[imageUrl] = colorImage.colorId;
            }
          });
        }
      });
      
      console.log('Loading existing assignments:', newImageColorMap);
      setImageColorMap(newImageColorMap);
    }
  }, [colorImages, productImages]);

  // Save image-color assignments
  const saveAssignmentsMutation = useMutation({
    mutationFn: async () => {
      console.log('=== STARTING SAVE PROCESS ===');
      console.log('Current imageColorMap:', imageColorMap);

      // No clear needed since we're using proper API - just group and save
      const colorGroups: {[colorId: number]: string[]} = {};
      
      Object.entries(imageColorMap).forEach(([imageUrl, colorId]) => {
        if (!colorGroups[colorId]) {
          colorGroups[colorId] = [];
        }
        colorGroups[colorId].push(imageUrl);
      });

      console.log('Color groups to save:', colorGroups);

      // Clear existing assignments first using proper API method  
      console.log('Step 1: Getting existing assignments to clear...');
      const response = await fetch(`/api/products/${productId}/color-images`);
      const existingAssignments = await response.json();
      
      for (const assignment of existingAssignments) {
        console.log('Deleting assignment:', assignment.id);
        await apiRequest(`/api/products/${productId}/color-images/${assignment.id}`, "DELETE");
      }

      // Create new assignments
      console.log('Step 2: Creating new assignments...');
      const promises = Object.entries(colorGroups).map(async ([colorId, images]) => {
        const payload = {
          colorId: parseInt(colorId),
          images,
          isPrimary: false,
          sortOrder: 0,
        };
        console.log('Creating assignment for color', colorId, ':', payload);
        const result = await apiRequest(`/api/products/${productId}/color-images`, "POST", payload);
        console.log('Assignment created:', result);
        return result;
      });

      const results = await Promise.all(promises);
      console.log('All assignments saved successfully:', results);
      console.log('=== SAVE PROCESS COMPLETED ===');
    },
    onSuccess: () => {
      console.log('Save mutation completed successfully');
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/color-images`] });
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}`] });
      queryClient.refetchQueries({ queryKey: [`/api/products/${productId}/color-images`] });
      toast({
        title: "Éxito",
        description: "Asignaciones de colores guardadas correctamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al guardar las asignaciones",
        variant: "destructive",
      });
    },
  });

  const handleColorAssignment = (imageUrl: string, colorId: number) => {
    console.log('Assigning color', colorId, 'to image:', imageUrl);
    setImageColorMap(prev => {
      const newMap = {
        ...prev,
        [imageUrl]: colorId
      };
      console.log('New imageColorMap:', newMap);
      return newMap;
    });
  };

  const getColorName = (colorId: number) => {
    const color = availableColors.find(c => c.id === colorId);
    return color?.name || "Sin asignar";
  };

  const getColorHex = (colorId: number) => {
    const color = availableColors.find(c => c.id === colorId);
    return color?.hexCode || "#CCCCCC";
  };

  if (productImages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Asignar Colores a Imágenes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay imágenes en este producto</p>
            <p className="text-sm">Agrega imágenes al producto primero</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Asignar Colores a Imágenes
          </CardTitle>
          <Button 
            onClick={() => {
              console.log('Button clicked - starting save process');
              saveAssignmentsMutation.mutate();
            }}
            disabled={saveAssignmentsMutation.isPending}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {saveAssignmentsMutation.isPending ? 'Guardando...' : 'Guardar Asignaciones'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Selecciona el color para cada imagen. Los clientes verán estas imágenes cuando seleccionen el color correspondiente.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productImages.map((imageUrl, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-3">
                <div className="aspect-square bg-gray-100 rounded overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSI+SW1hZ2VuPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Color para esta imagen:</label>
                  <Select 
                    value={imageColorMap[imageUrl]?.toString() || ""} 
                    onValueChange={(value) => handleColorAssignment(imageUrl, parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar color" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableColors.map((color) => (
                        <SelectItem key={color.id} value={color.id.toString()}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: color.hexCode || "#CCCCCC" }}
                            />
                            {color.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {imageColorMap[imageUrl] && (
                    <Badge 
                      variant="secondary" 
                      className="flex items-center gap-1 w-fit"
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getColorHex(imageColorMap[imageUrl]) }}
                      />
                      {getColorName(imageColorMap[imageUrl])}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {Object.keys(imageColorMap).length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Resumen de asignaciones:</h4>
              <div className="space-y-1">
                {availableColors.map(color => {
                  const assignedImages = Object.entries(imageColorMap)
                    .filter(([_, colorId]) => colorId === color.id)
                    .length;
                  
                  if (assignedImages === 0) return null;
                  
                  return (
                    <div key={color.id} className="flex items-center gap-2 text-sm">
                      <div 
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: color.hexCode || "#CCCCCC" }}
                      />
                      <span>{color.name}: {assignedImages} imagen{assignedImages !== 1 ? 's' : ''}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}