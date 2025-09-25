import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ZoomIn, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageZoom({ src, alt, className = "" }: ImageZoomProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;

    const deltaX = e.clientX - lastMousePosition.x;
    const deltaY = e.clientY - lastMousePosition.y;

    setPosition(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));

    setLastMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setLastMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    const newZoom = Math.max(1, Math.min(4, zoom + delta));
    
    if (newZoom === 1) {
      setPosition({ x: 0, y: 0 });
    }
    
    setZoom(newZoom);
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    const newZoom = Math.min(4, zoom + 0.5);
    setZoom(newZoom);
  };

  const zoomOut = () => {
    const newZoom = Math.max(1, zoom - 0.5);
    if (newZoom === 1) {
      setPosition({ x: 0, y: 0 });
    }
    setZoom(newZoom);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={`relative group cursor-zoom-in ${className}`}>
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-contain transition-all duration-200 group-hover:scale-110 scale-80"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
            <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8" />
          </div>
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black">
        <div className="relative w-full h-full overflow-hidden">
          {/* Controls */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={zoomOut}
              disabled={zoom <= 1}
              className="bg-white/20 hover:bg-white/30 text-white border-none"
            >
              -
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={resetZoom}
              className="bg-white/20 hover:bg-white/30 text-white border-none"
            >
              {Math.round(zoom * 100)}%
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={zoomIn}
              disabled={zoom >= 4}
              className="bg-white/20 hover:bg-white/30 text-white border-none"
            >
              +
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="bg-white/20 hover:bg-white/30 text-white border-none"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Image */}
          <div 
            className="w-full h-full flex items-center justify-center"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            <img
              ref={imageRef}
              src={src}
              alt={alt}
              className="max-w-none transition-transform duration-200"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                userSelect: 'none',
                pointerEvents: 'none'
              }}
              draggable={false}
            />
          </div>

          {/* Instructions */}
          {zoom <= 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded">
              Rueda del ratón para hacer zoom • Arrastra para mover
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}