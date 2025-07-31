import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Ruler } from "lucide-react";

interface MultiGenderSizeSelectorProps {
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

export function MultiGenderSizeSelector({
  garmentTypeId,
  genders,
  selectedSizes,
  onSizesChange,
  label = "Tallas Disponibles",
  className
}: MultiGenderSizeSelectorProps) {
  const [availableSizes, setAvailableSizes] = useState<{[key: string]: string[]}>({});
  const [combinedSizes, setCombinedSizes] = useState<string[]>([]);

  // Fetch available sizes for each gender
  const genderQueries = genders.map(gender => 
    useQuery<SizeRangeData>({
      queryKey: [`/api/size-ranges/available-sizes`, garmentTypeId, gender],
      enabled: !!garmentTypeId && !!gender,
      retry: false,
      select: (data) => ({ ...data, gender })
    })
  );

  useEffect(() => {
    const newAvailableSizes: {[key: string]: string[]} = {};
    const allSizes = new Set<string>();
    
    genderQueries.forEach((query, index) => {
      if (query.data) {
        const gender = genders[index];
        newAvailableSizes[gender] = query.data.sizes || [];
        query.data.sizes?.forEach(size => allSizes.add(size));
      }
    });
    
    setAvailableSizes(newAvailableSizes);
    setCombinedSizes(Array.from(allSizes).sort((a, b) => {
      // Sort sizes intelligently (numeric first, then alphabetic)
      const aNum = parseInt(a);
      const bNum = parseInt(b);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }
      return a.localeCompare(b);
    }));
  }, [genderQueries.map(q => q.data).join(','), genders.join(',')]);

  const handleSizeToggle = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];
    onSizesChange(newSizes);
  };

  const getSizeBadgeColor = (size: string) => {
    const availableIn = genders.filter(gender => availableSizes[gender]?.includes(size));
    if (availableIn.length === genders.length) {
      return "bg-green-100 text-green-800 border-green-300";
    } else if (availableIn.length > 1) {
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    } else {
      return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  const getSizeTooltip = (size: string) => {
    const availableIn = genders.filter(gender => availableSizes[gender]?.includes(size));
    return `Disponible en: ${availableIn.join(', ')}`;
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

  const isLoading = genderQueries.some(q => q.isLoading);

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
          <div className="grid grid-cols-4 gap-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-roboto flex items-center gap-2">
          <Ruler className="h-4 w-4" />
          {label}
          {genders.length > 1 && (
            <Badge variant="secondary" className="text-xs">
              Múltiples géneros
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {combinedSizes.length === 0 ? (
          <p className="text-sm text-gray-500">
            No hay tallas configuradas para esta combinación
          </p>
        ) : (
          <>
            <ScrollArea className="max-h-40">
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {combinedSizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size}`}
                      checked={selectedSizes.includes(size)}
                      onCheckedChange={() => handleSizeToggle(size)}
                      className="data-[state=checked]:bg-uniform-primary"
                    />
                    <Label
                      htmlFor={`size-${size}`}
                      className="text-sm font-roboto cursor-pointer"
                      title={getSizeTooltip(size)}
                    >
                      {size}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {genders.length > 1 && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-gray-600 mb-2">Leyenda de disponibilidad:</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 rounded bg-green-100 text-green-800">
                    Todos los géneros
                  </span>
                  <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                    Algunos géneros
                  </span>
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-800">
                    Un género
                  </span>
                </div>
              </div>
            )}
          </>
        )}
        
        {selectedSizes.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-gray-600 mb-2">Tallas seleccionadas:</p>
            <div className="flex flex-wrap gap-1">
              {selectedSizes.map((size) => (
                <Badge 
                  key={size} 
                  variant="default" 
                  className={`text-xs ${getSizeBadgeColor(size)}`}
                  title={getSizeTooltip(size)}
                >
                  {size}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}