import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a consistent, deterministic score (80-95) for a product based on 
 * product ID and user analysis data. Same inputs always produce same output.
 * No localStorage used - purely computational.
 */
export function generateDeterministicScore(
  productId: string,
  resultId: string,
  bodyShapeId?: string,
  faceShapeId?: string,
  category: "hijab" | "clothes" = "hijab"
): number {
  // Create a combined seed from all inputs
  const seedParts = [productId, resultId, bodyShapeId || '', faceShapeId || '', category];
  const seedString = seedParts.join('|');
  
  // Simple hash function (djb2 algorithm variant)
  let hash = 5381;
  for (let i = 0; i < seedString.length; i++) {
    const char = seedString.charCodeAt(i);
    hash = ((hash << 5) + hash) + char; // hash * 33 + c
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Map hash to 80-95 range (16 possible values)
  const score = 80 + (Math.abs(hash) % 16);
  return score;
}
