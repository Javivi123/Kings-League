import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Calendar, Clock, Trophy, Target, Users, TrendingUp, AlertTriangle, ArrowUpDown } from "lucide-react";
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
        return <Target className="h-5 w-5 text-green-500" />;
      case "yellow_card":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "red_card":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "substitution":
        return <ArrowUpDown className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white-kings via-white-off to-gray-100 dark:from-black-dark dark:via-gray-900 dark:to-black-kings py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header del Partido */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${getStatusColor(
                    match.status
                  )}`}
                >
                  {getStatusText(match.status)}
                </span>
                <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(match.matchDate), "EEEE d 'de' MMMM yyyy", {
                      locale: es,
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>
                    {format(new Date(match.matchDate), "HH:mm", { locale: es })}
                  </span>
                </div>
              </div>
            </div>

            {/* Scoreboard */}
            <div className="grid grid-cols-3 gap-8 items-center mb-8">
              <div className="text-center">
                <Link
                  href={`/teams/${match.homeTeam.id}`}
                  className="flex flex-col items-center hover:opacity-80 transition-opacity"
                >
                  {match.homeTeam.logo ? (
                    <img
                      src={match.homeTeam.logo}
                      alt={match.homeTeam.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-kings mb-4"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-blue-kings flex items-center justify-center text-white text-4xl font-bold mb-4">
                      {match.homeTeam.name.charAt(0)}
                    </div>
                  )}
                  <h2 className="text-2xl font-bold">{match.homeTeam.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {match.homeTeam.owner.name}
                  </p>
                </Link>
              </div>

              <div className="text-center">
                {match.status === "finished" &&
                match.homeScore !== null &&
                match.awayScore !== null ? (
                  <div className="text-6xl font-bold">
                    {match.homeScore} - {match.awayScore}
                  </div>
                ) : match.status === "live" ? (
                  <div className="text-5xl font-bold text-red-500 animate-pulse">
                    {match.homeScore ?? 0} - {match.awayScore ?? 0}
                  </div>
                ) : (
                  <div className="text-4xl font-bold text-gray-400">VS</div>
                )}
              </div>

              <div className="text-center">
                <Link
                  href={`/teams/${match.awayTeam.id}`}
                  className="flex flex-col items-center hover:opacity-80 transition-opacity"
                >
                  {match.awayTeam.logo ? (
                    <img
                      src={match.awayTeam.logo}
                      alt={match.awayTeam.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-red-kings mb-4"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-red-kings flex items-center justify-center text-white text-4xl font-bold mb-4">
                      {match.awayTeam.name.charAt(0)}
                    </div>
                  )}
                  <h2 className="text-2xl font-bold">{match.awayTeam.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {match.awayTeam.owner.name}
                  </p>
                </Link>
              </div>
            </div>

            {/* Goles */}
            {goals.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <Target className="h-6 w-6 text-green-500" />
                  <span>Goles</span>
                </h3>
                <div className="space-y-2">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-lg p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-green-500">
                          {goal.minute}'
                        </span>
                        <Link
                          href={`/players/${goal.playerId}`}
                          className="font-semibold hover:text-blue-kings"
                        >
                          {goal.player?.name || "Jugador desconocido"}
                        </Link>
                        {goal.description && (
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            ({goal.description})
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {goal.team.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Eventos del Partido */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tarjetas */}
              {(yellowCards.length > 0 || redCards.length > 0) && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <AlertTriangle className="h-6 w-6 text-yellow-500" />
                    <span>Tarjetas</span>
                  </h3>
                  <div className="space-y-2">
                    {yellowCards.map((card) => (
                      <div
                        key={card.id}
                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-lg p-3"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-yellow-500">
                            {card.minute}'
                          </span>
                          <span className="px-2 py-1 bg-yellow-500 text-white rounded text-sm font-semibold">
                            Amarilla
                          </span>
                          <Link
                            href={`/players/${card.playerId}`}
                            className="font-semibold hover:text-blue-kings"
                          >
                            {card.player?.name || "Jugador desconocido"}
                          </Link>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {card.team.name}
                        </span>
                      </div>
                    ))}
                    {redCards.map((card) => (
                      <div
                        key={card.id}
                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-lg p-3"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-red-500">
                            {card.minute}'
                          </span>
                          <span className="px-2 py-1 bg-red-500 text-white rounded text-sm font-semibold">
                            Roja
                          </span>
                          <Link
                            href={`/players/${card.playerId}`}
                            className="font-semibold hover:text-blue-kings"
                          >
                            {card.player?.name || "Jugador desconocido"}
                          </Link>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {card.team.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sustituciones */}
              {substitutions.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <ArrowUpDown className="h-6 w-6 text-blue-500" />
                    <span>Sustituciones</span>
                  </h3>
                  <div className="space-y-2">
                    {substitutions.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-lg p-3"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-blue-500">
                            {sub.minute}'
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-red-500 line-through">
                              {sub.playerOut?.name || "Jugador"}
                            </span>
                            <span className="text-gray-400">→</span>
                            <Link
                              href={`/players/${sub.playerId}`}
                              className="font-semibold text-green-500 hover:text-green-600"
                            >
                              {sub.player?.name || "Jugador desconocido"}
                            </Link>
                          </div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {sub.team.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Alineaciones */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-6">Alineaciones</h3>
                <div className="grid grid-cols-2 gap-6">
                  {/* Equipo Local */}
                  <div>
                    <h4 className="font-bold text-lg mb-4 text-blue-kings">
                      {match.homeTeam.name}
                    </h4>
                    <div className="space-y-2">
                      {homeStarters.map((lineup) => (
                        <div
                          key={lineup.id}
                          className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-lg p-2"
                        >
                          <div className="flex items-center space-x-2">
                            {lineup.shirtNumber && (
                              <span className="font-bold w-8 text-center">
                                {lineup.shirtNumber}
                              </span>
                            )}
                            <Link
                              href={`/players/${lineup.playerId}`}
                              className="font-semibold hover:text-blue-kings text-sm"
                            >
                              {lineup.player.name}
                            </Link>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {lineup.position}
                          </span>
                        </div>
                      ))}
                    </div>
                    {homeBench.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-semibold text-sm mb-2 text-gray-600 dark:text-gray-400">
                          Banquillo
                        </h5>
                        <div className="space-y-1">
                          {homeBench.map((lineup) => (
                            <div
                              key={lineup.id}
                              className="flex items-center justify-between text-sm"
                            >
                              <Link
                                href={`/players/${lineup.playerId}`}
                                className="hover:text-blue-kings"
                              >
                                {lineup.shirtNumber && (
                                  <span className="font-bold mr-2">
                                    {lineup.shirtNumber}
                                  </span>
                                )}
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
                    <h4 className="font-bold text-lg mb-4 text-red-kings">
                      {match.awayTeam.name}
                    </h4>
                    <div className="space-y-2">
                      {awayStarters.map((lineup) => (
                        <div
                          key={lineup.id}
                          className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-lg p-2"
                        >
                          <div className="flex items-center space-x-2">
                            {lineup.shirtNumber && (
                              <span className="font-bold w-8 text-center">
                                {lineup.shirtNumber}
                              </span>
                            )}
                            <Link
                              href={`/players/${lineup.playerId}`}
                              className="font-semibold hover:text-red-kings text-sm"
                            >
                              {lineup.player.name}
                            </Link>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {lineup.position}
                          </span>
                        </div>
                      ))}
                    </div>
                    {awayBench.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-semibold text-sm mb-2 text-gray-600 dark:text-gray-400">
                          Banquillo
                        </h5>
                        <div className="space-y-1">
                          {awayBench.map((lineup) => (
                            <div
                              key={lineup.id}
                              className="flex items-center justify-between text-sm"
                            >
                              <Link
                                href={`/players/${lineup.playerId}`}
                                className="hover:text-red-kings"
                              >
                                {lineup.shirtNumber && (
                                  <span className="font-bold mr-2">
                                    {lineup.shirtNumber}
                                  </span>
                                )}
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

            {/* Estadísticas */}
            {match.stats && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-blue-kings" />
                  <span>Estadísticas</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold">{match.stats.homePossession}%</span>
                      <span className="text-gray-600 dark:text-gray-400">Posesión</span>
                      <span className="font-semibold">{match.stats.awayPossession}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-kings h-2 rounded-full"
                        style={{ width: `${match.stats.homePossession}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold">{match.stats.homeShots}</span>
                      <span className="text-gray-600 dark:text-gray-400">Tiros</span>
                      <span className="font-semibold">{match.stats.awayShots}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold">{match.stats.homeShotsOnTarget}</span>
                      <span className="text-gray-600 dark:text-gray-400">Tiros a puerta</span>
                      <span className="font-semibold">{match.stats.awayShotsOnTarget}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold">{match.stats.homePasses}</span>
                      <span className="text-gray-600 dark:text-gray-400">Pases</span>
                      <span className="font-semibold">{match.stats.awayPasses}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold">
                        {match.stats.homePassAccuracy?.toFixed(0)}%
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">Precisión de pases</span>
                      <span className="font-semibold">
                        {match.stats.awayPassAccuracy?.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold">{match.stats.homeFouls}</span>
                      <span className="text-gray-600 dark:text-gray-400">Faltas</span>
                      <span className="font-semibold">{match.stats.awayFouls}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold">{match.stats.homeCorners}</span>
                      <span className="text-gray-600 dark:text-gray-400">Saques de esquina</span>
                      <span className="font-semibold">{match.stats.awayCorners}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold">{match.stats.homeOffsides}</span>
                      <span className="text-gray-600 dark:text-gray-400">Fueras de juego</span>
                      <span className="font-semibold">{match.stats.awayOffsides}</span>
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

