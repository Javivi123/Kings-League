import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Trophy, Calendar, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

async function getRecentMatches() {
  return await prisma.match.findMany({
    take: 5,
    orderBy: { matchDate: "desc" },
    where: { status: "finished" },
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  });
}

async function getNextMatch() {
  return await prisma.match.findFirst({
    where: { status: "scheduled" },
    orderBy: { matchDate: "asc" },
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  });
}

async function getTopMVPs() {
  return await prisma.playerStats.findMany({
    take: 5,
    orderBy: { mvpCount: "desc" },
    include: {
      player: {
        include: {
          team: true,
        },
      },
    },
  });
}

async function getTopInvestedPlayers() {
  const investments = await prisma.investment.findMany({
    include: {
      player: {
        include: {
          team: true,
        },
      },
    },
  });

  // Group by player and sum amounts
  const playerTotals = new Map<string, { player: any; total: number }>();
  
  investments.forEach((inv) => {
    const current = playerTotals.get(inv.playerId) || { player: inv.player, total: 0 };
    current.total += inv.amount;
    playerTotals.set(inv.playerId, current);
  });

  // Sort and take top 5
  return Array.from(playerTotals.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
}

export async function HomeContent() {
  const session = await getServerSession(authOptions);
  const [recentMatches, nextMatch, topMVPs, topInvested] = await Promise.all([
    getRecentMatches(),
    getNextMatch(),
    getTopMVPs(),
    getTopInvestedPlayers(),
  ]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-white-kings via-white-off to-gray-100 dark:from-black-dark dark:via-gray-900 dark:to-black-kings">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-kings via-red-kings to-gold-kings bg-clip-text text-transparent">
            👑 Kings League
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            La liga fantasy del colegio
          </p>
        </div>

        {/* Next Match Card */}
        {nextMatch && (
          <div className="bg-gradient-to-r from-blue-kings to-blue-dark rounded-2xl shadow-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-6 w-6" />
                <h2 className="text-2xl font-bold">Próximo Partido</h2>
              </div>
              <span className="text-lg">
                {format(new Date(nextMatch.matchDate), "d MMMM, HH:mm")}
              </span>
            </div>
            <div className="flex items-center justify-around">
              <div className="text-center">
                <div className="text-3xl font-bold">{nextMatch.homeTeam.name}</div>
                {nextMatch.homeTeam.logo && (
                  <img
                    src={nextMatch.homeTeam.logo}
                    alt={nextMatch.homeTeam.name}
                    className="h-16 w-16 mx-auto mt-2"
                  />
                )}
              </div>
              <div className="text-4xl font-bold">VS</div>
              <div className="text-center">
                <div className="text-3xl font-bold">{nextMatch.awayTeam.name}</div>
                {nextMatch.awayTeam.logo && (
                  <img
                    src={nextMatch.awayTeam.logo}
                    alt={nextMatch.awayTeam.name}
                    className="h-16 w-16 mx-auto mt-2"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Matches */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-gold-kings" />
              <span>Últimos Partidos</span>
            </h2>
            <div className="space-y-4">
              {recentMatches.length > 0 ? (
                recentMatches.map((match) => (
                  <div
                    key={match.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold">{match.homeTeam.name}</div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(match.matchDate), "d MMM yyyy")}
                        </div>
                      </div>
                      <div className="text-2xl font-bold mx-4">
                        {match.homeScore} - {match.awayScore}
                      </div>
                      <div className="flex-1 text-right">
                        <div className="font-semibold">{match.awayTeam.name}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No hay partidos recientes
                </p>
              )}
            </div>
            <Link
              href="/matches"
              className="block text-center mt-6 text-blue-kings hover:text-blue-dark font-medium"
            >
              Ver todos los partidos →
            </Link>
          </div>

          {/* Top MVPs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Star className="h-6 w-6 text-gold-kings" />
              <span>Top MVPs</span>
            </h2>
            <div className="space-y-4">
              {topMVPs.length > 0 ? (
                topMVPs.map((stat, index) => (
                  <div
                    key={stat.id}
                    className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gold-kings text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{stat.player.name}</div>
                        <div className="text-sm text-gray-500">
                          {stat.player.team?.name || "Sin equipo"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gold-kings">
                        {stat.mvpCount} MVP{stat.mvpCount !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No hay MVPs aún
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Top Invested Players */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-blue-kings" />
            <span>Jugadores Estrella (Más Inversión)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {topInvested.length > 0 ? (
              topInvested.map((item) => (
                <div
                  key={item.player.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
                >
                  {item.player.photo && (
                    <img
                      src={item.player.photo}
                      alt={item.player.name}
                      className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
                    />
                  )}
                  <div className="font-semibold">{item.player.name}</div>
                  <div className="text-sm text-gray-500">{item.player.position}</div>
                  <div className="text-lg font-bold text-gold-kings mt-2">
                    {item.total.toFixed(0)} €K
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8 col-span-full">
                No hay jugadores con inversión aún
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions based on role */}
        {session && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {session.user.role === "alumno" && (
              <>
                <Link
                  href="/news"
                  className="bg-blue-kings text-white rounded-lg p-6 text-center hover:bg-blue-dark transition-colors"
                >
                  <h3 className="text-xl font-bold mb-2">📰 Novedades</h3>
                  <p>Mantente al día con las últimas noticias</p>
                </Link>
                <Link
                  href="/players"
                  className="bg-red-kings text-white rounded-lg p-6 text-center hover:bg-red-dark transition-colors"
                >
                  <h3 className="text-xl font-bold mb-2">👥 Jugadores</h3>
                  <p>Explora las fichas de los jugadores</p>
                </Link>
                <Link
                  href="/standings"
                  className="bg-gold-kings text-white rounded-lg p-6 text-center hover:bg-gold-dark transition-colors"
                >
                  <h3 className="text-xl font-bold mb-2">🏆 Clasificación</h3>
                  <p>Consulta la tabla de posiciones</p>
                </Link>
              </>
            )}
            {session.user.role === "jugador" && (
              <Link
                href="/my-profile"
                className="bg-blue-kings text-white rounded-lg p-6 text-center hover:bg-blue-dark transition-colors col-span-3"
              >
                <h3 className="text-xl font-bold mb-2">Mi Perfil de Jugador</h3>
                <p>Ve tus estadísticas y tu posición en el equipo</p>
              </Link>
            )}
            {session.user.role === "presidente" && (
              <Link
                href="/my-team"
                className="bg-blue-kings text-white rounded-lg p-6 text-center hover:bg-blue-dark transition-colors col-span-3"
              >
                <h3 className="text-xl font-bold mb-2">Gestionar Mi Equipo</h3>
                <p>Administra jugadores, dinero y transferencias</p>
              </Link>
            )}
            {session.user.role === "admin" && (
              <Link
                href="/admin"
                className="bg-red-kings text-white rounded-lg p-6 text-center hover:bg-red-dark transition-colors col-span-3"
              >
                <h3 className="text-xl font-bold mb-2">Panel de Administración</h3>
                <p>Control total de la aplicación</p>
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

