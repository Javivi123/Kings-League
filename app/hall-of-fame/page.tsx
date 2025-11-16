import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { Trophy, Crown, Star, Medal } from "lucide-react";
import { FloatingIcons } from "@/components/ui/FloatingIcons";
import Link from "next/link";

async function getHallOfFame() {
  const [topTeams, topPlayers, topScorers, seasonAwards] = await Promise.all([
    // Top equipos históricos
    prisma.team.findMany({
      orderBy: [
        { points: "desc" },
        { wins: "desc" },
      ],
      take: 10,
      include: {
        owner: true,
      },
    }),
    // Top jugadores por puntos fantasy
    prisma.playerStats.findMany({
      orderBy: { points: "desc" },
      take: 10,
      include: {
        player: {
          include: {
            team: true,
          },
        },
      },
    }),
    // Top goleadores
    prisma.playerStats.findMany({
      orderBy: { goals: "desc" },
      take: 10,
      include: {
        player: {
          include: {
            team: true,
          },
        },
      },
    }),
    // Premios de temporada
    prisma.seasonAward.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return { topTeams, topPlayers, topScorers, seasonAwards };
}

export default async function HallOfFamePage() {
  const { topTeams, topPlayers, topScorers, seasonAwards } =
    await getHallOfFame();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white-kings via-white-off to-gray-100 dark:from-black-dark dark:via-gray-900 dark:to-black-kings py-8 relative overflow-hidden">
        <FloatingIcons type="trophies" count={10} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <Crown className="h-16 w-16 text-gold-kings mx-auto mb-4 animate-pulse" />
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gold-kings to-gold-dark bg-clip-text text-transparent leading-tight">
              Hall of Fame
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Los mejores de todos los tiempos
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Equipos */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-gold-kings" />
                <span>Top Equipos Históricos</span>
              </h2>
              <div className="space-y-3">
                {topTeams.map((team, index) => (
                  <div
                    key={team.id}
                    className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow animate-fade-in"
                  >
                    <div className="flex-shrink-0">
                      {index < 3 ? (
                        <Medal
                          className={`h-8 w-8 ${
                            index === 0
                              ? "text-gold-kings"
                              : index === 1
                              ? "text-gray-400"
                              : "text-orange-400"
                          }`}
                        />
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 font-bold">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{team.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {team.owner.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gold-kings">
                        {team.points} pts
                      </div>
                      <div className="text-xs text-gray-500">
                        {team.wins}W - {team.losses}L
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Jugadores */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Star className="h-6 w-6 text-blue-kings" />
                <span>Top Jugadores (Puntos Fantasy)</span>
              </h2>
              <div className="space-y-3">
                {topPlayers.map((stat, index) => (
                  <Link
                    key={stat.id}
                    href={`/players/${stat.player.id}`}
                    className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 hover:scale-105 animate-fade-in block"
                  >
                    <div className="flex-shrink-0">
                      {index < 3 ? (
                        <Medal
                          className={`h-8 w-8 ${
                            index === 0
                              ? "text-gold-kings"
                              : index === 1
                              ? "text-gray-400"
                              : "text-orange-400"
                          }`}
                        />
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 font-bold">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{stat.player.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.player.team?.name || "Sin equipo"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-kings">
                        {stat.points} pts
                      </div>
                      <div className="text-xs text-gray-500">
                        {stat.goals}G {stat.assists}A
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Top Goleadores */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Star className="h-6 w-6 text-red-kings" />
              <span>Top Goleadores</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {topScorers.map((stat, index) => (
                <Link
                  key={stat.id}
                  href={`/players/${stat.player.id}`}
                  className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 hover:scale-105 animate-fade-in"
                >
                  <div className="text-3xl mb-2">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`}
                  </div>
                  <div className="font-semibold">{stat.player.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {stat.player.team?.name || "Sin equipo"}
                  </div>
                  <div className="text-2xl font-bold text-red-kings">
                    {stat.goals}
                  </div>
                  <div className="text-xs text-gray-500">goles</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Premios de Temporada */}
          {seasonAwards.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-gold-kings" />
                <span>Premios de Temporada</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {seasonAwards.map((award) => (
                  <div
                    key={award.id}
                    className="p-4 border border-gold-kings/30 rounded-lg bg-gradient-to-br from-gold-kings/10 to-gold-kings/5 animate-fade-in"
                  >
                    <div className="font-semibold mb-1">{award.category}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Temporada {award.season}
                    </div>
                    {award.description && (
                      <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                        {award.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

