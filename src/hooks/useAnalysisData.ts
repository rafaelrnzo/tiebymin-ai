import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import url from '@/lib/url';
import { AnalysisData as GlobalAnalysisData } from '@/types';

// Interfaces for API data
interface AnalysisData extends GlobalAnalysisData {
  user_name?: string;
  celebrity_id: number | null;
  analysis_details: {
    bmi: {
      value: string | number;
    };
  };
}

interface PhotoData {
  is_processed: boolean;
  file_path: string;
  photo_type: "face_original" | "face_processed" | string;
}

interface FaceShapeData {
  name: string;
  description: string;
  characteristics: string[];
}

interface ColorToneData {
  name: string;
  description: string;
  best_colors: string[];
  neutral_colors: string[];
  worst_colors: string[];
  combination_colors: string[];
  tips?: {
    makeup: string[];
    outfit: string[];
    personality: string[];
    characteristics: string[];
  };
}

interface BodyShapeData {
  name: string;
  description: string;
  characteristics: string[];
}

// Interface tidak digunakan, dikomentari untuk menghindari peringatan linter
// interface BMICategoryData {
//   name: string;
//   description: string;
// }

interface CelebrityData {
  name: string;
  match_percentage: number;
  reason: string;
  image_url?: string;
}

// Transformed data structure for components
export interface UserData {
  name: string;
  faceShape: string;
  bodyShape: string;
  colorTone: string;
  bmi: number | string;
  celebrityMatch: {
    name: string;
    matchPercentage: number;
    imageUrl: string;
    reason: string[];
  };
  faceShapeAnalysis: {
    uniqueFact: string;
    characteristics: string[];
  };
  bodyShapeAnalysis: {
    description: string;
    characteristics: string[];
    imageUrl: string;
  };
  colorToneAnalysis: {
    description: string;
    bestColors: string[];
    neutralColors: string[];
    worstColors: string[];
    combination: string[];
    tips: {
      makeup: string[];
      outfit: string[];
      personality: string[];
      characteristics: string[];
    };
  };
  conclusionTips: {
    face: string[];
    body: string[];
    color: string[];
    quickRecap: string[];
  };
}

