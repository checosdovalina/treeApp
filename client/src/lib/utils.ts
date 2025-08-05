import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getValidImageUrl(images: string[], index: number = 0): string {
  if (!images || images.length === 0) {
    return '';
  }
  
  const imageIndex = Math.min(index, images.length - 1);
  return images[imageIndex] || '';
}
