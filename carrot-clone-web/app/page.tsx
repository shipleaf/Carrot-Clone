"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ── Kakao Maps type declarations ──────────────────────────────────────────────

interface KakaoLatLngInstance {
  getLat: () => number;
  getLng: () => number;
}
type KakaoLatLng = new (lat: number, lng: number) => KakaoLatLngInstance;

interface KakaoPointInstance {}
type KakaoPoint = new (x: number, y: number) => KakaoPointInstance;

interface KakaoProjection {
  coordsFromPoint: (point: KakaoPointInstance) => KakaoLatLngInstance;
}

interface KakaoLatLngBoundsInstance {
  getSouthWest: () => KakaoLatLngInstance;
  getNorthEast: () => KakaoLatLngInstance;
}

interface KakaoMapInstance {
  setCenter: (latlng: KakaoLatLngInstance) => void;
  getBounds: () => KakaoLatLngBoundsInstance;
  getProjection: () => KakaoProjection;
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
  map: KakaoMapInstance | null;
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
        Point: KakaoPoint;
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
    ReactNativeWebView?: { postMessage: (msg: string) => void };
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface StoreMarker {
  id: number;
  name: string;
  category: string;
  lat: number;
  lng: number;
  latestNews: string | null;
  ownerName: string;
  ownerProfileImageUrl: string | null;
}

interface CenterSquareBounds {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

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

// ── Utility functions ─────────────────────────────────────────────────────────

function sendToNative(data: Record<string, unknown>) {
  window.ReactNativeWebView?.postMessage(JSON.stringify(data));
}

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

function createStoreMarkerElement(
  store: StoreMarker,
  onClickMarker: () => void,
): HTMLElement {
  const container = document.createElement("div");
  container.style.cssText = `
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    transform: translateY(-3px);
    pointer-events: none;
  `;

  const iconKey = getCategoryIconKey(store.category);

  const pin = document.createElement("div");
  pin.style.cssText = `
    width: 42px; height: 42px;
    display: grid; place-items: center;
    color: #fff; background: ${CARROT_ORANGE};
    border: 3px solid #fff;
    border-radius: 999px 999px 999px 4px;
    box-shadow: 0 8px 18px rgba(0,0,0,0.22);
    transform: rotate(-45deg);
    cursor: pointer;
    pointer-events: auto;
  `;
  pin.innerHTML = `
    <div style="width:22px;height:22px;transform:rotate(45deg)">
      <style>.smk svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2}</style>
      <span class="smk">${CATEGORY_ICONS[iconKey]}</span>
    </div>
  `;
  pin.addEventListener("click", onClickMarker);

  const label = document.createElement("div");
  label.style.cssText = `
    max-width: 96px; padding: 3px 7px;
    overflow: hidden; color: #212124;
    background: rgba(255,255,255,0.94);
    border: 1px solid rgba(33,33,36,0.08);
    border-radius: 999px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.12);
    font-size: 11px; font-weight: 700; line-height: 1.2;
    text-overflow: ellipsis; white-space: nowrap;
    pointer-events: none;
  `;
  label.textContent = store.name;

  container.appendChild(pin);
  container.appendChild(label);
  return container;
}

function createSmallBadgeElement(): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "position: relative; pointer-events: none;";

  const badge = document.createElement("div");
  badge.style.cssText = `
    padding: 3px 8px;
    background: ${CARROT_ORANGE};
    color: white;
    border-radius: 999px;
    font-size: 10px; font-weight: 700;
    white-space: nowrap;
    box-shadow: 0 2px 6px rgba(255,111,15,0.35);
  `;
  badge.textContent = "새 소식";

  const tail = document.createElement("div");
  tail.style.cssText = `
    position: absolute;
    bottom: -4px; left: 50%;
    transform: translateX(-50%);
    width: 0; height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid ${CARROT_ORANGE};
  `;

  wrapper.appendChild(badge);
  wrapper.appendChild(tail);
  return wrapper;
}

function createFullBubbleElement(
  store: StoreMarker,
  onClickBubble: () => void,
): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "position: relative; cursor: pointer; pointer-events: auto;";

  const bubble = document.createElement("div");
  bubble.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 8px 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
    max-width: 180px;
    font-size: 12px; line-height: 1.4; color: #212124;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  `;
  bubble.textContent = store.latestNews ?? "";

  const tail = document.createElement("div");
  tail.style.cssText = `
    position: absolute;
    bottom: -6px; left: 50%;
    transform: translateX(-50%);
    width: 0; height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid white;
    filter: drop-shadow(0 2px 2px rgba(0,0,0,0.08));
  `;

  wrapper.appendChild(bubble);
  wrapper.appendChild(tail);
  wrapper.addEventListener("click", onClickBubble);
  return wrapper;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Home() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<KakaoMapInstance | null>(null);
  const currentLocationMarkerRef = useRef<KakaoMarkerInstance | null>(null);

  // Store marker overlays
  const storeOverlayRefs = useRef<KakaoCustomOverlayInstance[]>([]);
  // Per-store small "새 소식" badge overlays
  const smallBadgeOverlaysRef = useRef<Map<number, KakaoCustomOverlayInstance>>(new Map());
  // Full news bubble for the single focused store
  const fullBubbleOverlayRef = useRef<KakaoCustomOverlayInstance | null>(null);

