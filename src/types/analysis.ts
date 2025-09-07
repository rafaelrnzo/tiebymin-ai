import { UserData } from "./index";

export interface AnalysisData {
  face_shape_id?: string;
  color_analysis_id?: string;
  body_shape_id?: string;
  bmi_category_id?: string;
  celebrity_id?: string;
  analysis_details?: {
    bmi: {
      bmi_value: number;
    };
  };
}

export interface AnalysisResult {
  userData: UserData | null;
  userPhotoUrl: string | null;
  rawAnalysisData: AnalysisData | null;
}

export interface PaymentData {
  user_id: string;
  tinggi_badan: number;
  berat_badan: number;
  umur: number;
  body_shape_id: string;
  amount: number;
  foto_wajah: Blob;
}