import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { PopularNewsItem } from '@/types/store';

import { colors } from './styles';

interface PopularNewsButtonProps {
  isOpen: boolean;
  onPress: () => void;
}

interface PopularNewsDropdownProps {
  isLoading: boolean;
  items: PopularNewsItem[];
  onSelect: (item: PopularNewsItem) => void;
}

export function PopularNewsButton({ isOpen, onPress }: PopularNewsButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="인기 새소식"
      onPress={onPress}
      style={[styles.button, isOpen && styles.buttonSelected]}>
      <Ionicons
        name="newspaper-outline"
        size={15}
        color={isOpen ? colors.gray00 : colors.carrot500}
      />
      <Text style={[styles.buttonLabel, isOpen && styles.buttonLabelSelected]}>새소식</Text>
      <Ionicons
        name={isOpen ? 'chevron-up' : 'chevron-down'}
        size={13}
        color={isOpen ? colors.gray00 : colors.gray600}
      />
    </Pressable>
  );
}

export function PopularNewsDropdown({ isLoading, items, onSelect }: PopularNewsDropdownProps) {
  return (
    <View style={styles.dropdown}>
      {isLoading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={colors.carrot500} />
        </View>
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {items.map((item) => (
            <Pressable key={item.id} onPress={() => onSelect(item)} style={styles.row}>
              <View style={styles.rowHeader}>
                <Text style={styles.storeName} numberOfLines={1}>
                  {item.store.name}
                </Text>
                <Text style={styles.category}>{item.store.category}</Text>
              </View>
              <Text style={styles.content} numberOfLines={2}>
                {item.content}
              </Text>
              <View style={styles.meta}>
                <Ionicons name="heart-outline" size={13} color={colors.gray600} />
                <Text style={styles.metaText}>{item.likeCount}</Text>
                <Ionicons name="eye-outline" size={13} color={colors.gray600} />
                <Text style={styles.metaText}>{item.viewCount}</Text>
              </View>
            </Pressable>
          ))}
          {items.length === 0 && <Text style={styles.emptyText}>보여줄 새소식이 없어요</Text>}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.carrot500,
    backgroundColor: colors.gray00,
    shadowColor: colors.gray900,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  buttonSelected: {
    backgroundColor: colors.carrot500,
  },
  buttonLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray800,
  },
  buttonLabelSelected: {
    color: colors.gray00,
  },
  dropdown: {
    marginHorizontal: 16,
    maxHeight: 282,
    borderRadius: 16,
    backgroundColor: colors.gray00,
    shadowColor: colors.gray900,
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 9,
    overflow: 'hidden',
  },
  loadingRow: {
    minHeight: 74,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    maxHeight: 282,
  },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray200,
    gap: 6,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  storeName: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    fontWeight: '800',
    color: colors.gray900,
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.carrot500,
  },
  content: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.gray800,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    marginRight: 8,
    fontSize: 12,
    fontWeight: '700',
    color: colors.gray600,
  },
  emptyText: {
    padding: 18,
    fontSize: 13,
    color: colors.gray600,
    textAlign: 'center',
  },
});
