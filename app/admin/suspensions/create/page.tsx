"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Player {
  id: string;
  name: string;
  team: { name: string } | null;
}

export default function CreateSuspensionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [formData, setFormData] = useState({
    playerId: "",
    reason: "",
    matches: "1",
    startDate: "",
  });

  useEffect(() => {
    fetchPlayers();
    // Establecer fecha por defecto (hoy)
    const today = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, startDate: today }));
  }, []);

  const fetchPlayers = async () => {
    try {
      const res = await fetch("/api/players");
      if (res.ok) {
        const data = await res.json();
        setPlayers(data);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/suspensions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: formData.playerId,
          reason: formData.reason,
          matches: parseInt(formData.matches),
          startDate: new Date(formData.startDate).toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Suspensión creada exitosamente");
        router.push("/admin/suspensions");
      } else {
        toast.error(data.error || "Error al crear la suspensión");
      }
    } catch (error) {
      toast.error("Error al crear la suspensión");
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
            href="/admin/suspensions"
            className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver a Suspensiones</span>
          </Link>

          <div className="bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="h-8 w-8 text-red-kings" />
              <h1 className="text-3xl font-bold">Crear Suspensión</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Jugador
                </label>
                <select
                  value={formData.playerId}
                  onChange={(e) =>
                    setFormData({ ...formData, playerId: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-kings focus:border-transparent bg-gray-700 text-white"
                >
                  <option value="">Seleccionar jugador</option>
                  {players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name} {player.team ? `(${player.team.name})` : "(Sin equipo)"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Razón de la Suspensión
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  required
                  rows={4}
                  placeholder="Describe la razón de la suspensión..."
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-kings focus:border-transparent bg-gray-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Número de Partidos
                  </label>
                  <input
                    type="number"
                    value={formData.matches}
                    onChange={(e) =>
                      setFormData({ ...formData, matches: e.target.value })
                    }
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-kings focus:border-transparent bg-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-kings focus:border-transparent bg-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-200">
                  <strong>Nota:</strong> La fecha de fin se calculará automáticamente basándose en el número de partidos (aproximadamente 7 días por partido).
                </p>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Creando..." : "Crear Suspensión"}
                </Button>
                <Link href="/admin/suspensions">
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

