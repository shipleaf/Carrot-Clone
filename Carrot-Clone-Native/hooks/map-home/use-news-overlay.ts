import { useCallback, useRef, useState } from 'react';

import type { NewsOverlayStore } from '@/types/store';

export function useNewsOverlay() {
  const [store, setStore] = useState<NewsOverlayStore | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isVisibleRef = useRef(false);

  const hide = useCallback(() => {
    isVisibleRef.current = false;
    setIsVisible(false);
  }, []);

  const show = useCallback((nextStore: NewsOverlayStore) => {
    setStore(nextStore);
    isVisibleRef.current = true;
    setIsVisible(true);
  }, []);

  return {
    hide,
    isVisible,
    isVisibleRef,
    show,
    store,
  };
}
