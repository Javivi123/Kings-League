import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const createTeamSchema = z.object({
  name: z.string().min(1),
  logo: z.string().optional().nullable(),
  ownerId: z.string(),
  eurosKings: z.number().min(0).optional(),
});

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        owner: true,
        players: {
          include: {
            stats: true,
          },
        },
      },
      orderBy: {
        points: "desc",
      },
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create team (admin only)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = createTeamSchema.parse(body);

    // Verificar que el usuario existe y no tiene equipo
    const user = await prisma.user.findUnique({
      where: { id: validatedData.ownerId },
      include: { team: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    if (user.team) {
      return NextResponse.json(
        { error: "El usuario ya tiene un equipo" },
        { status: 400 }
      );
    }

    const team = await prisma.team.create({
      data: {
        name: validatedData.name,
        logo: validatedData.logo || null,
        ownerId: validatedData.ownerId,
        eurosKings: validatedData.eurosKings || 1000.0,
        points: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Error al crear el equipo" },
      { status: 500 }
    );
  }
}
