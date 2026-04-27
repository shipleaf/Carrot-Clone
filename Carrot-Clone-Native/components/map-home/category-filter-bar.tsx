import { Ionicons } from '@expo/vector-icons';
import { Image, ImageSourcePropType, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { colors } from './styles';

interface ImageIcon {
  type: 'image';
  source: ImageSourcePropType;
}

interface CategoryItem {
  value: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap | ImageIcon;
  color: string;
  disabled?: boolean;
}

const CATEGORIES: CategoryItem[] = [
  {
    value: '__trending__:dubai_cookie',
    label: '두바이쿠키',
    icon: { type: 'image', source: require('../../assets/images/dubai_cookie.png') },
    color: '#FF6F0F',
  },
  { value: '포장주문', label: '포장주문', icon: 'bag-handle-outline', color: '#3182F6' },
  { value: '음식점', label: '음식점', icon: 'restaurant-outline', color: '#F04438' },
  { value: '운동', label: '운동', icon: 'barbell-outline', color: '#12B886' },
  { value: '카페', label: '카페', icon: 'cafe-outline', color: '#8B95A1' },
  { value: '__more__', label: '더보기', icon: 'grid-outline', color: '#6B7684', disabled: true },
];

interface Props {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function CategoryFilterBar({ selectedCategory, onCategoryChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}>
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.value;
        return (
          <TouchableOpacity
            key={cat.value}
            activeOpacity={cat.disabled ? 1 : 0.75}
            onPress={cat.disabled ? undefined : () => onCategoryChange(isSelected ? null : cat.value)}
            style={[
              styles.button,
              { borderColor: isSelected ? cat.color : colors.gray300 },
              isSelected && { backgroundColor: cat.color },
            ]}>
            {typeof cat.icon === 'object' && cat.icon.type === 'image' ? (
              <Image
                source={cat.icon.source}
                style={[styles.iconImage, isSelected && { tintColor: colors.gray00 }]}
              />
            ) : (
              <Ionicons
                name={cat.icon as keyof typeof Ionicons.glyphMap}
                size={14}
                color={isSelected ? colors.gray00 : cat.color}
              />
            )}
            <Text style={[styles.label, { color: isSelected ? colors.gray00 : colors.gray800 }]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
    paddingVertical: 2,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: colors.gray00,
    shadowColor: colors.gray900,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  iconImage: {
    width: 14,
    height: 14,
  },
});
