import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertIndustrySectionSchema, type IndustrySection, type InsertIndustrySection } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Upload } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { ObjectUploader } from "@/components/ObjectUploader";
import { apiRequest } from "@/lib/queryClient";
import type { UploadResult } from "@uppy/core";

export default function IndustrySectionsPage() {
  const [editingSection, setEditingSection] = useState<IndustrySection | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: sections, isLoading } = useQuery({
    queryKey: ['/api/industry-sections'],
    queryFn: () => fetch('/api/industry-sections').then(res => res.json()),
  });

  const form = useForm<InsertIndustrySection>({
    resolver: zodResolver(insertIndustrySectionSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      industry: "",
      description: "",
      imageUrl: "",
      backgroundColor: "#1F4287",
      textColor: "#FFFFFF",
      linkUrl: "",
      buttonText: "Explorar productos",
      isActive: true,
      sortOrder: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertIndustrySection) => apiRequest('/api/industry-sections', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/industry-sections'] });
      toast({ title: "Sección creada exitosamente" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: "Error al crear la sección", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertIndustrySection> }) =>
      apiRequest(`/api/industry-sections/${id}`, 'PUT', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/industry-sections'] });
      toast({ title: "Sección actualizada exitosamente" });
      setIsDialogOpen(false);
      setEditingSection(null);
      form.reset();
    },
    onError: () => {
      toast({ title: "Error al actualizar la sección", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/industry-sections/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/industry-sections'] });
      toast({ title: "Sección eliminada exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al eliminar la sección", variant: "destructive" });
    },
  });

  const handleSubmit = (data: InsertIndustrySection) => {
    if (editingSection) {
      updateMutation.mutate({ id: editingSection.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (section: IndustrySection) => {
    setEditingSection(section);
    form.reset({
      title: section.title,
      subtitle: section.subtitle || "",
      industry: section.industry,
      description: section.description || "",
      imageUrl: section.imageUrl || "",
      backgroundColor: section.backgroundColor,
      textColor: section.textColor || "#FFFFFF",
      linkUrl: section.linkUrl || "",
      buttonText: section.buttonText || "Explorar productos",
      isActive: section.isActive,
      sortOrder: section.sortOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta sección?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleNewSection = () => {
    setEditingSection(null);
    form.reset({
      title: "",
      subtitle: "",
      industry: "",
      description: "",
      imageUrl: "",
      backgroundColor: "#1F4287",
      textColor: "#FFFFFF",
      linkUrl: "",
      buttonText: "Explorar productos",
      isActive: true,
      sortOrder: 0,
    });
    setIsDialogOpen(true);
  };

  const handleGetUploadParameters = async () => {
    const data = await apiRequest('/api/objects/upload', 'POST');
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const uploadURL = result.successful[0].uploadURL;
      if (uploadURL) {
        // Normalize the URL to the object path format
        const imageUrl = uploadURL.replace(/\?.*$/, ''); // Remove query parameters
        form.setValue('imageUrl', imageUrl);
        toast({ title: "Imagen subida exitosamente" });
      }
    }
  };

  if (isLoading) return <div>Cargando...</div>;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Secciones de Industria</h1>
          <Button onClick={handleNewSection} className="flex items-center gap-2">
            <Plus size={16} />
            Nueva Sección
          </Button>
        </div>

        <div className="grid gap-4">
          {sections?.map((section: IndustrySection) => (
            <Card key={section.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{section.subtitle}</p>
                  <p className="text-sm text-gray-500 mb-2">Industria: {section.industry}</p>
                  <p className="text-sm text-gray-400">
                    Color: {section.backgroundColor} | Activa: {section.isActive ? "Sí" : "No"}
                  </p>
                  {section.imageUrl && (
                    <div className="mt-2">
                      <img src={section.imageUrl} alt={section.title} className="w-20 h-20 object-cover rounded" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(section)}>
                    <Pencil size={14} />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(section.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSection ? "Editar Sección" : "Nueva Sección"}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ej: CORPORATIVO" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtítulo</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="Ej: Uniformes ejecutivos y de oficina" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industria</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar industria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="corporativo">Corporativo</SelectItem>
                            <SelectItem value="gastronomia">Gastronomía</SelectItem>
                            <SelectItem value="industrial">Industrial</SelectItem>
                            <SelectItem value="medico">Médico</SelectItem>
                            <SelectItem value="seguridad">Seguridad</SelectItem>
                            <SelectItem value="educacion">Educación</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <Textarea {...field} value={field.value || ""} placeholder="Descripción de la industria" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="backgroundColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color de Fondo</FormLabel>
                        <FormControl>
                          <Input {...field} type="color" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="textColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color de Texto</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || "#FFFFFF"} type="color" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagen</FormLabel>
                      <div className="space-y-2">
                        <FormControl>
                          <Input {...field} value={field.value || ""} placeholder="URL de la imagen" />
                        </FormControl>
                        <ObjectUploader
                          maxNumberOfFiles={1}
                          maxFileSize={10485760}
                          onGetUploadParameters={handleGetUploadParameters}
                          onComplete={handleUploadComplete}
                          buttonClassName="w-full"
                        >
                          <Upload size={16} className="mr-2" />
                          Subir Imagen
                        </ObjectUploader>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de Enlace</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="/catalog?category=corporativo" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="buttonText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Texto del Botón</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="Explorar productos" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sortOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Orden</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || 0} type="number" onChange={(e) => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Select onValueChange={(value) => field.onChange(value === 'true')} value={field.value ? 'true' : 'false'}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Activo</SelectItem>
                              <SelectItem value="false">Inactivo</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingSection ? "Actualizar" : "Crear"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}