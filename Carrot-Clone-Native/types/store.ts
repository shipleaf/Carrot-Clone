export interface StoreImage {
  id: number;
  url: string;
  order: number;
}

export interface StoreHours {
  id: number;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string | null;
}

export interface Review {
  id: number;
  userId: string;
  rating: number;
  content: string;
  likeCount: number;
  userProfileImageUrl: string | null;
}

export interface StoreNewsItem {
  id: number;
  content: string;
  likeCount: number;
  viewCount: number;
  createdAt: string;
}

export interface StoreDetail {
  id: number;
  name: string;
  category: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  instagramUrl: string | null;
  description: string | null;
  ownerName: string;
  ownerProfileImageUrl: string | null;
  followerCount: number;
  latestNews: string | null;
  ratingAverage: number | null;
  reviewCount: number;
  images: StoreImage[];
  hours: StoreHours[];
  menuItems: MenuItem[];
  news: StoreNewsItem[];
  reviews: Review[];
}

export interface CouponDetail {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  expiresAt: string | null;
  storeName: string;
}

export interface NewsOverlayStore {
  id: number;
  name: string;
  ownerName: string;
  ownerProfileImageUrl: string | null;
  latestNews: string;
  latestNewsId?: number | null;
  latestNewsLikeCount?: number | null;
  latestNewsViewCount?: number | null;
  latestNewsCreatedAt?: string | null;
}

export interface PopularNewsItem {
  id: number;
  content: string;
  likeCount: number;
  viewCount: number;
  createdAt: string;
  store: {
    id: number;
    name: string;
    category: string;
    lat: number;
    lng: number;
    ownerName: string;
    ownerProfileImageUrl: string | null;
  };
}
