import { CARROT_ORANGE } from "@/lib/constants";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import { getCategoryIconKey } from "@/lib/map-utils";
import { type StoreMarker } from "@/types/store";

const TRENDING_RECENT_THRESHOLD_MS = 60 * 60 * 1000; // 1시간

function ensureTrendingRecentStyle() {
  if (document.getElementById("trending-recent-style")) return;
  const style = document.createElement("style");
  style.id = "trending-recent-style";
  style.textContent = `
    @keyframes trendingGlow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(255,111,15,0), 0 8px 18px rgba(0,0,0,0.22); }
      50%       { box-shadow: 0 0 0 10px rgba(255,111,15,0.28), 0 8px 18px rgba(0,0,0,0.22); }
    }
    .trending-recent-pin {
      animation: trendingGlow 2s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
}

export function createStoreMarkerElement(
  store: StoreMarker,
  onClickMarker: () => void,
): HTMLElement {
  const hasInventory = store.inventoryCount !== undefined && store.inventoryCount !== null;
  const isSoldOut = hasInventory && store.inventoryCount === 0;
  const isRecentlyUpdated =
    hasInventory &&
    store.inventoryUpdatedAt !== null &&
    store.inventoryUpdatedAt !== undefined &&
    Date.now() - new Date(store.inventoryUpdatedAt).getTime() < TRENDING_RECENT_THRESHOLD_MS;

  if (isRecentlyUpdated) ensureTrendingRecentStyle();

  const container = document.createElement("div");
  container.style.cssText = `
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    transform: translateY(-3px);
    pointer-events: none;
    ${isSoldOut ? "opacity: 0.45;" : ""}
  `;

  const iconKey = getCategoryIconKey(store.category);

  const pin = document.createElement("div");
  pin.className = isRecentlyUpdated ? "trending-recent-pin" : "";
  pin.style.cssText = `
    width: 42px; height: 42px;
    display: grid; place-items: center;
    color: #fff; background: ${CARROT_ORANGE};
    border: 3px solid #fff;
    border-radius: 999px 999px 999px 4px;
    box-shadow: 0 8px 18px rgba(0,0,0,0.22);
    transform: rotate(-45deg);
    cursor: pointer;
    pointer-events: auto;
  `;
  pin.innerHTML = `
    <div style="width:22px;height:22px;transform:rotate(45deg)">
      <style>.smk svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2}</style>
      <span class="smk">${CATEGORY_ICONS[iconKey]}</span>
    </div>
  `;
  pin.addEventListener("click", (event) => {
    event.stopPropagation();
    onClickMarker();
  });

  const label = document.createElement("div");
  label.style.cssText = `
    max-width: 96px; padding: 3px 7px;
    overflow: hidden; color: #212124;
    background: rgba(255,255,255,0.94);
    border: 1px solid rgba(33,33,36,0.08);
    border-radius: 999px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.12);
    font-size: 11px; font-weight: 700; line-height: 1.2;
    text-overflow: ellipsis; white-space: nowrap;
    pointer-events: none;
  `;
  label.textContent = store.name;

  container.appendChild(pin);
  container.appendChild(label);

  if (hasInventory) {
    const badge = document.createElement("div");
    badge.style.cssText = `
      display: flex; align-items: center; gap: 3px;
      padding: 2px 7px;
      background: ${isSoldOut ? "#8B95A1" : "rgba(255,255,255,0.96)"};
      border: 1.5px solid ${isSoldOut ? "#8B95A1" : CARROT_ORANGE};
      border-radius: 999px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      font-size: 11px; font-weight: 700;
      color: ${isSoldOut ? "#fff" : "#212124"};
      white-space: nowrap;
      pointer-events: none;
    `;
    badge.innerHTML = isSoldOut
      ? `<span>품절</span>`
      : `<img src="/assets/dubai_cookie.png" style="width:13px;height:13px;object-fit:contain;" /><span>${store.inventoryCount}개</span>`;
    container.appendChild(badge);
  }

  return container;
}

export function createSmallBadgeElement(): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "position: relative; pointer-events: none;";

  const badge = document.createElement("div");
  badge.style.cssText = `
    padding: 3px 8px;
    background: ${CARROT_ORANGE};
    color: white;
    border-radius: 999px;
    font-size: 10px; font-weight: 700;
    white-space: nowrap;
    box-shadow: 0 2px 6px rgba(255,111,15,0.35);
  `;
  badge.textContent = "새 소식";

  const tail = document.createElement("div");
  tail.style.cssText = `
    position: absolute;
    bottom: -4px; left: 50%;
    transform: translateX(-50%);
    width: 0; height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid ${CARROT_ORANGE};
  `;

  wrapper.appendChild(badge);
  wrapper.appendChild(tail);
  return wrapper;
}

function ensureTreasureStyle() {
  if (document.getElementById("treasure-marker-style")) return;
  const style = document.createElement("style");
  style.id = "treasure-marker-style";
  style.textContent = `
    @keyframes treasureGlow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(255,200,57,0), 0 6px 16px rgba(0,0,0,0.22); }
      50%       { box-shadow: 0 0 0 10px rgba(255,200,57,0.28), 0 6px 16px rgba(0,0,0,0.22); }
    }
    @keyframes treasurePulseRing {
      0%   { transform: scale(1);   opacity: 0.55; }
      100% { transform: scale(2.2); opacity: 0; }
    }
    .treasure-pin {
      animation: treasureGlow 2s ease-in-out infinite;
    }
    .treasure-ring {
      animation: treasurePulseRing 2s ease-out infinite;
    }
  `;
  document.head.appendChild(style);
}

export function createTreasureMarkerElement(
  couponId: number,
  onClick: () => void,
): HTMLElement {
  ensureTreasureStyle();

  const container = document.createElement("div");
  container.style.cssText = `
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    pointer-events: none;
  `;

  // 펄스 링
  const ring = document.createElement("div");
  ring.className = "treasure-ring";
  ring.style.cssText = `
    position: absolute;
    top: 50%; left: 50%;
    width: 48px; height: 48px;
    margin: -24px 0 0 -24px;
    border-radius: 999px;
    background: rgba(255,200,57,0.35);
    pointer-events: none;
  `;

  const pin = document.createElement("div");
  pin.className = "treasure-pin";
  pin.style.cssText = `
    width: 48px; height: 48px;
    display: grid; place-items: center;
    background: #FFC839;
    border: 3px solid #fff;
    border-radius: 999px;
    cursor: pointer;
    pointer-events: auto;
    font-size: 24px;
    line-height: 1;
    position: relative;
    z-index: 1;
  `;
  pin.textContent = "🎁";
  pin.dataset.couponId = String(couponId);
  pin.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log("[treasure] clicked", couponId);
    onClick();
  });

  const label = document.createElement("div");
  label.style.cssText = `
    padding: 3px 8px;
    background: rgba(255,255,255,0.96);
    border: 1px solid rgba(255,200,57,0.5);
    border-radius: 999px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.12);
    font-size: 11px; font-weight: 700; color: #8F3206;
    white-space: nowrap;
    pointer-events: none;
  `;
  label.textContent = "쿠폰 발견!";

  container.appendChild(ring);
  container.appendChild(pin);
  container.appendChild(label);
  return container;
}

function formatTimeAgo(isoDate: string | null | undefined): string {
  if (!isoDate) return "";
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return "방금 전";
  if (diffMins < 60) return `${diffMins}분 전`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;
  return `${Math.floor(diffHours / 24)}일 전`;
}

function ensurePopInStyle() {
  if (document.getElementById("store-popup-style")) return;
  const style = document.createElement("style");
  style.id = "store-popup-style";
  style.textContent = `
    @keyframes popIn {
      from { transform: scale(0.7); opacity: 0; }
      to   { transform: scale(1);   opacity: 1; }
    }
    .store-pop-in {
      animation: popIn 250ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
      transform-origin: bottom center;
    }
  `;
  document.head.appendChild(style);
}

export function createFullBubbleElement(
  store: StoreMarker,
  onClickBubble: () => void,
): HTMLElement {
  ensurePopInStyle();
  const wrapper = document.createElement("div");
  wrapper.className = "store-pop-in";
  wrapper.style.cssText = "position: relative; cursor: pointer; pointer-events: auto;";

  const bubble = document.createElement("div");
  bubble.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 10px 14px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
    max-width: 200px;
  `;

  const header = document.createElement("div");
  header.style.cssText = `
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 5px;
  `;

  const label = document.createElement("span");
  label.style.cssText = "font-size: 11px; font-weight: 700; color: #FF6F0F;";
  label.textContent = "새소식";

  const timeAgo = document.createElement("span");
  timeAgo.style.cssText = "font-size: 11px; color: #6B7684;";
  timeAgo.textContent = formatTimeAgo(store.latestNewsCreatedAt);

  header.appendChild(label);
  header.appendChild(timeAgo);

  const content = document.createElement("div");
  content.style.cssText = `
    font-size: 12px; line-height: 1.5; color: #212124;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  `;
  content.textContent = store.latestNews ?? "";

  bubble.appendChild(header);
  bubble.appendChild(content);

  const tail = document.createElement("div");
  tail.style.cssText = `
    position: absolute;
    bottom: -6px; left: 50%;
    transform: translateX(-50%);
    width: 0; height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid white;
    filter: drop-shadow(0 2px 2px rgba(0,0,0,0.08));
  `;

  wrapper.appendChild(bubble);
  wrapper.appendChild(tail);
  wrapper.addEventListener("click", (event) => {
    event.stopPropagation();
    onClickBubble();
  });
  return wrapper;
}
