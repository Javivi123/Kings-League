"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { FileText, ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CreateNewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    published: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear la noticia");
      }

      toast.success("Noticia creada exitosamente");
      router.push("/admin");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Error al crear la noticia");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white-kings via-white-off to-gray-100 dark:from-black-dark dark:via-gray-900 dark:to-black-kings py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/admin"
              className="inline-flex items-center space-x-2 text-blue-kings hover:text-blue-dark mb-4 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver al Panel de Admin</span>
            </Link>
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-kings" />
              <h1 className="text-4xl font-bold">Crear Nueva Noticia</h1>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8"
          >
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Título de la Noticia *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-kings focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ej: Los Leones ganan su primer partido"
                />
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  URL de la Imagen
                </label>
                <div className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-kings focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Vista previa"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Puedes usar una URL de imagen externa
                </p>
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Contenido de la Noticia *
                </label>
                <textarea
                  id="content"
                  name="content"
                  required
                  rows={15}
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-kings focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                  placeholder="Escribe el contenido de la noticia aquí. Puedes usar HTML básico para formatear el texto."
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Puedes usar etiquetas HTML básicas como &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, etc.
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, published: e.target.checked }))
                  }
                  className="h-4 w-4 text-blue-kings focus:ring-blue-kings border-gray-300 rounded"
                />
                <label
                  htmlFor="published"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Publicar inmediatamente
                </label>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-kings hover:bg-blue-dark"
                >
                  {loading ? "Creando..." : "Crear Noticia"}
                </Button>
                <Link href="/admin">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
