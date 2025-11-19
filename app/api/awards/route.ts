import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const createAwardSchema = z.object({
  season: z.string().min(1),
  category: z.string().min(1),
  winnerId: z.string().optional().nullable(),
  winnerType: z.enum(["player", "team", "user"]).optional().nullable(),
  description: z.string().optional().nullable(),
});

// GET - List awards
export async function GET() {
  try {
    const awards = await prisma.seasonAward.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(awards);
  } catch (error) {
    console.error("Error fetching awards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create award (admin only)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = createAwardSchema.parse(body);

    const award = await prisma.seasonAward.create({
      data: {
        season: validatedData.season,
        category: validatedData.category,
        winnerId: validatedData.winnerId || null,
        winnerType: validatedData.winnerType || null,
        description: validatedData.description || null,
      },
    });

    return NextResponse.json(award, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating award:", error);
    return NextResponse.json(
      { error: "Error al crear el premio" },
      { status: 500 }
    );
  }
}

