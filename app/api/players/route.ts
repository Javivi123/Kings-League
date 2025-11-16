import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const players = await prisma.player.findMany({
      include: {
        team: {
          select: {
            name: true,
          },
        },
        stats: {
          select: {
            goals: true,
            assists: true,
          },
        },
      },
      orderBy: {
        marketValue: "desc",
      },
    });

    return NextResponse.json(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

