import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const createPlayerSchema = z.object({
  name: z.string().min(1),
  position: z.enum(["GK", "DEF", "MID", "FWD"]),
  price: z.number().min(0).optional(),
  marketValue: z.number().min(0).optional(),
  teamId: z.string().optional().nullable(),
  userId: z.string().optional().nullable(),
  age: z.number().optional().nullable(),
  photo: z.string().optional().nullable(),
});

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

// POST - Create player (admin only)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = createPlayerSchema.parse(body);

    const player = await prisma.player.create({
      data: {
        name: validatedData.name,
        position: validatedData.position,
        price: validatedData.price || 0,
        marketValue: validatedData.marketValue || validatedData.price || 0,
        teamId: validatedData.teamId || null,
        userId: validatedData.userId || null,
        age: validatedData.age || null,
        photo: validatedData.photo || null,
        isAvailable: !validatedData.teamId,
      },
    });

    // Crear estadísticas iniciales para el jugador
    await prisma.playerStats.create({
      data: {
        playerId: player.id,
        goals: 0,
        assists: 0,
        matches: 0,
        points: 0,
        yellowCards: 0,
        redCards: 0,
        mvpCount: 0,
      },
    });

    return NextResponse.json(player, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating player:", error);
    return NextResponse.json(
      { error: "Error al crear el jugador" },
      { status: 500 }
    );
  }
}
