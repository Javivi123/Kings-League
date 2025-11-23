"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Team {
  id: string;
  name: string;
}

export default function CreateMatchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [formData, setFormData] = useState({
    homeTeamId: "",
    awayTeamId: "",
    matchDate: "",
    matchTime: "",
    status: "scheduled",
  });

  useEffect(() => {
    fetchTeams();
    // Establecer fecha y hora por defecto (mañana a las 18:00)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(18, 0, 0, 0);
    const dateStr = tomorrow.toISOString().split("T")[0];
    const timeStr = "18:00";
    setFormData((prev) => ({
      ...prev,
      matchDate: dateStr,
      matchTime: timeStr,
    }));
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/teams");
      if (res.ok) {
        const data = await res.json();
        setTeams(data);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.homeTeamId === formData.awayTeamId) {
      toast.error("Un equipo no puede jugar contra sí mismo");
      setLoading(false);
      return;
    }

    try {
      // Combinar fecha y hora
      const matchDateTime = new Date(
        `${formData.matchDate}T${formData.matchTime}:00`
      ).toISOString();

      const response = await fetch("/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homeTeamId: formData.homeTeamId,
          awayTeamId: formData.awayTeamId,
          matchDate: matchDateTime,
          status: formData.status,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Partido creado exitosamente");
        router.push("/admin/matches");
      } else {
        toast.error(data.error || "Error al crear el partido");
      }
    } catch (error) {
      toast.error("Error al crear el partido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-black-dark via-gray-900 to-black-kings py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/admin/matches"
            className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver a Partidos</span>
          </Link>

          <div className="bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Calendar className="h-8 w-8 text-blue-kings" />
              <h1 className="text-3xl font-bold">Crear Nuevo Partido</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Equipo Local
                  </label>
                  <select
                    value={formData.homeTeamId}
                    onChange={(e) =>
                      setFormData({ ...formData, homeTeamId: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-kings focus:border-transparent bg-gray-700 text-white"
                  >
                    <option value="">Seleccionar equipo</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Equipo Visitante
                  </label>
                  <select
                    value={formData.awayTeamId}
                    onChange={(e) =>
                      setFormData({ ...formData, awayTeamId: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-kings focus:border-transparent bg-gray-700 text-white"
                  >
                    <option value="">Seleccionar equipo</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={formData.matchDate}
                    onChange={(e) =>
                      setFormData({ ...formData, matchDate: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-kings focus:border-transparent bg-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={formData.matchTime}
                    onChange={(e) =>
                      setFormData({ ...formData, matchTime: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-kings focus:border-transparent bg-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-kings focus:border-transparent bg-gray-700 text-white"
                >
                  <option value="scheduled">Programado</option>
                  <option value="live">En Vivo</option>
                  <option value="finished">Finalizado</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Creando..." : "Crear Partido"}
                </Button>
                <Link href="/admin/matches">
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

