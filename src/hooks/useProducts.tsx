import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  manufacturer: string;
  price: number;
  imageUrl: string;
  available: boolean;
  manufacturerUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  sort: number;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products and categories in parallel
      const [productsData, categoriesData] = await Promise.all([
        api.getProducts(),
        api.getCategories()
      ]);

      // Map product category identifier (which might be an icon filename like 'med.png' or an ID) 
      // to the actual Category Name (e.g., 'Med i proizvodi od meda')
      const mappedProducts = productsData.map(product => {
        // Try to find category by matching the product's category field against category icon OR name OR id
        const matchedCategory = categoriesData.find(c => 
          c.icon === product.category || 
          c.name === product.category || 
          c.id === product.category
        );
        
        return {
          ...product,
          category: matchedCategory ? matchedCategory.name : product.category
        };
      });

      setProducts(mappedProducts);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch products");
      // Fallback to mock data if API fails (or if spreadsheet ID is missing)
      setProducts(getMockProducts());
      setCategories(getMockCategories());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    categories,
    loading,
    error,
    refetch: fetchProducts,
  };
};

// Mock data for development
const getMockProducts = (): Product[] => [
  {
    id: "1",
    name: "Lavanda Sapun",
    description: "Ručno izrađen sapun sa eteričnim uljem lavande. Nježan za osjetljivu kožu.",
    category: "Prirodna Kozmetika",
    manufacturer: "Marija Handmade",
    price: 650,
    imageUrl: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=500&h=500&fit=crop",
    available: true,
    manufacturerUrl: "https://example.com",
  },
  {
    id: "2",
    name: "Domaći Med - Livadski",
    description: "Čisti livadski med sa porodične pčelinje farme. Bez aditiva.",
    category: "Prehrambeni Proizvodi",
    manufacturer: "Pčelarstvo Petrović",
    price: 1200,
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&h=500&fit=crop",
    available: true,
  },
  {
    id: "3",
    name: "Heklana Torba",
    description: "Jedinstvena heklana torba od prirodnog pamuka. Idealna za ljeto.",
    category: "Rukotvorine",
    manufacturer: "Ana Crafts",
    price: 2500,
    imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&h=500&fit=crop",
    available: true,
    manufacturerUrl: "https://example.com",
  },
  {
    id: "4",
    name: "Laneno Ulje",
    description: "Hladno ceđeno laneno ulje, bogato omega-3 masnim kiselinama.",
    category: "Prehrambeni Proizvodi",
    manufacturer: "Eko Farma Jovanović",
    price: 890,
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=500&fit=crop",
    available: false,
  },
  {
    id: "5",
    name: "Vunene Čarape",
    description: "Ručno pletene vunene čarape. Tople i udobne za zimske dane.",
    category: "Tekstil",
    manufacturer: "Baba Mira Pletivo",
    price: 1500,
    imageUrl: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=500&h=500&fit=crop",
    available: true,
  },
  {
    id: "6",
    name: "Keramička Šolja",
    description: "Ručno oslikana keramička šolja sa tradicionalnim motivima.",
    category: "Dekoracije",
    manufacturer: "Keramika Stojanović",
    price: 950,
    imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop",
    available: true,
    manufacturerUrl: "https://example.com",
  },
  {
    id: "7",
    name: "Domaći Džem od Šljiva",
    description: "Tradicionalni recepti, bez konzervansa. Ukus detinjstva.",
    category: "Prehrambeni Proizvodi",
    manufacturer: "Selo Moje",
    price: 550,
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=500&fit=crop",
    available: true,
  },
  {
    id: "8",
    name: "Krema za Lice - Ruža",
    description: "Hidratantna krema sa ekstraktom divlje ruže. Za sve tipove kože.",
    category: "Prirodna Kozmetika",
    manufacturer: "Marija Handmade",
    price: 1100,
    imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop",
    available: true,
  },
];

const getMockCategories = (): Category[] => [
  { id: "1", name: "Prirodna Kozmetika", description: "Sapuni, kreme, ulja", icon: "🧴", sort: 1 },
  { id: "2", name: "Prehrambeni Proizvodi", description: "Med, džemovi, ulja", icon: "🥗", sort: 2 },
  { id: "3", name: "Rukotvorine", description: "Heklano, pleteno, šiveno", icon: "🧶", sort: 3 },
  { id: "4", name: "Tekstil", description: "Čarape, šalovi, torbe", icon: "👗", sort: 4 },
  { id: "5", name: "Dekoracije", description: "Keramika, drvo, staklo", icon: "🏺", sort: 5 },
];
