import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "marketValue";
    const limit = searchParams.get("limit");

    // Determinar el orden según el parámetro sort
    let orderBy: any = { marketValue: "desc" };
    
    if (sort === "points") {
      orderBy = { stats: { points: "desc" } };
    } else if (sort === "mvp") {
      orderBy = { stats: { mvpCount: "desc" } };
    } else if (sort === "goals") {
      orderBy = { stats: { goals: "desc" } };
    }

    const players = await prisma.player.findMany({
      take: limit ? parseInt(limit) : undefined,
      include: {
        team: {
          select: {
            name: true,
          },
        },
        stats: true,
      },
      orderBy: orderBy,
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

