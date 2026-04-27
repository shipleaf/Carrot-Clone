import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const adapter = new PrismaBetterSqlite3({ url: path.resolve(process.cwd(), "dev.db") });
const prisma = new PrismaClient({ adapter });

function weeklyHours(openTime: string, closeTime: string) {
  return Array.from({ length: 7 }, (_, dayOfWeek) => ({
    dayOfWeek,
    openTime,
    closeTime,
    isClosed: false,
  }));
}

async function main() {
  await prisma.userCoupon.deleteMany();
  await prisma.treasureSpot.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.storeInventory.deleteMany();
  await prisma.trendingItem.deleteMany();
  await prisma.reviewImage.deleteMany();
  await prisma.review.deleteMany();
  await prisma.storeNews.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.storeHours.deleteMany();
  await prisma.storeImage.deleteMany();
  await prisma.store.deleteMany();

  const stores = [
    {
      name: "블루보틀 장덕점",
      category: "카페",
      lat: 35.1903,
      lng: 126.8108,
      address: "광주 광산구 산덕로 45",
      phone: "02-1234-5001",
      instagramUrl: "https://d2phebdq64jyfk.cloudfront.net/media/article/dc0a4f9d2c4745f9bef24b8f83546d88.jpg",
      description: "직접 로스팅한 원두로 내리는 핸드드립과 라떼가 인기인 동네 카페입니다.",
      ownerName: "김민지",
      ownerProfileImageUrl: "https://d2phebdq64jyfk.cloudfront.net/media/article/dc0a4f9d2c4745f9bef24b8f83546d88.jpg",
      followerCount: 128,
      images: [
        { url: "https://image.chosun.com/sitedata/image/202505/26/2025052602412_0.jpg", order: 1 },
        { url: "https://kr.bluebottlecoffee.com/cdn/shop/files/Blog_MO_250408_Marimekko.jpg?v=1744607721&width=420", order: 2 },
      ],
      hours: weeklyHours("08:00", "21:00"),
      menuItems: [
        { name: "시그니처 라떼", price: 7500, description: "고소한 원두와 부드러운 우유" },
        { name: "카페 라떼", price: 6500 },
        { name: "콜드브루", price: 7000 },
      ],
      news: [
        {
          content: "오늘 시즌 시그니처 라떼가 새로 나왔어요. 고소한 원두와 부드러운 우유 조합을 만나보세요.",
          likeCount: 18,
          viewCount: 243,
        },
        {
          content: "오후 2시부터 핸드드립 원두 시음 이벤트를 진행합니다.",
          likeCount: 11,
          viewCount: 176,
        },
      ],
    },
    {
      name: "온더테이블",
      category: "양식",
      lat: 35.1882,
      lng: 126.8127,
      address: "광주 광산구 산덕로 112",
      phone: "02-1234-5002",
      instagramUrl: "https://instagram.com/onthetable_kr",
      description: "제철 재료로 만드는 든든한 양식 브런치와 파스타를 준비합니다.",
      ownerName: "이서연",
      ownerProfileImageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
      followerCount: 84,
      images: [
        { url: "https://picsum.photos/seed/store2a/480/720", order: 1 },
        { url: "https://picsum.photos/seed/store2b/480/720", order: 2 },
        { url: "https://picsum.photos/seed/store2c/480/720", order: 3 },
      ],
      hours: weeklyHours("11:00", "22:00"),
      menuItems: [
        { name: "새우 불고기 정식", price: 18000 },
        { name: "제철 샐러드 비빔밥", price: 13000 },
        { name: "크림 파스타", price: 15000 },
      ],
      news: [
        {
          content: "이번 주 점심 특선 메뉴를 시작했어요. 평일 11시부터 13시까지 할인 이벤트 진행 중입니다.",
          likeCount: 24,
          viewCount: 319,
        },
      ],
    },
    {
      name: "카페 아틀리에",
      category: "카페",
      lat: 35.1915,
      lng: 126.8096,
      address: "광주 광산구 산덕길 1234",
      phone: "02-1234-5003",
      instagramUrl: null,
      description: "프렌치 감성의 작은 디저트 카페입니다.",
      ownerName: "박준호",
      ownerProfileImageUrl: "https://randomuser.me/api/portraits/men/3.jpg",
      followerCount: 56,
      images: [{ url: "https://picsum.photos/seed/store3a/480/720", order: 1 }],
      hours: weeklyHours("10:00", "21:00"),
      menuItems: [
        { name: "레몬 타르트", price: 4500 },
        { name: "아메리카노", price: 5000 },
        { name: "마카롱 세트", price: 8000 },
      ],
      news: [],
    },
    {
      name: "스시 료코",
      category: "일식",
      lat: 35.1874,
      lng: 126.8102,
      address: "광주 광산구 산덕로 78",
      phone: "02-1234-5004",
      instagramUrl: "https://instagram.com/sushi_ryoko",
      description: "신선한 생선으로 만드는 동네 스시와 사시미를 제공합니다.",
      ownerName: "최유나",
      ownerProfileImageUrl: "https://randomuser.me/api/portraits/women/4.jpg",
      followerCount: 143,
      images: [
        { url: "https://picsum.photos/seed/store4a/480/720", order: 1 },
        { url: "https://picsum.photos/seed/store4b/480/720", order: 2 },
      ],
      hours: weeklyHours("12:00", "22:00"),
      menuItems: [
        { name: "오마카세 런치", price: 65000 },
        { name: "연어 니기리", price: 12000 },
        { name: "우니 군함", price: 15000 },
      ],
      news: [
        {
          content: "이번 주 오마카세 재료가 입고됐습니다. 예약은 인스타그램 DM으로 문의해주세요.",
          likeCount: 32,
          viewCount: 421,
        },
        {
          content: "저녁 타임에 한정 사시미 플래터를 준비했습니다.",
          likeCount: 16,
          viewCount: 205,
        },
      ],
    },
    {
      name: "로스터리 문",
      category: "카페",
      lat: 35.1921,
      lng: 126.8131,
      address: "광주 광산구 산덕길 567",
      phone: "02-1234-5005",
      instagramUrl: null,
      description: "소규모 로스팅 공방을 겸한 스페셜티 커피 바입니다.",
      ownerName: "정도윤",
      ownerProfileImageUrl: "https://randomuser.me/api/portraits/men/5.jpg",
      followerCount: 91,
      images: [
        { url: "https://picsum.photos/seed/store5a/480/720", order: 1 },
        { url: "https://picsum.photos/seed/store5b/480/720", order: 2 },
      ],
      hours: weeklyHours("09:00", "20:00"),
      menuItems: [
        { name: "에스프레소", price: 4000 },
        { name: "플랫화이트", price: 6000 },
        { name: "원두 100g", price: 15000, description: "월별 싱글 오리진" },
      ],
      news: [],
    },
  ];

  for (const [storeIndex, store] of stores.entries()) {
    const { images, hours, menuItems, news, ...storeData } = store;
    const created = await prisma.store.create({
      data: {
        ...storeData,
        images: { create: images },
        hours: { create: hours },
        menuItems: { create: menuItems },
        news: {
          create: news.map((newsItem, newsIndex) => ({
            ...newsItem,
            createdAt: new Date(Date.now() - newsIndex * 24 * 60 * 60 * 1000),
          })),
        },
      },
    });

    await prisma.review.createMany({
      data: [
        {
          storeId: created.id,
          userId: "user_alice",
          userProfileImageUrl: "https://randomuser.me/api/portraits/women/10.jpg",
          rating: 5,
          content: "정말 맛있고 분위기도 좋아요. 다음에도 또 갈게요.",
          likeCount: 12 + storeIndex,
        },
        {
          storeId: created.id,
          userId: "user_bob",
          userProfileImageUrl: "https://randomuser.me/api/portraits/men/20.jpg",
          rating: storeIndex % 2 === 0 ? 4 : 5,
          content: "가성비가 좋고 직원분들이 친절했습니다.",
          likeCount: 5 + storeIndex,
        },
      ],
    });
  }

  const bluebottle = await prisma.store.findFirst({ where: { name: "블루보틀 장덕점" } });
  if (bluebottle) {
    const coupon = await prisma.coupon.create({
      data: {
        storeId: bluebottle.id,
        title: "아메리카노 1잔 무료 증정",
        description: "블루보틀 장덕점 방문 후 사용할 수 있는 1회 쿠폰입니다.",
        expiresAt: new Date("2026-05-31T23:59:59Z"),
      },
    });

    await prisma.treasureSpot.create({
      data: {
        lat: 35.18977523571425,
        lng: 126.81170817158458,
        couponId: coupon.id,
      },
    });
  }

  const dubaiCookie = await prisma.trendingItem.create({
    data: {
      slug: "dubai_cookie",
      name: "두바이 초콜릿 쿠키",
      emoji: "🍪",
      description: "두바이 감성 피스타치오 초콜릿 쿠키",
      isActive: true,
    },
  });

  const inventorySeed = [
    { name: "블루보틀 장덕점", quantity: 8, note: "오늘 입고분 있어요" },
    { name: "카페 아틀리에", quantity: 3, note: "마감 임박" },
    { name: "로스터리 문", quantity: 0, note: "내일 오전 재입고 예정" },
  ];

  for (const item of inventorySeed) {
    const store = await prisma.store.findFirst({ where: { name: item.name } });
    if (!store) continue;

    await prisma.storeInventory.create({
      data: {
        storeId: store.id,
        trendingItemId: dubaiCookie.id,
        quantity: item.quantity,
        note: item.note,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
