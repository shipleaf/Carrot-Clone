import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const storeId = parseInt(id);

  if (isNaN(storeId)) {
    return NextResponse.json({ error: "Invalid store id" }, { status: 400 });
  }

  const body = (await request.json()) as { slug?: string; quantity?: number; note?: string };
  const { slug, quantity, note } = body;

  if (!slug || typeof quantity !== "number" || quantity < 0) {
    return NextResponse.json({ error: "slug and quantity (>= 0) are required" }, { status: 400 });
  }

  const trendingItem = await prisma.trendingItem.findUnique({
    where: { slug, isActive: true },
  });

  if (!trendingItem) {
    return NextResponse.json({ error: "Trending item not found or inactive" }, { status: 404 });
  }

  const inventory = await prisma.storeInventory.upsert({
    where: { storeId_trendingItemId: { storeId, trendingItemId: trendingItem.id } },
    update: { quantity, note: note ?? null },
    create: { storeId, trendingItemId: trendingItem.id, quantity, note: note ?? null },
  });

  return NextResponse.json({
    storeId,
    slug,
    quantity: inventory.quantity,
    note: inventory.note,
    updatedAt: inventory.updatedAt.toISOString(),
  });
}
