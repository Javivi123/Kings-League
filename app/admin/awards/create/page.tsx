"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Trophy } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Player {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string | null;
  email: string;
}

export default function CreateAwardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    season: "",
    category: "",
    winnerType: "",
    winnerId: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
    // Establecer temporada por defecto
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    setFormData((prev) => ({
      ...prev,
      season: `${currentYear}-${nextYear}`,
    }));
  }, []);

  const fetchData = async () => {
    try {
      const [playersRes, teamsRes, usersRes] = await Promise.all([
        fetch("/api/players"),
        fetch("/api/teams"),
        fetch("/api/users"),
      ]);

      if (playersRes.ok) {
        const playersData = await playersRes.json();
        setPlayers(playersData);
      }
      if (teamsRes.ok) {
        const teamsData = await teamsRes.json();
        setTeams(teamsData);
      }
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/awards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          season: formData.season,
          category: formData.category,
          winnerType: formData.winnerType || null,
          winnerId: formData.winnerId || null,
          description: formData.description || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Premio creado exitosamente");
        router.push("/admin/awards");
      } else {
        toast.error(data.error || "Error al crear el premio");
      }
    } catch (error) {
      toast.error("Error al crear el premio");
    } finally {
      setLoading(false);
    }
  };

  const getWinnerOptions = () => {
    if (formData.winnerType === "player") {
      return players.map((player) => (
        <option key={player.id} value={player.id}>
          {player.name}
        </option>
      ));
    } else if (formData.winnerType === "team") {
      return teams.map((team) => (
        <option key={team.id} value={team.id}>
          {team.name}
        </option>
      ));
    } else if (formData.winnerType === "user") {
      return users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name || user.email}
        </option>
      ));
    }
    return null;
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-black-dark via-gray-900 to-black-kings py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/admin/awards"
            className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver a Premios</span>
          </Link>

          <div className="bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Trophy className="h-8 w-8 text-gold-kings" />
              <h1 className="text-3xl font-bold">Crear Premio de Temporada</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Temporada
                </label>
                <input
                  type="text"
                  value={formData.season}
                  onChange={(e) =>
                    setFormData({ ...formData, season: e.target.value })
                  }
                  required
                  placeholder="Ej: 2024-2025"
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-kings focus:border-transparent bg-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Categoría
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                  placeholder="Ej: best_player, best_team, top_scorer, etc."
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-kings focus:border-transparent bg-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Ganador (opcional)
                </label>
                <select
                  value={formData.winnerType}
                  onChange={(e) =>
                    setFormData({ ...formData, winnerType: e.target.value, winnerId: "" })
                  }
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-kings focus:border-transparent bg-gray-700 text-white"
                >
                  <option value="">Sin ganador (aún no asignado)</option>
                  <option value="player">Jugador</option>
                  <option value="team">Equipo</option>
                  <option value="user">Usuario</option>
                </select>
              </div>

              {formData.winnerType && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ganador
                  </label>
                  <select
                    value={formData.winnerId}
                    onChange={(e) =>
                      setFormData({ ...formData, winnerId: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-kings focus:border-transparent bg-gray-700 text-white"
                  >
                    <option value="">Seleccionar ganador</option>
                    {getWinnerOptions()}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  placeholder="Descripción adicional del premio..."
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-kings focus:border-transparent bg-gray-700 text-white"
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Creando..." : "Crear Premio"}
                </Button>
                <Link href="/admin/awards">
                  <Button type="button" variant="outline" size="lg">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

