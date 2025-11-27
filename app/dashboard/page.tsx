import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { BarChart3, Newspaper, Calendar, User } from "lucide-react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { FloatingIcons } from "@/components/ui/FloatingIcons";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

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
      type: "team" as const,
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
      type: "player" as const,
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

async function getNews() {
  return await prisma.news.findMany({
    where: { published: true },
    include: {
      author: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5, // Mostrar solo las 5 más recientes
  });
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const dashboardData = await getDashboardData(session.user.id, session.user.role);
  const news = await getNews();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-black-dark via-gray-900 to-black-kings py-8 relative overflow-hidden">
        <FloatingIcons type="mixed" count={8} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center space-x-3 mb-8 animate-fade-in">
            <BarChart3 className="h-8 w-8 text-blue-kings" />
            <h1 className="text-4xl font-bold">Dashboard</h1>
          </div>

          <div className="space-y-8">
            {/* Estadísticas (solo para presidente y jugador) */}
            {dashboardData && (
              <div>
                <DashboardStats data={dashboardData} />
              </div>
            )}

            {/* Noticias (para todos) */}
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Newspaper className="h-6 w-6 text-blue-kings" />
                  <h2 className="text-2xl font-bold">Últimas Noticias</h2>
                </div>
                <Link
                  href="/news"
                  className="text-blue-kings hover:text-blue-dark font-medium"
                >
                  Ver todas →
                </Link>
              </div>

              {news.length === 0 ? (
                <div className="text-center py-12">
                  <Newspaper className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">
                    No hay noticias disponibles
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {news.map((item) => (
                    <article
                      key={item.id}
                      className="border-b border-gray-700 pb-6 last:border-0 last:pb-0"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{item.author.name || "Admin"}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(item.createdAt), "d MMMM yyyy", { locale: es })}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <div
                        className="text-gray-300 prose prose-invert max-w-none line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html: item.content.substring(0, 200) + "...",
                        }}
                      />
                      <Link
                        href={`/news#${item.id}`}
                        className="text-blue-kings hover:text-blue-dark font-medium mt-2 inline-block"
                      >
                        Leer más →
                      </Link>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

