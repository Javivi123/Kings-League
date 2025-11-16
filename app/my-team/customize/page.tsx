"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Upload, Palette } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CustomizeTeamPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [teamData, setTeamData] = useState({
    name: "",
    logo: "",
    primaryColor: "#2563EB",
    secondaryColor: "#DC2626",
  });

  useEffect(() => {
    if (session?.user?.role === "presidente") {
      fetchTeamData();
    }
  }, [session]);

  const fetchTeamData = async () => {
    try {
      const res = await fetch("/api/my-team");
      if (res.ok) {
        const data = await res.json();
        setTeamData({
          name: data.name || "",
          logo: data.logo || "",
          primaryColor: data.primaryColor || "#2563EB",
          secondaryColor: data.secondaryColor || "#DC2626",
        });
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/my-team/customize", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teamData),
      });

      if (res.ok) {
        toast.success("Equipo personalizado exitosamente");
      } else {
        toast.error("Error al personalizar el equipo");
      }
    } catch (error) {
      toast.error("Error al personalizar el equipo");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Por ahora, solo guardamos la URL
    // En producción, deberías subir el archivo a un servicio de almacenamiento
    const reader = new FileReader();
    reader.onloadend = () => {
      setTeamData({ ...teamData, logo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  if (!session || session.user.role !== "presidente") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p>No tienes acceso a esta página</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white-kings via-white-off to-gray-100 dark:from-black-dark dark:via-gray-900 dark:to-black-kings py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/my-team"
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver a Mi Equipo</span>
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Palette className="h-6 w-6 text-gold-kings" />
              <h1 className="text-3xl font-bold">Personalizar Equipo</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Logo del Equipo
                </label>
                <div className="flex items-center space-x-4">
                  {teamData.logo && (
                    <img
                      src={teamData.logo}
                      alt="Logo"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                    />
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="px-4 py-2 bg-blue-kings text-white rounded-lg hover:bg-blue-dark transition-colors cursor-pointer inline-flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Subir Logo</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre del Equipo
                </label>
                <input
                  type="text"
                  value={teamData.name}
                  onChange={(e) =>
                    setTeamData({ ...teamData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-kings focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Colores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color Principal
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={teamData.primaryColor}
                      onChange={(e) =>
                        setTeamData({
                          ...teamData,
                          primaryColor: e.target.value,
                        })
                      }
                      className="w-16 h-16 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={teamData.primaryColor}
                      onChange={(e) =>
                        setTeamData({
                          ...teamData,
                          primaryColor: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color Secundario
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={teamData.secondaryColor}
                      onChange={(e) =>
                        setTeamData({
                          ...teamData,
                          secondaryColor: e.target.value,
                        })
                      }
                      className="w-16 h-16 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={teamData.secondaryColor}
                      onChange={(e) =>
                        setTeamData({
                          ...teamData,
                          secondaryColor: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-semibold mb-4">Vista Previa</h3>
                <div
                  className="p-6 rounded-lg text-white"
                  style={{
                    background: `linear-gradient(135deg, ${teamData.primaryColor} 0%, ${teamData.secondaryColor} 100%)`,
                  }}
                >
                  <div className="flex items-center space-x-4">
                    {teamData.logo && (
                      <img
                        src={teamData.logo}
                        alt="Preview"
                        className="w-16 h-16 rounded-full border-2 border-white"
                      />
                    )}
                    <div>
                      <div className="text-2xl font-bold">
                        {teamData.name || "Nombre del Equipo"}
                      </div>
                      <div className="text-sm opacity-90">Vista previa</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </Button>
                <Link href="/my-team">
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

