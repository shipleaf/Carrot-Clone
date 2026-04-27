import { useCallback, useEffect, useRef, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { mapUrl, PEEK, type Snap } from '@/constants/map-home';
import { useBottomSheetSnap } from '@/hooks/map-home/use-bottom-sheet-snap';
import { useCouponModal } from '@/hooks/map-home/use-coupon-modal';
import { useMapWebViewBridge } from '@/hooks/map-home/use-map-webview-bridge';
import { useNewsOverlay } from '@/hooks/map-home/use-news-overlay';
import { useSkeletonAnimation } from '@/hooks/map-home/use-skeleton-animation';
import { useStoreDetail } from '@/hooks/map-home/use-store-detail';
import type { NewsOverlayStore, PopularNewsItem } from '@/types/store';

import { CategoryFilterBar } from './category-filter-bar';
import { CouponModal } from './coupon-modal';
import { MapSearchBar } from './map-search-bar';
import { MapWebView } from './map-web-view';
import { NewsOverlayCard } from './news-overlay-card';
import { PopularNewsButton, PopularNewsDropdown } from './popular-news-dropdown';
import { StoreBottomSheet } from './store-bottom-sheet';
import { styles } from './styles';

export function MapHomeScreen() {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isPopularNewsOpen, setIsPopularNewsOpen] = useState(false);
  const [isPopularNewsLoading, setIsPopularNewsLoading] = useState(false);
  const [popularNewsItems, setPopularNewsItems] = useState<PopularNewsItem[]>([]);
  const { clearStore, fetchStore, focusedStore, isLoadingStore } = useStoreDetail();
  const couponModal = useCouponModal();
  const {
    hide: hideNewsOverlay,
    isVisible: isNewsOverlayVisible,
    isVisibleRef: isNewsOverlayVisibleRef,
    show: showNewsOverlay,
    store: newsOverlayStore,
  } = useNewsOverlay();
  const { shimmerTranslate, skeletonOpacity } = useSkeletonAnimation();
  const onSnapChangeRef = useRef<(snap: Snap) => void>(() => undefined);
  const focusedStoreIdRef = useRef<number | null>(null);
  const popularNewsLoadedRef = useRef(false);

  const sheet = useBottomSheetSnap({
    bottomInset: insets.bottom,
    dismissNewsOverlay: hideNewsOverlay,
    height,
    isNewsOverlayVisibleRef,
    onSnapChangeRef,
    width,
  });
  const {
    animateTo,
    bottomInsetRef,
    heightRef,
    panHandlers,
    snap,
    snapRef,
    translateY,
    webViewShift,
    widthRef,
  } = sheet;

  const handleStoreFocused = useCallback(
    (storeId: number | null) => {
      const previousStoreId = focusedStoreIdRef.current;
      focusedStoreIdRef.current = storeId;

      if (storeId !== previousStoreId) {
        hideNewsOverlay();
      }

      if (storeId !== null) {
        fetchStore(storeId);
      } else {
        clearStore();
      }
    },
    [clearStore, fetchStore, hideNewsOverlay],
  );

  const handleStoreClicked = useCallback(
    (storeId: number | null) => {
      animateTo(1);

      if (storeId !== null) {
        hideNewsOverlay();
        fetchStore(storeId);
      }
    },
    [animateTo, fetchStore, hideNewsOverlay],
  );

  const handleNewsBubbleClicked = useCallback(
    (store: NewsOverlayStore) => {
      focusedStoreIdRef.current = store.id;
      showNewsOverlay(store);
      animateTo(0);
    },
    [animateTo, showNewsOverlay],
  );

  const fetchPopularNews = useCallback(() => {
    if (popularNewsLoadedRef.current) return;

    setIsPopularNewsLoading(true);
    fetch(`${mapUrl}/api/news/popular`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((items: PopularNewsItem[]) => {
        popularNewsLoadedRef.current = true;
        setPopularNewsItems(items);
      })
      .catch((error) => {
        console.log('[native] popular news fetch FAIL:', error);
      })
      .finally(() => {
        setIsPopularNewsLoading(false);
      });
  }, []);

  const handlePopularNewsPress = useCallback(() => {
    setIsPopularNewsOpen((current) => {
      const next = !current;
      if (next) fetchPopularNews();
      return next;
    });
  }, [fetchPopularNews]);

  const mapBridge = useMapWebViewBridge({
    bottomInsetRef,
    heightRef,
    onNewsBubbleClicked: handleNewsBubbleClicked,
    onStoreClicked: handleStoreClicked,
    onStoreFocused: handleStoreFocused,
    onTreasureClicked: couponModal.open,
    snapRef,
    widthRef,
  });

  const handleCategoryChange = useCallback(
    (category: string | null) => {
      setIsPopularNewsOpen(false);
      setSelectedCategory(category);
      mapBridge.injectCategoryFilter(category);
    },
    [mapBridge],
  );

  const handlePopularNewsSelect = useCallback(
    (item: PopularNewsItem) => {
      setIsPopularNewsOpen(false);
      setSelectedCategory(null);
      mapBridge.injectCategoryFilter(null);
      mapBridge.injectMoveToStore(item.store.lat, item.store.lng);
      focusedStoreIdRef.current = item.store.id;
      hideNewsOverlay();
      fetchStore(item.store.id);
      animateTo(2);
    },
    [animateTo, fetchStore, hideNewsOverlay, mapBridge],
  );

  useEffect(() => {
    onSnapChangeRef.current = mapBridge.injectCenterPoint;
  }, [mapBridge.injectCenterPoint]);

  return (
    <View style={styles.screen}>
      <MapWebView
        onLoadEnd={mapBridge.handleLoadEnd}
        onMessageData={mapBridge.handleMessageData}
        shiftY={webViewShift}
        webviewRef={mapBridge.webviewRef}
      />

      <View style={[styles.topBar, { top: insets.top + 8 }]}>
        <MapSearchBar />
        <View style={styles.filterRow}>
          <PopularNewsButton isOpen={isPopularNewsOpen} onPress={handlePopularNewsPress} />
          <View style={styles.filterScrollWrap}>
            <CategoryFilterBar
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </View>
        </View>
        {isPopularNewsOpen && (
          <PopularNewsDropdown
            isLoading={isPopularNewsLoading}
            items={popularNewsItems}
            onSelect={handlePopularNewsSelect}
          />
        )}
      </View>

      {isNewsOverlayVisible && newsOverlayStore && (
        <NewsOverlayCard
          bottom={PEEK + insets.bottom + 8}
          store={newsOverlayStore}
          onClose={hideNewsOverlay}
        />
      )}

      <StoreBottomSheet
        height={height}
        bottomInset={insets.bottom}
        focusedStore={focusedStore}
        isLoadingStore={isLoadingStore}
        panHandlers={panHandlers}
        shimmer={shimmerTranslate}
        skeletonOpacity={skeletonOpacity}
        snap={snap}
        translateY={translateY}
        onBackPress={() => animateTo(0)}
      />

      {couponModal.isVisible && couponModal.coupon && (
        <CouponModal
          coupon={couponModal.coupon}
          isClaimed={couponModal.isClaimed}
          isVisible={couponModal.isVisible}
          translateY={couponModal.translateY}
          onClaim={() => couponModal.claim('user_guest')}
          onDismiss={couponModal.dismiss}
        />
      )}
    </View>
  );
}
