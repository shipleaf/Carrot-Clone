import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import type { NewsOverlayStore } from '@/types/store';

import { colors, styles } from './styles';

interface NewsOverlayCardProps {
  bottom: number;
  store: NewsOverlayStore;
  onClose: () => void;
}

export function NewsOverlayCard({ bottom, store, onClose }: NewsOverlayCardProps) {
  const likeCount = store.latestNewsLikeCount ?? 0;
  const viewCount = store.latestNewsViewCount ?? 0;

  return (
    <View style={[styles.newsOverlay, { bottom }]}>
      {store.ownerProfileImageUrl ? (
        <Image source={{ uri: store.ownerProfileImageUrl }} style={styles.ownerAvatar} />
      ) : (
        <View style={[styles.ownerAvatar, styles.ownerAvatarFallback]}>
          <Ionicons name="person" size={20} color={colors.gray600} />
        </View>
      )}
      <View style={styles.newsTextBlock}>
        <Text style={styles.newsOwnerName} numberOfLines={1}>
          {store.ownerName}
        </Text>
        <Text style={styles.newsStoreName} numberOfLines={1}>
          {store.name}
        </Text>
        <Text style={styles.newsBody} numberOfLines={4}>
          {store.latestNews}
        </Text>
        <View style={styles.newsOverlayMeta}>
          <Ionicons name="heart-outline" size={13} color={colors.gray600} />
          <Text style={styles.newsOverlayMetaText}>{likeCount}</Text>
          <Ionicons name="eye-outline" size={13} color={colors.gray600} />
          <Text style={styles.newsOverlayMetaText}>{viewCount}</Text>
        </View>
      </View>
      <Pressable onPress={onClose} style={styles.newsCloseBtn} hitSlop={8}>
        <Ionicons name="close" size={18} color={colors.gray600} />
      </Pressable>
    </View>
  );
}
