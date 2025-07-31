import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Ruler, User } from "lucide-react";

interface SeparatedGenderSizeSelectorProps {
  garmentTypeId?: number;
  genders: string[];
  selectedSizes: string[];
  onSizesChange: (sizes: string[]) => void;
  label?: string;
  className?: string;
}

interface SizeRangeData {
  sizes: string[];
  sizeType: string;
  gender: string;
}

export function SeparatedGenderSizeSelector({
  garmentTypeId,
  genders,
  selectedSizes,
  onSizesChange,
  label = "Tallas por Género",
  className
}: SeparatedGenderSizeSelectorProps) {

  // Fetch sizes for masculine gender
  const { data: masculineData } = useQuery<SizeRangeData>({
    queryKey: [`/api/size-ranges/available-sizes`, garmentTypeId, 'masculino'],
    enabled: !!garmentTypeId && genders.includes('masculino'),
    retry: false,
  });

  // Fetch sizes for feminine gender
  const { data: feminineData } = useQuery<SizeRangeData>({
    queryKey: [`/api/size-ranges/available-sizes`, garmentTypeId, 'femenino'],
    enabled: !!garmentTypeId && genders.includes('femenino'),
    retry: false,
  });

  // Fetch sizes for unisex gender
  const { data: unisexData, isLoading } = useQuery<SizeRangeData>({
    queryKey: [`/api/size-ranges/available-sizes`, garmentTypeId, 'unisex'],
    enabled: !!garmentTypeId && genders.includes('unisex'),
    retry: false,
  });

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

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case "masculino": return "bg-blue-50 border-blue-200";
      case "femenino": return "bg-pink-50 border-pink-200";
      case "unisex": return "bg-green-50 border-green-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  const getSizesForGender = (gender: string): string[] => {
    switch (gender) {
      case "masculino": return masculineData?.sizes || [];
      case "femenino": return feminineData?.sizes || [];
      case "unisex": return unisexData?.sizes || [];
      default: return [];
    }
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];
    onSizesChange(newSizes);
  };

  const getSizeTypeLabel = (gender: string) => {
    const data = gender === 'masculino' ? masculineData : gender === 'femenino' ? feminineData : unisexData;
    switch (data?.sizeType) {
      case 'waist': return '(Tallas de cintura)';
      case 'clothing': return '(Tallas de ropa)';
      case 'standard': return '(Tallas estándar)';
      default: return '';
    }
  };

  if (!garmentTypeId || genders.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-sm font-roboto flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            {label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Selecciona el tipo de prenda y al menos un género para ver las tallas disponibles
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-sm font-roboto flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            {label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {genders.map((gender) => (
              <div key={gender} className="h-32 bg-gray-200 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Ruler className="h-4 w-4" />
        <h3 className="text-lg font-poppins">{label}</h3>
      </div>
      
      {genders.map((gender) => {
        const sizes = getSizesForGender(gender);
        const sizeTypeLabel = getSizeTypeLabel(gender);
        
        return (
          <Card key={gender} className={`${getGenderColor(gender)} border-2`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-roboto flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-2xl mr-1">{getGenderIcon(gender)}</span>
                {getGenderDisplayName(gender)}
                <span className="text-xs text-gray-600 font-normal ml-2">
                  {sizeTypeLabel}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sizes.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No hay tallas configuradas para este género
                </p>
              ) : (
                <>
                  <ScrollArea className="max-h-32">
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                      {sizes.map((size) => (
                        <div key={`${gender}-${size}`} className="flex items-center space-x-2">
                          <Checkbox
                            id={`size-${gender}-${size}`}
                            checked={selectedSizes.includes(size)}
                            onCheckedChange={() => handleSizeToggle(size)}
                            className="data-[state=checked]:bg-uniform-primary"
                          />
                          <Label
                            htmlFor={`size-${gender}-${size}`}
                            className="text-sm font-roboto cursor-pointer"
                          >
                            {size}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  {/* Mostrar tallas seleccionadas para este género */}
                  {(() => {
                    const selectedForGender = selectedSizes.filter(size => sizes.includes(size));
                    return selectedForGender.length > 0 ? (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-600 mb-2">
                          Tallas seleccionadas en {getGenderDisplayName(gender).toLowerCase()}:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {selectedForGender.map((size) => (
                            <Badge 
                              key={size} 
                              variant="default" 
                              className="text-xs bg-uniform-primary text-white"
                            >
                              {size}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
      
      {/* Resumen total de tallas seleccionadas */}
      {selectedSizes.length > 0 && (
        <Card className="bg-gray-50 border-gray-300">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-roboto text-gray-700">
                Total de tallas seleccionadas: {selectedSizes.length}
              </p>
              <div className="flex flex-wrap gap-1">
                {selectedSizes.map((size) => (
                  <Badge key={size} variant="outline" className="text-xs">
                    {size}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}