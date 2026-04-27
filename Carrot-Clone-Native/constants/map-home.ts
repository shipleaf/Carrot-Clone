import { Platform } from 'react-native';

export const mapUrl =
  process.env.EXPO_PUBLIC_MAP_WEB_URL ??
  Platform.select({
    android: 'http://10.0.2.2:3000',
    default: 'http://localhost:3000',
  });

export const GRABBER_AREA = 28;
export const NAME_ROW = 40;
export const PEEK = GRABBER_AREA + NAME_ROW;
export const SQUARE_HALF = 160;
export const WEBVIEW_MID_SNAP_SHIFT = -50;

export const FIXED_LOCATION = { lat: 35.1897739, lng: 126.8113884 };

export type Snap = 0 | 1 | 2;
