import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Package,
  Tag,
  Palette,
  Ruler
} from "lucide-react";
import type { Product, Category, Brand, Size, Color } from "@shared/schema";
import { GarmentTypeSelector } from "./garment-type-selector";
import { SeparatedGenderSizeSelector } from "@/components/ui/separated-gender-size-selector";
import { MultiGenderSelector } from "@/components/ui/multi-gender-selector";

// Schema de validación para el formulario de producto
const productFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(200, "El nombre es muy largo"),
  sku: z.string().optional().refine(
    (val) => !val || /^[A-Z0-9-_]+$/.test(val),
    "El SKU solo puede contener letras mayúsculas, números, guiones y guiones bajos"
  ),
  description: z.string().optional(),
  categoryId: z.number().min(1, "Selecciona una categoría"),
  brand: z.string().optional(),
  genders: z.array(z.enum(["masculino", "femenino", "unisex"])).default(["unisex"]),
  garmentTypeId: z.number().min(1, "El tipo de prenda es requerido"),
  price: z.string().min(1, "El precio es requerido").regex(/^\d+(\.\d{1,2})?$/, "Precio inválido"),
  images: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface AdvancedProductFormProps {
  product?: Product;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function AdvancedProductForm({ product, onSuccess, trigger }: AdvancedProductFormProps) {
  const [open, setOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newBrandName, setNewBrandName] = useState("");
  const [newSizeName, setNewSizeName] = useState("");
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries para obtener datos
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });

  const { data: sizes = [] } = useQuery<Size[]>({
    queryKey: ["/api/sizes"],
  });

  const { data: colors = [] } = useQuery<Color[]>({
    queryKey: ["/api/colors"],
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      sku: product?.sku || "",
      description: product?.description || "",
      categoryId: product?.categoryId || 0,
      brand: product?.brand || "",
      genders: (product?.genders as ("masculino" | "femenino" | "unisex")[]) || ["unisex"],
      garmentTypeId: product?.garmentTypeId || 1,
      price: product?.price || "",
      images: product?.images || [],
      sizes: product?.sizes || [],
      colors: product?.colors || [],
      isActive: product?.isActive ?? true,
    },
  });

  // Mutations para crear nuevas entidades
  const createCategoryMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      return await apiRequest("POST", "/api/categories", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setNewCategoryName("");
      toast({ title: "Categoría creada exitosamente" });
    },
  });

  const createBrandMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      return await apiRequest("POST", "/api/brands", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      setNewBrandName("");
      toast({ title: "Marca creada exitosamente" });
    },
  });

  const createSizeMutation = useMutation({
    mutationFn: async (data: { name: string; sortOrder?: number }) => {
      return await apiRequest("POST", "/api/sizes", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sizes"] });
      setNewSizeName("");
      toast({ title: "Talla creada exitosamente" });
    },
  });

  const createColorMutation = useMutation({
    mutationFn: async (data: { name: string; hexCode?: string }) => {
      return await apiRequest("POST", "/api/colors", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/colors"] });
      setNewColorName("");
      setNewColorHex("#000000");
      toast({ title: "Color creado exitosamente" });
    },
  });

  // Mutation para producto
  const productMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const payload = {
        ...data,
        // Keep price as string since backend expects string
      };
      
      if (product) {
        return await apiRequest("PUT", `/api/products/${product.id}`, payload);
      } else {
        return await apiRequest("POST", "/api/products", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: product ? "Producto actualizado" : "Producto creado",
        description: "Los cambios se han guardado exitosamente",
      });
      setOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo guardar el producto",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    productMutation.mutate(data as ProductFormData);
  };

  // Funciones para manejar imágenes
  const addImage = () => {
    if (newImageUrl.trim()) {
      const currentImages = form.getValues("images");
      form.setValue("images", [...currentImages, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleImageFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const maxFileSize = 5 * 1024 * 1024; // 5MB límite
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    Array.from(files).forEach((file) => {
      // Validar tipo de archivo
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Tipo de archivo no válido",
          description: `El archivo "${file.name}" no es un tipo de imagen válido. Use PNG, JPG, JPEG o WEBP.`,
          variant: "destructive",
        });
        return;
      }

      // Validar tamaño de archivo
      if (file.size > maxFileSize) {
        toast({
          title: "Archivo muy grande",
          description: `El archivo "${file.name}" es muy grande. El tamaño máximo es 5MB.`,
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          const currentImages = form.getValues("images");
          form.setValue("images", [...currentImages, result]);
          toast({
            title: "Imagen agregada",
            description: `Se agregó exitosamente "${file.name}".`,
          });
        }
      };
      
      reader.onerror = () => {
        toast({
          title: "Error al cargar imagen",
          description: `No se pudo cargar el archivo "${file.name}".`,
          variant: "destructive",
        });
      };
      
      reader.readAsDataURL(file);
    });
    
    // Reset input
    event.target.value = '';
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images");
    form.setValue("images", currentImages.filter((_, i) => i !== index));
  };

  // Funciones para manejar selecciones múltiples
  const toggleSize = (sizeName: string) => {
    const currentSizes = form.getValues("sizes");
    const isSelected = currentSizes.includes(sizeName);
    
    if (isSelected) {
      form.setValue("sizes", currentSizes.filter(s => s !== sizeName));
    } else {
      form.setValue("sizes", [...currentSizes, sizeName]);
    }
    
    // Trigger form re-render to update UI
    form.trigger("sizes");
  };

  const toggleColor = (colorName: string) => {
    const currentColors = form.getValues("colors");
    const isSelected = currentColors.includes(colorName);
    
    if (isSelected) {
      const newColors = currentColors.filter(c => c !== colorName);
      form.setValue("colors", newColors);
    } else {
      const newColors = [...currentColors, colorName];
      form.setValue("colors", newColors);
    }
    
    // Trigger form re-render to update UI
    form.trigger("colors");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-poppins">
            <Package className="h-5 w-5" />
            {product ? "Editar Producto" : "Crear Nuevo Producto"}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[80vh] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Información básica */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-poppins">Información Básica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-roboto">Nombre del Producto</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Camisa Médica Premium" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-roboto">SKU (Opcional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Ej: CMP-001" 
                              {...field} 
                              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                            />
                          </FormControl>
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
                        <FormLabel className="font-roboto">Descripción</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descripción detallada del producto..." 
                            rows={3}
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
                          <FormLabel className="font-roboto">Precio (MXN)</FormLabel>
                          <FormControl>
                            <Input 
                              type="text" 
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
                        <FormItem className="flex items-center space-x-2 pt-6">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-roboto">Producto activo</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Categoría */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-poppins flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Categoría
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-roboto">Seleccionar Categoría</FormLabel>
                            <Select
                              value={field.value?.toString()}
                              onValueChange={(value) => field.onChange(parseInt(value))}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona una categoría" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
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
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-roboto">Nueva Categoría</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Nombre"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => createCategoryMutation.mutate({ name: newCategoryName })}
                          disabled={!newCategoryName.trim() || createCategoryMutation.isPending}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Marca */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-poppins">Marca</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-roboto">Seleccionar Marca</FormLabel>
                            <Select 
                              value={field.value || "no-brand"} 
                              onValueChange={(value) => field.onChange(value === "no-brand" ? "" : value)}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona una marca (opcional)" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="no-brand">Sin marca</SelectItem>
                                {brands.map((brand) => (
                                  <SelectItem key={brand.id} value={brand.name}>
                                    {brand.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-roboto">Nueva Marca</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Nombre"
                          value={newBrandName}
                          onChange={(e) => setNewBrandName(e.target.value)}
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => createBrandMutation.mutate({ name: newBrandName })}
                          disabled={!newBrandName.trim() || createBrandMutation.isPending}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tipo de Prenda */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-poppins">Tipo de Prenda</CardTitle>
                </CardHeader>
                <CardContent>
                  <GarmentTypeSelector form={form} />
                </CardContent>
              </Card>

              {/* Géneros */}
              <MultiGenderSelector
                garmentTypeId={form.watch("garmentTypeId")}
                selectedGenders={form.watch("genders") || []}
                onGendersChange={(genders) => form.setValue("genders", genders)}
                label="Géneros Disponibles"
              />

              {/* Tallas por Género */}
              <SeparatedGenderSizeSelector
                garmentTypeId={form.watch("garmentTypeId")}
                genders={form.watch("genders") || []}
                selectedSizes={form.watch("sizes")}
                onSizesChange={(sizes) => form.setValue("sizes", sizes)}
                label="Tallas por Género"
              />

              {/* Colores */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-poppins flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Colores Disponibles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {colors.map((color) => {
                      const isSelected = form.watch("colors").includes(color.name);
                      return (
                        <div
                          key={color.id}
                          className={`p-2 border rounded-md cursor-pointer text-center transition-colors ${
                            isSelected 
                              ? "bg-blue-500 text-white border-blue-500" 
                              : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleColor(color.name);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {color.hexCode && (
                              <div
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: color.hexCode }}
                              />
                            )}
                            <span className="text-sm font-roboto">{color.name}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-roboto">Agregar Nuevo Color</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nombre del color"
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                      />
                      <Input
                        type="color"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="w-16"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => createColorMutation.mutate({ 
                          name: newColorName,
                          hexCode: newColorHex 
                        })}
                        disabled={!newColorName.trim() || createColorMutation.isPending}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {form.watch("colors").length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-roboto">Colores Seleccionados:</Label>
                      <div className="flex flex-wrap gap-2">
                        {form.watch("colors").map((colorName) => {
                          const color = colors.find(c => c.name === colorName);
                          return (
                            <Badge key={colorName} variant="secondary" className="font-roboto">
                              {color?.hexCode && (
                                <div
                                  className="w-3 h-3 rounded-full mr-1"
                                  style={{ backgroundColor: color.hexCode }}
                                />
                              )}
                              {colorName}
                              <X 
                                className="h-3 w-3 ml-1 cursor-pointer" 
                                onClick={() => toggleColor(colorName)}
                              />
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Imágenes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-poppins flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Imágenes del Producto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-roboto">Agregar Nueva Imagen</Label>
                    
                    {/* Opciones para agregar imágenes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Input para URL de imagen */}
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-600">Desde URL</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="https://ejemplo.com/imagen.jpg"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                          />
                          <Button type="button" size="sm" onClick={addImage} disabled={!newImageUrl.trim()}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Input para cargar archivos */}
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-600">Desde Dispositivo</Label>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            const input = document.getElementById('image-upload') as HTMLInputElement;
                            if (input) {
                              input.click();
                            } else {
                              toast({
                                title: "Error",
                                description: "No se pudo abrir el selector de archivos.",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Subir Archivos
                        </Button>
                        <input
                          id="image-upload"
                          type="file"
                          multiple
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                        <p className="text-xs text-gray-500">
                          Formatos soportados: PNG, JPG, JPEG, WEBP. Máximo 5MB por archivo.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {form.watch("images").length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-roboto">Imágenes Actuales:</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {form.watch("images").map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={imageUrl}
                              alt={`Imagen ${index + 1}`}
                              className="w-full h-24 object-cover rounded-md border"
                              onError={(e) => {
                                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' fill='%236b7280' text-anchor='middle' dy='.3em'%3EImagen no disponible%3C/text%3E%3C/svg%3E";
                              }}
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                              onClick={() => removeImage(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Botones de acción */}
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={productMutation.isPending}>
                  {productMutation.isPending ? (
                    "Guardando..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {product ? "Actualizar" : "Crear"} Producto
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}