import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Trophy, Users } from "lucide-react";

async function getTeams() {
  return await prisma.team.findMany({
    include: {
      owner: true,
      players: {
        include: {
          stats: true,
        },
      },
    },
    orderBy: {
      points: "desc",
    },
  });
}

export default async function TeamsPage() {
  const teams = await getTeams();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-black-dark via-gray-900 to-black-kings py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-8">
            <Users className="h-8 w-8 text-blue-kings" />
            <h1 className="text-4xl font-bold">Equipos</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Link
                key={team.id}
                href={`/teams/${team.id}`}
                className="bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center space-x-4 mb-4">
                  {team.logo ? (
                    <img
                      src={team.logo}
                      alt={team.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-kings flex items-center justify-center text-white text-2xl font-bold">
                      {team.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{team.name}</h2>
                    <p className="text-gray-400">
                      {team.owner.name}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-sm text-gray-400">
                      Puntos
                    </div>
                    <div className="text-2xl font-bold text-gold-kings">
                      {team.points}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">
                      Jugadores
                    </div>
                    <div className="text-2xl font-bold">{team.players.length}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    {team.wins}W - {team.draws}E - {team.losses}L
                  </span>
                  <span className="text-gold-kings font-semibold">
                    {team.eurosKings.toFixed(0)} €K
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {teams.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                No hay equipos registrados aún
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

