import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const customizeSchema = z.object({
  name: z.string().min(1),
  logo: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
});

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "presidente") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = customizeSchema.parse(body);

    const team = await prisma.team.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    const updatedTeam = await prisma.team.update({
      where: { id: team.id },
      data: {
        name: validatedData.name,
        logo: validatedData.logo || team.logo,
        // Los colores se pueden guardar en un campo JSON o en una tabla separada
        // Por ahora, solo actualizamos nombre y logo
      },
    });

    return NextResponse.json(updatedTeam);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating team:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

