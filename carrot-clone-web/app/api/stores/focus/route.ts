import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { haversine } from "@/app/lib/haversine";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const swLat = parseFloat(searchParams.get("swLat") ?? "");
  const swLng = parseFloat(searchParams.get("swLng") ?? "");
  const neLat = parseFloat(searchParams.get("neLat") ?? "");
  const neLng = parseFloat(searchParams.get("neLng") ?? "");
  const centerLat = parseFloat(searchParams.get("centerLat") ?? "");
  const centerLng = parseFloat(searchParams.get("centerLng") ?? "");

  if ([swLat, swLng, neLat, neLng, centerLat, centerLng].some(isNaN)) {
    return NextResponse.json({ error: "Missing or invalid query parameters" }, { status: 400 });
  }

  const stores = await prisma.store.findMany({
    where: {
      lat: { gte: swLat, lte: neLat },
      lng: { gte: swLng, lte: neLng },
    },
    include: {
      images: { orderBy: { order: "asc" } },
      hours: { orderBy: { dayOfWeek: "asc" } },
      menuItems: true,
      reviews: {
        include: { images: true },
        orderBy: { createdAt: "desc" },
      },
      news: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (stores.length === 0) {
    return NextResponse.json(null);
  }

  const nearest = stores.reduce((closest, store) => {
    const d = haversine(centerLat, centerLng, store.lat, store.lng);
    const dClosest = haversine(centerLat, centerLng, closest.lat, closest.lng);
    return d < dClosest ? store : closest;
  });

  const { news, ...rest } = nearest;
  return NextResponse.json({
    ...rest,
    latestNews: news[0]?.content ?? null,
    latestNewsId: news[0]?.id ?? null,
    latestNewsLikeCount: news[0]?.likeCount ?? null,
    latestNewsViewCount: news[0]?.viewCount ?? null,
    latestNewsCreatedAt: news[0]?.createdAt.toISOString() ?? null,
  });
}
