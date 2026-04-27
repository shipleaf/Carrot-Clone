import { MutableRefObject, useCallback, useRef } from 'react';
import WebView from 'react-native-webview';

import { FIXED_LOCATION, PEEK, Snap, SQUARE_HALF } from '@/constants/map-home';
import type { NewsOverlayStore } from '@/types/store';

interface UseMapWebViewBridgeParams {
  bottomInsetRef: MutableRefObject<number>;
  heightRef: MutableRefObject<number>;
  onNewsBubbleClicked: (store: NewsOverlayStore) => void;
  onStoreClicked: (storeId: number | null) => void;
  onStoreFocused: (storeId: number | null) => void;
  onTreasureClicked: (couponId: number) => void;
  snapRef: MutableRefObject<Snap>;
  widthRef: MutableRefObject<number>;
}

interface WebMessage {
  type?: string;
  msg?: string;
  store?: NewsOverlayStore;
  storeId?: number | null;
  couponId?: number;
}

export function useMapWebViewBridge({
  bottomInsetRef,
  heightRef,
  onNewsBubbleClicked,
  onStoreClicked,
  onStoreFocused,
  onTreasureClicked,
  snapRef,
  widthRef,
}: UseMapWebViewBridgeParams) {
  const webviewRef = useRef<WebView>(null);
  const webviewReadyRef = useRef(false);

  const injectLocation = useCallback(() => {
    const { lat, lng } = FIXED_LOCATION;

    webviewRef.current?.injectJavaScript(`
      (function() {
        var loc = { lat: ${lat}, lng: ${lng} };
        window.__nativeLocation = loc;
        window.dispatchEvent(new CustomEvent('nativeLocation', { detail: loc }));
      })();
      true;
    `);
  }, []);

  const injectCenterPoint = useCallback(
    (nextSnap: Snap) => {
      if (!webviewReadyRef.current) return;

      const height = heightRef.current;
      const width = widthRef.current;
      const webviewOffset = nextSnap === 1 ? 50 : 0;
      const visibleScreenBottom =
        nextSnap === 0 ? height - PEEK : nextSnap === 1 ? height * 0.7 : height;
      const centerY = webviewOffset + visibleScreenBottom / 2;
      const centerX = width / 2;

      webviewRef.current?.injectJavaScript(`
        window.dispatchEvent(new CustomEvent('centerPointChanged', {
          detail: { x: ${centerX}, y: ${centerY}, squareHalfSize: ${SQUARE_HALF} }
        }));
        true;
      `);
    },
    [bottomInsetRef, heightRef, widthRef],
  );

  const injectCategoryFilter = useCallback((category: string | null) => {
    webviewRef.current?.injectJavaScript(`
      window.dispatchEvent(new CustomEvent('categoryFilter', {
        detail: { category: ${JSON.stringify(category)} }
      }));
      true;
    `);
  }, []);

  const injectMoveToStore = useCallback((lat: number, lng: number) => {
    webviewRef.current?.injectJavaScript(`
      window.dispatchEvent(new CustomEvent('moveToStore', {
        detail: { lat: ${lat}, lng: ${lng} }
      }));
      true;
    `);
  }, []);

  const handleLoadEnd = useCallback(() => {
    console.log('[WV] loadEnd');
    webviewReadyRef.current = true;
    injectLocation();
    injectCenterPoint(snapRef.current);
  }, [injectCenterPoint, injectLocation, snapRef]);

  const handleMessageData = useCallback(
    (data: string) => {
      try {
        const msg = JSON.parse(data) as WebMessage;

        switch (msg.type) {
          case 'storeFocused':
            onStoreFocused(typeof msg.storeId === 'number' ? msg.storeId : null);
            break;
          case 'storeClicked':
            onStoreClicked(typeof msg.storeId === 'number' ? msg.storeId : null);
            break;
          case 'newsBubbleClicked':
            if (msg.store) onNewsBubbleClicked(msg.store);
            break;
          case 'treasureClicked':
            if (typeof msg.couponId === 'number') {
              console.log('[native] treasureClicked:', msg.couponId);
              onTreasureClicked(msg.couponId);
            }
            break;
          default:
            if (msg.type && ['log', 'err', 'warn'].includes(msg.type)) {
              console.log(`[WV:${msg.type}]`, msg.msg);
            }
        }
      } catch {
        console.log('[WV]', data);
      }
    },
    [onNewsBubbleClicked, onStoreClicked, onStoreFocused, onTreasureClicked],
  );

  return {
    handleLoadEnd,
    handleMessageData,
    injectCategoryFilter,
    injectCenterPoint,
    injectMoveToStore,
    webviewRef,
  };
}
