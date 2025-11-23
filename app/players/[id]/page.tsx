import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Trophy, Target, TrendingUp, Users, Euro } from "lucide-react";
import Link from "next/link";

async function getPlayer(id: string) {
  const player = await prisma.player.findUnique({
    where: { id },
    include: {
      team: {
        include: {
          owner: true,
        },
      },
      stats: true,
      investments: {
        include: {
          team: true,
        },
        orderBy: {
          amount: "desc",
        },
      },
    },
  });

  if (!player) return null;

  // Calcular total invertido
  const totalInvested = player.investments.reduce(
    (sum, inv) => sum + inv.amount,
    0
  );

  return { ...player, totalInvested };
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const player = await getPlayer(id);

  if (!player) {
    notFound();
  }

  const getPositionColor = (position: string) => {
    switch (position) {
      case "GK":
        return "bg-blue-kings";
      case "DEF":
        return "bg-green-500";
      case "MID":
        return "bg-yellow-500";
      case "FWD":
        return "bg-red-kings";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-black-dark via-gray-900 to-black-kings py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {player.photo ? (
                <img
                  src={player.photo}
                  alt={player.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gold-kings"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-kings flex items-center justify-center text-white text-5xl font-bold border-4 border-gold-kings">
                  {player.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">{player.name}</h1>
                <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                  <span
                    className={`px-4 py-2 rounded-full text-white font-semibold ${getPositionColor(
                      player.position
                    )}`}
                  >
                    {player.position}
                  </span>
                  {player.age && (
                    <span className="text-gray-400">
                      {player.age} años
                    </span>
                  )}
                </div>
                {player.team && (
                  <Link
                    href={`/teams/${player.team.id}`}
                    className="text-blue-kings hover:text-blue-dark font-semibold"
                  >
                    <Users className="inline h-4 w-4 mr-1" />
                    {player.team.name}
                  </Link>
                )}
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">
                  Valor de Mercado
                </div>
                <div className="text-3xl font-bold text-gold-kings">
                  {player.marketValue.toFixed(0)} €K
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Estadísticas */}
            {player.stats && (
              <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                  <Trophy className="h-6 w-6 text-gold-kings" />
                  <span>Estadísticas</span>
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-kings/10 rounded-lg">
                    <div className="text-3xl font-bold text-blue-kings">
                      {player.stats.goals}
                    </div>
                    <div className="text-sm text-gray-400">
                      Goles
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-lg">
                    <div className="text-3xl font-bold text-green-500">
                      {player.stats.assists}
                    </div>
                    <div className="text-sm text-gray-400">
                      Asistencias
                    </div>
                  </div>
                  <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-500">
                      {player.stats.matches}
                    </div>
                    <div className="text-sm text-gray-400">
                      Partidos
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gold-kings/10 rounded-lg">
                    <div className="text-3xl font-bold text-gold-kings">
                      {player.stats.mvpCount}
                    </div>
                    <div className="text-sm text-gray-400">
                      MVPs
                    </div>
                  </div>
                  <div className="text-center p-4 bg-red-kings/10 rounded-lg">
                    <div className="text-3xl font-bold text-red-kings">
                      {player.stats.points}
                    </div>
                    <div className="text-sm text-gray-400">
                      Puntos Fantasy
                    </div>
                  </div>
                  <div className="text-center p-4 bg-orange-500/10 rounded-lg">
                    <div className="text-3xl font-bold text-orange-500">
                      {player.stats.yellowCards + player.stats.redCards}
                    </div>
                    <div className="text-sm text-gray-400">
                      Tarjetas
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Inversiones */}
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-blue-kings" />
                <span>Inversiones</span>
              </h2>
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-1">
                  Total Invertido
                </div>
                <div className="text-3xl font-bold text-gold-kings">
                  {player.totalInvested.toFixed(0)} €K
                </div>
              </div>
              {player.investments.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-300 mb-2">
                    Inversiones por equipo:
                  </div>
                  {player.investments.slice(0, 5).map((inv) => (
                    <div
                      key={inv.id}
                      className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                    >
                      <span className="font-medium">{inv.team.name}</span>
                      <span className="text-gold-kings font-bold">
                        {inv.amount.toFixed(0)} €K
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Estado */}
          <div className="mt-6 bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">
                  Estado
                </div>
                <div className="flex items-center space-x-2">
                  {player.team ? (
                    <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full font-semibold">
                      Contratado
                    </span>
                  ) : (
                    <span className="px-4 py-2 bg-gray-500/20 text-gray-400 rounded-full font-semibold">
                      Disponible
                    </span>
                  )}
                  {player.isOnMarket && (
                    <span className="px-4 py-2 bg-blue-kings/20 text-blue-kings rounded-full font-semibold">
                      En Mercado
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">
                  Precio Actual
                </div>
                <div className="text-2xl font-bold text-gold-kings">
                  {player.price.toFixed(0)} €K
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

