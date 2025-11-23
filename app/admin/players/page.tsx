import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Users, Plus, Trophy, Target } from "lucide-react";
import Link from "next/link";

async function getPlayers() {
  return await prisma.player.findMany({
    include: {
      team: true,
      stats: true,
      user: true,
    },
    orderBy: {
      marketValue: "desc",
    },
  });
}

export default async function AdminPlayersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const players = await getPlayers();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white-kings via-white-off to-gray-100 dark:from-black-dark dark:via-gray-900 dark:to-black-kings py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-kings" />
              <h1 className="text-4xl font-bold">Gestión de Jugadores</h1>
            </div>
            <Link
              href="/admin/create-player"
              className="px-6 py-3 bg-blue-kings text-white rounded-lg hover:bg-blue-dark transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Crear Jugador</span>
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black-kings text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Jugador</th>
                    <th className="px-6 py-4 text-left">Posición</th>
                    <th className="px-6 py-4 text-left">Equipo</th>
                    <th className="px-6 py-4 text-left">Goles</th>
                    <th className="px-6 py-4 text-left">Asistencias</th>
                    <th className="px-6 py-4 text-left">Puntos</th>
                    <th className="px-6 py-4 text-left">Valor</th>
                    <th className="px-6 py-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index) => (
                    <tr
                      key={player.id}
                      className={`border-b border-gray-700 ${
                        index % 2 === 0
                          ? "bg-gray-800"
                          : "bg-gray-900"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {player.photo ? (
                            <img
                              src={player.photo}
                              alt={player.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-kings flex items-center justify-center text-white font-bold">
                              {player.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold">{player.name}</div>
                            {player.user && (
                              <div className="text-sm text-gray-500">
                                {player.user.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
                          {player.position}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {player.team ? (
                          <Link
                            href={`/teams/${player.team.id}`}
                            className="text-blue-kings hover:text-blue-dark font-semibold"
                          >
                            {player.team.name}
                          </Link>
                        ) : (
                          <span className="text-gray-400">Sin equipo</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <Target className="h-4 w-4 text-green-500" />
                          <span className="font-semibold">
                            {player.stats?.goals || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span className="font-semibold">
                            {player.stats?.assists || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <Trophy className="h-4 w-4 text-gold-kings" />
                          <span className="font-semibold text-gold-kings">
                            {player.stats?.points || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gold-kings">
                          {player.marketValue.toFixed(0)} €K
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          href={`/players/${player.id}`}
                          className="text-blue-kings hover:text-blue-dark font-medium"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {players.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg mt-6">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No hay jugadores registrados
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

