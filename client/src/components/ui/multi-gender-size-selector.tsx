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

  // Fetch sizes for masculine gender
  const { data: masculineData } = useQuery<SizeRangeData>({
    queryKey: [`/api/size-ranges/available-sizes?garmentTypeId=${garmentTypeId}&gender=masculino`],
    enabled: !!garmentTypeId && genders.includes('masculino'),
    retry: false,
    staleTime: 0, // Force fresh data
    gcTime: 0, // Don't cache
  });

  // Fetch sizes for feminine gender
  const { data: feminineData } = useQuery<SizeRangeData>({
    queryKey: [`/api/size-ranges/available-sizes?garmentTypeId=${garmentTypeId}&gender=femenino`],
    enabled: !!garmentTypeId && genders.includes('femenino'),
    retry: false,
    staleTime: 0, // Force fresh data
    gcTime: 0, // Don't cache
  });

  // Fetch sizes for unisex gender
  const { data: unisexData, isLoading } = useQuery<SizeRangeData>({
    queryKey: [`/api/size-ranges/available-sizes?garmentTypeId=${garmentTypeId}&gender=unisex`],
    enabled: !!garmentTypeId && genders.includes('unisex'),
    retry: false,
    staleTime: 0, // Force fresh data
    gcTime: 0, // Don't cache
  });

  useEffect(() => {
    const newAvailableSizes: {[key: string]: string[]} = {};
    const allSizes = new Set<string>();
    
    // Process each gender's data
    if (masculineData && genders.includes('masculino')) {
      newAvailableSizes['masculino'] = masculineData.sizes || [];
      masculineData.sizes?.forEach((size: string) => allSizes.add(size));
    }
    
    if (feminineData && genders.includes('femenino')) {
      newAvailableSizes['femenino'] = feminineData.sizes || [];
      feminineData.sizes?.forEach((size: string) => allSizes.add(size));
    }
    
    if (unisexData && genders.includes('unisex')) {
      newAvailableSizes['unisex'] = unisexData.sizes || [];
      unisexData.sizes?.forEach((size: string) => allSizes.add(size));
    }
    
    setAvailableSizes(newAvailableSizes);
    setCombinedSizes(Array.from(allSizes).sort((a, b) => {
      // Define size order for clothing sizes
      const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];
      const aIndex = sizeOrder.indexOf(a);
      const bIndex = sizeOrder.indexOf(b);
      
      // If both are clothing sizes, use predefined order
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      
      // If only one is a clothing size, prioritize it
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      
      // For numeric sizes (waist, etc.)
      const aNum = parseInt(a);
      const bNum = parseInt(b);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }
      
      // Default alphabetic sort
      return a.localeCompare(b);
    }));
  }, [masculineData, feminineData, unisexData, genders]);

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