import { StyleSheet } from 'react-native';

import { GRABBER_AREA, NAME_ROW } from '@/constants/map-home';

export const colors = {
  carrot500: '#FF6F0F',
  gray00: '#FFFFFF',
  gray100: '#F2F3F6',
  gray200: '#E8EAED',
  gray300: '#D1D6DB',
  gray600: '#6B7684',
  gray800: '#333D4B',
  gray900: '#191F28',
};

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  topBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    gap: 8,
  },
  newsOverlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 20,
    minHeight: 120,
    backgroundColor: colors.gray00,
    borderRadius: 16,
    shadowColor: colors.gray900,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  ownerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray100,
  },
  ownerAvatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsTextBlock: {
    flex: 1,
    gap: 2,
  },
  newsOwnerName: {
    fontSize: 11,
    color: colors.gray600,
    fontWeight: '500',
  },
  newsStoreName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray900,
  },
  newsBody: {
    fontSize: 13,
    color: colors.gray800,
    lineHeight: 19,
    marginTop: 4,
  },
  newsCloseBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.gray00,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: colors.gray900,
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  grabberArea: {
    height: GRABBER_AREA + NAME_ROW,
    paddingTop: 10,
    alignItems: 'center',
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray300,
    marginBottom: 14,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray900,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  previewRow: {
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  storeThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: colors.gray100,
  },
  storeInfoBox: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  storeCategory: {
    fontSize: 12,
    color: colors.gray600,
    fontWeight: '500',
  },
  storeInfoName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray900,
  },
  storeAddress: {
    fontSize: 12,
    color: colors.gray600,
  },
  fullContent: {
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.gray200,
    marginHorizontal: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    color: colors.gray800,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.gray900,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  menuName: {
    fontSize: 14,
    color: colors.gray800,
  },
  menuPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
  },
  reviewRow: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 6,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewRating: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray800,
  },
  reviewLikes: {
    fontSize: 12,
    color: colors.gray600,
    marginLeft: 6,
  },
  reviewContent: {
    fontSize: 13,
    color: colors.gray800,
    lineHeight: 19,
  },
});

export const skeletonStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: colors.gray200,
  },
  lines: {
    flex: 1,
    justifyContent: 'center',
  },
  line: {
    height: 13,
    borderRadius: 6,
    backgroundColor: colors.gray200,
  },
  titleLine: {
    height: 16,
    borderRadius: 6,
    backgroundColor: colors.gray200,
    width: '45%',
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
});
