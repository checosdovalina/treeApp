import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { GripVertical, Star, Save, RefreshCw } from "lucide-react";

interface Product {
  id: number;
  name: string;
  sku: string;
  price: string;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number | null;
}

interface SortableProductProps {
  product: Product;
  index: number;
  onToggleFeatured: (id: number, isFeatured: boolean) => void;
}

function SortableProduct({ product, index, onToggleFeatured }: SortableProductProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border rounded-lg p-4 mb-2 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
      data-testid={`sortable-product-${product.id}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
        data-testid={`drag-handle-${product.id}`}
      >
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>

      <div className="flex items-center justify-center w-10 h-10 bg-uniform-primary/10 rounded text-uniform-primary font-bold">
        {index + 1}
      </div>

      {product.images && product.images.length > 0 ? (
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-16 h-16 object-cover rounded"
          data-testid={`product-image-${product.id}`}
        />
      ) : (
        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-xs text-gray-400">Sin imagen</span>
        </div>
      )}

      <div className="flex-1">
        <div className="font-medium" data-testid={`product-name-${product.id}`}>
          {product.name}
        </div>
        <div className="text-sm text-gray-500">
          {product.sku && <span data-testid={`product-sku-${product.id}`}>SKU: {product.sku}</span>}
          {product.sku && <span className="mx-2">•</span>}
          <span data-testid={`product-price-${product.id}`}>${product.price}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {product.isFeatured && (
          <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600" data-testid={`badge-featured-${product.id}`}>
            <Star className="h-3 w-3 mr-1" />
            Destacado
          </Badge>
        )}
        {!product.isActive && (
          <Badge variant="secondary" data-testid={`badge-inactive-${product.id}`}>Inactivo</Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Destacar:</label>
        <Switch
          checked={product.isFeatured}
          onCheckedChange={(checked) => onToggleFeatured(product.id, checked)}
          data-testid={`toggle-featured-${product.id}`}
        />
      </div>
    </div>
  );
}

export default function Merchandising() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch products
  const { data: productsData, isLoading, refetch } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Update local state when data changes
  useEffect(() => {
    if (productsData) {
      setProducts(productsData);
      setHasChanges(false);
    }
  }, [productsData]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const updates = products.map((product, index) => ({
        id: product.id,
        displayOrder: index,
        isFeatured: product.isFeatured,
      }));
      return await apiRequest("PUT", "/api/products/batch-order", updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setHasChanges(false);
      toast({
        title: "Cambios guardados",
        description: "El orden de los productos se ha actualizado correctamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios.",
        variant: "destructive",
      });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setProducts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        setHasChanges(true);
        return newOrder;
      });
    }
  };

  const handleToggleFeatured = (id: number, isFeatured: boolean) => {
    setProducts((items) =>
      items.map((item) =>
        item.id === id ? { ...item, isFeatured } : item
      )
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    saveMutation.mutate();
  };

  const handleReset = () => {
    refetch();
    setHasChanges(false);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Merchandising de Productos</CardTitle>
              <CardDescription className="mt-2">
                Arrastra y suelta para reordenar cómo aparecen los productos en la tienda. Los productos destacados aparecen primero.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {hasChanges && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={saveMutation.isPending}
                  data-testid="button-reset-changes"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Descartar Cambios
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={!hasChanges || saveMutation.isPending}
                className="bg-uniform-primary hover:bg-blue-700"
                data-testid="button-save-order"
              >
                <Save className="h-4 w-4 mr-2" />
                {saveMutation.isPending ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No hay productos disponibles
            </div>
          ) : (
            <>
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Productos Destacados</p>
                    <p className="text-gray-600 mt-1">
                      Los productos marcados como "Destacado" aparecerán primero en la tienda y en la página principal.
                      Usa el switch a la derecha de cada producto para destacarlo.
                    </p>
                  </div>
                </div>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={products.map((p) => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {products.map((product, index) => (
                    <SortableProduct
                      key={product.id}
                      product={product}
                      index={index}
                      onToggleFeatured={handleToggleFeatured}
                    />
                  ))}
                </SortableContext>
              </DndContext>

              {hasChanges && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Tienes cambios sin guardar. Presiona "Guardar Cambios" para aplicarlos.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
