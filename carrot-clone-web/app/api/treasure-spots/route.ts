import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const spots = await prisma.treasureSpot.findMany({
    where: { isActive: true, coupon: { isActive: true } },
    select: {
      id: true,
      lat: true,
      lng: true,
      couponId: true,
    },
  });

  return NextResponse.json(spots);
}
