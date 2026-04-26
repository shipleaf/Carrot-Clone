import { Feather } from '@expo/vector-icons';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { CouponDetail } from '@/types/store';

import { colors } from './styles';

const GOLD = '#FFC839';
const GOLD_DARK = '#8F3206';
const GOLD_BG = '#FFF4EC';

interface CouponModalProps {
  coupon: CouponDetail;
  isClaimed: boolean;
  isVisible: boolean;
  translateY: Animated.Value;
  onClaim: () => void;
  onDismiss: () => void;
}

function formatExpiry(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function CouponModal({
  coupon,
  isClaimed,
  isVisible,
  translateY,
  onClaim,
  onDismiss,
}: CouponModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDismiss}>
      <View style={styles.modalRoot}>
      {/* 딤 배경 */}
      <Pressable style={styles.backdrop} onPress={onDismiss} />

      {/* 슬라이드업 컨테이너 */}
      <Animated.View
        style={[
          styles.sheet,
          { paddingBottom: Math.max(insets.bottom, 16) + 8, transform: [{ translateY }] },
        ]}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.storeName}>{coupon.storeName}</Text>
            <Text style={styles.headline}>
              {isClaimed ? '쿠폰이 저장됐어요! 🎉' : '쿠폰을 찾았어요! 🎁'}
            </Text>
          </View>
          <Pressable style={styles.closeBtn} onPress={onDismiss} hitSlop={8}>
            <Feather name="x" size={20} color={colors.gray600} />
          </Pressable>
        </View>

        {/* 티켓 카드 */}
        <View style={styles.ticket}>
          {/* 왼쪽 — 쿠폰 라벨 */}
          <View style={styles.ticketLeft}>
            <Text style={styles.ticketLabel}>쿠폰</Text>
          </View>

          {/* 점선 구분선 + 반원 노치 */}
          <View style={styles.dividerCol}>
            <View style={styles.notchTop} />
            <View style={styles.dashedLine} />
            <View style={styles.notchBottom} />
          </View>

          {/* 오른쪽 — 내용 + 다운로드 */}
          <View style={styles.ticketRight}>
            <View style={styles.ticketInfo}>
              <Text style={styles.ticketTitle}>{coupon.title}</Text>
              {coupon.description ? (
                <Text style={styles.ticketDesc}>{coupon.description}</Text>
              ) : null}
              {coupon.expiresAt ? (
                <Text style={styles.ticketExpiry}>
                  유효기간 {formatExpiry(coupon.expiresAt)}까지
                </Text>
              ) : null}
            </View>
            <View style={[styles.downloadBtn, isClaimed && styles.downloadBtnClaimed]}>
              <Feather
                name={isClaimed ? 'check' : 'download'}
                size={18}
                color={isClaimed ? colors.carrot500 : GOLD_DARK}
              />
            </View>
          </View>
        </View>

        {/* 액션 버튼 */}
        {isClaimed ? (
          <Pressable style={styles.primaryBtn} onPress={onDismiss}>
            <Text style={styles.primaryBtnText}>확인</Text>
          </Pressable>
        ) : (
          <View style={styles.btnRow}>
            <Pressable style={styles.primaryBtn} onPress={onClaim}>
              <Text style={styles.primaryBtnText}>쿠폰 받기</Text>
            </Pressable>
            <Pressable style={styles.ghostBtn} onPress={onDismiss}>
              <Text style={styles.ghostBtnText}>나중에 받을게요</Text>
            </Pressable>
          </View>
        )}
      </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 1,
  },
  sheet: {
    zIndex: 2,
    elevation: 24,
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.gray00,
    borderRadius: 20,
    paddingTop: 24,
    paddingHorizontal: 20,
    gap: 20,
    shadowColor: colors.gray900,
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  storeName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.carrot500,
    marginBottom: 4,
  },
  headline: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray900,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 티켓
  ticket: {
    flexDirection: 'row',
    backgroundColor: GOLD_BG,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: GOLD,
    overflow: 'hidden',
    minHeight: 100,
  },
  ticketLeft: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GOLD,
  },
  ticketLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: GOLD_DARK,
    letterSpacing: 2,
    // 세로 텍스트
    transform: [{ rotate: '-90deg' }],
    width: 60,
    textAlign: 'center',
  },
  dividerCol: {
    width: 1,
    alignItems: 'center',
    position: 'relative',
  },
  notchTop: {
    width: 16,
    height: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: colors.gray00,
    marginTop: -1,
  },
  dashedLine: {
    flex: 1,
    width: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: GOLD,
  },
  notchBottom: {
    width: 16,
    height: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: colors.gray00,
    marginBottom: -1,
  },
  ticketRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 16,
    gap: 12,
  },
  ticketInfo: {
    flex: 1,
    gap: 4,
  },
  ticketTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.gray900,
  },
  ticketDesc: {
    fontSize: 12,
    color: colors.gray600,
    lineHeight: 17,
  },
  ticketExpiry: {
    fontSize: 11,
    color: colors.gray600,
    marginTop: 2,
  },
  downloadBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadBtnClaimed: {
    backgroundColor: '#FFE4D0',
  },

  // 버튼
  btnRow: {
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: colors.carrot500,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray00,
  },
  ghostBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostBtnText: {
    fontSize: 14,
    color: colors.gray600,
  },
});
