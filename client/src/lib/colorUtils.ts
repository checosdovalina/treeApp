// Utility to map color names to hex codes
interface ColorData {
  name: string;
  hexCode: string;
}

// Cache for color mappings
let colorCache: Map<string, string> | null = null;

export async function getColorHex(colorName: string): Promise<string> {
  // Initialize cache if not exists
  if (!colorCache) {
    try {
      const response = await fetch('/api/colors');
      if (response.ok) {
        const colors: ColorData[] = await response.json();
        colorCache = new Map();
        colors.forEach(color => {
          colorCache!.set(color.name.toLowerCase(), color.hexCode);
        });
      }
    } catch (error) {
      console.error('Error loading colors:', error);
    }
  }

  // Return hex code or fallback color
  return colorCache?.get(colorName.toLowerCase()) || getColorFallback(colorName);
}

// Fallback function for common colors when API is not available
function getColorFallback(colorName: string): string {
  const fallbackColors: Record<string, string> = {
    'blanco': '#FFFFFF',
    'negro': '#000000',
    'azul': '#0066CC',
    'azul marino': '#001F3F',
    'azul claro': '#87CEEB',
    'rojo': '#FF0000',
    'verde': '#008000',
    'verde quirófano': '#00CED1',
    'amarillo': '#FFFF00',
    'naranja': '#FFA500',
    'naranja alta visibilidad': '#FF6600',
    'gris': '#808080',
    'gris claro': '#D3D3D3',
    'morado': '#800080',
    'rosa': '#FFC0CB',
    'café': '#8B4513',
    'beige': '#F5F5DC'
  };

  return fallbackColors[colorName.toLowerCase()] || '#CCCCCC';
}

// Function to get all colors for components that need them
export async function getAllColors(): Promise<ColorData[]> {
  try {
    const response = await fetch('/api/colors');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error loading colors:', error);
  }
  return [];
}

// Simple color mapping object for immediate use
export const colorMap: Record<string, string> = {
  'Blanco': '#FFFFFF',
  'Negro': '#000000', 
  'Azul': '#0066CC',
  'Azul Marino': '#001F3F',
  'Azul Claro': '#87CEEB',
  'Rojo': '#FF0000',
  'Verde': '#008000',
  'Verde Quirófano': '#00CED1',
  'Amarillo': '#FFFF00',
  'Naranja': '#FFA500',
  'Naranja Alta Visibilidad': '#FF6600',
  'Gris': '#808080',
  'Gris Claro': '#D3D3D3',
  'Morado': '#800080',
  'Rosa': '#FFC0CB',
  'Café': '#8B4513',
  'Beige': '#F5F5DC'
};