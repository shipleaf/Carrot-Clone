import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const swLat = parseFloat(searchParams.get("swLat") ?? "");
  const swLng = parseFloat(searchParams.get("swLng") ?? "");
  const neLat = parseFloat(searchParams.get("neLat") ?? "");
  const neLng = parseFloat(searchParams.get("neLng") ?? "");

  if ([swLat, swLng, neLat, neLng].some(isNaN)) {
    return NextResponse.json({ error: "Missing or invalid query parameters" }, { status: 400 });
  }

  const stores = await prisma.store.findMany({
    where: {
      lat: { gte: swLat, lte: neLat },
      lng: { gte: swLng, lte: neLng },
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
        select: { content: true },
      },
    },
  });

  const result = stores.map((s) => ({
    ...s,
    latestNews: s.news[0]?.content ?? null,
    news: undefined,
  }));

  return NextResponse.json(result);
}
