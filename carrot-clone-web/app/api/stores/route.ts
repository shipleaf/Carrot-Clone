import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const swLat = parseFloat(searchParams.get("swLat") ?? "");
  const swLng = parseFloat(searchParams.get("swLng") ?? "");
  const neLat = parseFloat(searchParams.get("neLat") ?? "");
  const neLng = parseFloat(searchParams.get("neLng") ?? "");
  const trendingSlug = searchParams.get("trendingSlug");

  if ([swLat, swLng, neLat, neLng].some(isNaN)) {
    return NextResponse.json({ error: "Missing or invalid query parameters" }, { status: 400 });
  }

  const stores = await prisma.store.findMany({
    where: {
      lat: { gte: swLat, lte: neLat },
      lng: { gte: swLng, lte: neLng },
      ...(trendingSlug
        ? { inventories: { some: { trendingItem: { slug: trendingSlug, isActive: true } } } }
        : {}),
    },
    select: {
      id: true,
      name: true,
      category: true,
      lat: true,
      lng: true,
      ownerName: true,
      ownerProfileImageUrl: true,
      news: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          content: true,
          likeCount: true,
          viewCount: true,
          createdAt: true,
        },
      },
      ...(trendingSlug
        ? {
            inventories: {
              where: { trendingItem: { slug: trendingSlug } },
              select: { quantity: true, updatedAt: true },
              take: 1,
            },
          }
        : {}),
    },
    ...(trendingSlug
      ? { orderBy: { inventories: { _count: "desc" } } }
      : {}),
  });

  const result = stores.map((s) => {
    const { news, inventories, ...rest } = s as typeof s & {
      inventories?: { quantity: number; updatedAt: Date }[];
    };
    return {
      ...rest,
      latestNews: news[0]?.content ?? null,
      latestNewsId: news[0]?.id ?? null,
      latestNewsLikeCount: news[0]?.likeCount ?? null,
      latestNewsViewCount: news[0]?.viewCount ?? null,
      latestNewsCreatedAt: news[0]?.createdAt.toISOString() ?? null,
      ...(trendingSlug && inventories?.[0]
        ? {
            inventoryCount: inventories[0].quantity,
            inventoryUpdatedAt: inventories[0].updatedAt.toISOString(),
          }
        : {}),
    };
  });

  // 트렌딩 필터 시: 최근 업데이트 순 정렬
  if (trendingSlug) {
    result.sort((a, b) => {
      const aTime = a.inventoryUpdatedAt ? new Date(a.inventoryUpdatedAt).getTime() : 0;
      const bTime = b.inventoryUpdatedAt ? new Date(b.inventoryUpdatedAt).getTime() : 0;
      return bTime - aTime;
    });
  }

  return NextResponse.json(result);
}
