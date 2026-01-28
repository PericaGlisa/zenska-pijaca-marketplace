// Category-specific placeholder images for products and categories
// These are used as fallbacks when Google Drive images are not available

export const categoryPlaceholders: Record<string, string> = {
  // Food products
  "Med": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop",
  "Jaja": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&h=600&fit=crop",
  "Brašno": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=600&fit=crop",
  "Sokovi": "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=600&h=600&fit=crop",
  "Sirupi": "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop",
  "Zimnica": "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=600&h=600&fit=crop",
  "Mlečni proizvodi": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&h=600&fit=crop",
  "Voće i povrće": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&h=600&fit=crop",
  "Voće": "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&h=600&fit=crop",
  "Povrće": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=600&fit=crop",
  "Orasi": "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=600&h=600&fit=crop",
  "Bilje": "https://images.unsplash.com/photo-1515586838455-8f8c940d6853?w=600&h=600&fit=crop",
  "Čajevi": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop",
  "Prehrambeni Proizvodi": "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&h=600&fit=crop",
  
  // Handmade & Crafts
  "Rukotvorine": "https://images.unsplash.com/photo-1528396518501-b53b655eb9b3?w=600&h=600&fit=crop",
  "Ručni radovi": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
  "Heklano": "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=600&h=600&fit=crop",
  "Pletivo": "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=600&fit=crop",
  "Tekstil": "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&h=600&fit=crop",
  
  // Cosmetics & Personal care
  "Kozmetika": "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop",
  "Prirodna Kozmetika": "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=600&h=600&fit=crop",
  "Sapuni": "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=600&h=600&fit=crop",
  
  // Home & Decoration
  "Dekoracije": "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop",
  "Keramika": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=600&fit=crop",
  
  // Icon-based mappings (for matching by icon field)
  "jaja.png": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&h=600&fit=crop",
  "brašno.png": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=600&fit=crop",
  "Bilje.png": "https://images.unsplash.com/photo-1515586838455-8f8c940d6853?w=600&h=600&fit=crop",
  "med.png": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop",
  "orah.png": "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=600&h=600&fit=crop",
  "Povrće.png": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=600&fit=crop",
  "ručni radovi.png": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
  "sveže.png": "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=600&fit=crop",
  "voće.png": "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&h=600&fit=crop",
  "mleko.png": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&h=600&fit=crop",
};

// Default fallback image when no category match is found
export const defaultPlaceholder = "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop";

/**
 * Get placeholder image URL for a given category
 * @param category - Category name or icon filename
 * @returns Placeholder image URL
 */
export const getPlaceholderForCategory = (category: string): string => {
  // Try exact match first
  if (categoryPlaceholders[category]) {
    return categoryPlaceholders[category];
  }
  
  // Try case-insensitive match
  const lowerCategory = category.toLowerCase();
  for (const [key, value] of Object.entries(categoryPlaceholders)) {
    if (key.toLowerCase() === lowerCategory) {
      return value;
    }
  }
  
  // Try partial match (for categories that might contain the keyword)
  for (const [key, value] of Object.entries(categoryPlaceholders)) {
    if (lowerCategory.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerCategory)) {
      return value;
    }
  }
  
  return defaultPlaceholder;
};

/**
 * Check if a URL is valid (not a filename or empty)
 * @param url - URL to check
 * @returns true if URL appears to be valid
 */
export const isValidImageUrl = (url: string | undefined | null): boolean => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  // Check if it starts with http:// or https://
  return trimmed.startsWith('http://') || trimmed.startsWith('https://');
};

/**
 * Get the best available image URL, falling back to category placeholder
 * @param imageUrl - Original image URL from data
 * @param category - Category for fallback selection
 * @returns Valid image URL
 */
export const getImageWithFallback = (imageUrl: string | undefined | null, category: string): string => {
  if (isValidImageUrl(imageUrl)) {
    return imageUrl!;
  }
  return getPlaceholderForCategory(category);
};
