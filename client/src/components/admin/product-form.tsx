import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { X, Plus } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "La categoría es requerida"),
  price: z.string().min(1, "El precio es requerido"),
  isActive: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const { toast } = useToast();
  const [sizes, setSizes] = useState<string[]>(product?.sizes || []);
  const [colors, setColors] = useState<string[]>(product?.colors || []);
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newImage, setNewImage] = useState("");

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      categoryId: product?.categoryId?.toString() || "",
      price: product?.price || "",
      isActive: product?.isActive ?? true,
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  const mutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const productData = {
        ...data,
        categoryId: parseInt(data.categoryId),
        price: parseFloat(data.price),
        sizes,
        colors,
        images,
      };

      if (product) {
        return await apiRequest('PUT', `/api/products/${product.id}`, productData);
      } else {
        return await apiRequest('POST', '/api/products', productData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: product ? "Producto actualizado" : "Producto creado",
        description: `El producto ha sido ${product ? 'actualizado' : 'creado'} correctamente.`,
      });
      onSuccess?.();
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
        description: `No se pudo ${product ? 'actualizar' : 'crear'} el producto.`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProductFormData) => {
    mutation.mutate(data);
  };

  const addSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize("");
    }
  };

  const removeSize = (size: string) => {
    setSizes(sizes.filter(s => s !== size));
  };

  const addColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
      setNewColor("");
    }
  };

  const removeColor = (color: string) => {
    setColors(colors.filter(c => c !== color));
  };

  const addImage = () => {
    if (newImage && !images.includes(newImage)) {
      setImages([...images, newImage]);
      setNewImage("");
    }
  };

  const removeImage = (image: string) => {
    setImages(images.filter(i => i !== image));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Producto</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Camisa Ejecutiva Blanca" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category: any) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descripción detallada del producto..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Producto Activo</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    El producto será visible en la tienda
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Sizes */}
        <div>
          <Label className="text-base font-medium">Tallas Disponibles</Label>
          <div className="flex items-center space-x-2 mt-2">
            <Input
              placeholder="Ej: S, M, L, XL"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
            />
            <Button type="button" onClick={addSize} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {sizes.map((size) => (
              <Badge key={size} variant="secondary" className="cursor-pointer" onClick={() => removeSize(size)}>
                {size} <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <Label className="text-base font-medium">Colores Disponibles</Label>
          <div className="flex items-center space-x-2 mt-2">
            <Input
              placeholder="Ej: Blanco, Azul, Negro"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
            />
            <Button type="button" onClick={addColor} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {colors.map((color) => (
              <Badge key={color} variant="secondary" className="cursor-pointer" onClick={() => removeColor(color)}>
                {color} <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <Label className="text-base font-medium">Imágenes del Producto</Label>
          <div className="flex items-center space-x-2 mt-2">
            <Input
              placeholder="URL de la imagen"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
            />
            <Button type="button" onClick={addImage} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img 
                  src={image} 
                  alt={`Producto ${index + 1}`}
                  className="w-full h-20 object-cover rounded border"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0"
                  onClick={() => removeImage(image)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={mutation.isPending}
            className="bg-uniform-primary hover:bg-blue-700"
          >
            {mutation.isPending ? "Guardando..." : (product ? "Actualizar" : "Crear")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
