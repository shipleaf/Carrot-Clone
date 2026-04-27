import { MutableRefObject, useCallback, useRef, useState } from 'react';
import { Animated, PanResponder } from 'react-native';

import { PEEK, Snap, WEBVIEW_MID_SNAP_SHIFT } from '@/constants/map-home';

interface UseBottomSheetSnapParams {
  bottomInset: number;
  dismissNewsOverlay: () => void;
  height: number;
  isNewsOverlayVisibleRef: MutableRefObject<boolean>;
  onSnapChangeRef: MutableRefObject<(snap: Snap) => void>;
  width: number;
}

export function useBottomSheetSnap({
  bottomInset,
  dismissNewsOverlay,
  height,
  isNewsOverlayVisibleRef,
  onSnapChangeRef,
  width,
}: UseBottomSheetSnapParams) {
  const heightRef = useRef(height);
  heightRef.current = height;
  const widthRef = useRef(width);
  widthRef.current = width;
  const bottomInsetRef = useRef(bottomInset);
  bottomInsetRef.current = bottomInset;

  const snapToY = useCallback((nextSnap: Snap): number => {
    if (nextSnap === 0) return heightRef.current - PEEK;
    if (nextSnap === 1) return heightRef.current * 0.7;
    return 0;
  }, []);

  const snapRef = useRef<Snap>(0);
  const baseY = useRef(snapToY(0));
  const translateY = useRef(new Animated.Value(snapToY(0))).current;
  const [snap, setSnap] = useState<Snap>(0);

  const animateTo = useCallback((nextSnap: Snap) => {
    if (nextSnap >= 1) {
      dismissNewsOverlay();
    }

    onSnapChangeRef.current(nextSnap);
    const nextY = snapToY(nextSnap);
    snapRef.current = nextSnap;
    baseY.current = nextY;
    setSnap(nextSnap);

    Animated.spring(translateY, {
      toValue: nextY,
      useNativeDriver: true,
      damping: 28,
      stiffness: 320,
      mass: 0.8,
    }).start();
  }, [dismissNewsOverlay, onSnapChangeRef, snapToY, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, { dx, dy }) =>
        Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 4,
      onPanResponderGrant: () => {
        translateY.setOffset(baseY.current);
        translateY.setValue(0);
      },
      onPanResponderMove: (_, { dy }) => {
        const minY = 0;
        const maxY = heightRef.current - PEEK;
        const clamped = Math.max(minY - baseY.current, Math.min(maxY - baseY.current, dy));
        translateY.setValue(clamped);
      },
      onPanResponderRelease: (_, { dx, dy, vy }) => {
        translateY.flattenOffset();

        const isTap = Math.sqrt(dx * dx + dy * dy) < 8;
        let target: Snap;

        if (isTap) {
          if (isNewsOverlayVisibleRef.current) {
            dismissNewsOverlay();
            animateTo(1);
            return;
          }
          target = snapRef.current < 2 ? ((snapRef.current + 1) as Snap) : snapRef.current;
        } else if (dy < -30 || vy < -0.5) {
          target = Math.min(2, snapRef.current + 1) as Snap;
        } else if (dy > 30 || vy > 0.5) {
          target = Math.max(0, snapRef.current - 1) as Snap;
        } else {
          target = snapRef.current;
        }

        animateTo(target);
      },
    }),
  ).current;

  const webViewShift = translateY.interpolate({
    inputRange: [0, height * 0.7, height - PEEK],
    outputRange: [0, WEBVIEW_MID_SNAP_SHIFT, 0],
    extrapolate: 'clamp',
  });

  return {
    animateTo,
    bottomInsetRef,
    heightRef,
    panHandlers: panResponder.panHandlers,
    snap,
    snapRef,
    translateY,
    webViewShift,
    widthRef,
  };
}
