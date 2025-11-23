"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

export default function RequestWildcardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    effect: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
    if (session?.user?.role !== "presidente") {
      redirect("/");
    }
  }, [session, status]);

  if (status === "loading") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-kings mx-auto"></div>
            <p className="mt-4 text-gray-400">Cargando...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "wildcard",
          name: formData.name,
          description: formData.description,
          effect: formData.effect,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Solicitud de carta comodín enviada exitosamente");
        router.push("/my-team");
      } else {
        const errorMessage = data.error || data.details || "Error al enviar la solicitud";
        toast.error(errorMessage);
        console.error("Error response:", data);
      }
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error("Error al enviar la solicitud. Por favor, inténtalo de nuevo.");
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
            href="/my-team"
            className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver a Mi Equipo</span>
          </Link>

          <div className="bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Sparkles className="h-8 w-8 text-gold-kings" />
              <h1 className="text-3xl font-bold">Solicitar Carta Comodín</h1>
            </div>

            <p className="text-gray-400 mb-6">
              Las cartas comodín son efectos especiales que puedes usar durante la temporada.
              Solicita una carta comodín y un administrador la revisará.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre de la Carta
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Ej: Doble Puntos"
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-kings focus:border-transparent bg-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows={4}
                  placeholder="Describe qué tipo de carta comodín necesitas..."
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-kings focus:border-transparent bg-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Efecto Deseado
                </label>
                <textarea
                  value={formData.effect}
                  onChange={(e) =>
                    setFormData({ ...formData, effect: e.target.value })
                  }
                  required
                  rows={4}
                  placeholder="Describe el efecto que quieres que tenga la carta..."
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-kings focus:border-transparent bg-gray-700 text-white"
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
                  {loading ? "Enviando..." : "Enviar Solicitud"}
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

