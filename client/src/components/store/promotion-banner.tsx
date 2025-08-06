import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Promotion } from "@shared/schema";

interface PromotionBannerProps {
  showDismiss?: boolean;
  autoRotate?: boolean;
  rotationInterval?: number;
}

export default function PromotionBanner({ 
  showDismiss = true, 
  autoRotate = true, 
  rotationInterval = 5000 
}: PromotionBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  const { data: promotions = [], isLoading } = useQuery<Promotion[]>({
    queryKey: ["/api/promotions/active"],
    refetchInterval: 60000, // Check for new promotions every minute
  });

  // Auto rotation
  useEffect(() => {
    if (!autoRotate || promotions.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promotions.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, promotions.length, rotationInterval]);

  // Reset index when promotions change
  useEffect(() => {
    setCurrentIndex(0);
  }, [promotions]);

  if (isLoading || isDismissed || promotions.length === 0) {
    return null;
  }

  const currentPromotion = promotions[currentIndex];
  if (!currentPromotion) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % promotions.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  const handleBannerClick = () => {
    if (currentPromotion.linkUrl) {
      window.open(currentPromotion.linkUrl, '_blank');
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Main Banner */}
      <div
        className="relative h-20 md:h-24 flex items-center justify-center cursor-pointer transition-colors duration-300"
        style={{
          backgroundColor: currentPromotion.backgroundColor || "#1F4287",
          color: currentPromotion.textColor || "#FFFFFF",
        }}
        onClick={handleBannerClick}
      >
        {/* Background Image */}
        {currentPromotion.imageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${currentPromotion.imageUrl})` }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-1 md:space-y-0 md:space-x-4">
            <h3 className="text-lg md:text-xl font-bold">
              {currentPromotion.title}
            </h3>
            {currentPromotion.description && (
              <p className="text-sm md:text-base opacity-90">
                {currentPromotion.description}
              </p>
            )}
            {currentPromotion.promoCode && (
              <div className="flex items-center space-x-2">
                <span className="text-xs md:text-sm opacity-75">Código:</span>
                <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs md:text-sm font-mono font-bold">
                  {currentPromotion.promoCode}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Arrows - Only show if multiple promotions */}
        {promotions.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 md:left-4 text-white hover:bg-white hover:bg-opacity-20 h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-12 md:right-16 text-white hover:bg-white hover:bg-opacity-20 h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Dismiss Button */}
        {showDismiss && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 md:right-4 text-white hover:bg-white hover:bg-opacity-20 h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsDismissed(true);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Dots Indicator - Only show if multiple promotions */}
      {promotions.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {promotions.map((_, index: number) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Optional: Create a simpler version for smaller spaces
export function CompactPromotionBanner() {
  const { data: promotions = [] } = useQuery<Promotion[]>({
    queryKey: ["/api/promotions/active"],
  });

  if (promotions.length === 0) return null;

  const promotion = promotions[0]; // Show only the first active promotion

  return (
    <div
      className="h-12 flex items-center justify-center text-sm font-medium cursor-pointer"
      style={{
        backgroundColor: promotion.backgroundColor || "#1F4287",
        color: promotion.textColor || "#FFFFFF",
      }}
      onClick={() => {
        if (promotion.linkUrl) {
          window.open(promotion.linkUrl, '_blank');
        }
      }}
    >
      <div className="flex items-center space-x-2">
        <span>{promotion.title}</span>
        {promotion.promoCode && (
          <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs font-mono">
            {promotion.promoCode}
          </span>
        )}
      </div>
    </div>
  );
}