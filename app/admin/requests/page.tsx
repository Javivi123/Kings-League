import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FileText } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { RequestActions } from "@/components/admin/RequestActions";

async function getRequests() {
  return await prisma.request.findMany({
    include: {
      user: true,
      team: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

function getRequestTypeLabel(type: string) {
  switch (type) {
    case "wildcard":
      return "Carta Comodín";
    case "team_registration":
      return "Registro de Equipo";
    default:
      return type;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "approved":
      return "bg-green-500";
    case "rejected":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "approved":
      return "Aprobada";
    case "rejected":
      return "Rechazada";
    default:
      return status;
  }
}

export default async function AdminRequestsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const requests = await getRequests();
  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white-kings via-white-off to-gray-100 dark:from-black-dark dark:via-gray-900 dark:to-black-kings py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-8">
            <FileText className="h-8 w-8 text-blue-kings" />
            <h1 className="text-4xl font-bold">Gestión de Solicitudes</h1>
            {pendingCount > 0 && (
              <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-semibold">
                {pendingCount} pendientes
              </span>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black-kings text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Tipo</th>
                    <th className="px-6 py-4 text-left">Usuario</th>
                    <th className="px-6 py-4 text-left">Equipo</th>
                    <th className="px-6 py-4 text-left">Estado</th>
                    <th className="px-6 py-4 text-left">Fecha</th>
                    <th className="px-6 py-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request, index) => (
                    <tr
                      key={request.id}
                      className={`border-b border-gray-700 ${
                        index % 2 === 0
                          ? "bg-gray-800"
                          : "bg-gray-900"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-blue-kings" />
                          <span className="font-semibold">
                            {getRequestTypeLabel(request.type)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold">
                            {request.user.name || "Sin nombre"}
                          </div>
                          <div className="text-sm text-gray-500">{request.user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {request.team ? (
                          <span className="text-blue-kings font-semibold">
                            {request.team.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {getStatusText(request.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {format(new Date(request.createdAt), "d MMM yyyy", { locale: es })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <RequestActions requestId={request.id} currentStatus={request.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {requests.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg mt-6">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No hay solicitudes registradas
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

