import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { GarmentType } from "@shared/schema";

interface GarmentTypeSelectorProps {
  form: any;
}

export function GarmentTypeSelector({ form }: GarmentTypeSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeDisplayName, setNewTypeDisplayName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: garmentTypes = [], isLoading } = useQuery<GarmentType[]>({
    queryKey: ["/api/garment-types"],
  });

  const createGarmentTypeMutation = useMutation({
    mutationFn: async (data: { name: string; displayName: string }) => {
      const response = await apiRequest("/api/garment-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    onSuccess: (newGarmentType: GarmentType) => {
      queryClient.invalidateQueries({ queryKey: ["/api/garment-types"] });
      form.setValue("garmentTypeId", newGarmentType.id);
      setIsDialogOpen(false);
      setNewTypeName("");
      setNewTypeDisplayName("");
      toast({
        title: "Éxito",
        description: "Tipo de prenda creado correctamente",
      });
    },
    onError: (error) => {
      console.error("Error creating garment type:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el tipo de prenda",
        variant: "destructive",
      });
    },
  });

  const handleCreateGarmentType = () => {
    if (!newTypeName.trim() || !newTypeDisplayName.trim()) {
      toast({
        title: "Error",
        description: "Completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    const formattedName = newTypeName.toLowerCase().replace(/\s+/g, '_');
    createGarmentTypeMutation.mutate({
      name: formattedName,
      displayName: newTypeDisplayName,
    });
  };

  return (
    <FormField
      control={form.control}
      name="garmentTypeId"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-roboto">Tipo de Prenda</FormLabel>
          <div className="flex gap-2">
            <Select 
              value={field.value?.toString() || ""} 
              onValueChange={(value) => field.onChange(parseInt(value))}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>Cargando...</SelectItem>
                ) : (
                  garmentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.displayName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Tipo de Prenda</DialogTitle>
                  <DialogDescription>
                    Agrega un nuevo tipo de prenda al catálogo
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nombre interno
                    </Label>
                    <Input
                      id="name"
                      value={newTypeName}
                      onChange={(e) => setNewTypeName(e.target.value)}
                      className="col-span-3"
                      placeholder="chamarra, playera, etc."
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="displayName" className="text-right">
                      Nombre visible
                    </Label>
                    <Input
                      id="displayName"
                      value={newTypeDisplayName}
                      onChange={(e) => setNewTypeDisplayName(e.target.value)}
                      className="col-span-3"
                      placeholder="Chamarra, Playera, etc."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCreateGarmentType}
                    disabled={createGarmentTypeMutation.isPending}
                  >
                    {createGarmentTypeMutation.isPending ? "Creando..." : "Crear"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}