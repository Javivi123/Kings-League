import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { BarChart3, TrendingUp, Users, Trophy, Activity } from "lucide-react";

async function getAnalytics() {
  const [
    totalUsers,
    totalTeams,
    totalPlayers,
    totalMatches,
    activeUsers,
    recentActivity,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.team.count(),
    prisma.player.count(),
    prisma.match.count(),
    prisma.user.count({
      where: {
        updatedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Últimos 7 días
        },
      },
    }),
    prisma.match.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    }),
  ]);

  return {
    totalUsers,
    totalTeams,
    totalPlayers,
    totalMatches,
    activeUsers,
    recentActivity,
  };
}

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const analytics = await getAnalytics();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white-kings via-white-off to-gray-100 dark:from-black-dark dark:via-gray-900 dark:to-black-kings py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-8">
            <BarChart3 className="h-8 w-8 text-blue-kings" />
            <h1 className="text-4xl font-bold">Panel de Analytics</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8 text-blue-kings" />
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">{analytics.totalUsers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Usuarios Totales
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {analytics.activeUsers} activos (7 días)
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <Trophy className="h-8 w-8 text-gold-kings" />
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">{analytics.totalTeams}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Equipos
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8 text-green-500" />
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {analytics.totalPlayers}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Jugadores
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <Activity className="h-8 w-8 text-red-kings" />
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {analytics.totalMatches}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Partidos
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Activity className="h-6 w-6 text-blue-kings" />
              <span>Actividad Reciente</span>
            </h2>
            <div className="space-y-4">
              {analytics.recentActivity.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg animate-fade-in"
                >
                  <div>
                    <div className="font-semibold">
                      {match.homeTeam.name} vs {match.awayTeam.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(match.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        match.status === "finished"
                          ? "bg-green-500/20 text-green-600"
                          : match.status === "live"
                          ? "bg-red-kings/20 text-red-kings"
                          : "bg-gray-500/20 text-gray-600"
                      }`}
                    >
                      {match.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

