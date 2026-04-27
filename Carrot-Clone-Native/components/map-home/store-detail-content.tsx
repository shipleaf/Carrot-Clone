import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import type { StoreDetail } from '@/types/store';
import { formatTodayHours, formatWon } from '@/utils/store-format';

import { colors, styles } from './styles';

interface StoreDetailContentProps {
  store: StoreDetail;
}

export function StoreDetailContent({ store }: StoreDetailContentProps) {
  return (
    <>
      {store.news.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>새소식</Text>
          {store.news.map((news) => (
            <View key={news.id} style={styles.newsCard}>
              <Text style={styles.newsCardContent}>{news.content}</Text>
              <View style={styles.newsCardMeta}>
                <Ionicons name="heart-outline" size={13} color={colors.gray600} />
                <Text style={styles.newsCardMetaText}>{news.likeCount}</Text>
                <Ionicons name="eye-outline" size={13} color={colors.gray600} />
                <Text style={styles.newsCardMetaText}>{news.viewCount}</Text>
              </View>
            </View>
          ))}
        </>
      )}
      <View style={styles.divider} />
      <View style={styles.detailRow}>
        <Ionicons name="location-outline" size={18} color={colors.gray600} />
        <Text style={styles.detailText}>{store.address}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.detailRow}>
        <Ionicons name="call-outline" size={18} color={colors.gray600} />
        <Text style={styles.detailText}>{store.phone}</Text>
      </View>
      {store.hours.length > 0 && (
        <>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={18} color={colors.gray600} />
            <Text style={styles.detailText}>{formatTodayHours(store)}</Text>
          </View>
        </>
      )}
      {store.menuItems.length > 0 && (
        <>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>메뉴</Text>
          {store.menuItems.map((item) => (
            <View key={item.id} style={styles.menuRow}>
              <Text style={styles.menuName}>{item.name}</Text>
              <Text style={styles.menuPrice}>{formatWon(item.price)}</Text>
            </View>
          ))}
        </>
      )}
      {store.reviews.length > 0 && (
        <>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>리뷰</Text>
          {store.reviews.map((review) => (
            <View key={review.id} style={styles.reviewRow}>
              <View style={styles.reviewMeta}>
                <Ionicons name="star" size={12} color={colors.carrot500} />
                <Text style={styles.reviewRating}>{review.rating}</Text>
                <Text style={styles.reviewLikes}>좋아요 {review.likeCount}</Text>
              </View>
              <Text style={styles.reviewContent} numberOfLines={3}>
                {review.content}
              </Text>
            </View>
          ))}
        </>
      )}
    </>
  );
}
