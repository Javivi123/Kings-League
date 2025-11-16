import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    // Actualizar el usuario para marcar que ya vio el tutorial
    await prisma.user.update({
      where: { email: session.user.email },
      data: { hasSeenTutorial: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al marcar tutorial como completado:", error);
    return NextResponse.json(
      { error: "Error al guardar" },
      { status: 500 }
    );
  }
}

