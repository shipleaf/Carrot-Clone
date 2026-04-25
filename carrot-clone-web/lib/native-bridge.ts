export function sendToNative(data: Record<string, unknown>) {
  window.ReactNativeWebView?.postMessage(JSON.stringify(data));
}
