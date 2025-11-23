import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Users, Euro, TrendingUp, Calendar, ShoppingCart, Crown } from "lucide-react";
import Link from "next/link";

async function getTeam(userId: string) {
  const team = await prisma.team.findFirst({
    where: { ownerId: userId },
    include: {
      owner: true, // Incluir el owner para evitar el error
      players: {
        include: {
          stats: true,
        },
        orderBy: {
          marketValue: "desc",
        },
      },
      matchesHome: {
        where: { status: "scheduled" },
        include: { awayTeam: true },
        orderBy: { matchDate: "asc" },
        take: 3,
      },
      matchesAway: {
        where: { status: "scheduled" },
        include: { homeTeam: true },
        orderBy: { matchDate: "asc" },
        take: 3,
      },
      wildcards: {
        where: { used: false },
      },
    },
  });

  if (!team) return null;

  // Calcular estadísticas del equipo
  const totalGoals = team.players.reduce(
    (sum, p) => sum + (p.stats?.goals || 0),
    0
  );
  const totalAssists = team.players.reduce(
    (sum, p) => sum + (p.stats?.assists || 0),
    0
  );
  const totalValue = team.players.reduce(
    (sum, p) => sum + p.marketValue,
    0
  );

  // Combinar próximos partidos
  const upcomingMatches = [
    ...team.matchesHome.map((m) => ({ ...m, isHome: true })),
    ...team.matchesAway.map((m) => ({ ...m, isHome: false })),
  ]
    .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime())
    .slice(0, 3);

  return {
    ...team,
    totalGoals,
    totalAssists,
    totalValue,
    upcomingMatches,
  };
}

export default async function MyTeamPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "presidente") {
    redirect("/");
  }

  const team = await getTeam(session.user.id);

  if (!team) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-black-dark via-gray-900 to-black-kings py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Crown className="h-16 w-16 text-gold-kings mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">No tienes un equipo registrado</h2>
            <p className="text-gray-400 mb-6">
              Contacta con un administrador para registrar tu equipo.
            </p>
            <Link
              href="/admin/register-team"
              className="inline-block px-6 py-3 bg-blue-kings text-white rounded-lg hover:bg-blue-dark transition-colors"
            >
              Solicitar Registro de Equipo
            </Link>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header del Equipo */}
          <div className="bg-gradient-to-r from-blue-kings to-blue-dark rounded-2xl shadow-lg p-8 mb-6 text-white">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {team.logo ? (
                <img
                  src={team.logo}
                  alt={team.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center text-white text-5xl font-bold border-4 border-white">
                  {team.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">{team.name}</h1>
                <p className="text-lg opacity-90">Equipo de {team.owner?.name || "Sin propietario"}</p>
              </div>
              <div className="text-center">
                <div className="text-sm opacity-90 mb-1">Euros Kings</div>
                <div className="text-4xl font-bold text-gold-kings">
                  {team.eurosKings.toFixed(0)} €K
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas del Equipo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-kings">{team.points}</div>
              <div className="text-sm text-gray-300">Puntos</div>
            </div>
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-500">{team.wins}</div>
              <div className="text-sm text-gray-300">Victorias</div>
            </div>
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-gold-kings">{team.totalGoals}</div>
              <div className="text-sm text-gray-300">Goles</div>
            </div>
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-500">{team.players.length}</div>
              <div className="text-sm text-gray-300">Jugadores</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Jugadores */}
            <div className="lg:col-span-2 bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                  <Users className="h-6 w-6 text-blue-kings" />
                  <span>Jugadores ({team.players.length})</span>
                </h2>
                <Link
                  href="/transfers"
                  className="px-4 py-2 bg-blue-kings text-white rounded-lg hover:bg-blue-dark transition-colors text-sm"
                >
                  <ShoppingCart className="inline h-4 w-4 mr-1" />
                  Mercado
                </Link>
              </div>
              <div className="space-y-3">
                {team.players.map((player) => (
                  <Link
                    key={player.id}
                    href={`/players/${player.id}`}
                    className="flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      {player.photo ? (
                        <img
                          src={player.photo}
                          alt={player.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-kings flex items-center justify-center text-white font-bold">
                          {player.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold">{player.name}</div>
                        <div className="text-sm text-gray-400">
                          {player.position}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gold-kings">
                        {player.marketValue.toFixed(0)} €K
                      </div>
                      {player.stats && (
                        <div className="text-xs text-gray-500">
                          {player.stats.goals}G {player.stats.assists}A
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
                {team.players.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No tienes jugadores aún
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Próximos Partidos */}
              {team.upcomingMatches.length > 0 && (
                <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                    <Calendar className="h-6 w-6 text-blue-kings" />
                    <span>Próximos Partidos</span>
                  </h2>
                  <div className="space-y-3">
                    {team.upcomingMatches.map((match: any) => {
                      const opponent = match.isHome ? match.awayTeam : match.homeTeam;
                      return (
                        <div
                          key={match.id}
                          className="border border-gray-700 rounded-lg p-3"
                        >
                          <div className="font-semibold text-sm">
                            {match.isHome ? "vs" : "@"} {opponent.name}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(match.matchDate).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cartas Comodín */}
              <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                  <Crown className="h-6 w-6 text-gold-kings" />
                  <span>Cartas Comodín</span>
                </h2>
                <div className="space-y-2 mb-4">
                  {team.wildcards.map((card) => (
                    <div
                      key={card.id}
                      className="p-3 bg-gold-kings/10 rounded-lg border border-gold-kings/20"
                    >
                      <div className="font-semibold">{card.name}</div>
                      <div className="text-sm text-gray-400">
                        {card.description}
                      </div>
                    </div>
                  ))}
                  {team.wildcards.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No tienes cartas comodín
                    </p>
                  )}
                </div>
                <Link
                  href="/wildcards/request"
                  className="block w-full text-center px-4 py-2 bg-gold-kings text-white rounded-lg hover:bg-gold-dark transition-colors text-sm"
                >
                  Solicitar Carta
                </Link>
              </div>

              {/* Acciones Rápidas */}
              <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Acciones</h2>
                <div className="space-y-2">
                  <Link
                    href="/transfers"
                    className="block w-full px-4 py-2 bg-blue-kings text-white rounded-lg hover:bg-blue-dark transition-colors text-center"
                  >
                    Mercado de Transferencias
                  </Link>
                  <Link
                    href="/wallet"
                    className="block w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-center"
                  >
                    <Euro className="inline h-4 w-4 mr-1" />
                    Gestión de Dinero
                  </Link>
                  <Link
                    href="/agenda"
                    className="block w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-center"
                  >
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Agenda
                  </Link>
                  <Link
                    href="/my-team/customize"
                    className="block w-full px-4 py-2 bg-gold-kings text-white rounded-lg hover:bg-gold-dark transition-colors text-center"
                  >
                    Personalizar Equipo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

