export interface StoreMarker {
  id: number;
  name: string;
  category: string;
  lat: number;
  lng: number;
  latestNews: string | null;
  latestNewsId?: number | null;
  latestNewsLikeCount?: number | null;
  latestNewsViewCount?: number | null;
  latestNewsCreatedAt?: string | null;
  ownerName: string;
  ownerProfileImageUrl: string | null;
  inventoryCount?: number | null;
  inventoryUpdatedAt?: string | null;
}

export interface CenterSquareBounds {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
}
