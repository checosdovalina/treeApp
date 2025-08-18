import { Badge } from "@/components/ui/badge";
import { useDiscount } from "@/hooks/useDiscount";
import { Crown, Star, User, Shield } from "lucide-react";

interface DiscountBadgeProps {
  showLabel?: boolean;
  className?: string;
}

export default function DiscountBadge({ showLabel = true, className = "" }: DiscountBadgeProps) {
  const { getDiscountInfo } = useDiscount();
  const discountInfo = getDiscountInfo();

  const getRoleIcon = () => {
    switch (discountInfo.userRole) {
      case 'admin':
        return <Shield className="h-3 w-3" />;
      case 'premium':
        return <Crown className="h-3 w-3" />;
      case 'regular':
        return <Star className="h-3 w-3" />;
      case 'basic':
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const getBadgeVariant = () => {
    switch (discountInfo.userRole) {
      case 'admin':
        return "default";
      case 'premium':
        return "secondary";
      case 'regular':
        return "outline";
      case 'basic':
      default:
        return "secondary";
    }
  };

  const getBadgeColor = () => {
    switch (discountInfo.userRole) {
      case 'admin':
        return "bg-uniform-primary text-white hover:bg-uniform-primary/90";
      case 'premium':
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700";
      case 'regular':
        return "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200";
      case 'basic':
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  if (!showLabel && discountInfo.userRole === 'basic') {
    return null; // No mostrar badge para usuarios básicos si no queremos mostrar label
  }

  return (
    <Badge 
      variant={getBadgeVariant()}
      className={`flex items-center space-x-1 text-xs font-medium ${getBadgeColor()} ${className}`}
    >
      {getRoleIcon()}
      {showLabel && (
        <span>
          {discountInfo.userRole === 'admin' 
            ? discountInfo.roleLabel
            : discountInfo.discountLabel
          }
        </span>
      )}
    </Badge>
  );
}