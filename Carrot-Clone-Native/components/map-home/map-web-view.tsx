import { RefObject } from 'react';
import { Animated, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

import { mapUrl } from '@/constants/map-home';

interface MapWebViewProps {
  onLoadEnd: () => void;
  onMessageData: (data: string) => void;
  shiftY: Animated.AnimatedInterpolation<number>;
  webviewRef: RefObject<WebView | null>;
}

const injectedConsoleBridge = `
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
`;

export function MapWebView({ onLoadEnd, onMessageData, shiftY, webviewRef }: MapWebViewProps) {
  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, { transform: [{ translateY: shiftY }] }]}
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
        onLoadEnd={onLoadEnd}
        onError={(e) => console.log('[WV] ERROR', JSON.stringify(e.nativeEvent))}
        onHttpError={(e) =>
          console.log('[WV] HTTP ERROR', e.nativeEvent.statusCode, e.nativeEvent.url)
        }
        onMessage={(e) => onMessageData(e.nativeEvent.data)}
        injectedJavaScript={injectedConsoleBridge}
      />
    </Animated.View>
  );
}
