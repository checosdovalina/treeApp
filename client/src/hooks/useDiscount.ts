import { useAuth } from "./useAuth";

export interface DiscountInfo {
  discountPercent: number;
  userRole: 'admin' | 'premium' | 'regular' | 'basic';
  roleLabel: string;
  discountLabel: string;
}

export function useDiscount() {
  const { user } = useAuth();
  
  const getDiscountInfo = (): DiscountInfo => {
    const userRole = (user as any)?.role || 'basic';
    
    switch (userRole) {
      case 'admin':
        return {
          discountPercent: 0, // Admin no necesita descuentos
          userRole: 'admin',
          roleLabel: 'Administrador',
          discountLabel: 'Acceso completo'
        };
      case 'premium':
        return {
          discountPercent: 15,
          userRole: 'premium',
          roleLabel: 'Cliente Premium',
          discountLabel: '15% de descuento'
        };
      case 'regular':
        return {
          discountPercent: 8,
          userRole: 'regular', 
          roleLabel: 'Cliente Regular',
          discountLabel: '8% de descuento'
        };
      case 'basic':
      default:
        return {
          discountPercent: 0,
          userRole: 'basic',
          roleLabel: 'Cliente Básico',
          discountLabel: 'Sin descuentos'
        };
    }
  };

  const calculateDiscountedPrice = (originalPrice: number): { 
    originalPrice: number; 
    discountedPrice: number; 
    savings: number; 
    discountPercent: number;
  } => {
    const { discountPercent } = getDiscountInfo();
    const discountedPrice = originalPrice * (1 - discountPercent / 100);
    const savings = originalPrice - discountedPrice;
    
    return {
      originalPrice,
      discountedPrice,
      savings,
      discountPercent
    };
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  return {
    getDiscountInfo,
    calculateDiscountedPrice,
    formatPrice
  };
}