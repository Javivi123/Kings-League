import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    let data: any[] = [];
    let headers: string[] = [];

    switch (type) {
      case "users":
        data = await prisma.user.findMany({
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            age: true,
            createdAt: true,
          },
        });
        headers = ["ID", "Email", "Nombre", "Rol", "Edad", "Fecha Creación"];
        break;

      case "teams":
        data = await prisma.team.findMany({
          include: {
            owner: {
              select: {
                email: true,
                name: true,
              },
            },
          },
        });
        headers = [
          "ID",
          "Nombre",
          "Propietario",
          "Email Propietario",
          "Euros Kings",
          "Puntos",
          "Victorias",
          "Empates",
          "Derrotas",
        ];
        break;

      case "players":
        data = await prisma.player.findMany({
          include: {
            team: {
              select: {
                name: true,
              },
            },
            stats: true,
          },
        });
        headers = [
          "ID",
          "Nombre",
          "Posición",
          "Equipo",
          "Precio",
          "Valor Mercado",
          "Goles",
          "Asistencias",
          "Partidos",
        ];
        break;

      case "matches":
        data = await prisma.match.findMany({
          include: {
            homeTeam: {
              select: {
                name: true,
              },
            },
            awayTeam: {
              select: {
                name: true,
              },
            },
          },
        });
        headers = [
          "ID",
          "Equipo Local",
          "Equipo Visitante",
          "Goles Local",
          "Goles Visitante",
          "Fecha",
          "Estado",
        ];
        break;

      default:
        return NextResponse.json(
          { error: "Tipo no válido" },
          { status: 400 }
        );
    }

    // Convert to CSV
    const csvRows = [
      headers.join(","),
      ...data.map((row) => {
        if (type === "users") {
          return [
            row.id,
            row.email,
            row.name || "",
            row.role,
            row.age || "",
            row.createdAt.toISOString(),
          ].join(",");
        }
        if (type === "teams") {
          return [
            row.id,
            row.name,
            row.owner.name || "",
            row.owner.email,
            row.eurosKings,
            row.points,
            row.wins,
            row.draws,
            row.losses,
          ].join(",");
        }
        if (type === "players") {
          return [
            row.id,
            row.name,
            row.position,
            row.team?.name || "",
            row.price,
            row.marketValue,
            row.stats?.goals || 0,
            row.stats?.assists || 0,
            row.stats?.matches || 0,
          ].join(",");
        }
        if (type === "matches") {
          return [
            row.id,
            row.homeTeam.name,
            row.awayTeam.name,
            row.homeScore || "",
            row.awayScore || "",
            row.matchDate.toISOString(),
            row.status,
          ].join(",");
        }
        return "";
      }),
    ];

    const csv = csvRows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    return new NextResponse(blob, {
      headers: {
        "Content-Type": "text/csv;charset=utf-8;",
        "Content-Disposition": `attachment; filename="${type}-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

