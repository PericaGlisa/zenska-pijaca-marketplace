import { Product, Category } from "@/hooks/useProducts";
import { transformGoogleDriveUrl } from "@/lib/imageOptimization";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;

// Cache configuration
const CACHE_PREFIX = "zp_cache_";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

const getFromCache = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(CACHE_PREFIX + key);
    if (!item) return null;
    
    const entry: CacheEntry<T> = JSON.parse(item);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    
    return entry.data;
  } catch (e) {
    return null;
  }
};

const saveToCache = <T>(key: string, data: T): void => {
  try {
    const entry: CacheEntry<T> = {
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch (e) {
    // Ignore quota errors
  }
};

export const api = {
  async getProducts(): Promise<Product[]> {
    const cacheKey = "products";
    const cached = getFromCache<Product[]>(cacheKey);
    if (cached) return cached;

    if (!SPREADSHEET_ID || SPREADSHEET_ID === "PLACEHOLDER_SPREADSHEET_ID") {
      console.warn("Spreadsheet ID not set");
      // Return empty array or throw error depending on preference. 
      // For now, logging warning and returning empty to prevent crash.
      return [];
    }
    
    // Assumes "Products" sheet exists
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Products!A2:Z?key=${GOOGLE_API_KEY}`;
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.error) {
      console.error("Google Sheets API Error:", result.error);
      throw new Error(result.error.message);
    }
    
    const products = (result.values || []).map((row: string[], index: number) => ({
      id: row[0] || `sheet-prod-${index}`,
      name: row[1] || "Nepoznat proizvod",
      description: row[2] || "",
      category: row[3] || "Ostalo",
      manufacturer: row[4] || "",
      price: Number(row[5]?.replace(/[^0-9.-]+/g,"")) || 0,
      imageUrl: transformGoogleDriveUrl(row[6] || ""),
      available: (row[7]?.toLowerCase() === "true" || row[7]?.toLowerCase() === "da"),
      manufacturerUrl: row[8] || "",
    }));

    saveToCache(cacheKey, products);
    return products;
  },

  async getCategories(): Promise<Category[]> {
    const cacheKey = "categories";
    const cached = getFromCache<Category[]>(cacheKey);
    if (cached) return cached;

     if (!SPREADSHEET_ID || SPREADSHEET_ID === "PLACEHOLDER_SPREADSHEET_ID") {
      return [];
    }
    
    // Assumes "Categories" sheet exists
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Categories!A2:Z?key=${GOOGLE_API_KEY}`;
    const response = await fetch(url);
    const result = await response.json();

    if (result.error) {
       console.error("Google Sheets API Error:", result.error);
       throw new Error(result.error.message);
    }

    const categories = (result.values || []).map((row: string[], index: number) => ({
      id: row[0] || `sheet-cat-${index}`,
      name: row[1] || "Nova kategorija",
      description: row[2] || "",
      // Apply Google Drive URL transformation to icon field as well, in case it's a link
      icon: transformGoogleDriveUrl(row[3] || "Package"), 
      sort: Number(row[4]) || 0,
    }));

    saveToCache(cacheKey, categories);
    return categories;
  },

  async sendEmail(type: "contact" | "newsletter" | "order", data: unknown) {
    // Call Netlify Function
    const response = await fetch("/.netlify/functions/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, data }),
    });
    
    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(err.error || "Failed to send email");
    }
    return response.json();
  }
};
