import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import {
  Animated,
  GestureResponderHandlers,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import type { Snap } from '@/constants/map-home';
import type { ShimmerValue } from '@/hooks/map-home/use-skeleton-animation';
import type { StoreDetail } from '@/types/store';

import { StoreDetailContent } from './store-detail-content';
import { StoreSkeleton, TitleSkeleton } from './store-skeleton';
import { colors, styles } from './styles';

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
  onBackPress: () => void;
}

function formatRating(rating: number | null) {
  if (rating === null) return '별점 없음';
  return rating.toFixed(1);
}

function StoreActionBar({ onBackPress }: { onBackPress: () => void }) {
  return (
    <View style={styles.sheetActionBar}>
      <Pressable onPress={onBackPress} style={styles.sheetIconButton} hitSlop={8}>
        <Ionicons name="arrow-back" size={22} color={colors.gray900} />
      </Pressable>
      <View style={styles.sheetActionRight}>
        <Pressable style={styles.sheetIconButton} hitSlop={8}>
          <Ionicons name="heart-outline" size={22} color={colors.gray900} />
        </Pressable>
        <Pressable style={styles.sheetIconButton} hitSlop={8}>
          <Ionicons name="share-outline" size={22} color={colors.gray900} />
        </Pressable>
      </View>
    </View>
  );
}

function StoreHero({ store }: { store: StoreDetail }) {
  return (
    <View style={styles.sheetHero}>
      <View style={styles.sheetHeroText}>
        <Text style={styles.heroStoreName}>{store.name}</Text>
        <View style={styles.heroMetaRow}>
          <Ionicons name="star" size={14} color={colors.carrot500} />
          <Text style={styles.heroMetaText}>{formatRating(store.ratingAverage)}</Text>
          <Text style={styles.heroMetaDot}>·</Text>
          <Text style={styles.heroMetaText}>후기 {store.reviewCount}개</Text>
          <Text style={styles.heroMetaDot}>·</Text>
          <Text style={styles.heroMetaText}>단골 {store.followerCount}명</Text>
        </View>
        <Text style={styles.heroSubText} numberOfLines={2}>
          {store.address} · {store.category}
        </Text>
      </View>
      <Pressable style={styles.followButton}>
        <Ionicons name="add" size={16} color={colors.gray00} />
        <Text style={styles.followButtonText}>단골맺기</Text>
      </Pressable>
    </View>
  );
}

function StoreImageCarousel({ store }: { store: StoreDetail }) {
  const carouselImages = [
    store.ownerProfileImageUrl,
    ...store.images.map((image) => image.url),
  ].filter((url): url is string => Boolean(url));

  if (carouselImages.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.imageCarouselContent}
      style={styles.imageCarousel}>
      {carouselImages.map((url, index) => (
        <Image
          key={`${url}-${index}`}
          source={{ uri: url }}
          style={styles.carouselImage}
          contentFit="cover"
        />
      ))}
    </ScrollView>
  );
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
  onBackPress,
}: StoreBottomSheetProps) {
  const hasLoadedStore = focusedStore && !isLoadingStore;

  return (
    <Animated.View style={[styles.sheet, { height, transform: [{ translateY }] }]}>
      <View style={[styles.grabberArea, snap !== 0 && styles.grabberAreaExpanded]} {...panHandlers}>
        <View style={styles.grabber} />
        {snap === 0 &&
          (hasLoadedStore ? (
            <Text style={styles.storeName} numberOfLines={1}>
              {focusedStore.name}
            </Text>
          ) : (
            <TitleSkeleton opacity={skeletonOpacity} shimmer={shimmer} />
          ))}
      </View>

      {snap !== 0 && (
        <ScrollView
          style={styles.fullContent}
          contentContainerStyle={[
            styles.fullContentInner,
            snap === 2 && styles.fullContentInnerExpanded,
            { paddingBottom: bottomInset + 24 },
          ]}
          scrollEnabled={snap === 2}
          showsVerticalScrollIndicator={false}>
          {hasLoadedStore ? (
            <>
              {snap === 2 && <StoreActionBar onBackPress={onBackPress} />}
              <StoreHero store={focusedStore} />
              <StoreImageCarousel store={focusedStore} />
              <StoreDetailContent store={focusedStore} />
            </>
          ) : (
            <StoreSkeleton opacity={skeletonOpacity} shimmer={shimmer} />
          )}
        </ScrollView>
      )}
    </Animated.View>
  );
}
