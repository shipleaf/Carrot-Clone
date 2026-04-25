"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  KAKAO_MAP_SCRIPT_ID,
  DEFAULT_CENTER,
  NULL_FOCUS_CLEAR_THRESHOLD,
} from "@/lib/constants";
import { sendToNative } from "@/lib/native-bridge";
import { getBoundsCenter } from "@/lib/map-utils";
import {
  createStoreMarkerElement,
  createSmallBadgeElement,
  createFullBubbleElement,
} from "@/lib/map-overlays";
import { type KakaoMapInstance, type KakaoMarkerInstance, type KakaoCustomOverlayInstance } from "@/types/kakao";
import { type StoreMarker, type CenterSquareBounds } from "@/types/store";

const kakaoMapApiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

export function useKakaoMap() {
  // 상태
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<KakaoMapInstance | null>(null);
  const currentLocationMarkerRef = useRef<KakaoMarkerInstance | null>(null);

  const storeOverlayRefs = useRef<KakaoCustomOverlayInstance[]>([]);
  const smallBadgeOverlaysRef = useRef<Map<number, KakaoCustomOverlayInstance>>(new Map());
  const fullBubbleOverlayRef = useRef<KakaoCustomOverlayInstance | null>(null);

  const focusedStoreIdRef = useRef<number | null>(null);
  const focusedStorePositionRef = useRef<{ lat: number; lng: number } | null>(null);
  const currentStoresRef = useRef<StoreMarker[]>([]);
  const centerSquareBoundsRef = useRef<CenterSquareBounds | null>(null);
  const centerPixelRef = useRef<{ x: number; y: number; squareHalfSize: number } | null>(null);
  const focusRequestSeqRef = useRef(0);
  const nullFocusCountRef = useRef(0);
  const checkCenterStoreRef = useRef<() => void | Promise<void>>(() => {});

  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    kakaoMapApiKey ? "loading" : "error",
  );

  const calcCenterSquareBounds = useCallback(
    (px: { x: number; y: number; squareHalfSize: number }): CenterSquareBounds | null => {
      const map = mapInstanceRef.current;
      if (!map || !mapRef.current) return null;

      const bounds = map.getBounds();
      const mapSw = bounds.getSouthWest();
      const mapNe = bounds.getNorthEast();
      const mapWidth = mapRef.current.clientWidth;
      const mapHeight = mapRef.current.clientHeight;
      if (!mapWidth || !mapHeight) return null;

      const latPerPx = (mapNe.getLat() - mapSw.getLat()) / mapHeight;
      const lngPerPx = (mapNe.getLng() - mapSw.getLng()) / mapWidth;

      const center = map.getCenter();
      const focusCenterLat = center.getLat() - (px.y - mapHeight / 2) * latPerPx;
      const focusCenterLng = center.getLng() + (px.x - mapWidth / 2) * lngPerPx;

      return {
        swLat: focusCenterLat - px.squareHalfSize * latPerPx,
        swLng: focusCenterLng - px.squareHalfSize * lngPerPx,
        neLat: focusCenterLat + px.squareHalfSize * latPerPx,
        neLng: focusCenterLng + px.squareHalfSize * lngPerPx,
      };
    },
    [],
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

  // 사용자의 시선 중앙점 위, 경도값 찾기
  const checkCenterStore = useCallback(async () => {
    const bounds = centerSquareBoundsRef.current;
    if (!bounds) return;

    const map = mapInstanceRef.current;
    if (!window.kakao || !map) return;

    console.log("센터 찾기");
    const center = getBoundsCenter(bounds);
    console.log("센터: " + center.lat + " " + center.lng);
    const params = new URLSearchParams({
      swLat: String(bounds.swLat),
      swLng: String(bounds.swLng),
      neLat: String(bounds.neLat),
      neLng: String(bounds.neLng),
      centerLat: String(center.lat),
      centerLng: String(center.lng),
    });
    const requestSeq = focusRequestSeqRef.current + 1;
    focusRequestSeqRef.current = requestSeq;

    let storeInCenter: StoreMarker | null;
    try {
      const response = await fetch(`/api/stores/focus?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch focused store");
      storeInCenter = (await response.json()) as StoreMarker | null;
    } catch (error) {
      console.error("[kakao] focused store fetch failed:", error);
      return;
    }

    if (requestSeq !== focusRequestSeqRef.current) return;

    if (!storeInCenter) {
      nullFocusCountRef.current += 1;

      if (
        focusedStoreIdRef.current !== null &&
        nullFocusCountRef.current < NULL_FOCUS_CLEAR_THRESHOLD
      ) {
        sendToNative({ type: "storeFocused", storeId: focusedStoreIdRef.current });
        return;
      }

      if (focusedStoreIdRef.current !== null) {
        if (fullBubbleOverlayRef.current) {
          fullBubbleOverlayRef.current.setMap(null);
          fullBubbleOverlayRef.current = null;
        }
        const prevStore = currentStoresRef.current.find((s) => s.id === focusedStoreIdRef.current);
        if (prevStore?.latestNews) {
          smallBadgeOverlaysRef.current.get(prevStore.id)?.setMap(map);
        }
      }

      focusedStoreIdRef.current = null;
      focusedStorePositionRef.current = null;
      sendToNative({ type: "storeFocused", storeId: null });
      return;
    }

    nullFocusCountRef.current = 0;

    if (storeInCenter.id === focusedStoreIdRef.current) {
      if (storeInCenter.latestNews && !fullBubbleOverlayRef.current) {
        smallBadgeOverlaysRef.current.get(storeInCenter.id)?.setMap(null);
        const pos = new window.kakao!.maps.LatLng(storeInCenter.lat, storeInCenter.lng);
        const bubbleEl = createFullBubbleElement(storeInCenter, () => {
          sendToNative({ type: "newsBubbleClicked", store: storeInCenter });
        });
        fullBubbleOverlayRef.current = new window.kakao!.maps.CustomOverlay({
          map, position: pos, content: bubbleEl, xAnchor: 0.5, yAnchor: 3.4,
        });
      }
      sendToNative({ type: "storeFocused", storeId: storeInCenter.id });
      return;
    }

    const prevId = focusedStoreIdRef.current;
    if (prevId !== null) {
      if (fullBubbleOverlayRef.current) {
        fullBubbleOverlayRef.current.setMap(null);
        fullBubbleOverlayRef.current = null;
      }
      const prevStore = currentStoresRef.current.find((s) => s.id === prevId);
      if (prevStore?.latestNews) {
        smallBadgeOverlaysRef.current.get(prevId)?.setMap(map);
      }
    }

    focusedStoreIdRef.current = storeInCenter.id;
    focusedStorePositionRef.current = { lat: storeInCenter.lat, lng: storeInCenter.lng };

    if (storeInCenter.latestNews) {
      smallBadgeOverlaysRef.current.get(storeInCenter.id)?.setMap(null);
      const pos = new window.kakao!.maps.LatLng(storeInCenter.lat, storeInCenter.lng);
      const bubbleEl = createFullBubbleElement(storeInCenter, () => {
        sendToNative({ type: "newsBubbleClicked", store: storeInCenter });
      });
      fullBubbleOverlayRef.current = new window.kakao!.maps.CustomOverlay({
        map, position: pos, content: bubbleEl, xAnchor: 0.5, yAnchor: 3.4,
      });
    }
    sendToNative({ type: "storeFocused", storeId: storeInCenter.id });
  }, []);

  useEffect(() => {
    checkCenterStoreRef.current = checkCenterStore;
  }, [checkCenterStore]);

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

      const pixel = centerPixelRef.current;
      if (pixel) {
        const newBounds = calcCenterSquareBounds(pixel);
        if (newBounds) centerSquareBoundsRef.current = newBounds;
      }

      void checkCenterStoreRef.current();
    } catch (error) {
      console.error("[kakao] store marker fetch failed:", error);
    }
  }, [renderStoreMarkers, calcCenterSquareBounds]);

  const moveToLocation = useCallback(
    (lat: number, lng: number) => {
      if (!window.kakao || !mapInstanceRef.current || !currentLocationMarkerRef.current) return;
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

  useEffect(() => {
    const handler = (e: Event) => {
      const { lat, lng } = (e as CustomEvent<{ lat: number; lng: number }>).detail;
      if (lat === 0 && lng === 0) return;
      moveToLocation(lat, lng);
    };
    window.addEventListener("nativeLocation", handler);
    return () => window.removeEventListener("nativeLocation", handler);
  }, [moveToLocation]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { x, y, squareHalfSize } = (
        e as CustomEvent<{ x: number; y: number; squareHalfSize: number }>
      ).detail;
      const map = mapInstanceRef.current;

      centerPixelRef.current = { x, y, squareHalfSize };

      if (!map) return;

      const newBounds = calcCenterSquareBounds({ x, y, squareHalfSize });
      if (newBounds) centerSquareBoundsRef.current = newBounds;

      void checkCenterStoreRef.current();
    };

    window.addEventListener("centerPointChanged", handler);
    return () => window.removeEventListener("centerPointChanged", handler);
  }, [calcCenterSquareBounds]);

  return { mapRef, status };
}
