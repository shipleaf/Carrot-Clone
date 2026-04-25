import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  Platform,
  Pressable,
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
const SQUARE_HALF = 160; // 320x320px center detection square

type Snap = 0 | 1 | 2;

interface StoreDetail {
  id: number;
  name: string;
  category: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  instagramUrl: string | null;
  description: string | null;
  ownerName: string;
  ownerProfileImageUrl: string | null;
  latestNews: string | null;
  images: { id: number; url: string; order: number }[];
  hours: {
    id: number;
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }[];
  menuItems: {
    id: number;
    name: string;
    price: number;
    description: string | null;
  }[];
  reviews: {
    id: number;
    userId: string;
    rating: number;
    content: string;
    likeCount: number;
    userProfileImageUrl: string | null;
  }[];
}

interface NewsOverlayStore {
  id: number;
  name: string;
  ownerName: string;
  ownerProfileImageUrl: string | null;
  latestNews: string;
}

// ── Skeleton UI ───────────────────────────────────────────────────────────────

type ShimmerValue = Animated.AnimatedInterpolation<number>;

function ShimmerStrip({ shimmer }: { shimmer: ShimmerValue }) {
  return (
    <Animated.View
      style={[skStyles.shimmerOverlay, { transform: [{ translateX: shimmer }] }]}
    />
  );
}

function StoreSkeleton({ opacity, shimmer }: { opacity: Animated.Value; shimmer: ShimmerValue }) {
  return (
    <View style={skStyles.row}>
      <Animated.View style={[skStyles.thumb, { opacity, overflow: 'hidden' }]}>
        <ShimmerStrip shimmer={shimmer} />
      </Animated.View>
      <View style={skStyles.lines}>
        <Animated.View style={[skStyles.line, { width: '35%', opacity, overflow: 'hidden' }]}>
          <ShimmerStrip shimmer={shimmer} />
        </Animated.View>
        <Animated.View style={[skStyles.line, { width: '75%', marginTop: 7, opacity, overflow: 'hidden' }]}>
          <ShimmerStrip shimmer={shimmer} />
        </Animated.View>
        <Animated.View style={[skStyles.line, { width: '50%', marginTop: 7, opacity, overflow: 'hidden' }]}>
          <ShimmerStrip shimmer={shimmer} />
        </Animated.View>
      </View>
    </View>
  );
}

function TitleSkeleton({ opacity, shimmer }: { opacity: Animated.Value; shimmer: ShimmerValue }) {
  return (
    <Animated.View style={[skStyles.titleLine, { opacity, overflow: 'hidden' }]}>
      <ShimmerStrip shimmer={shimmer} />
    </Animated.View>
  );
}

const skStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 14, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  thumb: { width: 80, height: 80, borderRadius: 10, backgroundColor: '#E8EAED' },
  lines: { flex: 1, justifyContent: 'center' },
  line: { height: 13, borderRadius: 6, backgroundColor: '#E8EAED' },
  titleLine: { height: 16, borderRadius: 6, backgroundColor: '#E8EAED', width: '45%', alignSelf: 'flex-start', marginLeft: 20 },
  shimmerOverlay: { position: 'absolute', top: 0, bottom: 0, width: 100, backgroundColor: 'rgba(255,255,255,0.55)' },
});

// ── Component ─────────────────────────────────────────────────────────────────

