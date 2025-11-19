import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const createRequestSchema = z.object({
  type: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  effect: z.string().optional(),
});

// POST - Create request
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = createRequestSchema.parse(body);

    // Si es presidente, obtener su equipo
    let teamId = null;
    if (session.user.role === "presidente") {
      const team = await prisma.team.findFirst({
        where: { ownerId: session.user.id },
      });
      teamId = team?.id || null;
    }

    // Preparar datos adicionales en JSON
    const data = JSON.stringify({
      name: validatedData.name,
      description: validatedData.description,
      effect: validatedData.effect,
    });

    const request = await prisma.request.create({
      data: {
        type: validatedData.type,
        userId: session.user.id,
        teamId: teamId,
        data: data,
        status: "pending",
      },
    });

    return NextResponse.json(request, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating request:", error);
    return NextResponse.json(
      { error: "Error al crear la solicitud" },
      { status: 500 }
    );
  }
}

