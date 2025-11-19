import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Calendar, Plus, Clock, Trophy } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

async function getMatches() {
  return await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
    },
    orderBy: {
      matchDate: "desc",
    },
  });
}

export default async function AdminMatchesPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const matches = await getMatches();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500";
      case "live":
        return "bg-red-500";
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white-kings via-white-off to-gray-100 dark:from-black-dark dark:via-gray-900 dark:to-black-kings py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-blue-kings" />
              <h1 className="text-4xl font-bold">Gestión de Partidos</h1>
            </div>
            <Link
              href="/admin/create-match"
              className="px-6 py-3 bg-blue-kings text-white rounded-lg hover:bg-blue-dark transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Crear Partido</span>
            </Link>
          </div>

          <div className="space-y-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${getStatusColor(
                        match.status
                      )}`}
                    >
                      {getStatusText(match.status)}
                    </span>
                    <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(match.matchDate), "d MMMM yyyy 'a las' HH:mm", {
                          locale: es,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="text-center">
                    <Link
                      href={`/teams/${match.homeTeam.id}`}
                      className="flex flex-col items-center hover:opacity-80 transition-opacity"
                    >
                      {match.homeTeam.logo ? (
                        <img
                          src={match.homeTeam.logo}
                          alt={match.homeTeam.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-blue-kings mb-2"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-blue-kings flex items-center justify-center text-white text-xl font-bold mb-2">
                          {match.homeTeam.name.charAt(0)}
                        </div>
                      )}
                      <h3 className="font-bold">{match.homeTeam.name}</h3>
                    </Link>
                  </div>

                  <div className="text-center">
                    {match.status === "finished" &&
                    match.homeScore !== null &&
                    match.awayScore !== null ? (
                      <div className="text-3xl font-bold">
                        {match.homeScore} - {match.awayScore}
                      </div>
                    ) : match.status === "live" ? (
                      <div className="text-2xl font-bold text-red-500 animate-pulse">
                        {match.homeScore ?? 0} - {match.awayScore ?? 0}
                      </div>
                    ) : (
                      <div className="text-xl font-bold text-gray-400">VS</div>
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
                          className="w-16 h-16 rounded-full object-cover border-2 border-red-kings mb-2"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-red-kings flex items-center justify-center text-white text-xl font-bold mb-2">
                          {match.awayTeam.name.charAt(0)}
                        </div>
                      )}
                      <h3 className="font-bold">{match.awayTeam.name}</h3>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {matches.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No hay partidos registrados
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

