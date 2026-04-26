import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const couponId = parseInt(id);

  if (isNaN(couponId)) {
    return NextResponse.json({ error: "Invalid coupon id" }, { status: 400 });
  }

  const coupon = await prisma.coupon.findUnique({
    where: { id: couponId, isActive: true },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      expiresAt: true,
      store: { select: { name: true } },
    },
  });

  if (!coupon) {
    return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: coupon.id,
    title: coupon.title,
    description: coupon.description,
    imageUrl: coupon.imageUrl,
    expiresAt: coupon.expiresAt,
    storeName: coupon.store.name,
  });
}
