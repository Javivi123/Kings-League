import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const offerSchema = z.object({
  playerId: z.string(),
  price: z.number().positive(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "presidente") {
    return NextResponse.json(
      { error: "Solo los presidentes pueden hacer ofertas" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const validatedData = offerSchema.parse(body);

    // Obtener el equipo del presidente
    const team = await prisma.team.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!team) {
      return NextResponse.json(
        { error: "No tienes un equipo registrado" },
        { status: 404 }
      );
    }

    // Verificar balance
    if (team.eurosKings < validatedData.price) {
      return NextResponse.json(
        { error: "No tienes suficientes Euros Kings" },
        { status: 400 }
      );
    }

    // Verificar que el jugador existe y está en el mercado
    const player = await prisma.player.findUnique({
      where: { id: validatedData.playerId },
    });

    if (!player) {
      return NextResponse.json(
        { error: "Jugador no encontrado" },
        { status: 404 }
      );
    }

    if (!player.isOnMarket) {
      return NextResponse.json(
        { error: "El jugador no está en el mercado" },
        { status: 400 }
      );
    }

    // Verificar que el equipo destino existe
    const destinationTeam = await prisma.team.findUnique({
      where: { id: team.id },
    });

    if (!destinationTeam) {
      return NextResponse.json(
        { error: "Equipo destino no encontrado" },
        { status: 404 }
      );
    }

    // Crear la transferencia
    const transferData: {
      toTeamId: string;
      playerId: string;
      price: number;
      status: string;
      fromTeamId?: string;
    } = {
      toTeamId: team.id,
      playerId: validatedData.playerId,
      price: validatedData.price,
      status: "pending",
    };

    // Solo añadir fromTeamId si el jugador tiene equipo y el equipo existe
    if (player.teamId) {
      const sourceTeam = await prisma.team.findUnique({
        where: { id: player.teamId },
      });
      if (sourceTeam) {
        transferData.fromTeamId = player.teamId;
      }
    }

    const transfer = await prisma.transfer.create({
      data: transferData,
    });

    // Crear transacción pendiente
    await prisma.transaction.create({
      data: {
        teamId: team.id,
        type: "transfer",
        amount: validatedData.price,
        description: `Oferta por ${player.name}`,
        status: "pending",
      },
    });

    return NextResponse.json(transfer, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating offer:", error);
    
    // Proporcionar más información del error
    let errorMessage = "Error al crear la oferta";
    if (error instanceof Error) {
      if (error.message.includes("Foreign key constraint")) {
        errorMessage = "Error: El jugador o equipo no existe en la base de datos";
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}

