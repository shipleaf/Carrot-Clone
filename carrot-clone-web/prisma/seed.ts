import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const adapter = new PrismaBetterSqlite3({ url: path.resolve(process.cwd(), "dev.db") });
const prisma = new PrismaClient({ adapter });

async function main() {
  // 광주광역시 광산구 장덕동 근처 매장 데이터 (기본 지도 중심: 35.1897739, 126.8113884)
  const stores = [
    {
      name: "블루보틀 장덕점",
      category: "카페",
      lat: 35.1903,
      lng: 126.8108,
      address: "광주 광산구 장덕로 45",
      phone: "02-1234-5001",
      instagramUrl: "https://instagram.com/bluebottle_korea",
      description: "스페셜티 커피 전문점. 직접 로스팅한 원두로 내리는 핸드드립이 유명합니다.",
      ownerName: "김민준",
      ownerProfileImageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
      images: [
        { url: "https://picsum.photos/seed/store1a/600/400", order: 1 },
        { url: "https://picsum.photos/seed/store1b/600/400", order: 2 },
      ],
      hours: [
        { dayOfWeek: 0, openTime: "10:00", closeTime: "20:00", isClosed: false },
        { dayOfWeek: 1, openTime: "08:00", closeTime: "21:00", isClosed: false },
        { dayOfWeek: 2, openTime: "08:00", closeTime: "21:00", isClosed: false },
        { dayOfWeek: 3, openTime: "08:00", closeTime: "21:00", isClosed: false },
        { dayOfWeek: 4, openTime: "08:00", closeTime: "21:00", isClosed: false },
        { dayOfWeek: 5, openTime: "08:00", closeTime: "22:00", isClosed: false },
        { dayOfWeek: 6, openTime: "10:00", closeTime: "20:00", isClosed: false },
      ],
      menuItems: [
        { name: "싱글 오리진 드립", price: 7500, description: "당일 선택 원두" },
        { name: "카페 라떼", price: 6500 },
        { name: "콜드브루", price: 7000 },
      ],
    },
    {
      name: "온더테이블",
      category: "음식점",
      lat: 35.1882,
      lng: 126.8127,
      address: "광주 광산구 장덕로 112",
      phone: "02-1234-5002",
      instagramUrl: "https://instagram.com/onthetable_kr",
      description: "제철 재료로 만드는 정갈한 한식 브런치 레스토랑.",
      ownerName: "이서연",
      ownerProfileImageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
      images: [
        { url: "https://picsum.photos/seed/store2a/600/400", order: 1 },
        { url: "https://picsum.photos/seed/store2b/600/400", order: 2 },
        { url: "https://picsum.photos/seed/store2c/600/400", order: 3 },
      ],
      hours: [
        { dayOfWeek: 0, openTime: "11:00", closeTime: "21:00", isClosed: false },
        { dayOfWeek: 1, openTime: "11:00", closeTime: "22:00", isClosed: false },
        { dayOfWeek: 2, openTime: "11:00", closeTime: "22:00", isClosed: false },
        { dayOfWeek: 3, openTime: "11:00", closeTime: "22:00", isClosed: false },
        { dayOfWeek: 4, openTime: "11:00", closeTime: "22:00", isClosed: false },
        { dayOfWeek: 5, openTime: "11:00", closeTime: "23:00", isClosed: false },
        { dayOfWeek: 6, openTime: "11:00", closeTime: "21:00", isClosed: false },
      ],
      menuItems: [
        { name: "한우 불고기 정식", price: 18000 },
        { name: "제철 나물 비빔밥", price: 13000 },
        { name: "들깨 순두부찌개", price: 11000 },
      ],
    },
    {
      name: "카페 드 파리",
      category: "카페",
      lat: 35.1915,
      lng: 126.8096,
      address: "광주 광산구 장덕동 1234",
      phone: "02-1234-5003",
      description: "프렌치 감성의 아늑한 디저트 카페.",
      ownerName: "박지훈",
      ownerProfileImageUrl: "https://randomuser.me/api/portraits/men/3.jpg",
      images: [
        { url: "https://picsum.photos/seed/store3a/600/400", order: 1 },
      ],
      hours: [
        { dayOfWeek: 0, openTime: "11:00", closeTime: "20:00", isClosed: false },
        { dayOfWeek: 1, openTime: "10:00", closeTime: "21:00", isClosed: false },
        { dayOfWeek: 2, openTime: "10:00", closeTime: "21:00", isClosed: false },
        { dayOfWeek: 3, openTime: "10:00", closeTime: "21:00", isClosed: false },
        { dayOfWeek: 4, openTime: "10:00", closeTime: "21:00", isClosed: false },
        { dayOfWeek: 5, openTime: "10:00", closeTime: "22:00", isClosed: false },
        { dayOfWeek: 6, isClosed: true, openTime: "00:00", closeTime: "00:00" },
      ],
      menuItems: [
        { name: "크루아상", price: 4500 },
        { name: "아메리카노", price: 5000 },
        { name: "마카롱 세트 (3개)", price: 8000 },
      ],
    },
    {
      name: "스시 료코",
      category: "음식점",
      lat: 35.1874,
      lng: 126.8102,
      address: "광주 광산구 장덕로 78",
      phone: "02-1234-5004",
      instagramUrl: "https://instagram.com/sushi_ryoko",
      description: "도쿄 직수입 생선으로 만드는 정통 에도마에 스시.",
      ownerName: "최유나",
      ownerProfileImageUrl: "https://randomuser.me/api/portraits/women/4.jpg",
      images: [
        { url: "https://picsum.photos/seed/store4a/600/400", order: 1 },
        { url: "https://picsum.photos/seed/store4b/600/400", order: 2 },
      ],
      hours: [
        { dayOfWeek: 0, isClosed: true, openTime: "00:00", closeTime: "00:00" },
        { dayOfWeek: 1, openTime: "12:00", closeTime: "15:00", isClosed: false },
        { dayOfWeek: 2, openTime: "12:00", closeTime: "15:00", isClosed: false },
        { dayOfWeek: 3, openTime: "12:00", closeTime: "15:00", isClosed: false },
        { dayOfWeek: 4, openTime: "12:00", closeTime: "15:00", isClosed: false },
        { dayOfWeek: 5, openTime: "12:00", closeTime: "22:00", isClosed: false },
        { dayOfWeek: 6, openTime: "12:00", closeTime: "21:00", isClosed: false },
      ],
      menuItems: [
        { name: "오마카세 런치", price: 65000 },
        { name: "연어 니기리 (2p)", price: 12000 },
        { name: "우니 군함", price: 15000 },
      ],
    },
    {
      name: "로스터리 랩",
      category: "카페",
      lat: 35.1921,
      lng: 126.8131,
      address: "광주 광산구 장덕동 567",
      phone: "02-1234-5005",
      description: "소규모 로스팅 공방을 겸한 스페셜티 커피 바.",
      ownerName: "정도윤",
      ownerProfileImageUrl: "https://randomuser.me/api/portraits/men/5.jpg",
      images: [
        { url: "https://picsum.photos/seed/store5a/600/400", order: 1 },
        { url: "https://picsum.photos/seed/store5b/600/400", order: 2 },
      ],
      hours: [
        { dayOfWeek: 0, openTime: "11:00", closeTime: "19:00", isClosed: false },
        { dayOfWeek: 1, openTime: "09:00", closeTime: "20:00", isClosed: false },
        { dayOfWeek: 2, openTime: "09:00", closeTime: "20:00", isClosed: false },
        { dayOfWeek: 3, openTime: "09:00", closeTime: "20:00", isClosed: false },
        { dayOfWeek: 4, openTime: "09:00", closeTime: "20:00", isClosed: false },
        { dayOfWeek: 5, openTime: "09:00", closeTime: "21:00", isClosed: false },
        { dayOfWeek: 6, openTime: "11:00", closeTime: "19:00", isClosed: false },
      ],
      menuItems: [
        { name: "에스프레소", price: 4000 },
        { name: "플랫화이트", price: 6000 },
        { name: "원두 100g", price: 15000, description: "당월 싱글오리진" },
      ],
    },
  ];

  const newsDataByName: Record<string, string> = {
    "블루보틀 장덕점": "🆕 제주 한라봉 라떼 신메뉴 출시! 상큼한 한라봉과 부드러운 우유의 조화, 지금 바로 만나보세요 ☀️",
    "온더테이블": "🎉 점심 특선 메뉴 런칭! 평일 11시~13시 한우 불고기 정식 15% 할인 이벤트 진행 중입니다",
    "스시 료코": "🐟 이번 주 오마카세 재료: 홋카이도산 참다랑어 입고! 한정 12석, 예약은 인스타 DM으로",
  };

  for (const store of stores) {
    const { images, hours, menuItems, ...storeData } = store;
    const created = await prisma.store.create({
      data: {
        ...storeData,
        images: { create: images },
        hours: { create: hours },
        menuItems: { create: menuItems },
      },
    });

    if (newsDataByName[store.name]) {
      await prisma.storeNews.create({
        data: { storeId: created.id, content: newsDataByName[store.name] },
      });
    }

    // 리뷰 2개씩
    await prisma.review.createMany({
      data: [
        {
          storeId: created.id,
          userId: "user_alice",
          userProfileImageUrl: "https://randomuser.me/api/portraits/women/10.jpg",
          rating: 5,
          content: "정말 맛있고 분위기도 너무 좋아요! 다음에 또 올게요 :)",
          likeCount: 12,
        },
        {
          storeId: created.id,
          userId: "user_bob",
          userProfileImageUrl: "https://randomuser.me/api/portraits/men/20.jpg",
          rating: 4,
          content: "가성비가 훌륭합니다. 웨이팅이 조금 있지만 그만한 가치가 있어요.",
          likeCount: 5,
        },
      ],
    });
  }

  console.log("Seed 완료: 매장 5개 + 뉴스 3개 + 리뷰 10개 입력");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
