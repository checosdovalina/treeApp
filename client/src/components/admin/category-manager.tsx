import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Plus, FolderOpen, Edit, Trash2, Package } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

const categorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  _count?: {
    products: number;
  };
}

export default function CategoryManager() {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { data: categories, isLoading } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: () => apiRequest('GET', '/api/categories'),
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      return await apiRequest('POST', '/api/categories', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: "Categoría creada",
        description: "La categoría ha sido creada correctamente.",
      });
      handleFormClose();
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
        description: "No se pudo crear la categoría.",
        variant: "destructive",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormData & { id: number }) => {
      return await apiRequest('PUT', `/api/categories/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: "Categoría actualizada",
        description: "La categoría ha sido actualizada correctamente.",
      });
      handleFormClose();
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
        description: "No se pudo actualizar la categoría.",
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('DELETE', `/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: "Categoría eliminada",
        description: "La categoría ha sido eliminada correctamente.",
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
        description: "No se pudo eliminar la categoría.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    if (editingCategory) {
      updateCategoryMutation.mutate({ ...data, id: editingCategory.id });
    } else {
      createCategoryMutation.mutate(data);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      description: category.description || "",
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de que desea eliminar esta categoría?')) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
    form.reset({
      name: "",
      description: "",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Cargando categorías...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Gestión de Categorías
          </CardTitle>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-uniform-primary hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Categoría
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de la Categoría</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ej: Camisas Ejecutivas, Pantalones, Uniformes Médicos"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descripción opcional de la categoría..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={handleFormClose}>
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                      className="bg-uniform-primary hover:bg-blue-700"
                    >
                      {createCategoryMutation.isPending || updateCategoryMutation.isPending
                        ? "Guardando..." 
                        : editingCategory 
                        ? "Actualizar" 
                        : "Crear"
                      }
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {!categories || categories.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay categorías
            </h3>
            <p className="text-gray-500 mb-4">
              Crea categorías para organizar tus productos
            </p>
            <Button 
              onClick={() => setIsFormOpen(true)}
              className="bg-uniform-primary hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Categoría
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category: Category) => (
              <div key={category.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <Badge variant="secondary">
                        <Package className="h-3 w-3 mr-1" />
                        {category._count?.products || 0} productos
                      </Badge>
                    </div>
                    {category.description && (
                      <p className="text-sm text-gray-500 mb-2">
                        {category.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      Creada: {new Date(category.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(category.id)}
                      disabled={category._count?.products > 0}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}