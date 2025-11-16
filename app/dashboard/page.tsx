import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { TrendingUp, TrendingDown, BarChart3, Users, Trophy, Euro } from "lucide-react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";

async function getDashboardData(userId: string, role: string) {
  if (role === "presidente") {
    const team = await prisma.team.findFirst({
      where: { ownerId: userId },
      include: {
        players: {
          include: {
            stats: true,
          },
        },
        matchesHome: true,
        matchesAway: true,
      },
    });

    if (!team) return null;

    const totalGoals = team.players.reduce(
      (sum, p) => sum + (p.stats?.goals || 0),
      0
    );
    const totalAssists = team.players.reduce(
      (sum, p) => sum + (p.stats?.assists || 0),
      0
    );
    const totalMatches = team.matchesHome.length + team.matchesAway.length;

    return {
      type: "team",
      data: {
        points: team.points,
        wins: team.wins,
        losses: team.losses,
        draws: team.draws,
        goals: totalGoals,
        assists: totalAssists,
        matches: totalMatches,
        eurosKings: team.eurosKings,
        players: team.players.length,
      },
    };
  }

  if (role === "jugador") {
    const player = await prisma.player.findFirst({
      where: { userId },
      include: {
        stats: true,
        team: true,
      },
    });

    if (!player || !player.stats) return null;

    return {
      type: "player",
      data: {
        goals: player.stats.goals,
        assists: player.stats.assists,
        matches: player.stats.matches,
        points: player.stats.points,
        mvpCount: player.stats.mvpCount,
        marketValue: player.marketValue,
      },
    };
  }

  return null;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const dashboardData = await getDashboardData(session.user.id, session.user.role);

  if (!dashboardData) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p>No hay datos disponibles para tu perfil</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white-kings via-white-off to-gray-100 dark:from-black-dark dark:via-gray-900 dark:to-black-kings py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-8">
            <BarChart3 className="h-8 w-8 text-blue-kings" />
            <h1 className="text-4xl font-bold">Dashboard de Estadísticas</h1>
          </div>

          <DashboardStats data={dashboardData} />
        </div>
      </main>
      <Footer />
    </>
  );
}

