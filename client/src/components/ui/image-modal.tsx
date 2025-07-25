import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface ImageModalProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageModal({ src, alt, isOpen, onClose }: ImageModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const resetTransforms = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleClose = () => {
    resetTransforms();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-black/90">
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        
        {/* Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="bg-white/20 hover:bg-white/30 text-white"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            className="bg-white/20 hover:bg-white/30 text-white"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRotate}
            className="bg-white/20 hover:bg-white/30 text-white"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={resetTransforms}
            className="bg-white/20 hover:bg-white/30 text-white"
          >
            Reset
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={handleClose}
            className="bg-white/20 hover:bg-white/30 text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Zoom indicator */}
        <div className="absolute top-4 left-4 z-10 bg-white/20 text-white px-3 py-1 rounded-md text-sm">
          {Math.round(zoom * 100)}%
        </div>

        {/* Image container */}
        <div className="flex items-center justify-center w-full h-[95vh] overflow-auto">
          <img
            src={src}
            alt={alt}
            className="max-w-none transition-transform duration-200 ease-in-out cursor-grab active:cursor-grabbing"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'center center'
            }}
            draggable={false}
            onDoubleClick={handleZoomIn}
          />
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white/20 text-white px-4 py-2 rounded-md text-sm text-center">
          Doble clic para ampliar • Usa los controles para zoom y rotación
        </div>
      </DialogContent>
    </Dialog>
  );
}