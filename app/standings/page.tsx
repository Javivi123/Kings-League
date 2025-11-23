import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { Trophy, Medal } from "lucide-react";

async function getStandings() {
  return await prisma.team.findMany({
    include: {
      owner: true,
    },
    orderBy: [
      { points: "desc" },
      { goalsFor: "desc" },
    ],
  });
}

export default async function StandingsPage() {
  const teams = await getStandings();

  const getPositionColor = (position: number) => {
    if (position === 1) return "bg-gold-kings text-white";
    if (position === 2) return "bg-gray-300 text-gray-800";
    if (position === 3) return "bg-orange-400 text-white";
    return "bg-gray-800";
  };

  const getSecondaryTextColor = (position: number) => {
    if (position === 1) return "text-white/80";
    if (position === 2) return "text-gray-700";
    if (position === 3) return "text-white/80";
    return "text-gray-400";
  };

  const getMedalColor = (position: number) => {
    if (position === 1) return "text-yellow-300";
    if (position === 2) return "text-gray-500";
    if (position === 3) return "text-yellow-200";
    return "";
  };

  const getPointsColor = (position: number) => {
    if (position === 1) return "text-white";
    if (position === 2) return "text-gold-kings";
    if (position === 3) return "text-white";
    return "text-gold-kings";
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-black-dark via-gray-900 to-black-kings py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-8">
            <Trophy className="h-8 w-8 text-gold-kings" />
            <h1 className="text-4xl font-bold">Clasificación</h1>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black-kings text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Pos</th>
                    <th className="px-6 py-4 text-left">Equipo</th>
                    <th className="px-6 py-4 text-center">PJ</th>
                    <th className="px-6 py-4 text-center">G</th>
                    <th className="px-6 py-4 text-center">E</th>
                    <th className="px-6 py-4 text-center">P</th>
                    <th className="px-6 py-4 text-center">GF</th>
                    <th className="px-6 py-4 text-center">GC</th>
                    <th className="px-6 py-4 text-center">DG</th>
                    <th className="px-6 py-4 text-center">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team, index) => (
                    <tr
                      key={team.id}
                      className={`border-b border-gray-700 ${getPositionColor(index + 1)}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {index < 3 && (
                            <Medal className={`h-5 w-5 ${getMedalColor(index + 1)}`} />
                          )}
                          <span className="font-bold">{index + 1}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {team.logo && (
                            <img
                              src={team.logo}
                              alt={team.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <div className="font-semibold">{team.name}</div>
                            <div className={`text-sm ${getSecondaryTextColor(index + 1)}`}>
                              {team.owner.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {team.wins + team.draws + team.losses}
                      </td>
                      <td className="px-6 py-4 text-center font-semibold">
                        {team.wins}
                      </td>
                      <td className="px-6 py-4 text-center">{team.draws}</td>
                      <td className="px-6 py-4 text-center font-semibold text-red-kings">
                        {team.losses}
                      </td>
                      <td className="px-6 py-4 text-center">{team.goalsFor}</td>
                      <td className="px-6 py-4 text-center">{team.goalsAgainst}</td>
                      <td className="px-6 py-4 text-center font-semibold">
                        {team.goalsFor - team.goalsAgainst > 0 ? "+" : ""}
                        {team.goalsFor - team.goalsAgainst}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-2xl font-bold ${getPointsColor(index + 1)}`}>
                          {team.points}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {teams.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                No hay equipos en la clasificación aún
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

