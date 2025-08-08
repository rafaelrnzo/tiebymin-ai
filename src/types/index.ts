

export interface Product {
  id: string;
  name: string;
  description: string;
  original_price: number;
  current_price: number;
  discount_percentage: number | null;
  average_rating: number;
  total_reviews: number;
  size_range: string;
  brand: string | null;
  category: string;
  product_link: string;
  images: string[];
  is_active: boolean;
  stock_quantity: number;
  created_at: string; 
  updated_at: string; 
}

export interface BMICategory {
  id: string;
  kategori: string;
  min_bmi: number;
  max_bmi: number | null;
  tips_fashion: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}