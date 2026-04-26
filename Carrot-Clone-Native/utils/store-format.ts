import type { StoreDetail } from '@/types/store';

export function formatTodayHours(store: StoreDetail) {
  const today = store.hours.find((hours) => hours.dayOfWeek === new Date().getDay());

  if (!today) return '영업시간 정보 없음';
  if (today.isClosed) return '오늘 휴무';

  return `오늘 ${today.openTime} - ${today.closeTime}`;
}

export function formatWon(price: number) {
  return `${price.toLocaleString()}원`;
}
