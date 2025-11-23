"use client";

import { useState } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Download, Upload, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function ExportImportPage() {
  const [loading, setLoading] = useState(false);

  const exportData = async (type: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/export?type=${type}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${type}-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Datos exportados exitosamente");
      } else {
        toast.error("Error al exportar datos");
      }
    } catch (error) {
      toast.error("Error al exportar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/import", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Datos importados exitosamente");
      } else {
        toast.error("Error al importar datos");
      }
    } catch (error) {
      toast.error("Error al importar datos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-black-dark via-gray-900 to-black-kings py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-8">
            <FileSpreadsheet className="h-8 w-8 text-blue-kings" />
            <h1 className="text-4xl font-bold">Exportar/Importar Datos</h1>
          </div>

          <div className="space-y-6">
            {/* Export Section */}
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Download className="h-6 w-6 text-green-500" />
                <span>Exportar Datos</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => exportData("users")}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  Exportar Usuarios
                </Button>
                <Button
                  onClick={() => exportData("teams")}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  Exportar Equipos
                </Button>
                <Button
                  onClick={() => exportData("players")}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  Exportar Jugadores
                </Button>
                <Button
                  onClick={() => exportData("matches")}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  Exportar Partidos
                </Button>
              </div>
            </div>

            {/* Import Section */}
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Upload className="h-6 w-6 text-blue-kings" />
                <span>Importar Datos</span>
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Seleccionar archivo CSV
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleImport}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                  />
                </div>
                <p className="text-sm text-gray-400">
                  El archivo CSV debe tener el formato correcto. Consulta la documentación para más detalles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

