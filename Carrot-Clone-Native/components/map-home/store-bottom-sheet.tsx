import { Animated, GestureResponderHandlers, ScrollView, Text, View } from 'react-native';

import type { Snap } from '@/constants/map-home';
import type { ShimmerValue } from '@/hooks/map-home/use-skeleton-animation';
import type { StoreDetail } from '@/types/store';

import { StoreDetailContent } from './store-detail-content';
import { StorePreviewRow } from './store-preview-row';
import { StoreSkeleton, TitleSkeleton } from './store-skeleton';
import { styles } from './styles';

interface StoreBottomSheetProps {
  height: number;
  bottomInset: number;
  focusedStore: StoreDetail | null;
  isLoadingStore: boolean;
  panHandlers: GestureResponderHandlers;
  shimmer: ShimmerValue;
  skeletonOpacity: Animated.Value;
  snap: Snap;
  translateY: Animated.Value;
}

export function StoreBottomSheet({
  height,
  bottomInset,
  focusedStore,
  isLoadingStore,
  panHandlers,
  shimmer,
  skeletonOpacity,
  snap,
  translateY,
}: StoreBottomSheetProps) {
  const hasLoadedStore = focusedStore && !isLoadingStore;

  return (
    <Animated.View style={[styles.sheet, { height, transform: [{ translateY }] }]}>
      <View style={styles.grabberArea} {...panHandlers}>
        <View style={styles.grabber} />
        {hasLoadedStore ? (
          <Text style={styles.storeName} numberOfLines={1}>
            {focusedStore.name}
          </Text>
        ) : (
          <TitleSkeleton opacity={skeletonOpacity} shimmer={shimmer} />
        )}
      </View>

      {hasLoadedStore ? (
        <StorePreviewRow store={focusedStore} />
      ) : (
        <StoreSkeleton opacity={skeletonOpacity} shimmer={shimmer} />
      )}

      <ScrollView
        style={styles.fullContent}
        contentContainerStyle={{ paddingBottom: bottomInset + 24 }}
        scrollEnabled={snap === 2}
        showsVerticalScrollIndicator={false}>
        {hasLoadedStore && <StoreDetailContent store={focusedStore} />}
      </ScrollView>
    </Animated.View>
  );
}
