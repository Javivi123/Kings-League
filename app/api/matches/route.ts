import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = searchParams.get("limit");

    const matches = await prisma.match.findMany({
      where: status ? { status } : undefined,
      take: limit ? parseInt(limit) : undefined,
      orderBy: { matchDate: status === "scheduled" ? "asc" : "desc" },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      { error: "Error al obtener partidos" },
      { status: 500 }
    );
  }
}

