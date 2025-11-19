import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const createMatchSchema = z.object({
  homeTeamId: z.string(),
  awayTeamId: z.string(),
  matchDate: z.string(), // ISO string
  status: z.enum(["scheduled", "live", "finished"]).optional(),
});

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

// POST - Create match (admin only)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = createMatchSchema.parse(body);

    // Verificar que los equipos existen
    const [homeTeam, awayTeam] = await Promise.all([
      prisma.team.findUnique({ where: { id: validatedData.homeTeamId } }),
      prisma.team.findUnique({ where: { id: validatedData.awayTeamId } }),
    ]);

    if (!homeTeam || !awayTeam) {
      return NextResponse.json(
        { error: "Uno o ambos equipos no existen" },
        { status: 404 }
      );
    }

    if (homeTeam.id === awayTeam.id) {
      return NextResponse.json(
        { error: "Un equipo no puede jugar contra sí mismo" },
        { status: 400 }
      );
    }

    const match = await prisma.match.create({
      data: {
        homeTeamId: validatedData.homeTeamId,
        awayTeamId: validatedData.awayTeamId,
        matchDate: new Date(validatedData.matchDate),
        status: validatedData.status || "scheduled",
        homeScore: null,
        awayScore: null,
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating match:", error);
    return NextResponse.json(
      { error: "Error al crear el partido" },
      { status: 500 }
    );
  }
}
