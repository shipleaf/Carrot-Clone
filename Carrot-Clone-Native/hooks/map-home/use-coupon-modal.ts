import { useCallback, useRef, useState } from 'react';
import { Animated } from 'react-native';

import { mapUrl } from '@/constants/map-home';
import type { CouponDetail } from '@/types/store';

const SLIDE_DURATION = 320;
const MODAL_HEIGHT = 400;

export function useCouponModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [coupon, setCoupon] = useState<CouponDetail | null>(null);
  const translateY = useRef(new Animated.Value(MODAL_HEIGHT)).current;

  const slideIn = useCallback(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: SLIDE_DURATION,
      useNativeDriver: true,
    }).start();
  }, [translateY]);

  const open = useCallback(
    async (couponId: number) => {
      try {
        console.log('[native] open coupon:', couponId);
        const res = await fetch(`${mapUrl}/api/coupons/${couponId}`);
        if (!res.ok) {
          console.log('[native] fetchCoupon FAIL:', couponId, res.status);
          return;
        }

        const data = (await res.json()) as CouponDetail;
        setCoupon(data);
        setIsClaimed(false);
        translateY.setValue(MODAL_HEIGHT);
        setIsVisible(true);
        slideIn();
      } catch (error) {
        console.log('[native] fetchCoupon ERROR:', couponId, error);
      }
    },
    [slideIn, translateY],
  );

  const claim = useCallback(
    async (userId: string) => {
      if (!coupon) return;

      try {
        const res = await fetch(`${mapUrl}/api/coupons/${coupon.id}/claim`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });

        if (res.ok || res.status === 409) {
          setIsClaimed(true);
          return;
        }

        console.log('[native] claimCoupon FAIL:', coupon.id, res.status);
      } catch (error) {
        console.log('[native] claimCoupon ERROR:', coupon.id, error);
      }
    },
    [coupon],
  );

  const dismiss = useCallback(() => {
    translateY.stopAnimation(() => {
      setIsVisible(false);
      setCoupon(null);
      setIsClaimed(false);
      translateY.setValue(MODAL_HEIGHT);
    });
  }, [translateY]);

  return { claim, coupon, dismiss, isClaimed, isVisible, open, translateY };
}
