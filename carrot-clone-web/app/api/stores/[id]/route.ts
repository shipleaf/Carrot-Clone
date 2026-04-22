import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const storeId = parseInt(id);

  if (isNaN(storeId)) {
    return NextResponse.json({ error: "Invalid store id" }, { status: 400 });
  }

  const store = await prisma.store.findUnique({
    where: { id: storeId },
    include: {
      images: { orderBy: { order: "asc" } },
      hours: { orderBy: { dayOfWeek: "asc" } },
      menuItems: true,
      reviews: { include: { images: true } },
      news: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  const { news, ...rest } = store;
  return NextResponse.json({ ...rest, latestNews: news[0]?.content ?? null });
}
