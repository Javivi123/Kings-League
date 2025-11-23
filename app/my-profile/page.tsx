import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Trophy, TrendingUp, Users, Euro, Calendar, Target } from "lucide-react";
import Link from "next/link";

async function getPlayerProfile(userId: string) {
  const player = await prisma.player.findFirst({
    where: { userId },
    include: {
      team: {
        include: {
          owner: true,
          players: {
            include: {
              stats: true,
            },
            orderBy: {
              marketValue: "desc",
            },
          },
        },
      },
      stats: true,
      investments: {
        include: {
          team: true,
        },
      },
    },
  });

  if (!player) return null;

  // Calcular posición en el equipo
  const teamPlayers = player.team?.players || [];
  const playerPosition = teamPlayers.findIndex((p) => p.id === player.id) + 1;

  // Calcular total invertido
  const totalInvested = player.investments.reduce(
    (sum, inv) => sum + inv.amount,
    0
  );

  // Obtener próximos partidos del equipo
  const upcomingMatches = player.team
    ? await prisma.match.findMany({
        where: {
          OR: [
            { homeTeamId: player.team.id },
            { awayTeamId: player.team.id },
          ],
          status: "scheduled",
        },
        include: {
          homeTeam: true,
          awayTeam: true,
        },
        orderBy: {
          matchDate: "asc",
        },
        take: 3,
      })
    : [];

  return {
    ...player,
    playerPosition,
    totalInvested,
    upcomingMatches,
  };
}

export default async function MyProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "jugador") {
    redirect("/");
  }

  const playerProfile = await getPlayerProfile(session.user.id);

  if (!playerProfile) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-black-dark via-gray-900 to-black-kings py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-lg text-gray-400">
              No se encontró tu perfil de jugador. Contacta con un administrador.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-black-dark via-gray-900 to-black-kings py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-kings to-blue-dark rounded-2xl shadow-lg p-8 mb-6 text-white">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {playerProfile.photo ? (
                <img
                  src={playerProfile.photo}
                  alt={playerProfile.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center text-white text-5xl font-bold border-4 border-white">
                  {playerProfile.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">{playerProfile.name}</h1>
                <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                  <span className="px-4 py-2 bg-white/20 rounded-full font-semibold">
                    {playerProfile.position}
                  </span>
                  {playerProfile.team && (
                    <Link
                      href={`/teams/${playerProfile.team.id}`}
                      className="hover:underline"
                    >
                      <Users className="inline h-4 w-4 mr-1" />
                      {playerProfile.team.name}
                    </Link>
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm opacity-90 mb-1">Valor de Mercado</div>
                <div className="text-4xl font-bold text-gold-kings">
                  {playerProfile.marketValue.toFixed(0)} €K
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Estadísticas Personales */}
            {playerProfile.stats && (
              <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                  <Trophy className="h-6 w-6 text-gold-kings" />
                  <span>Mis Estadísticas</span>
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-kings/10 rounded-lg">
                    <div className="text-3xl font-bold text-blue-kings">
                      {playerProfile.stats.goals}
                    </div>
                    <div className="text-sm text-gray-400">
                      Goles
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-lg">
                    <div className="text-3xl font-bold text-green-500">
                      {playerProfile.stats.assists}
                    </div>
                    <div className="text-sm text-gray-400">
                      Asistencias
                    </div>
                  </div>
                  <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-500">
                      {playerProfile.stats.matches}
                    </div>
                    <div className="text-sm text-gray-400">
                      Partidos
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gold-kings/10 rounded-lg">
                    <div className="text-3xl font-bold text-gold-kings">
                      {playerProfile.stats.mvpCount}
                    </div>
                    <div className="text-sm text-gray-400">
                      MVPs
                    </div>
                  </div>
                  <div className="text-center p-4 bg-red-kings/10 rounded-lg">
                    <div className="text-3xl font-bold text-red-kings">
                      {playerProfile.stats.points}
                    </div>
                    <div className="text-sm text-gray-400">
                      Puntos Fantasy
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Panel del Equipo */}
            {playerProfile.team && (
              <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                  <Users className="h-6 w-6 text-blue-kings" />
                  <span>Mi Equipo</span>
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">
                      Equipo
                    </div>
                    <div className="text-xl font-bold">{playerProfile.team.name}</div>
                    <div className="text-sm text-gray-400">
                      Presidente: {playerProfile.team.owner.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">
                      Mi Posición en el Equipo
                    </div>
                    <div className="text-3xl font-bold text-gold-kings">
                      #{playerProfile.playerPosition}
                    </div>
                    <div className="text-sm text-gray-400">
                      de {playerProfile.team.players.length} jugadores
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">
                      Dinero Invertido en Mí
                    </div>
                    <div className="text-2xl font-bold text-gold-kings">
                      {playerProfile.totalInvested.toFixed(0)} €K
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Próximos Partidos */}
          {playerProfile.upcomingMatches.length > 0 && (
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-blue-kings" />
                <span>Próximos Partidos</span>
              </h2>
              <div className="space-y-4">
                {playerProfile.upcomingMatches.map((match) => {
                  const isHome = match.homeTeamId === playerProfile.team?.id;
                  const opponent = isHome ? match.awayTeam : match.homeTeam;
                  return (
                    <div
                      key={match.id}
                      className="border border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-lg">
                            {isHome ? "vs" : "@"} {opponent.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {new Date(match.matchDate).toLocaleDateString("es-ES", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">
                            {isHome ? "Local" : "Visitante"}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

