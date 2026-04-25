import { CARROT_ORANGE } from "@/lib/constants";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import { getCategoryIconKey } from "@/lib/map-utils";
import { type StoreMarker } from "@/types/store";

export function createStoreMarkerElement(
  store: StoreMarker,
  onClickMarker: () => void,
): HTMLElement {
  const container = document.createElement("div");
  container.style.cssText = `
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    transform: translateY(-3px);
    pointer-events: none;
  `;

  const iconKey = getCategoryIconKey(store.category);

  const pin = document.createElement("div");
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
  pin.addEventListener("click", onClickMarker);

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
    font-size: 12px; line-height: 1.5; color: #212124;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  `;
  bubble.textContent = store.latestNews ?? "";

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
  wrapper.addEventListener("click", onClickBubble);
  return wrapper;
}
