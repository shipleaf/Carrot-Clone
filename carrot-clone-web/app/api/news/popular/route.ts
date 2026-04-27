import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const news = await prisma.storeNews.findMany({
    orderBy: [
      { likeCount: "desc" },
      { viewCount: "desc" },
      { createdAt: "desc" },
    ],
    take: 10,
    include: {
      store: {
        select: {
          id: true,
          name: true,
          category: true,
          lat: true,
          lng: true,
          ownerName: true,
          ownerProfileImageUrl: true,
        },
      },
    },
  });

  return NextResponse.json(
    news.map((item) => ({
      id: item.id,
      content: item.content,
      likeCount: item.likeCount,
      viewCount: item.viewCount,
      createdAt: item.createdAt.toISOString(),
      store: item.store,
    })),
  );
}
