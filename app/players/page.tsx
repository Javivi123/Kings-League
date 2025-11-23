"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/search/SearchBar";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { FloatingIcons } from "@/components/ui/FloatingIcons";
import { Users } from "lucide-react";
import Link from "next/link";

interface Player {
  id: string;
  name: string;
  position: string;
  price: number;
  marketValue: number;
  team: { name: string } | null;
  stats: { goals: number; assists: number } | null;
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    filterPlayers();
  }, [players, searchQuery, filters]);

  const fetchPlayers = async () => {
    try {
      const res = await fetch("/api/players");
      if (res.ok) {
        const data = await res.json();
        setPlayers(data);
        setFilteredPlayers(data);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPlayers = () => {
    let filtered = [...players];

    // Aplicar búsqueda
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.team?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Aplicar filtros
    if (filters.position) {
      filtered = filtered.filter((p) => p.position === filters.position);
    }
    if (filters.team) {
      filtered = filtered.filter((p) => p.team?.name === filters.team);
    }
    if (filters.minValue) {
      filtered = filtered.filter((p) => p.marketValue >= parseFloat(filters.minValue));
    }
    if (filters.maxValue) {
      filtered = filtered.filter((p) => p.marketValue <= parseFloat(filters.maxValue));
    }

    setFilteredPlayers(filtered);
  };

  const positionOptions = [
    { label: "Portero", value: "GK" },
    { label: "Defensa", value: "DEF" },
    { label: "Mediocampista", value: "MID" },
    { label: "Delantero", value: "FWD" },
  ];

  const teamOptions = Array.from(
    new Set(players.map((p) => p.team?.name).filter(Boolean))
  ).map((name) => ({ label: name!, value: name! }));

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
      <main className="min-h-screen bg-gradient-to-br from-black-dark via-gray-900 to-black-kings py-8 relative overflow-hidden">
        <FloatingIcons type="stars" count={8} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-kings" />
              <h1 className="text-4xl font-bold">Jugadores</h1>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Buscar por nombre, posición o equipo..."
                onSearch={setSearchQuery}
              />
            </div>
            <FilterPanel
              filters={{
                position: {
                  label: "Posición",
                  options: positionOptions,
                },
                team: {
                  label: "Equipo",
                  options: teamOptions,
                },
                minValue: {
                  label: "Valor Mínimo",
                  options: [
                    { label: "100 €K", value: "100" },
                    { label: "200 €K", value: "200" },
                    { label: "300 €K", value: "300" },
                    { label: "500 €K", value: "500" },
                  ],
                },
                maxValue: {
                  label: "Valor Máximo",
                  options: [
                    { label: "300 €K", value: "300" },
                    { label: "500 €K", value: "500" },
                    { label: "700 €K", value: "700" },
                    { label: "1000 €K", value: "1000" },
                  ],
                },
              }}
              onFilterChange={setFilters}
            />
          </div>

          {loading ? (
            <div className="text-center py-12">Cargando...</div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-400">
                Mostrando {filteredPlayers.length} de {players.length} jugadores
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlayers.map((player) => (
                  <Link
                    key={player.id}
                    href={`/players/${player.id}`}
                    className="bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 hover:scale-105 animate-fade-in"
                  >
                    <div className="text-center mb-4">
                      <div className="w-24 h-24 rounded-full bg-blue-kings mx-auto mb-3 flex items-center justify-center text-white text-3xl font-bold">
                        {player.name.charAt(0)}
                      </div>
                      <h2 className="text-xl font-bold">{player.name}</h2>
                      <div className="flex items-center justify-center space-x-2 mt-2">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getPositionColor(
                            player.position
                          )}`}
                        >
                          {player.position}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          Equipo:
                        </span>
                        <span className="font-semibold">
                          {player.team?.name || "Sin equipo"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          Valor:
                        </span>
                        <span className="font-bold text-gold-kings">
                          {player.marketValue.toFixed(0)} €K
                        </span>
                      </div>
                      {player.stats && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Goles:
                            </span>
                            <span className="font-semibold">
                              {player.stats.goals}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Asistencias:
                            </span>
                            <span className="font-semibold">
                              {player.stats.assists}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {filteredPlayers.length === 0 && (
                <div className="text-center py-12 bg-gray-800 rounded-2xl shadow-lg">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">
                    No se encontraron jugadores
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
