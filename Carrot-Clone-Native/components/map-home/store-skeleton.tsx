import { Animated, View } from 'react-native';

import type { ShimmerValue } from '@/hooks/map-home/use-skeleton-animation';

import { skeletonStyles } from './styles';

function ShimmerStrip({ shimmer }: { shimmer: ShimmerValue }) {
  return (
    <Animated.View
      style={[skeletonStyles.shimmerOverlay, { transform: [{ translateX: shimmer }] }]}
    />
  );
}

interface SkeletonProps {
  opacity: Animated.Value;
  shimmer: ShimmerValue;
}

export function StoreSkeleton({ opacity, shimmer }: SkeletonProps) {
  return (
    <View style={skeletonStyles.row}>
      <Animated.View style={[skeletonStyles.thumb, { opacity, overflow: 'hidden' }]}>
        <ShimmerStrip shimmer={shimmer} />
      </Animated.View>
      <View style={skeletonStyles.lines}>
        <Animated.View
          style={[skeletonStyles.line, { width: '35%', opacity, overflow: 'hidden' }]}>
          <ShimmerStrip shimmer={shimmer} />
        </Animated.View>
        <Animated.View
          style={[
            skeletonStyles.line,
            { width: '75%', marginTop: 7, opacity, overflow: 'hidden' },
          ]}>
          <ShimmerStrip shimmer={shimmer} />
        </Animated.View>
        <Animated.View
          style={[
            skeletonStyles.line,
            { width: '50%', marginTop: 7, opacity, overflow: 'hidden' },
          ]}>
          <ShimmerStrip shimmer={shimmer} />
        </Animated.View>
      </View>
    </View>
  );
}

export function TitleSkeleton({ opacity, shimmer }: SkeletonProps) {
  return (
    <Animated.View style={[skeletonStyles.titleLine, { opacity, overflow: 'hidden' }]}>
      <ShimmerStrip shimmer={shimmer} />
    </Animated.View>
  );
}
