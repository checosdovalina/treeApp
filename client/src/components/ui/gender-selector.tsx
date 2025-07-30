import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GenderSelectorProps {
  availableGenders: string[];
  selectedGender?: string;
  onGenderChange: (gender: string) => void;
  className?: string;
  variant?: "buttons" | "dropdown";
}

export function GenderSelector({ 
  availableGenders, 
  selectedGender, 
  onGenderChange, 
  className = "",
  variant = "buttons"
}: GenderSelectorProps) {
  // Si solo hay una opción, no mostrar selector
  if (availableGenders.length <= 1) {
    return null;
  }

  const getGenderDisplayName = (gender: string) => {
    switch (gender) {
      case "masculino": return "Hombre";
      case "femenino": return "Mujer";
      case "unisex": return "Unisex";
      default: return gender;
    }
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case "masculino": return "♂";
      case "femenino": return "♀";
      case "unisex": return "⚥";
      default: return "";
    }
  };

  if (variant === "dropdown") {
    return (
      <div className={`space-y-2 ${className}`}>
        <Label className="text-sm font-roboto">Género</Label>
        <Select value={selectedGender} onValueChange={onGenderChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona género" />
          </SelectTrigger>
          <SelectContent>
            {availableGenders.map((gender) => (
              <SelectItem key={gender} value={gender}>
                <span className="flex items-center gap-2">
                  <span>{getGenderIcon(gender)}</span>
                  {getGenderDisplayName(gender)}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-roboto">Género</Label>
      <div className="flex gap-2 flex-wrap">
        {availableGenders.map((gender) => (
          <Button
            key={gender}
            type="button"
            variant={selectedGender === gender ? "default" : "outline"}
            size="sm"
            onClick={() => onGenderChange(gender)}
            className="flex items-center gap-1"
          >
            <span>{getGenderIcon(gender)}</span>
            {getGenderDisplayName(gender)}
          </Button>
        ))}
      </div>
    </div>
  );
}