"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface KakaoLatLngInstance {
  getLat: () => number;
  getLng: () => number;
}
type KakaoLatLng = new (lat: number, lng: number) => KakaoLatLngInstance;

interface KakaoLatLngBoundsInstance {
  getSouthWest: () => KakaoLatLngInstance;
  getNorthEast: () => KakaoLatLngInstance;
}

interface KakaoMapInstance {
  setCenter: (latlng: KakaoLatLngInstance) => void;
  getBounds: () => KakaoLatLngBoundsInstance;
}
type KakaoMap = new (
  container: HTMLElement,
  options: { center: KakaoLatLngInstance; level: number },
) => KakaoMapInstance;

interface KakaoMarkerInstance {
  setPosition: (latlng: KakaoLatLngInstance) => void;
}
type KakaoMarker = new (options: {
  map: KakaoMapInstance;
  position: KakaoLatLngInstance;
}) => KakaoMarkerInstance;

interface KakaoCustomOverlayInstance {
  setMap: (map: KakaoMapInstance | null) => void;
}
type KakaoCustomOverlay = new (options: {
  map: KakaoMapInstance;
  position: KakaoLatLngInstance;
  content: string | HTMLElement;
  xAnchor?: number;
  yAnchor?: number;
}) => KakaoCustomOverlayInstance;

declare global {
  interface Window {
    kakao?: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: KakaoLatLng;
        Map: KakaoMap;
        Marker: KakaoMarker;
        CustomOverlay: KakaoCustomOverlay;
        event: {
          addListener: (
            target: KakaoMapInstance,
            type: string,
            handler: () => void,
          ) => void;
        };
      };
    };
    __nativeLocation?: { lat: number; lng: number };
  }
}

interface StoreMarker {
  id: number;
  name: string;
  category: string;
  lat: number;
  lng: number;
}

const KAKAO_MAP_SCRIPT_ID = "kakao-map-sdk";
const DEFAULT_CENTER = { lat: 35.1897739, lng: 126.8113884 };
const CARROT_ORANGE = "#ff6f0f";
const kakaoMapApiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

