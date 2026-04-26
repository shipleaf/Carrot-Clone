import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const items = await prisma.trendingItem.findMany({
    where: { isActive: true },
    select: { slug: true, name: true, emoji: true, description: true },
    orderBy: { startedAt: "desc" },
  });

  return NextResponse.json(items);
}
