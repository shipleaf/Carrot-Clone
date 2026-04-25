import { type CategoryIconKey } from "@/lib/category-icons";
import { type CenterSquareBounds } from "@/types/store";

export function getBoundsCenter(bounds: CenterSquareBounds) {
  return {
    lat: (bounds.swLat + bounds.neLat) / 2,
    lng: (bounds.swLng + bounds.neLng) / 2,
  };
}

export function getCategoryIconKey(category: string): CategoryIconKey {
  const normalized = category.toLowerCase();
  if (
    normalized.includes("cafe") ||
    normalized.includes("coffee") ||
    normalized.includes("카페") ||
    normalized.includes("커피")
  ) {
    return "cafe";
  }
  if (
    normalized.includes("food") ||
    normalized.includes("restaurant") ||
    normalized.includes("meal") ||
    normalized.includes("음식") ||
    normalized.includes("식당") ||
    normalized.includes("맛집")
  ) {
    return "food";
  }
  return "shop";
}
