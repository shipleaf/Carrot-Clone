import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const couponId = parseInt(id);

  if (isNaN(couponId)) {
    return NextResponse.json({ error: "Invalid coupon id" }, { status: 400 });
  }

  let userId: string;
  try {
    const body = (await request.json()) as { userId?: unknown };
    if (typeof body.userId !== "string" || !body.userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
    userId = body.userId;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const coupon = await prisma.coupon.findUnique({
    where: { id: couponId, isActive: true },
  });

  if (!coupon) {
    return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ error: "Coupon has expired" }, { status: 410 });
  }

  try {
    const userCoupon = await prisma.userCoupon.create({
      data: { userId, couponId },
    });
    return NextResponse.json({ success: true, claimedAt: userCoupon.claimedAt });
  } catch (e: unknown) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code: string }).code === "P2002"
    ) {
      return NextResponse.json({ error: "Already claimed" }, { status: 409 });
    }
    throw e;
  }
}
