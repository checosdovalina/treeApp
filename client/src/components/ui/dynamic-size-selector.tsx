import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Ruler } from "lucide-react";

interface DynamicSizeSelectorProps {
  garmentTypeId?: number;
  gender?: string;
  selectedSizes: string[];
  onSizesChange: (sizes: string[]) => void;
  label?: string;
  className?: string;
}

interface SizeRange {
  sizes: string[];
  sizeType: string;
}

export function DynamicSizeSelector({
  garmentTypeId,
  gender,
  selectedSizes,
  onSizesChange,
  label = "Tallas Disponibles",
  className
}: DynamicSizeSelectorProps) {
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [sizeType, setSizeType] = useState<string>("");

  // Fetch available sizes based on garment type and gender
  const { data: sizeRange, isLoading } = useQuery<SizeRange>({
    queryKey: [`/api/size-ranges/available-sizes`, garmentTypeId, gender],
    enabled: !!garmentTypeId && !!gender,
    retry: false,
  });

  useEffect(() => {
    if (sizeRange) {
      setAvailableSizes(sizeRange.sizes || []);
      setSizeType(sizeRange.sizeType || "");
    } else {
      setAvailableSizes([]);
      setSizeType("");
    }
  }, [sizeRange]);

  const handleSizeToggle = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];
    onSizesChange(newSizes);
  };

  const getSizeTypeLabel = (type: string) => {
    switch (type) {
      case 'waist':
        return 'Tallas de Cintura';
      case 'clothing':
        return 'Tallas de Ropa';
      case 'standard':
        return 'Tallas Estándar';
      default:
        return 'Tallas';
    }
  };

  if (!garmentTypeId || !gender) {
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
            {!garmentTypeId && !gender 
              ? "Selecciona el tipo de prenda y género para ver las tallas disponibles"
              : !garmentTypeId 
              ? "Selecciona el tipo de prenda para ver las tallas"
              : "Selecciona al menos un género para ver las tallas disponibles"
            }
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
          {sizeType && (
            <Badge variant="secondary" className="text-xs">
              {getSizeTypeLabel(sizeType)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {availableSizes.length === 0 ? (
          <p className="text-sm text-gray-500">
            No hay tallas configuradas para esta combinación
          </p>
        ) : (
          <ScrollArea className="max-h-32">
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {availableSizes.map((size) => (
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
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        {selectedSizes.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-gray-600 mb-2">Tallas seleccionadas:</p>
            <div className="flex flex-wrap gap-1">
              {selectedSizes.map((size) => (
                <Badge key={size} variant="default" className="text-xs">
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