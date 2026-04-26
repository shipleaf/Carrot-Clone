import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from './styles';

export function MapSearchBar() {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={16} color={colors.gray600} />
      <Text style={styles.placeholder}>집 근처 업체 검색</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    backgroundColor: colors.gray00,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    shadowColor: colors.gray900,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  placeholder: {
    fontSize: 14,
    color: colors.gray600,
    flex: 1,
  },
});
