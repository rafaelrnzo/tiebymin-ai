export interface BodyShapeData {
  id: string;
  name: string;
  penjelasan_body_shape: string;
  tips_body_shape: string;
  link_picture: string;
  karakteristik:string;
}

export interface BodyType {
  id: string;
  name: string;
  link_picture: string;
  penjelasan_body_shape: string;
  karakteristik: string;
}

export interface BmiCategory {
  id: string;
  kategori: string;
  penjelasan_kategori: string;
  tips_fashion: string;
}

export interface ProductColor {
  id: string;
  name: string;
  hex_code: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  original_price: number;
  current_price: number;
  discount_percentage?: number;
  average_rating: number;
  total_reviews?: number;
  size_range: string;
  brand?: string;
  category?: string;
  product_link: string;
  images: string[];
  is_active?: boolean;
  stock_quantity?: number;
  created_at?: string;
  updated_at?: string;
  color_recommendations?: string[];
  score_breakdown?: {
    face?: number;
    body?: number;
    bmi?: number;
    color: number;
    reasons: string[];
  };
  total_score?: number;
  total_compatibility_score: number;
  compatibility_reason?: string;
}

export interface Celebrity {
  id: string;
  name: string;
  similarity_text: string;
  description: string;
  picture_url: string;
  faceshape_id: string;
  color_analysis_id: string;
}

export interface ColorAnalysis {
  id: string;
  name: string;
  description: string;
  best_colour?: string[];
  best_colors?: string[];
  neutral_colour?: string[];
  neutral_colors?: string[];
  worst_colour?: string[];
  worst_colors?: string[];
  best_colour_combination?: string[];
  combination_colors?: string[][];
  make_up_tips: string;
  tips_warna_kulit_pakaian: string;
  personality: string;
  karakteristik: string;
  penjelasan_color_analysis: string;
  color_tips_summary?: string;
}

export interface FaceShape {
  id: string;
  name: string;
  description: string;
  karakteristik: string;
  tips_bentuk_wajah: string;
  penjelasan_face_shape: string;
}

export interface UserData {
  name: string;
  faceShape: string;
  bodyShape: string;
  colorTone: string;
  bmi: {
    value: number;
    category: string;
    desc: string;
  };
  celebrityMatch: {
    name: string;
    matchPercentage: number;
    imageUrl: string;
    reason: string[];
    description: string;
  };
  faceShapeAnalysis: {
    uniqueFact: string;
    karakteristik: string;
  };
  bodyShapeAnalysis: {
    description: string;
    karakteristik: string;
    imageUrl: string;
  };
  colorToneAnalysis: {
    description: string;
    bestColors: string[];
    neutralColors: string[];
    worstColors: string[];
    combination: string[][];
    tips: {
      makeup: string[];
      outfit: string[];
      personality: string[];
      karakteristik: string[];
    };
  };
  conclusionTips: {
    face: string[];
    body: string[];
    color: string[];
    quickRecap: string[];
  };
}

export interface AllTips {
  faceTip: string;
  bodyTip: string;
  colorTip: string;
  makeupTip: string;
  bmiTip: string;
}

export interface AnalysisData {
  face_shape_id: string;
  color_analysis_id: string;
  body_shape_id: string;
  bmi_category_id: string;
  analysis_details?: Record<string, unknown>;
  celebrity?: Celebrity;
}