const CATEGORY_ICONS = {
  cafe: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 8h11v5.2a4.8 4.8 0 0 1-4.8 4.8H9.8A4.8 4.8 0 0 1 5 13.2V8Z" />
      <path d="M16 10h1.4a2.6 2.6 0 0 1 0 5.2H16" />
      <path d="M8 5.5c0-.9.7-.9.7-1.8S8 2.8 8 2" />
      <path d="M12 5.5c0-.9.7-.9.7-1.8S12 2.8 12 2" />
      <path d="M4 21h15" />
    </svg>
  `,
  food: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3v8" />
      <path d="M4.5 3v6.2A2.5 2.5 0 0 0 7 11.7a2.5 2.5 0 0 0 2.5-2.5V3" />
      <path d="M7 11.7V21" />
      <path d="M16.5 3C19 5.1 20 7.7 20 11.2c0 2.1-1.3 3.7-3.2 4.2V21" />
      <path d="M16.5 3v18" />
    </svg>
  `,
  shop: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10h16l-1.4-5H5.4L4 10Z" />
      <path d="M6 10v9h12v-9" />
      <path d="M9 19v-5h6v5" />
      <path d="M4 10a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
    </svg>
  `,
} as const;

function getCategoryIconKey(category: string): keyof typeof CATEGORY_ICONS {
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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createStoreMarkerContent(store: StoreMarker) {
  const iconKey = getCategoryIconKey(store.category);
  const label = escapeHtml(store.name);

  return `
    <div style="
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      transform: translateY(-3px);
      pointer-events: none;
    ">
      <div style="
        width: 42px;
        height: 42px;
        display: grid;
        place-items: center;
        color: #fff;
        background: ${CARROT_ORANGE};
        border: 3px solid #fff;
        border-radius: 999px 999px 999px 4px;
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.22);
        transform: rotate(-45deg);
      ">
        <div style="
          width: 22px;
          height: 22px;
          transform: rotate(45deg);
        ">
          <style>
            .store-marker-icon svg {
              width: 22px;
              height: 22px;
              fill: none;
              stroke: currentColor;
              stroke-linecap: round;
              stroke-linejoin: round;
              stroke-width: 2;
            }
          </style>
          <span class="store-marker-icon">${CATEGORY_ICONS[iconKey]}</span>
        </div>
      </div>
      <div style="
        max-width: 96px;
        padding: 3px 7px;
        overflow: hidden;
        color: #212124;
        background: rgba(255, 255, 255, 0.94);
        border: 1px solid rgba(33, 33, 36, 0.08);
        border-radius: 999px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
        font-size: 11px;
        font-weight: 700;
        line-height: 1.2;
        text-overflow: ellipsis;
        white-space: nowrap;
      ">${label}</div>
    </div>
  `;
}

export default function Home() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<KakaoMapInstance | null>(null);
  const currentLocationMarkerRef = useRef<KakaoMarkerInstance | null>(null);
  const storeOverlayRefs = useRef<KakaoCustomOverlayInstance[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    kakaoMapApiKey ? "loading" : "error",
  );

  const clearStoreMarkers = useCallback(() => {
    for (const overlay of storeOverlayRefs.current) {
      overlay.setMap(null);
    }
    storeOverlayRefs.current = [];
  }, []);

  const renderStoreMarkers = useCallback(
    (stores: StoreMarker[]) => {
      const map = mapInstanceRef.current;
      if (!window.kakao || !map) return;

      clearStoreMarkers();

      storeOverlayRefs.current = stores.map((store) => {
        const position = new window.kakao!.maps.LatLng(store.lat, store.lng);

        return new window.kakao!.maps.CustomOverlay({
          map,
          position,
          content: createStoreMarkerContent(store),
          xAnchor: 0.5,
          yAnchor: 1.1,
        });
      });
    },
    [clearStoreMarkers],
  );

  const fetchStoresInBounds = useCallback(async () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const params = new URLSearchParams({
      swLat: String(sw.getLat()),
      swLng: String(sw.getLng()),
      neLat: String(ne.getLat()),
      neLng: String(ne.getLng()),
    });

    try {
      const response = await fetch(`/api/stores?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch stores");

      const stores = (await response.json()) as StoreMarker[];
      renderStoreMarkers(stores);
    } catch (error) {
      console.error("[kakao] store marker fetch failed:", error);
    }
  }, [renderStoreMarkers]);

  const moveToLocation = useCallback(
    (lat: number, lng: number) => {
      if (!window.kakao || !mapInstanceRef.current || !currentLocationMarkerRef.current) {
        return;
      }

      const pos = new window.kakao.maps.LatLng(lat, lng);
      mapInstanceRef.current.setCenter(pos);
      currentLocationMarkerRef.current.setPosition(pos);
      void fetchStoresInBounds();
    },
    [fetchStoresInBounds],
  );

  useEffect(() => {
    console.log("[kakao] useEffect start, apiKey:", !!kakaoMapApiKey);
    if (!kakaoMapApiKey) return;

    const initializeMap = () => {
      console.log(
        "[kakao] initializeMap, window.kakao:",
        typeof window.kakao,
        "mapRef:",
        !!mapRef.current,
      );
      if (!mapRef.current || !window.kakao) {
        setStatus("error");
        return;
      }

      window.kakao.maps.load(() => {
        if (!mapRef.current || !window.kakao) {
          setStatus("error");
          return;
        }

        const native = window.__nativeLocation;
        const isValid = native && (native.lat !== 0 || native.lng !== 0);
        const seed = isValid ? native : DEFAULT_CENTER;
        console.log(
          "[kakao] initial center:",
          seed.lat,
          seed.lng,
          isValid ? "(native)" : "(default)",
        );
        const center = new window.kakao.maps.LatLng(seed.lat, seed.lng);

        const map = new window.kakao.maps.Map(mapRef.current, {
          center,
          level: 3,
        });
        const marker = new window.kakao.maps.Marker({ map, position: center });

        mapInstanceRef.current = map;
        currentLocationMarkerRef.current = marker;

        window.kakao.maps.event.addListener(map, "idle", () => {
          void fetchStoresInBounds();
        });
        void fetchStoresInBounds();

        setStatus("ready");
      });
    };

    const existingScript = document.getElementById(KAKAO_MAP_SCRIPT_ID);
    if (existingScript) {
      initializeMap();
      return;
    }

    const script = document.createElement("script");
    script.id = KAKAO_MAP_SCRIPT_ID;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapApiKey}&autoload=false`;
    script.async = true;
    script.onload = () => {
      console.log("[kakao] script onload fired");
      initializeMap();
    };
    script.onerror = (e) => {
      console.error("[kakao] script onerror:", e);
      setStatus("error");
    };
    document.head.appendChild(script);
  }, [fetchStoresInBounds]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { lat, lng } = (e as CustomEvent<{ lat: number; lng: number }>).detail;
      if (lat === 0 && lng === 0) return;

      console.log("[kakao] nativeLocation received:", lat, lng);
      moveToLocation(lat, lng);
    };

    window.addEventListener("nativeLocation", handler);
    return () => window.removeEventListener("nativeLocation", handler);
  }, [moveToLocation]);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#f2f3f5]">
      <div ref={mapRef} className="h-full w-full" aria-label="Kakao map" />

      {status !== "ready" && (
        <div className="absolute inset-0 grid place-items-center bg-white text-sm font-medium text-[#4d5159]">
          {status === "loading" ? "Loading map..." : "Failed to load Kakao map."}
        </div>
      )}
    </main>
  );
}
