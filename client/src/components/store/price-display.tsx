import { useDiscount } from "@/hooks/useDiscount";
import { Badge } from "@/components/ui/badge";

interface PriceDisplayProps {
  price: number;
  showDiscount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function PriceDisplay({ 
  price, 
  showDiscount = true, 
  size = 'md',
  className = "" 
}: PriceDisplayProps) {
  const { calculateDiscountedPrice, formatPrice, getDiscountInfo } = useDiscount();
  const { originalPrice, discountedPrice, savings, discountPercent } = calculateDiscountedPrice(price);
  const { userRole } = getDiscountInfo();

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          originalPrice: 'text-sm',
          discountedPrice: 'text-base font-semibold',
          savings: 'text-xs',
          badge: 'text-xs'
        };
      case 'lg':
        return {
          originalPrice: 'text-lg',
          discountedPrice: 'text-2xl font-bold',
          savings: 'text-sm',
          badge: 'text-sm'
        };
      case 'md':
      default:
        return {
          originalPrice: 'text-base',
          discountedPrice: 'text-xl font-semibold',
          savings: 'text-sm',
          badge: 'text-xs'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  // Si no hay descuento o es usuario básico, mostrar precio normal
  if (!showDiscount || discountPercent === 0 || userRole === 'basic') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <span className={`text-uniform-primary font-semibold ${sizeClasses.discountedPrice}`}>
          {formatPrice(price)}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <div className="flex items-center space-x-2">
        <span className={`text-uniform-primary font-semibold ${sizeClasses.discountedPrice}`}>
          {formatPrice(discountedPrice)}
        </span>
        {discountPercent > 0 && (
          <Badge variant="destructive" className={`${sizeClasses.badge}`}>
            -{discountPercent}%
          </Badge>
        )}
      </div>
      
      {discountPercent > 0 && (
        <div className="flex items-center space-x-2">
          <span className={`text-gray-500 line-through ${sizeClasses.originalPrice}`}>
            {formatPrice(originalPrice)}
          </span>
          <span className={`text-green-600 font-medium ${sizeClasses.savings}`}>
            Ahorras {formatPrice(savings)}
          </span>
        </div>
      )}
    </div>
  );
}