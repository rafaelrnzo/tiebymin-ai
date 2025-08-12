export interface BodyShape {
  id: string;
  name: string;
  penjelasan_body_shape: string;
  tips_body_shape: string;
  link_picture: string;
}

export interface BmiCategory {
  id: string;
  kategori: string;
  penjelasan_kategori: string;
  tips_fashion: string;
}

export interface Celebrity {
  id: string;
  name: string;
  similarity_text: string;
  description: string;
  picture_url: string;
}

export interface ColorAnalysis {
  id: string;
  name: string;
  penjelasan_color_analysis: string;
  make_up_tips: string;
  tips_warna_kulit_pakaian: string;
  personality: string;
  karakteristik: string;
  best_colour: string[];
  worst_colour: string[];
  neutral_colour: string[];
  best_colour_combination: string[][];
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
}