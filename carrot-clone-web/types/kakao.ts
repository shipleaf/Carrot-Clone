export interface KakaoLatLngInstance {
  getLat: () => number;
  getLng: () => number;
}
export type KakaoLatLng = new (lat: number, lng: number) => KakaoLatLngInstance;

export type KakaoPointInstance = object;
export type KakaoPoint = new (x: number, y: number) => KakaoPointInstance;

export interface KakaoProjection {
  coordsFromPoint: (point: KakaoPointInstance) => KakaoLatLngInstance;
}

export interface KakaoLatLngBoundsInstance {
  getSouthWest: () => KakaoLatLngInstance;
  getNorthEast: () => KakaoLatLngInstance;
}

export interface KakaoMapInstance {
  setCenter: (latlng: KakaoLatLngInstance) => void;
  getCenter: () => KakaoLatLngInstance;
  getBounds: () => KakaoLatLngBoundsInstance;
  getProjection: () => KakaoProjection;
}
export type KakaoMap = new (
  container: HTMLElement,
  options: { center: KakaoLatLngInstance; level: number },
) => KakaoMapInstance;

export interface KakaoMarkerInstance {
  setPosition: (latlng: KakaoLatLngInstance) => void;
}
export type KakaoMarker = new (options: {
  map: KakaoMapInstance;
  position: KakaoLatLngInstance;
}) => KakaoMarkerInstance;

export interface KakaoCustomOverlayInstance {
  setMap: (map: KakaoMapInstance | null) => void;
}
export type KakaoCustomOverlay = new (options: {
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
