"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Calendar, Clock, Trophy, Users } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

interface Match {
  id: string;
  homeTeam: {
    id: string;
    name: string;
    logo: string | null;
  };
  awayTeam: {
    id: string;
    name: string;
    logo: string | null;
  };
  homeScore: number | null;
  awayScore: number | null;
  matchDate: string;
  status: string;
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "scheduled" | "live" | "finished">("all");

  useEffect(() => {
    fetchMatches();
  }, [filter]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const url = filter === "all" ? "/api/matches" : `/api/matches?status=${filter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMatches(data);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white-kings via-white-off to-gray-100 dark:from-black-dark dark:via-gray-900 dark:to-black-kings py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-8">
            <Calendar className="h-8 w-8 text-blue-kings" />
            <h1 className="text-4xl font-bold">Partidos</h1>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(["all", "scheduled", "live", "finished"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === f
                    ? "bg-blue-kings text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {f === "all"
                  ? "Todos"
                  : f === "scheduled"
                  ? "Programados"
                  : f === "live"
                  ? "En Vivo"
                  : "Finalizados"}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-kings mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando partidos...</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No hay partidos {filter !== "all" ? getStatusText(filter) : ""}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <Link
                  href={`/matches/${match.id}`}
                  key={match.id}
                  className="block bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
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
                    {/* Equipo Local */}
                    <div className="text-center">
                      <Link
                        href={`/matches/${match.id}`}
                        className="flex flex-col items-center hover:opacity-80 transition-opacity"
                      >
                        {match.homeTeam.logo ? (
                          <img
                            src={match.homeTeam.logo}
                            alt={match.homeTeam.name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-blue-kings mb-2"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-blue-kings flex items-center justify-center text-white text-2xl font-bold mb-2">
                            {match.homeTeam.name.charAt(0)}
                          </div>
                        )}
                        <h3 className="font-bold text-lg">{match.homeTeam.name}</h3>
                      </Link>
                    </div>

                    {/* Resultado */}
                    <div className="text-center">
                      {match.status === "finished" && match.homeScore !== null && match.awayScore !== null ? (
                        <div className="text-4xl font-bold">
                          {match.homeScore} - {match.awayScore}
                        </div>
                      ) : match.status === "live" ? (
                        <div className="text-2xl font-bold text-red-500 animate-pulse">
                          {match.homeScore ?? 0} - {match.awayScore ?? 0}
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-gray-400">VS</div>
                      )}
                    </div>

                    {/* Equipo Visitante */}
                    <div className="text-center">
                      <Link
                        href={`/matches/${match.id}`}
                        className="flex flex-col items-center hover:opacity-80 transition-opacity"
                      >
                        {match.awayTeam.logo ? (
                          <img
                            src={match.awayTeam.logo}
                            alt={match.awayTeam.name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-red-kings mb-2"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-red-kings flex items-center justify-center text-white text-2xl font-bold mb-2">
                            {match.awayTeam.name.charAt(0)}
                          </div>
                        )}
                        <h3 className="font-bold text-lg">{match.awayTeam.name}</h3>
                      </Link>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

