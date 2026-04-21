import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

const mapUrl =
  process.env.EXPO_PUBLIC_MAP_WEB_URL ??
  Platform.select({
    android: 'http://10.0.2.2:3000',
    default: 'http://localhost:3000',
  });

const GRABBER_AREA = 28;
const NAME_ROW = 52;
const PEEK = GRABBER_AREA + NAME_ROW;

type Snap = 0 | 1 | 2;

const MOCK_STORE = {
  name: '스타벅스 강남역점',
  category: '카페',
  distance: '350m',
  rating: 4.5,
  reviewCount: 128,
  address: '서울 강남구 강남대로 396',
  hours: '매일 07:00 - 22:00',
};

export function MapHomeScreen() {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const webviewRef = useRef<WebView>(null);
  const webviewReadyRef = useRef(false);

  const FIXED_LOCATION = { lat: 35.1897739, lng: 126.8113884 };

  const injectLocation = () => {
    const { lat, lng } = FIXED_LOCATION;
    webviewRef.current?.injectJavaScript(`
      (function() {
        var loc = { lat: ${lat}, lng: ${lng} };
        window.__nativeLocation = loc;
        window.dispatchEvent(new CustomEvent('nativeLocation', { detail: loc }));
      })();
      true;
    `);
  };


  // Keep latest values accessible inside PanResponder callbacks
  const heightRef = useRef(height);
  heightRef.current = height;
  const insetsBottomRef = useRef(insets.bottom);
  insetsBottomRef.current = insets.bottom;

  const snapToY = (s: Snap): number => {
    if (s === 0) return heightRef.current - PEEK - insetsBottomRef.current;
    if (s === 1) return heightRef.current * 0.7;
    return 0;
  };

  const snapRef = useRef<Snap>(0);
  const baseY = useRef(snapToY(0));
  const translateY = useRef(new Animated.Value(snapToY(0))).current;
  const [snap, setSnap] = useState<Snap>(0);

  const animateTo = (s: Snap) => {
    const y = snapToY(s);
    snapRef.current = s;
    baseY.current = y;
    setSnap(s);
    Animated.spring(translateY, {
      toValue: y,
      useNativeDriver: true,
      damping: 28,
      stiffness: 320,
      mass: 0.8,
    }).start();
  };

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
        const maxY = heightRef.current - PEEK - insetsBottomRef.current;
        const clamped = Math.max(minY - baseY.current, Math.min(maxY - baseY.current, dy));
        translateY.setValue(clamped);
      },
      onPanResponderRelease: (_, { dx, dy, vy }) => {
        translateY.flattenOffset();

        const isTap = Math.sqrt(dx * dx + dy * dy) < 8;
        let target: Snap;

        if (isTap) {
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
    })
  ).current;

  // snap 1(partial)일 때 WebView가 살짝 위로 올라가는 효과
  // inputRange: 시트 translateY의 snap2→snap1→snap0 순서 (오름차순 필수)
  const webViewShift = translateY.interpolate({
    inputRange: [0, height * 0.7, height - PEEK - insets.bottom],
    outputRange: [0, -50, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.screen}>
      <Animated.View
        style={[StyleSheet.absoluteFill, { transform: [{ translateY: webViewShift }] }]}
        pointerEvents="box-none">
        <WebView
          ref={webviewRef}
          source={{ uri: mapUrl }}
          style={StyleSheet.absoluteFill}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          onLoadStart={() => console.log('[WV] loadStart', mapUrl)}
          onLoadEnd={() => {
            console.log('[WV] loadEnd');
            webviewReadyRef.current = true;
            injectLocation();
          }}
        onError={(e) => console.log('[WV] ERROR', JSON.stringify(e.nativeEvent))}
        onHttpError={(e) =>
          console.log('[WV] HTTP ERROR', e.nativeEvent.statusCode, e.nativeEvent.url)
        }
        onMessage={(e) => {
          try {
            const { type, msg } = JSON.parse(e.nativeEvent.data);
            console.log(`[WV:${type}]`, msg);
          } catch {
            console.log('[WV]', e.nativeEvent.data);
          }
        }}
        injectedJavaScript={`
          (function() {
            var orig = console.log, origErr = console.error, origWarn = console.warn;
            function send(type, args) {
              try { window.ReactNativeWebView.postMessage(JSON.stringify({type, msg: Array.from(args).map(String).join(' ')})); } catch(e) {}
            }
            console.log = function() { orig.apply(console, arguments); send('log', arguments); };
            console.error = function() { origErr.apply(console, arguments); send('err', arguments); };
            console.warn = function() { origWarn.apply(console, arguments); send('warn', arguments); };
            window.addEventListener('error', function(e) {
              send('err', ['[onerror] ' + e.message + ' ' + e.filename + ':' + e.lineno]);
            });
            send('log', ['[inject] ready, url=' + location.href + ' kakao=' + typeof window.kakao]);
          })();
          true;
        `}
      />
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View style={[styles.sheet, { height, transform: [{ translateY }] }]}>
        {/* Grabber + store name — pan handler lives here */}
        <View style={styles.grabberArea} {...panResponder.panHandlers}>
          <View style={styles.grabber} />
          <Text style={styles.storeName} numberOfLines={1}>
            {MOCK_STORE.name}
          </Text>
        </View>

        {/* Preview row: thumbnail + brief info (visible from snap 1) */}
        <View style={styles.previewRow}>
          <View style={styles.storeThumbnail} />
          <View style={styles.storeInfoBox}>
            <Text style={styles.storeCategory}>{MOCK_STORE.category}</Text>
            <Text style={styles.storeInfoName} numberOfLines={1}>
              {MOCK_STORE.name}
            </Text>
            <View style={styles.storeMeta}>
              <Ionicons name="star" size={12} color="#FF6F0F" />
              <Text style={styles.storeMetaText}>
                {MOCK_STORE.rating} ({MOCK_STORE.reviewCount})
              </Text>
              <Text style={styles.storeMetaSep}>·</Text>
              <Text style={styles.storeMetaText}>{MOCK_STORE.distance}</Text>
            </View>
          </View>
        </View>

        {/* Full detail content (visible from snap 2) */}
        <ScrollView
          style={styles.fullContent}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          scrollEnabled={snap === 2}
          showsVerticalScrollIndicator={false}>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={18} color="#6B7684" />
            <Text style={styles.detailText}>{MOCK_STORE.address}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={18} color="#6B7684" />
            <Text style={styles.detailText}>{MOCK_STORE.hours}</Text>
          </View>
          <View style={styles.divider} />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F3F6',
  },
  overlay: {
    flex: 1,
  },
  topControls: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 10,
  },
  searchBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E8EAED',
    shadowColor: '#191F28',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  searchText: {
    color: '#6B7684',
    fontSize: 16,
    fontWeight: '500',
  },
  categoryList: {
    gap: 8,
    paddingRight: 16,
  },
  categoryChip: {
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E8EAED',
    shadowColor: '#191F28',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  categoryChipActive: {
    backgroundColor: '#FF6F0F',
    borderColor: '#FF6F0F',
  },
  categoryText: {
    color: '#333D4B',
    fontSize: 14,
    fontWeight: '700',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },

  // Bottom Sheet
  sheet: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#191F28',
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
    backgroundColor: '#D1D6DB',
    marginBottom: 14,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#191F28',
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },

  // Preview row
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
    backgroundColor: '#F2F3F6',
  },
  storeInfoBox: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  storeCategory: {
    fontSize: 12,
    color: '#6B7684',
    fontWeight: '500',
  },
  storeInfoName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#191F28',
  },
  storeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  storeMetaText: {
    fontSize: 13,
    color: '#6B7684',
  },
  storeMetaSep: {
    fontSize: 13,
    color: '#D1D6DB',
  },

  // Full detail
  fullContent: {
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E8EAED',
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
    color: '#333D4B',
    lineHeight: 20,
  },
});
