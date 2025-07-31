import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

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
  
  // Definir géneros disponibles basado en el tipo de prenda
  const getAvailableGenders = () => {
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

  const handleGenderToggle = (gender: string) => {
    const newGenders = selectedGenders.includes(gender)
      ? selectedGenders.filter(g => g !== gender)
      : [...selectedGenders, gender];
    onGendersChange(newGenders);
  };

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