// Default fallback data
export const defaultUserData: UserData = {
  name: "Yasmin Azizah",
  faceShape: "Kotak",
  bodyShape: "Hourglass",
  colorTone: "Cool Winter",
  bmi: 52.2,
  celebrityMatch: {
    name: "Cut Syifa",
    matchPercentage: 88,
    imageUrl: "https://placehold.co/400/f0f0f0/333?text=Selebriti",
    reason: [
      "Kamu punya Rahang tegas dan kuat",
      "Dahi dan rahang memiliki lebar yang hampir sama",
      "Panjang dan lebar wajah hampir seimbang",
    ],
  },
  faceShapeAnalysis: {
    uniqueFact:
      "Bentuk wajah kamu itu kotak! Kamu punya garis rahang yang tegas dan dahi nggak terlalu lebar atau sempit.",
    characteristics: [
      "Kamu punya Rahang tegas dan kuat",
      "Dahi dan rahang memiliki lebar yang hampir sama",
      "Panjang dan lebar wajah hampir seimbang",
    ],
  },
  bodyShapeAnalysis: {
    imageUrl: "https://placehold.co/250x500/FFFFFF/CCCCCC?text=Bentuk+Tubuh",
    description:
      "Bagian Tengah Tubuhmu Lebih Dominan, Dengan Bagian Tengah Yang Lebih Menonjol Dan Bahu Yang Lebar Serta Bagian Dada Yang Penuh.",
    characteristics: [
      "Kamu punya Rahang tegas dan kuat",
      "Dahi dan rahang memiliki lebar yang hampir sama",
      "Panjang dan lebar wajah hampir seimbang",
    ],
  },
  colorToneAnalysis: {
    description:
      "Ini berarti kulitmu memiliki undertone dingin dengan hint biru atau pink yang memberikan kesan elegan.",
    bestColors: [
      "#C7D2FE",
      "#BFDBFE",
      "#E0E7FF",
      "#E5E7EB",
      "#F472B6",
      "#60A5FA",
    ],
    neutralColors: [
      "#A3A3A3",
      "#6B7280",
      "#9CA3AF",
      "#D1D5DB",
      "#F59E0B",
      "#FACC15",
    ],
    worstColors: [
      "#F59E0B",
      "#FACC15",
      "#FEF08A",
      "#FDE68A",
      "#C7D2FE",
      "#BFDBFE",
    ],
    combination: [
      "#F472B6",
      "#60A5FA",
      "#3B82F6",
      "#1E3A8A",
      "#C7D2FE",
      "#BFDBFE",
    ],
    tips: {
      makeup: [
        "Kamu punya Rahang tegas dan kuat",
        "Dahi dan rahang memiliki lebar yang hampir sama",
        "Panjang dan lebar wajah hampir seimbang",
      ],
      outfit: [
        "Kamu punya Rahang tegas dan kuat",
        "Dahi dan rahang memiliki lebar yang hampir sama",
        "Panjang dan lebar wajah hampir seimbang",
      ],
      personality: [
        "Kamu punya Rahang tegas dan kuat",
        "Dahi dan rahang memiliki lebar yang hampir sama",
        "Panjang dan lebar wajah hampir seimbang",
      ],
      characteristics: [
        "Kamu punya Rahang tegas dan kuat",
        "Dahi dan rahang memiliki lebar yang hampir sama",
        "Panjang dan lebar wajah hampir seimbang",
      ],
    },
  },
  conclusionTips: {
    face: [
      "Kamu punya Rahang tegas dan kuat",
      "Dahi dan rahang memiliki lebar yang hampir sama",
      "Panjang dan lebar wajah hampir seimbang",
    ],
    body: [
      "Kamu punya Rahang tegas dan kuat",
      "Dahi dan rahang memiliki lebar yang hampir sama",
      "Panjang dan lebar wajah hampir seimbang",
    ],
    color: [
      "Kamu punya Rahang tegas dan kuat",
      "Dahi dan rahang memiliki lebar yang hampir sama",
      "Panjang dan lebar wajah hampir seimbang",
    ],
    quickRecap: [
      "Kamu punya Rahang tegas dan kuat",
      "Dahi dan rahang memiliki lebar yang hampir sama",
      "Panjang dan lebar wajah hampir seimbang",
    ],
  },
};

