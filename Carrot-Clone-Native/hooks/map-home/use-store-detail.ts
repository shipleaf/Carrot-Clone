import { useCallback, useRef, useState } from 'react';

import { mapUrl } from '@/constants/map-home';
import type { StoreDetail } from '@/types/store';

export function useStoreDetail() {
  const [focusedStore, setFocusedStore] = useState<StoreDetail | null>(null);
  const [isLoadingStore, setIsLoadingStore] = useState(false);
  const loadedStoreIdRef = useRef<number | null>(null);
  const requestedStoreIdRef = useRef<number | null>(null);
  const storeRequestSeqRef = useRef(0);

  const clearStore = useCallback(() => {
    storeRequestSeqRef.current += 1;
    requestedStoreIdRef.current = null;
    loadedStoreIdRef.current = null;
    setFocusedStore(null);
    setIsLoadingStore(false);
  }, []);

  const fetchStore = useCallback((storeId: number) => {
    if (requestedStoreIdRef.current === storeId) return;
    if (loadedStoreIdRef.current === storeId) return;

    const requestSeq = storeRequestSeqRef.current + 1;
    storeRequestSeqRef.current = requestSeq;
    requestedStoreIdRef.current = storeId;
    loadedStoreIdRef.current = null;

    setFocusedStore(null);
    setIsLoadingStore(true);

    fetch(`${mapUrl}/api/stores/${storeId}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((detail: StoreDetail) => {
        if (requestSeq !== storeRequestSeqRef.current) return;

        console.log('[native] fetchStore success:', storeId, detail.name);
        requestedStoreIdRef.current = null;
        loadedStoreIdRef.current = detail.id;
        setFocusedStore(detail);
        setIsLoadingStore(false);
      })
      .catch((error) => {
        if (requestSeq !== storeRequestSeqRef.current) return;

        console.log('[native] fetchStore FAIL:', storeId, error);
        requestedStoreIdRef.current = null;
        setIsLoadingStore(false);
      });
  }, []);

  return {
    clearStore,
    fetchStore,
    focusedStore,
    isLoadingStore,
  };
}
