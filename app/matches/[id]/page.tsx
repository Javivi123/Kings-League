import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Calendar, Clock, Trophy, Target, Users, TrendingUp, AlertTriangle, ArrowUpDown, MapPin, Award } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

async function getMatch(id: string) {
  try {
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: {
          include: {
            owner: true,
          },
        },
        awayTeam: {
          include: {
            owner: true,
          },
        },
        events: {
          include: {
            player: true,
            playerOut: true,
            team: true,
          },
          orderBy: {
            minute: "asc",
          },
        },
        lineups: {
          include: {
            player: {
              include: {
                stats: true,
              },
            },
            team: true,
          },
        },
        stats: true,
      },
    });
    return match;
  } catch (error) {
    console.error("Error fetching match:", error);
    return null;
  }
}

export default async function MatchDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const match = await getMatch(id);

  if (!match) {
    notFound();
  }

  // Separar eventos por tipo
  const goals = match.events.filter((e) => e.type === "goal");
  const yellowCards = match.events.filter((e) => e.type === "yellow_card");
  const redCards = match.events.filter((e) => e.type === "red_card");
  const substitutions = match.events.filter((e) => e.type === "substitution");

  // Separar alineaciones por equipo
  const homeLineup = match.lineups.filter(
    (l) => l.teamId === match.homeTeamId
  );
  const awayLineup = match.lineups.filter(
    (l) => l.teamId === match.awayTeamId
  );

  const homeStarters = homeLineup.filter((l) => l.isStarter).sort((a, b) => {
    const order = ["GK", "DEF", "MID", "FWD"];
    return order.indexOf(a.position) - order.indexOf(b.position);
  });
  const homeBench = homeLineup.filter((l) => !l.isStarter);
  const awayStarters = awayLineup.filter((l) => l.isStarter).sort((a, b) => {
    const order = ["GK", "DEF", "MID", "FWD"];
    return order.indexOf(a.position) - order.indexOf(b.position);
  });
  const awayBench = awayLineup.filter((l) => !l.isStarter);

  // Crear timeline de eventos combinado
  const allEvents = [...match.events].sort((a, b) => a.minute - b.minute);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500";
      case "live":
        return "bg-red-500 animate-pulse";
      case "finished":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Programado";
      case "live":
        return "En Vivo";
      case "finished":
        return "Finalizado";
      default:
        return status;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "goal":
        return "⚽";
      case "yellow_card":
        return "🟨";
      case "red_card":
        return "🟥";
      case "substitution":
        return "🔄";
      default:
        return "•";
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "goal":
        return "text-green-600 dark:text-green-400";
      case "yellow_card":
        return "text-yellow-600 dark:text-yellow-400";
      case "red_card":
        return "text-red-600 dark:text-red-400";
      case "substitution":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  // Agrupar goles por equipo
  const homeGoals = goals.filter(g => g.teamId === match.homeTeamId);
  const awayGoals = goals.filter(g => g.teamId === match.awayTeamId);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Principal - Estilo Google */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="p-6">
              {/* Fecha y Estado */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(match.matchDate), "EEEE, d 'de' MMMM yyyy", { locale: es })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(new Date(match.matchDate), "HH:mm", { locale: es })}h
                    </span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(
                    match.status
                  )}`}
                >
                  {getStatusText(match.status)}
                </span>
              </div>

              {/* Marcador Principal */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1 text-center">
                  <Link
                    href={`/teams/${match.homeTeam.id}`}
                    className="block hover:opacity-80 transition-opacity"
                  >
                    <div className="flex flex-col items-center">
                      {match.homeTeam.logo ? (
                        <img
                          src={match.homeTeam.logo}
                          alt={match.homeTeam.name}
                          className="w-16 h-16 rounded-full object-cover mb-2"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-2">
                          {match.homeTeam.name.charAt(0)}
                        </div>
                      )}
                      <h3 className="text-lg font-semibold">{match.homeTeam.name}</h3>
                    </div>
                  </Link>
                </div>

                <div className="px-8">
                  {match.status === "finished" &&
                  match.homeScore !== null &&
                  match.awayScore !== null ? (
                    <div className="text-5xl font-bold">
                      {match.homeScore} - {match.awayScore}
                    </div>
                  ) : match.status === "live" ? (
                    <div className="text-4xl font-bold text-red-500 animate-pulse">
                      {match.homeScore ?? 0} - {match.awayScore ?? 0}
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-gray-400">VS</div>
                  )}
                </div>

                <div className="flex-1 text-center">
                  <Link
                    href={`/teams/${match.awayTeam.id}`}
                    className="block hover:opacity-80 transition-opacity"
                  >
                    <div className="flex flex-col items-center">
                      {match.awayTeam.logo ? (
                        <img
                          src={match.awayTeam.logo}
                          alt={match.awayTeam.name}
                          className="w-16 h-16 rounded-full object-cover mb-2"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white text-2xl font-bold mb-2">
                          {match.awayTeam.name.charAt(0)}
                        </div>
                      )}
                      <h3 className="text-lg font-semibold">{match.awayTeam.name}</h3>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna Principal - Timeline y Eventos */}
            <div className="lg:col-span-2 space-y-6">
              {/* Timeline de Eventos - Estilo Google */}
              {allEvents.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Resumen del Partido</span>
                  </h2>
                  <div className="space-y-3">
                    {allEvents.map((event) => {
                      const isHome = event.teamId === match.homeTeamId;
                      return (
                        <div
                          key={event.id}
                          className={`flex items-center space-x-3 p-3 rounded-lg ${
                            isHome
                              ? "bg-blue-50 dark:bg-blue-900/20"
                              : "bg-red-50 dark:bg-red-900/20"
                          }`}
                        >
                          <div className="flex-shrink-0 w-12 text-center">
                            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                              {event.minute}'
                            </span>
                          </div>
                          <div className={`text-2xl ${getEventColor(event.type)}`}>
                            {getEventIcon(event.type)}
                          </div>
                          <div className="flex-1">
                            {event.type === "goal" && (
                              <div>
                                <Link
                                  href={`/players/${event.playerId}`}
                                  className="font-semibold hover:underline"
                                >
                                  {event.player?.name || "Jugador desconocido"}
                                </Link>
                                {event.description && (
                                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                                    ({event.description})
                                  </span>
                                )}
                              </div>
                            )}
                            {event.type === "yellow_card" && (
                              <div>
                                <span className="inline-block px-2 py-1 bg-yellow-500 text-white rounded text-xs font-semibold mr-2">
                                  Amarilla
                                </span>
                                <Link
                                  href={`/players/${event.playerId}`}
                                  className="font-semibold hover:underline"
                                >
                                  {event.player?.name || "Jugador desconocido"}
                                </Link>
                              </div>
                            )}
                            {event.type === "red_card" && (
                              <div>
                                <span className="inline-block px-2 py-1 bg-red-500 text-white rounded text-xs font-semibold mr-2">
                                  Roja
                                </span>
                                <Link
                                  href={`/players/${event.playerId}`}
                                  className="font-semibold hover:underline"
                                >
                                  {event.player?.name || "Jugador desconocido"}
                                </Link>
                              </div>
                            )}
                            {event.type === "substitution" && (
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-500 line-through text-sm">
                                  {event.playerOut?.name || "Jugador"}
                                </span>
                                <span className="text-gray-400">→</span>
                                <Link
                                  href={`/players/${event.playerId}`}
                                  className="font-semibold hover:underline"
                                >
                                  {event.player?.name || "Jugador desconocido"}
                                </Link>
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {event.team.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Alineaciones - Estilo Google */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Alineaciones</span>
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  {/* Equipo Local */}
                  <div>
                    <h3 className="font-bold text-lg mb-4 text-blue-600 dark:text-blue-400">
                      {match.homeTeam.name}
                    </h3>
                    <div className="space-y-2 mb-4">
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                        TITULARES
                      </div>
                      {homeStarters.length > 0 ? (
                        homeStarters.map((lineup) => (
                          <div
                            key={lineup.id}
                            className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-900 rounded"
                          >
                            <div className="flex items-center space-x-3">
                              {lineup.shirtNumber && (
                                <span className="font-bold text-gray-600 dark:text-gray-400 w-6 text-center">
                                  {lineup.shirtNumber}
                                </span>
                              )}
                              <Link
                                href={`/players/${lineup.playerId}`}
                                className="font-medium hover:underline text-sm"
                              >
                                {lineup.player.name}
                              </Link>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {lineup.position}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          No hay alineación disponible
                        </p>
                      )}
                    </div>
                    {homeBench.length > 0 && (
                      <div className="mt-4">
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                          BANQUILLO
                        </div>
                        <div className="space-y-1">
                          {homeBench.map((lineup) => (
                            <div
                              key={lineup.id}
                              className="flex items-center space-x-2 text-sm py-1"
                            >
                              {lineup.shirtNumber && (
                                <span className="font-bold text-gray-500 dark:text-gray-400 w-6 text-center">
                                  {lineup.shirtNumber}
                                </span>
                              )}
                              <Link
                                href={`/players/${lineup.playerId}`}
                                className="hover:underline text-gray-700 dark:text-gray-300"
                              >
                                {lineup.player.name}
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Equipo Visitante */}
                  <div>
                    <h3 className="font-bold text-lg mb-4 text-red-600 dark:text-red-400">
                      {match.awayTeam.name}
                    </h3>
                    <div className="space-y-2 mb-4">
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                        TITULARES
                      </div>
                      {awayStarters.length > 0 ? (
                        awayStarters.map((lineup) => (
                          <div
                            key={lineup.id}
                            className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-900 rounded"
                          >
                            <div className="flex items-center space-x-3">
                              {lineup.shirtNumber && (
                                <span className="font-bold text-gray-600 dark:text-gray-400 w-6 text-center">
                                  {lineup.shirtNumber}
                                </span>
                              )}
                              <Link
                                href={`/players/${lineup.playerId}`}
                                className="font-medium hover:underline text-sm"
                              >
                                {lineup.player.name}
                              </Link>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {lineup.position}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          No hay alineación disponible
                        </p>
                      )}
                    </div>
                    {awayBench.length > 0 && (
                      <div className="mt-4">
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                          BANQUILLO
                        </div>
                        <div className="space-y-1">
                          {awayBench.map((lineup) => (
                            <div
                              key={lineup.id}
                              className="flex items-center space-x-2 text-sm py-1"
                            >
                              {lineup.shirtNumber && (
                                <span className="font-bold text-gray-500 dark:text-gray-400 w-6 text-center">
                                  {lineup.shirtNumber}
                                </span>
                              )}
                              <Link
                                href={`/players/${lineup.playerId}`}
                                className="hover:underline text-gray-700 dark:text-gray-300"
                              >
                                {lineup.player.name}
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Lateral - Estadísticas */}
            {match.stats && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Estadísticas</span>
                  </h2>
                  <div className="space-y-5">
                    {/* Posesión */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold">{match.stats.homePossession}%</span>
                        <span className="text-gray-600 dark:text-gray-400">Posesión</span>
                        <span className="font-semibold">{match.stats.awayPossession}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-blue-500 h-3 rounded-full transition-all"
                          style={{ width: `${match.stats.homePossession}%` }}
                        />
                      </div>
                    </div>

                    {/* Tiros */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold">{match.stats.homeShots}</span>
                        <span className="text-gray-600 dark:text-gray-400">Tiros</span>
                        <span className="font-semibold">{match.stats.awayShots}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (match.stats.homeShots! /
                                (match.stats.homeShots! + match.stats.awayShots!)) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Tiros a puerta */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold">{match.stats.homeShotsOnTarget}</span>
                        <span className="text-gray-600 dark:text-gray-400">Tiros a puerta</span>
                        <span className="font-semibold">{match.stats.awayShotsOnTarget}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (match.stats.homeShotsOnTarget! /
                                (match.stats.homeShotsOnTarget! + match.stats.awayShotsOnTarget!)) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Pases */}
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">{match.stats.homePasses}</span>
                        <span className="text-gray-600 dark:text-gray-400">Pases</span>
                        <span className="font-semibold">{match.stats.awayPasses}</span>
                      </div>
                    </div>

                    {/* Precisión de pases */}
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">
                          {match.stats.homePassAccuracy?.toFixed(0)}%
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">Precisión de pases</span>
                        <span className="font-semibold">
                          {match.stats.awayPassAccuracy?.toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    {/* Faltas */}
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">{match.stats.homeFouls}</span>
                        <span className="text-gray-600 dark:text-gray-400">Faltas</span>
                        <span className="font-semibold">{match.stats.awayFouls}</span>
                      </div>
                    </div>

                    {/* Saques de esquina */}
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">{match.stats.homeCorners}</span>
                        <span className="text-gray-600 dark:text-gray-400">Saques de esquina</span>
                        <span className="font-semibold">{match.stats.awayCorners}</span>
                      </div>
                    </div>

                    {/* Fueras de juego */}
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">{match.stats.homeOffsides}</span>
                        <span className="text-gray-600 dark:text-gray-400">Fueras de juego</span>
                        <span className="font-semibold">{match.stats.awayOffsides}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
