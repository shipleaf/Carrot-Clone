import { useCallback, useEffect, useRef, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PEEK, type Snap } from '@/constants/map-home';
import { useBottomSheetSnap } from '@/hooks/map-home/use-bottom-sheet-snap';
import { useCouponModal } from '@/hooks/map-home/use-coupon-modal';
import { useMapWebViewBridge } from '@/hooks/map-home/use-map-webview-bridge';
import { useNewsOverlay } from '@/hooks/map-home/use-news-overlay';
import { useSkeletonAnimation } from '@/hooks/map-home/use-skeleton-animation';
import { useStoreDetail } from '@/hooks/map-home/use-store-detail';
import type { NewsOverlayStore } from '@/types/store';

import { CategoryFilterBar } from './category-filter-bar';
import { CouponModal } from './coupon-modal';
import { MapSearchBar } from './map-search-bar';
import { MapWebView } from './map-web-view';
import { NewsOverlayCard } from './news-overlay-card';
import { StoreBottomSheet } from './store-bottom-sheet';
import { styles } from './styles';

export function MapHomeScreen() {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
      hideNewsOverlay();

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
      showNewsOverlay(store);
      animateTo(0);
    },
    [animateTo, showNewsOverlay],
  );

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
      setSelectedCategory(category);
      mapBridge.injectCategoryFilter(category);
    },
    [mapBridge],
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
        <CategoryFilterBar
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
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
