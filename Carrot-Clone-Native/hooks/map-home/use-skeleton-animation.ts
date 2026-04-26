import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export type ShimmerValue = Animated.AnimatedInterpolation<number>;

export function useSkeletonAnimation() {
  const skeletonOpacity = useRef(new Animated.Value(0.4)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(skeletonOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(skeletonOpacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );

    anim.start();
    return () => anim.stop();
  }, [skeletonOpacity]);

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    );

    anim.start();
    return () => anim.stop();
  }, [shimmerAnim]);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 400],
  });

  return { skeletonOpacity, shimmerTranslate };
}
