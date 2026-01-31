import { Product, Category } from "@/hooks/useProducts";
import { transformGoogleDriveUrl } from "@/lib/imageOptimization";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;

export const api = {
  async getProducts(): Promise<Product[]> {
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
    
    return (result.values || []).map((row: string[], index: number) => ({
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
  },

  async getCategories(): Promise<Category[]> {
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

    return (result.values || []).map((row: string[], index: number) => ({
      id: row[0] || `sheet-cat-${index}`,
      name: row[1] || "Nova kategorija",
      description: row[2] || "",
      icon: row[3] || "Package", 
      sort: Number(row[4]) || 0,
    }));
  },

  async sendEmail(type: "contact" | "newsletter" | "order", data: any) {
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
