import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { AlertTriangle, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

async function getSuspensions() {
  return await prisma.suspension.findMany({
    include: {
      player: {
        include: {
          team: true,
        },
      },
    },
    orderBy: {
      startDate: "desc",
    },
  });
}

export default async function SuspensionsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const suspensions = await getSuspensions();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white-kings via-white-off to-gray-100 dark:from-black-dark dark:via-gray-900 dark:to-black-kings py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-red-kings" />
              <h1 className="text-4xl font-bold">Suspensiones</h1>
            </div>
            <Link
              href="/admin/suspensions/create"
              className="px-6 py-3 bg-red-kings text-white rounded-lg hover:bg-red-dark transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Crear Suspensión</span>
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black-kings text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Jugador</th>
                    <th className="px-6 py-4 text-left">Equipo</th>
                    <th className="px-6 py-4 text-left">Razón</th>
                    <th className="px-6 py-4 text-center">Partidos</th>
                    <th className="px-6 py-4 text-left">Inicio</th>
                    <th className="px-6 py-4 text-left">Fin</th>
                    <th className="px-6 py-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {suspensions.map((suspension, index) => {
                    const isActive =
                      new Date(suspension.startDate) <= new Date() &&
                      new Date(suspension.endDate) >= new Date();
                    const isExpired = new Date(suspension.endDate) < new Date();

                    return (
                      <tr
                        key={suspension.id}
                        className={`border-b border-gray-700 ${
                          index % 2 === 0
                            ? "bg-gray-800"
                            : "bg-gray-900"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold">
                            {suspension.player.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {suspension.player.team?.name || "Sin equipo"}
                        </td>
                        <td className="px-6 py-4">{suspension.reason}</td>
                        <td className="px-6 py-4 text-center">
                          {suspension.matches}
                        </td>
                        <td className="px-6 py-4">
                          {format(new Date(suspension.startDate), "d MMM yyyy")}
                        </td>
                        <td className="px-6 py-4">
                          {format(new Date(suspension.endDate), "d MMM yyyy")}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              isActive
                                ? "bg-red-kings/20 text-red-kings"
                                : isExpired
                                ? "bg-gray-500/20 text-gray-600"
                                : "bg-yellow-500/20 text-yellow-600"
                            }`}
                          >
                            {isActive
                              ? "Activa"
                              : isExpired
                              ? "Finalizada"
                              : "Pendiente"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {suspensions.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No hay suspensiones registradas
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

