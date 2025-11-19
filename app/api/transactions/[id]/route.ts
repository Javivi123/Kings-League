import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateTransactionSchema = z.object({
  status: z.enum(["approved", "rejected"]),
});

// PATCH - Update transaction status (approve/reject)
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
    const validatedData = updateTransactionSchema.parse(body);

    // Obtener la transacción
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id: params.id },
      include: { team: true },
    });

    if (!existingTransaction) {
      return NextResponse.json(
        { error: "Transacción no encontrada" },
        { status: 404 }
      );
    }

    // Si se aprueba, actualizar el balance del equipo
    if (validatedData.status === "approved" && existingTransaction.status === "pending") {
      // Actualizar el balance del equipo según el tipo de transacción
      if (existingTransaction.type === "transfer" || existingTransaction.type === "wildcard") {
        // Restar dinero del equipo
        await prisma.team.update({
          where: { id: existingTransaction.teamId },
          data: {
            eurosKings: {
              decrement: existingTransaction.amount,
            },
          },
        });
      } else if (existingTransaction.type === "investment") {
        // Las inversiones pueden añadir dinero (depende de la lógica de negocio)
        // Por ahora, no hacemos nada adicional
      }
    }

    // Actualizar el estado de la transacción
    const updatedTransaction = await prisma.transaction.update({
      where: { id: params.id },
      data: {
        status: validatedData.status,
        reviewedBy: session.user.id,
      },
    });

    return NextResponse.json(updatedTransaction, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Error al actualizar la transacción" },
      { status: 500 }
    );
  }
}

