import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateRequestSchema = z.object({
  status: z.enum(["approved", "rejected"]),
});

// PATCH - Update request status (approve/reject)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = updateRequestSchema.parse(body);

    // Verificar que la solicitud existe
    const existingRequest = await prisma.request.findUnique({
      where: { id: params.id },
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: "Solicitud no encontrada" },
        { status: 404 }
      );
    }

    // Actualizar el estado
    const updatedRequest = await prisma.request.update({
      where: { id: params.id },
      data: {
        status: validatedData.status,
        reviewedBy: session.user.id,
      },
    });

    return NextResponse.json(updatedRequest, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating request:", error);
    return NextResponse.json(
      { error: "Error al actualizar la solicitud" },
      { status: 500 }
    );
  }
}

