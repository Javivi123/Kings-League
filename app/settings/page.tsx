"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Settings, User, Tv, Lock, Bell } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [tvMode, setTvMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load TV mode from localStorage
    const savedTvMode = localStorage.getItem("tvMode") === "true";
    setTvMode(savedTvMode);
    if (savedTvMode) {
      document.documentElement.classList.add("tv-mode");
    }

    // Load user data
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        age: "",
      });
    }
  }, [session]);

  const handleTvModeToggle = () => {
    const newTvMode = !tvMode;
    setTvMode(newTvMode);
    localStorage.setItem("tvMode", newTvMode.toString());
    
    if (newTvMode) {
      document.documentElement.classList.add("tv-mode");
      toast.success("Modo TV activado");
    } else {
      document.documentElement.classList.remove("tv-mode");
      toast.success("Modo TV desactivado");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          age: formData.age ? parseInt(formData.age) : null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Perfil actualizado");
        // Refrescar la sesión para actualizar los datos del usuario
        window.location.reload();
      } else {
        const errorMessage = data.error || data.details || "Error al actualizar el perfil";
        toast.error(errorMessage);
        console.error("Error response:", data);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error al actualizar el perfil. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white-kings via-white-off to-gray-100 dark:from-black-dark dark:via-gray-900 dark:to-black-kings py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-8">
            <Settings className="h-8 w-8 text-blue-kings" />
            <h1 className="text-4xl font-bold">Configuración</h1>
          </div>

          <div className="space-y-6">
            {/* Profile Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <User className="h-6 w-6 text-blue-kings" />
                <h2 className="text-2xl font-bold">Perfil</h2>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-kings focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    El email no se puede cambiar
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Edad
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-kings focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </form>
            </div>

            {/* TV Mode - Solo visible para admin */}
            {session?.user?.role === "admin" && (
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center space-x-2 mb-6">
                  <Tv className="h-6 w-6 text-yellow-300" />
                  <h2 className="text-2xl font-bold">Modo TV / ChromeCast</h2>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">
                    Visualización para Pantallas Grandes
                  </h3>
                  <p className="text-white/80">
                    Abre la vista especial para TV con carrusel automático de clasificación, partidos, noticias y jugadores destacados.
                  </p>
                </div>

                <Link href="/tv">
                  <Button className="w-full bg-yellow-300 hover:bg-yellow-400 text-purple-900 font-bold text-lg py-4 shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2">
                    <Tv className="h-5 w-5" />
                    <span>Abrir Modo TV</span>
                  </Button>
                </Link>
              </div>
            )}

            {/* Security */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Lock className="h-6 w-6 text-red-kings" />
                <h2 className="text-2xl font-bold">Seguridad</h2>
              </div>

              <Link href="/change-password">
                <Button variant="outline" className="w-full">
                  Cambiar Contraseña
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

