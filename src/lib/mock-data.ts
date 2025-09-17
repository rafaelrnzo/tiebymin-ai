import { UserData } from "@/types";
import { Product } from "@/types";

// Default fallback data
export const defaultUserData: UserData = {
  name: "Yasmin Azizah",
  faceShape: "Kotak",
  bodyShape: "Hourglass",
  colorTone: "Cool Winter",
  bmi: {
    value: 0.00,
    category: "Ideal",
    desc: "Badan kamu bagus ideal!"
  },
  celebrityMatch: {
    name: "Cut Syifa",
    matchPercentage: 88,
    imageUrl: "https://placehold.co/400/f0f0f0/333?text=Selebriti",
    reason: [
      "Kamu punya Rahang tegas dan kuat",
      "Dahi dan rahang memiliki lebar yang hampir sama",
      "Panjang dan lebar wajah hampir seimbang",
    ],
    description: "Cut Syifa adalah seorang aktris dan model Indonesia.",
  },
  faceShapeAnalysis: {
    uniqueFact:
      "Bentuk wajah kamu itu kotak! Kamu punya garis rahang yang tegas dan dahi nggak terlalu lebar atau sempit.",
    karakteristik: 
      "Kamu punya Rahang tegas dan kuat Dahi dan rahang memiliki lebar yang hampir sama Panjang dan lebar wajah hampir seimbang",
  },
  bodyShapeAnalysis: {
    imageUrl: "https://placehold.co/250x500/FFFFFF/CCCCCC?text=Bentuk+Tubuh",
    description:
      "Bagian Tengah Tubuhmu Lebih Dominan, Dengan Bagian Tengah Yang Lebih Menonjol Dan Bahu Yang Lebar Serta Bagian Dada Yang Penuh.",
    karakteristik:
      "Kamu punya Rahang tegas dan kuat -Dahi dan rahang memiliki lebar yang hampir sama Panjang dan lebar wajah hampir seimbang",
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
      ["#F472B6", "#60A5FA"],
      ["#3B82F6", "#1E3A8A"],
      ["#C7D2FE", "#BFDBFE"],
    ],
    tips: {
      makeup: ["Kamu punya Rahang tegas dan kuat"],
      outfit: ["Kamu punya Rahang tegas dan kuat"],
      personality: ["Kamu punya Rahang tegas dan kuat"],
      karakteristik: ["Kamu punya Rahang tegas dan kuat"],
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

export const analysisTabs = [
  { id: "shape", text: "Shape", icon: "/overview-ai/icons/ri_shape-fill.svg" },
  { id: "color", text: "Color Tone", icon: "/overview-ai/icons/mdi_color.svg" },
  { id: "body", text: "Body", icon: "/overview-ai/icons/healthicons_body.svg" },
  {
    id: "celebrity",
    text: "Celebrity\nMatch",
    icon: "/overview-ai/icons/material-symbols_crown-rounded.svg",
  },
  {
    id: "tips",
    text: "Tips &\nTrick",
    icon: "/overview-ai/icons/ic_baseline-tips-and-updates.svg",
  },
];




export const mockProducts: Product[] = [
  {
    id: "mock-p1",
    name: "Pashmina Ceruti Premium (Mock)",
    description: "Pashmina berkualitas tinggi yang mudah diatur dan nyaman dipakai sepanjang hari. Cocok untuk acara formal maupun kasual.",
    original_price: 95000,
    current_price: 75000,
    discount_percentage: 21,
    average_rating: 4.8,
    total_reviews: 258,
    size_range: "180cm x 75cm",
    brand: "Hijabista",
    category: "hijab",
    product_link: "#",
    images: ["/hijab-3.png"],
    is_active: true,
    stock_quantity: 120,
    color_recommendations: ["Beige", "Dusty Pink", "Milo"],
    total_compatibility_score: 95.8,
    compatibility_reason: "Warna pastel ini sangat cocok dengan undertone kulit Anda dan preferensi gaya minimalis Anda.",
  },
  {
    id: "mock-p2",
    name: "Tunik Rayon Elegan (Mock)",
    description: "Tunik dari bahan rayon premium yang adem dan jatuh. Desain simpel dan elegan untuk tampilan sehari-hari yang menawan.",
    original_price: 225000,
    current_price: 185000,
    discount_percentage: 18,
    average_rating: 4.9,
    total_reviews: 412,
    size_range: "S - XL",
    brand: "Modest Wear",
    category: "clothes",
    product_link: "#",
    images: ["/hijab-4.png"],
    is_active: true,
    stock_quantity: 85,
    color_recommendations: ["Navy", "Maroon", "Broken White"],
    total_compatibility_score: 92.3,
    compatibility_reason: "Potongan tunik ini sesuai dengan bentuk tubuh Anda dan cocok untuk gaya semi-formal yang Anda sukai.",
  },
  {
    id: "mock-p3",
    name: "Bergo Instan Jersey (Mock)",
    description: "Hijab instan praktis dari bahan jersey yang lentur dan tidak mudah kusut. Pilihan tepat untuk aktivitas dinamis.",
    original_price: 55000,
    current_price: 55000,
    discount_percentage: 0,
    average_rating: 4.7,
    total_reviews: 890,
    size_range: "All Size",
    brand: "Hijab Praktis",
    category: "hijab",
    product_link: "#",
    images: ["/hijab-2.png"],
    is_active: true,
    stock_quantity: 0,
    color_recommendations: ["Hitam", "Abu-abu", "Coklat Tua"],
    total_compatibility_score: 88.5,
    compatibility_reason: "Pilihan praktis untuk gaya kasual Anda, dan warna netralnya mudah dipadukan.",
  },
  {
    id: "mock-p4",
    name: "Gamis Katun Toyobo (Mock)",
    description: "Gamis mewah dari katun Toyobo yang dikenal adem dan tidak menerawang. Memberikan kesan rapi dan berkelas.",
    original_price: 295000,
    current_price: 250000,
    discount_percentage: 15,
    average_rating: 4.9,
    total_reviews: 320,
    size_range: "M - XXL",
    brand: "Modest Wear",
    category: "clothes",
    product_link: "#",
    images: ["/hijab-1.png"],
    is_active: true,
    stock_quantity: 0,
    color_recommendations: ["Sage Green", "Lavender", "Khaki"],
    total_compatibility_score: 94.1,
    compatibility_reason: "Model A-line pada gamis ini menunjang postur Anda. Warna sage green sedang tren dan cocok untuk Anda.",
  },
];

// Map ini tetap bisa digunakan jika komponen Anda masih membutuhkannya secara terpisah.
// Kuncinya harus cocok dengan 'id' dari mockProducts di atas.
export const mockTopProductScores = new Map<string, number>([
  ["mock-p1", 95.8],
  ["mock-p4", 94.1],
  ["mock-p2", 92.3],
]);