import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import type { StoreDetail } from '@/types/store';

import { styles } from './styles';

interface StorePreviewRowProps {
  store: StoreDetail;
}

export function StorePreviewRow({ store }: StorePreviewRowProps) {
  return (
    <View style={styles.previewRow}>
      {store.images[0] ? (
        <Image source={{ uri: store.images[0].url }} style={styles.storeThumbnail} />
      ) : (
        <View style={styles.storeThumbnail} />
      )}
      <View style={styles.storeInfoBox}>
        <Text style={styles.storeCategory}>{store.category}</Text>
        <Text style={styles.storeInfoName} numberOfLines={1}>
          {store.name}
        </Text>
        <Text style={styles.storeAddress} numberOfLines={1}>
          {store.address}
        </Text>
      </View>
    </View>
  );
}