  // Currently focused store id (in center square)
  const focusedStoreIdRef = useRef<number | null>(null);
  // Latest fetched stores list
  const currentStoresRef = useRef<StoreMarker[]>([]);
  // Center detection square bounds in lat/lng
  const centerSquareBoundsRef = useRef<CenterSquareBounds | null>(null);
  // Stable ref to checkCenterStore to break circular deps
  const checkCenterStoreRef = useRef<() => void>(() => {});

  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    kakaoMapApiKey ? "loading" : "error",
  );

  const clearStoreMarkers = useCallback(() => {
    for (const overlay of storeOverlayRefs.current) {
      overlay.setMap(null);
    }
    storeOverlayRefs.current = [];

    smallBadgeOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
    smallBadgeOverlaysRef.current.clear();

    if (fullBubbleOverlayRef.current) {
      fullBubbleOverlayRef.current.setMap(null);
      fullBubbleOverlayRef.current = null;
    }

    focusedStoreIdRef.current = null;
  }, []);

  const renderStoreMarkers = useCallback(
    (stores: StoreMarker[]) => {
      const map = mapInstanceRef.current;
      if (!window.kakao || !map) return;

      clearStoreMarkers();
      currentStoresRef.current = stores;

      storeOverlayRefs.current = stores.map((store) => {
        const position = new window.kakao!.maps.LatLng(store.lat, store.lng);

        const markerEl = createStoreMarkerElement(store, () => {
          sendToNative({ type: "storeClicked", storeId: store.id });
        });

        const overlay = new window.kakao!.maps.CustomOverlay({
          map,
          position,
          content: markerEl,
          xAnchor: 0.5,
          yAnchor: 1.1,
        });

        if (store.latestNews) {
          const badgeEl = createSmallBadgeElement();
          const badgeOverlay = new window.kakao!.maps.CustomOverlay({
            map,
            position,
            content: badgeEl,
            xAnchor: 0.5,
            yAnchor: 3.8,
          });
          smallBadgeOverlaysRef.current.set(store.id, badgeOverlay);
        }

        return overlay;
      });
    },
    [clearStoreMarkers],
  );

  const checkCenterStore = useCallback(() => {
    const bounds = centerSquareBoundsRef.current;
    const stores = currentStoresRef.current;
    if (!bounds) return;

    const map = mapInstanceRef.current;
    if (!window.kakao || !map) return;

    const storeInCenter = stores.find(
      (s) =>
        s.lat >= bounds.swLat &&
        s.lat <= bounds.neLat &&
        s.lng >= bounds.swLng &&
        s.lng <= bounds.neLng,
    );

    if (storeInCenter?.id === focusedStoreIdRef.current) return;

    // Restore previous focused store
    const prevId = focusedStoreIdRef.current;
    if (prevId !== null) {
      if (fullBubbleOverlayRef.current) {
        fullBubbleOverlayRef.current.setMap(null);
        fullBubbleOverlayRef.current = null;
      }
      const prevStore = stores.find((s) => s.id === prevId);
      if (prevStore?.latestNews) {
        smallBadgeOverlaysRef.current.get(prevId)?.setMap(map);
      }
    }

    focusedStoreIdRef.current = storeInCenter?.id ?? null;

    if (storeInCenter) {
      if (storeInCenter.latestNews) {
        smallBadgeOverlaysRef.current.get(storeInCenter.id)?.setMap(null);
        const pos = new window.kakao!.maps.LatLng(storeInCenter.lat, storeInCenter.lng);
        const bubbleEl = createFullBubbleElement(storeInCenter, () => {
          sendToNative({ type: "newsBubbleClicked", store: storeInCenter });
        });
        fullBubbleOverlayRef.current = new window.kakao!.maps.CustomOverlay({
          map,
          position: pos,
          content: bubbleEl,
          xAnchor: 0.5,
          yAnchor: 3.4,
        });
      }
      sendToNative({ type: "storeFocused", storeId: storeInCenter.id });
    } else {
      sendToNative({ type: "storeFocused", storeId: null });
    }
  }, []);

  // Keep ref stable so fetchStoresInBounds can call it without circular dep
  checkCenterStoreRef.current = checkCenterStore;

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
      checkCenterStoreRef.current();
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
    if (!kakaoMapApiKey) return;

    const initializeMap = () => {
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
        const center = new window.kakao.maps.LatLng(seed.lat, seed.lng);

        const map = new window.kakao.maps.Map(mapRef.current, { center, level: 3 });
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
    script.onload = () => initializeMap();
    script.onerror = () => setStatus("error");
    document.head.appendChild(script);
  }, [fetchStoresInBounds]);

  // Handle location updates from native app
  useEffect(() => {
    const handler = (e: Event) => {
      const { lat, lng } = (e as CustomEvent<{ lat: number; lng: number }>).detail;
      if (lat === 0 && lng === 0) return;
      moveToLocation(lat, lng);
    };
    window.addEventListener("nativeLocation", handler);
    return () => window.removeEventListener("nativeLocation", handler);
  }, [moveToLocation]);

  // Handle center square point injected by native
  useEffect(() => {
    const handler = (e: Event) => {
      const { x, y, squareHalfSize } = (
        e as CustomEvent<{ x: number; y: number; squareHalfSize: number }>
      ).detail;
      const map = mapInstanceRef.current;
      if (!window.kakao || !map) return;

      const proj = map.getProjection();
      const sw = proj.coordsFromPoint(
        new window.kakao.maps.Point(x - squareHalfSize, y + squareHalfSize),
      );
      const ne = proj.coordsFromPoint(
        new window.kakao.maps.Point(x + squareHalfSize, y - squareHalfSize),
      );

      centerSquareBoundsRef.current = {
        swLat: sw.getLat(),
        swLng: sw.getLng(),
        neLat: ne.getLat(),
        neLng: ne.getLng(),
      };

      checkCenterStoreRef.current();
    };

    window.addEventListener("centerPointChanged", handler);
    return () => window.removeEventListener("centerPointChanged", handler);
  }, []);

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
