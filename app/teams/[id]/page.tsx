import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { Trophy, Users, Euro, TrendingUp, Calendar, Target } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

async function getTeam(id: string) {
  try {
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        owner: true,
        players: {
          include: {
            stats: true,
            user: true,
          },
          orderBy: {
            marketValue: "desc",
          },
        },
        matchesHome: {
          include: {
            awayTeam: true,
          },
          orderBy: {
            matchDate: "desc",
          },
          take: 5,
        },
        matchesAway: {
          include: {
            homeTeam: true,
          },
          orderBy: {
            matchDate: "desc",
          },
          take: 5,
        },
      },
    });
    return team;
  } catch (error) {
    console.error("Error fetching team:", error);
    return null;
  }
}

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = await getTeam(id);

  if (!team) {
    notFound();
  }

  const allMatches = [
    ...team.matchesHome.map((m) => ({
      ...m,
      opponent: m.awayTeam,
      isHome: true,
    })),
    ...team.matchesAway.map((m) => ({
      ...m,
      opponent: m.homeTeam,
      isHome: false,
    })),
  ].sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime());

  const totalGoals = team.players.reduce((sum, p) => sum + (p.stats?.goals || 0), 0);
  const totalAssists = team.players.reduce((sum, p) => sum + (p.stats?.assists || 0), 0);
  const totalPoints = team.players.reduce((sum, p) => sum + (p.stats?.points || 0), 0);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white-kings via-white-off to-gray-100 dark:from-black-dark dark:via-gray-900 dark:to-black-kings py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header del Equipo */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
              {team.logo ? (
                <img
                  src={team.logo}
                  alt={team.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gold-kings shadow-xl"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-kings flex items-center justify-center text-white text-5xl font-bold shadow-xl">
                  {team.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-5xl font-bold mb-2">{team.name}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                  Presidente: {team.owner.name || team.owner.email}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-gradient-to-br from-gold-kings to-gold-dark rounded-lg p-4 text-center">
                    <Trophy className="h-6 w-6 text-white mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{team.points}</div>
                    <div className="text-sm text-white/80">Puntos</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-center">
                    <Target className="h-6 w-6 text-white mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{team.wins}</div>
                    <div className="text-sm text-white/80">Victorias</div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-4 text-center">
                    <TrendingUp className="h-6 w-6 text-white mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{team.draws}</div>
                    <div className="text-sm text-white/80">Empates</div>
                  </div>
                  <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-4 text-center">
                    <Target className="h-6 w-6 text-white mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{team.losses}</div>
                    <div className="text-sm text-white/80">Derrotas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Estadísticas del Equipo */}
            <div className="lg:col-span-2 space-y-6">
              {/* Jugadores */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Users className="h-6 w-6 text-blue-kings" />
                  <h2 className="text-2xl font-bold">Jugadores ({team.players.length})</h2>
                </div>
                {team.players.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                    No hay jugadores en este equipo
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {team.players.map((player) => (
                      <Link
                        key={player.id}
                        href={`/players/${player.id}`}
                        className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          {player.photo ? (
                            <img
                              src={player.photo}
                              alt={player.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-blue-kings flex items-center justify-center text-white text-xl font-bold">
                              {player.name.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{player.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {player.position}
                            </p>
                            {player.stats && (
                              <div className="flex space-x-4 mt-2 text-sm">
                                <span className="text-green-500">
                                  {player.stats.goals} Goles
                                </span>
                                <span className="text-blue-500">
                                  {player.stats.assists} Asistencias
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Partidos Recientes */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Calendar className="h-6 w-6 text-blue-kings" />
                  <h2 className="text-2xl font-bold">Partidos Recientes</h2>
                </div>
                {allMatches.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                    No hay partidos registrados
                  </p>
                ) : (
                  <div className="space-y-4">
                    {allMatches.map((match) => (
                      <div
                        key={match.id}
                        className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="text-center flex-1">
                              <p className="font-semibold">{team.name}</p>
                            </div>
                            <div className="text-center">
                              {match.status === "finished" &&
                              match.homeScore !== null &&
                              match.awayScore !== null ? (
                                <div className="text-2xl font-bold">
                                  {match.isHome ? match.homeScore : match.awayScore} -{" "}
                                  {match.isHome ? match.awayScore : match.homeScore}
                                </div>
                              ) : (
                                <div className="text-lg text-gray-400">VS</div>
                              )}
                            </div>
                            <div className="text-center flex-1">
                              <p className="font-semibold">{match.opponent.name}</p>
                            </div>
                          </div>
                          <div className="ml-4 text-sm text-gray-600 dark:text-gray-400">
                            {format(new Date(match.matchDate), "d MMM yyyy", { locale: es })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Estadísticas Generales */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Estadísticas</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Goles a Favor</span>
                      <span className="font-bold text-green-500">{team.goalsFor}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Goles en Contra</span>
                      <span className="font-bold text-red-500">{team.goalsAgainst}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Diferencia</span>
                      <span className="font-bold">
                        {team.goalsFor - team.goalsAgainst > 0 ? "+" : ""}
                        {team.goalsFor - team.goalsAgainst}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Total Goles (Jugadores)</span>
                      <span className="font-bold">{totalGoals}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Total Asistencias</span>
                      <span className="font-bold">{totalAssists}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Total Puntos Fantasy</span>
                      <span className="font-bold text-gold-kings">{totalPoints}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Euros Kings */}
              <div className="bg-gradient-to-br from-gold-kings to-gold-dark rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center space-x-3 mb-4">
                  <Euro className="h-6 w-6" />
                  <h2 className="text-2xl font-bold">Euros Kings</h2>
                </div>
                <div className="text-4xl font-bold">{team.eurosKings.toFixed(0)}</div>
                <div className="text-sm opacity-80 mt-2">Disponible</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