// Hook for fetching analysis data
export function useAnalysisData(resultId: string | null) {
  return useQuery({
    queryKey: ['analysisData', resultId],
    queryFn: async () => {
      if (!resultId) {
        throw new Error('Result ID is required');
      }

      try {
        // Fetch analysis data and photos in parallel
        const [analysisResponse, photosResponse] = await Promise.all([
          axios.get(`${url}/v1/user-analysis-results/${resultId}`),
          axios.get(`${url}/v1/user-photos/analysis-results/${resultId}/photos`)
        ]);

        const analysisData: AnalysisData = analysisResponse.data;

        // Fetch additional data based on IDs from analysis result
        const [faceShapeResponse, colorToneResponse, bodyShapeResponse, /* bmiCategoryResponse tidak digunakan */, celebrityResponse] = 
          await Promise.all([
            axios.get(`${url}/v1/face-shapes/${analysisData.face_shape_id}`),
            axios.get(`${url}/v1/color-analysis/${analysisData.color_analysis_id}`),
            axios.get(`${url}/v1/body-shapes/${analysisData.body_shape_id}`),
            axios.get(`${url}/v1/bmi-categories/${analysisData.bmi_category_id}`),
            analysisData.celebrity_id 
              ? axios.get(`${url}/v1/celebrities/${analysisData.celebrity_id}`) 
              : Promise.resolve({ data: null })
          ]);

        const faceShapeData: FaceShapeData = faceShapeResponse.data;
        const colorToneData: ColorToneData = colorToneResponse.data;
        const bodyShapeData: BodyShapeData = bodyShapeResponse.data;
        // const bmiCategoryData: BMICategoryData = bmiCategoryResponse.data; // Removed unused variable
        const celebrityData: CelebrityData | null = celebrityResponse.data;

        // Find user photo
        const processedPhoto = photosResponse.data.find(
          (photo: PhotoData) => photo.is_processed === true
        );
        
        let userPhotoUrl = null;
        if (processedPhoto) {
          userPhotoUrl = processedPhoto.file_path;
        } else {
          const originalPhoto = photosResponse.data.find(
            (photo: PhotoData) => photo.photo_type === "face_original"
          );
          if (originalPhoto) userPhotoUrl = originalPhoto.file_path;
        }

        // Transform data for components
        const transformedData: UserData = {
          name: analysisData.user_name || "User",
          faceShape: faceShapeData?.name || defaultUserData.faceShape,
          bodyShape: bodyShapeData?.name || defaultUserData.bodyShape,
          colorTone: colorToneData?.name || defaultUserData.colorTone,
          bmi: typeof analysisData.analysis_details.bmi.value === "string"
            ? parseFloat(analysisData.analysis_details.bmi.value)
            : Number(analysisData.analysis_details.bmi.value),
          celebrityMatch: {
            name: celebrityData?.name || defaultUserData.celebrityMatch.name,
            matchPercentage: celebrityData?.match_percentage || defaultUserData.celebrityMatch.matchPercentage,
            imageUrl: celebrityData?.image_url || defaultUserData.celebrityMatch.imageUrl,
            reason: celebrityData?.reason ? [celebrityData.reason] : defaultUserData.celebrityMatch.reason,
          },
          faceShapeAnalysis: {
            uniqueFact: faceShapeData?.description || defaultUserData.faceShapeAnalysis.uniqueFact,
            characteristics: faceShapeData?.characteristics || defaultUserData.faceShapeAnalysis.characteristics,
          },
          bodyShapeAnalysis: {
            description: bodyShapeData?.description || defaultUserData.bodyShapeAnalysis.description,
            characteristics: bodyShapeData?.characteristics || defaultUserData.bodyShapeAnalysis.characteristics,
            imageUrl: defaultUserData.bodyShapeAnalysis.imageUrl,
          },
          colorToneAnalysis: {
            description: colorToneData?.description || defaultUserData.colorToneAnalysis.description,
            bestColors: colorToneData?.best_colors || defaultUserData.colorToneAnalysis.bestColors,
            neutralColors: colorToneData?.neutral_colors || defaultUserData.colorToneAnalysis.neutralColors,
            worstColors: colorToneData?.worst_colors || defaultUserData.colorToneAnalysis.worstColors,
            combination: colorToneData?.combination_colors || defaultUserData.colorToneAnalysis.combination,
            tips: colorToneData?.tips || defaultUserData.colorToneAnalysis.tips,
          },
          conclusionTips: {
            face: faceShapeData?.characteristics || defaultUserData.conclusionTips.face,
            body: bodyShapeData?.characteristics || defaultUserData.conclusionTips.body,
            color: colorToneData?.best_colors?.map(color => `Gunakan warna ${color}`) || defaultUserData.conclusionTips.color,
            quickRecap: [
              `Bentuk wajah kamu adalah ${faceShapeData?.name || defaultUserData.faceShape}`,
              `Bentuk tubuh kamu adalah ${bodyShapeData?.name || defaultUserData.bodyShape}`,
              `Tone warna kamu adalah ${colorToneData?.name || defaultUserData.colorTone}`,
            ],
          },
        };

        return { userData: transformedData, userPhotoUrl };
      } catch (error) {
        console.error('Error fetching analysis data:', error);
        return { userData: defaultUserData, userPhotoUrl: null };
      }
    },
    enabled: !!resultId,
  });
}

// Hook for downloading PDF
export function useDownloadPdf() {
  // Using URLSearchParams to get resultId from URL
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const resultId = searchParams.get('result_id');

  return useQuery({
    queryKey: ['downloadPdf', resultId],
    queryFn: async () => {
      if (!resultId) {
        throw new Error('Result ID is required');
      }

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resultId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      return await response.blob();
    },
    enabled: false, // This query will not run automatically
  });
}

// Hook for generating story image
export function useGenerateStory() {
  // Using URLSearchParams to get resultId from URL
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const resultId = searchParams.get('result_id');

  return useQuery({
    queryKey: ['generateStory', resultId],
    queryFn: async () => {
      if (!resultId) {
        throw new Error('Result ID is required');
      }

      const response = await fetch(`/api/generate-story?result_id=${resultId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate story image');
      }

      return await response.blob();
    },
    enabled: false, // This query will not run automatically
  });
}