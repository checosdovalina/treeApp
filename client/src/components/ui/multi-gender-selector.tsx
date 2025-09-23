import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Info } from "lucide-react";
import type { GarmentType } from "@shared/schema";

interface MultiGenderSelectorProps {
  garmentTypeId?: number;
  selectedGenders: string[];
  onGendersChange: (genders: string[]) => void;
  label?: string;
  className?: string;
}

export function MultiGenderSelector({
  garmentTypeId,
  selectedGenders,
  onGendersChange,
  label = "Géneros Disponibles",
  className
}: MultiGenderSelectorProps) {

  // Fetch garment type information to check if it requires sizes
  const { data: garmentTypes = [] } = useQuery<GarmentType[]>({
    queryKey: ["/api/garment-types"],
  });

  const currentGarmentType = garmentTypes.find(gt => gt.id === garmentTypeId);
  const requiresSizes = currentGarmentType?.requiresSizes ?? true;
  
  // Definir géneros disponibles basado en el tipo de prenda
  const getAvailableGenders = () => {
    // Para productos que no requieren tallas (bolsas, termos, etc.), solo unisex
    if (!requiresSizes && garmentTypeId) {
      return [
        { value: "unisex", label: "Unisex", icon: "⚥" }
      ];
    }
    
    // Para pantalones (ID 4), excluir unisex
    if (garmentTypeId === 4) {
      return [
        { value: "masculino", label: "Hombre", icon: "♂" },
        { value: "femenino", label: "Mujer", icon: "♀" }
      ];
    }
    
    // Para faldas (ID 10) y vestidos (ID 11), solo femenino y unisex
    if (garmentTypeId === 10 || garmentTypeId === 11) {
      return [
        { value: "femenino", label: "Mujer", icon: "♀" },
        { value: "unisex", label: "Unisex", icon: "⚥" }
      ];
    }
    
    // Para todas las demás prendas, incluir todos los géneros
    return [
      { value: "masculino", label: "Hombre", icon: "♂" },
      { value: "femenino", label: "Mujer", icon: "♀" },
      { value: "unisex", label: "Unisex", icon: "⚥" }
    ];
  };

  const availableGenders = getAvailableGenders();

  // Auto-select unisex for products that don't require sizes
  useEffect(() => {
    if (!requiresSizes && garmentTypeId && availableGenders.length === 1 && availableGenders[0].value === "unisex") {
      // Solo autoseleccionar si no hay nada seleccionado aún
      if (selectedGenders.length === 0) {
        onGendersChange(["unisex"]);
      }
    }
  }, [requiresSizes, garmentTypeId, availableGenders, selectedGenders, onGendersChange]);

  const handleGenderToggle = (gender: string) => {
    const newGenders = selectedGenders.includes(gender)
      ? selectedGenders.filter(g => g !== gender)
      : [...selectedGenders, gender];
    onGendersChange(newGenders);
  };

  // Si el tipo de prenda no requiere tallas, mostrar mensaje informativo
  if (!requiresSizes && garmentTypeId) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-sm font-roboto flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            {label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              Los productos tipo <strong>"{currentGarmentType?.displayName}"</strong> se configuran automáticamente como unisex.
            </p>
          </div>
          
          {/* Mostrar el género seleccionado */}
          <div className="mt-3 flex items-center space-x-2">
            <Checkbox
              id="gender-unisex-auto"
              checked={true}
              disabled={true}
              className="data-[state=checked]:bg-uniform-primary"
            />
            <Label
              htmlFor="gender-unisex-auto"
              className="text-sm font-roboto flex items-center gap-2"
            >
              <span className="text-lg">⚥</span>
              Unisex
            </Label>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-roboto flex items-center gap-2">
          <Users className="h-4 w-4" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {availableGenders.map((gender) => (
            <div key={gender.value} className="flex items-center space-x-2">
              <Checkbox
                id={`gender-${gender.value}`}
                checked={selectedGenders.includes(gender.value)}
                onCheckedChange={() => handleGenderToggle(gender.value)}
                className="data-[state=checked]:bg-uniform-primary"
              />
              <Label
                htmlFor={`gender-${gender.value}`}
                className="text-sm font-roboto cursor-pointer flex items-center gap-2"
              >
                <span className="text-lg">{gender.icon}</span>
                {gender.label}
              </Label>
            </div>
          ))}
        </div>
        
        {selectedGenders.length === 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Selecciona al menos un género para continuar
          </p>
        )}
      </CardContent>
    </Card>
  );
}