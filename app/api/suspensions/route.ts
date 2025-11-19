import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSuspensionSchema = z.object({
  playerId: z.string(),
  reason: z.string().min(1),
  matches: z.number().min(1),
  startDate: z.string(), // ISO string
});

// GET - List suspensions (admin only)
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const suspensions = await prisma.suspension.findMany({
      include: {
        player: {
          include: {
            team: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return NextResponse.json(suspensions);
  } catch (error) {
    console.error("Error fetching suspensions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create suspension (admin only)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = createSuspensionSchema.parse(body);

    // Verificar que el jugador existe
    const player = await prisma.player.findUnique({
      where: { id: validatedData.playerId },
    });

    if (!player) {
      return NextResponse.json(
        { error: "Jugador no encontrado" },
        { status: 404 }
      );
    }

    // Calcular fecha de fin (aproximadamente matches * 7 días)
    const startDate = new Date(validatedData.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + validatedData.matches * 7);

    const suspension = await prisma.suspension.create({
      data: {
        playerId: validatedData.playerId,
        reason: validatedData.reason,
        matches: validatedData.matches,
        startDate: startDate,
        endDate: endDate,
      },
      include: {
        player: {
          include: {
            team: true,
          },
        },
      },
    });

    return NextResponse.json(suspension, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating suspension:", error);
    return NextResponse.json(
      { error: "Error al crear la suspensión" },
      { status: 500 }
    );
  }
}