export function MapHomeScreen() {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const webviewRef = useRef<WebView>(null);
  const webviewReadyRef = useRef(false);

  const [focusedStore, setFocusedStore] = useState<StoreDetail | null>(null);
  const [isLoadingStore, setIsLoadingStore] = useState(false);
  const [newsOverlayStore, setNewsOverlayStore] = useState<NewsOverlayStore | null>(null);
  const [showNewsOverlay, setShowNewsOverlay] = useState(false);
  const showNewsOverlayRef = useRef(false);
  const loadedStoreIdRef = useRef<number | null>(null);
  const requestedStoreIdRef = useRef<number | null>(null);
  const storeRequestSeqRef = useRef(0);

  // Skeleton pulse animation
  const skeletonOpacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(skeletonOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(skeletonOpacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [skeletonOpacity]);

  const shimmerAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    );
    anim.start();
    return () => anim.stop();
  }, [shimmerAnim]);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 400],
  });

  // Stable refs for PanResponder closures
  const heightRef = useRef(height);
  heightRef.current = height;
  const widthRef = useRef(width);
  widthRef.current = width;
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

  const injectCenterPoint = (s: Snap) => {
    if (!webviewReadyRef.current) return;
    const h = heightRef.current;
    const insetsBottom = insetsBottomRef.current;
    const w = widthRef.current;

    // WebView shifts up by 50px at snap 1 — visible content starts at y=50 in WebView coords
    const webviewOffset = s === 1 ? 50 : 0;
    const visibleScreenBottom =
      s === 0 ? h - PEEK - insetsBottom :
      s === 1 ? h * 0.7 :
      h;
    const centerY = webviewOffset + visibleScreenBottom / 2;
    const centerX = w / 2;

    webviewRef.current?.injectJavaScript(`
      window.dispatchEvent(new CustomEvent('centerPointChanged', {
        detail: { x: ${centerX}, y: ${centerY}, squareHalfSize: ${SQUARE_HALF} }
      }));
      true;
    `);
  };

  const animateTo = (s: Snap) => {
    // Auto-dismiss news overlay when bottom sheet opens
    if (s >= 1) {
      showNewsOverlayRef.current = false;
      setShowNewsOverlay(false);
    }
    injectCenterPoint(s);
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

  const hideNewsOverlay = () => {
    showNewsOverlayRef.current = false;
    setShowNewsOverlay(false);
  };

  const fetchStore = (storeId: number) => {
    if (requestedStoreIdRef.current === storeId) return;
    if (loadedStoreIdRef.current === storeId) {
      return;
    }

    const requestSeq = storeRequestSeqRef.current + 1;
    storeRequestSeqRef.current = requestSeq;
    requestedStoreIdRef.current = storeId;
    loadedStoreIdRef.current = null;

    setFocusedStore(null);
    hideNewsOverlay();
    setIsLoadingStore(true);
    fetch(`${mapUrl}/api/stores/${storeId}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((detail: StoreDetail) => {
        if (requestSeq !== storeRequestSeqRef.current) return;
        console.log('[native] fetchStore success:', storeId, detail.name);
        requestedStoreIdRef.current = null;
        loadedStoreIdRef.current = detail.id;
        setFocusedStore(detail);
        setIsLoadingStore(false);
      })
      .catch((e) => {
        if (requestSeq !== storeRequestSeqRef.current) return;
        console.log('[native] fetchStore FAIL:', storeId, e);
        requestedStoreIdRef.current = null;
        setIsLoadingStore(false);
      });
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
          // Tap on bottom sheet while news overlay is visible → close overlay + open sheet
          if (showNewsOverlayRef.current) {
            showNewsOverlayRef.current = false;
            setShowNewsOverlay(false);
            animateTo(1);
            return;
          }
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

  const webViewShift = translateY.interpolate({
    inputRange: [0, height * 0.7, height - PEEK - insets.bottom],
    outputRange: [0, -50, 0],
    extrapolate: 'clamp',
  });

  const handleWebMessage = (data: string) => {
    try {
      const msg = JSON.parse(data);
      switch (msg.type) {
        case 'storeFocused':
          if (msg.storeId) {
            fetchStore(msg.storeId);
          } else {
            storeRequestSeqRef.current += 1;
            requestedStoreIdRef.current = null;
            loadedStoreIdRef.current = null;
        
            setFocusedStore(null);
            setIsLoadingStore(false);
            hideNewsOverlay();
          }
          break;
        case 'storeClicked':
          animateTo(1);
          if (msg.storeId) fetchStore(msg.storeId);
          break;
        case 'newsBubbleClicked': {
          const store = msg.store as NewsOverlayStore;
          setNewsOverlayStore(store);
          showNewsOverlayRef.current = true;
          setShowNewsOverlay(true);
          animateTo(0);
          break;
        }
        default:
          if (['log', 'err', 'warn'].includes(msg.type)) {
            console.log(`[WV:${msg.type}]`, msg.msg);
          }
      }
    } catch {
      console.log('[WV]', data);
    }
  };

  const todayHours = (store: StoreDetail) => {
    const today = store.hours.find((h) => h.dayOfWeek === new Date().getDay());
    if (!today) return '영업시간 정보 없음';
    if (today.isClosed) return '오늘 휴무';
    return `오늘 ${today.openTime} - ${today.closeTime}`;
  };

  return (
    <View style={styles.screen}>
      {/* Map WebView */}
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
            injectCenterPoint(snapRef.current);
          }}
          onError={(e) => console.log('[WV] ERROR', JSON.stringify(e.nativeEvent))}
          onHttpError={(e) =>
            console.log('[WV] HTTP ERROR', e.nativeEvent.statusCode, e.nativeEvent.url)
          }
          onMessage={(e) => handleWebMessage(e.nativeEvent.data)}
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

      {/* News overlay card — floats above the minimized bottom sheet */}
      {showNewsOverlay && newsOverlayStore && (
        <View style={[styles.newsOverlay, { bottom: PEEK + insets.bottom + 8 }]}>
          {newsOverlayStore.ownerProfileImageUrl ? (
            <Image
              source={{ uri: newsOverlayStore.ownerProfileImageUrl }}
              style={styles.ownerAvatar}
            />
          ) : (
            <View style={[styles.ownerAvatar, styles.ownerAvatarFallback]}>
              <Ionicons name="person" size={20} color="#6B7684" />
            </View>
          )}
          <View style={styles.newsTextBlock}>
            <Text style={styles.newsOwnerName} numberOfLines={1}>
              {newsOverlayStore.ownerName}
            </Text>
            <Text style={styles.newsStoreName} numberOfLines={1}>
              {newsOverlayStore.name}
            </Text>
            <Text style={styles.newsBody} numberOfLines={4}>
              {newsOverlayStore.latestNews}
            </Text>
          </View>
          <Pressable
            onPress={() => setShowNewsOverlay(false)}
            style={styles.newsCloseBtn}
            hitSlop={8}>
            <Ionicons name="close" size={18} color="#6B7684" />
          </Pressable>
        </View>
      )}

      {/* Bottom Sheet */}
      <Animated.View style={[styles.sheet, { height, transform: [{ translateY }] }]}>
        {/* Grabber + store name */}
        <View style={styles.grabberArea} {...panResponder.panHandlers}>
          <View style={styles.grabber} />
          {focusedStore && !isLoadingStore ? (
            <Text style={styles.storeName} numberOfLines={1}>
              {focusedStore.name}
            </Text>
          ) : (
            <TitleSkeleton opacity={skeletonOpacity} shimmer={shimmerTranslate} />
          )}
        </View>

        {/* Preview row */}
        {focusedStore && !isLoadingStore ? (
          <View style={styles.previewRow}>
            {focusedStore.images[0] ? (
              <Image
                source={{ uri: focusedStore.images[0].url }}
                style={styles.storeThumbnail}
              />
            ) : (
              <View style={[styles.storeThumbnail, { backgroundColor: '#F2F3F6' }]} />
            )}
            <View style={styles.storeInfoBox}>
              <Text style={styles.storeCategory}>{focusedStore.category}</Text>
              <Text style={styles.storeInfoName} numberOfLines={1}>
                {focusedStore.name}
              </Text>
              <Text style={styles.storeAddress} numberOfLines={1}>
                {focusedStore.address}
              </Text>
            </View>
          </View>
        ) : (
          <StoreSkeleton opacity={skeletonOpacity} shimmer={shimmerTranslate} />
        )}

        {/* Full detail content */}
        <ScrollView
          style={styles.fullContent}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          scrollEnabled={snap === 2}
          showsVerticalScrollIndicator={false}>
          {focusedStore && !isLoadingStore && (
            <>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={18} color="#6B7684" />
                <Text style={styles.detailText}>{focusedStore.address}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Ionicons name="call-outline" size={18} color="#6B7684" />
                <Text style={styles.detailText}>{focusedStore.phone}</Text>
              </View>
              {focusedStore.hours.length > 0 && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={18} color="#6B7684" />
                    <Text style={styles.detailText}>{todayHours(focusedStore)}</Text>
                  </View>
                </>
              )}
              {focusedStore.menuItems.length > 0 && (
                <>
                  <View style={styles.divider} />
                  <Text style={styles.sectionTitle}>메뉴</Text>
                  {focusedStore.menuItems.map((item) => (
                    <View key={item.id} style={styles.menuRow}>
                      <Text style={styles.menuName}>{item.name}</Text>
                      <Text style={styles.menuPrice}>{item.price.toLocaleString()}원</Text>
                    </View>
                  ))}
                </>
              )}
              {focusedStore.reviews.length > 0 && (
                <>
                  <View style={styles.divider} />
                  <Text style={styles.sectionTitle}>리뷰</Text>
                  {focusedStore.reviews.map((review) => (
                    <View key={review.id} style={styles.reviewRow}>
                      <View style={styles.reviewMeta}>
                        <Ionicons name="star" size={12} color="#FF6F0F" />
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
          )}
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

  // News overlay card
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#191F28',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  ownerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F3F6',
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
    color: '#6B7684',
    fontWeight: '500',
  },
  newsStoreName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#191F28',
  },
  newsBody: {
    fontSize: 13,
    color: '#333D4B',
    lineHeight: 19,
    marginTop: 4,
  },
  newsCloseBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
  storeAddress: {
    fontSize: 12,
    color: '#6B7684',
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#191F28',
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
    color: '#333D4B',
  },
  menuPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191F28',
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
    color: '#333D4B',
  },
  reviewLikes: {
    fontSize: 12,
    color: '#6B7684',
    marginLeft: 6,
  },
  reviewContent: {
    fontSize: 13,
    color: '#333D4B',
    lineHeight: 19,
  },
});
