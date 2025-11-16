import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Users, Plus, Shield, User, Crown } from "lucide-react";
import Link from "next/link";

async function getUsers() {
  return await prisma.user.findMany({
    include: {
      team: true,
      player: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

function getRoleIcon(role: string) {
  switch (role) {
    case "admin":
      return <Shield className="h-4 w-4 text-red-kings" />;
    case "presidente":
      return <Crown className="h-4 w-4 text-gold-kings" />;
    case "jugador":
      return <User className="h-4 w-4 text-blue-kings" />;
    default:
      return <User className="h-4 w-4 text-gray-500" />;
  }
}

function getRoleColor(role: string) {
  switch (role) {
    case "admin":
      return "bg-red-kings/20 text-red-kings";
    case "presidente":
      return "bg-gold-kings/20 text-gold-kings";
    case "jugador":
      return "bg-blue-kings/20 text-blue-kings";
    default:
      return "bg-gray-500/20 text-gray-600";
  }
}

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const users = await getUsers();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white-kings via-white-off to-gray-100 dark:from-black-dark dark:via-gray-900 dark:to-black-kings py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-kings" />
              <h1 className="text-4xl font-bold">Gestión de Usuarios</h1>
            </div>
            <Link
              href="/admin/users/create"
              className="px-6 py-3 bg-blue-kings text-white rounded-lg hover:bg-blue-dark transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Crear Usuario</span>
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black-kings text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Usuario</th>
                    <th className="px-6 py-4 text-left">Email</th>
                    <th className="px-6 py-4 text-left">Rol</th>
                    <th className="px-6 py-4 text-left">Equipo</th>
                    <th className="px-6 py-4 text-left">Jugador</th>
                    <th className="px-6 py-4 text-left">Fecha</th>
                    <th className="px-6 py-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`border-b border-gray-200 dark:border-gray-700 ${
                        index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold">{user.name || "Sin nombre"}</div>
                        {user.age && (
                          <div className="text-sm text-gray-500">{user.age} años</div>
                        )}
                      </td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(user.role)}
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleColor(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.team ? (
                          <span className="text-blue-kings font-semibold">
                            {user.team.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {user.player ? (
                          <span className="text-green-500 font-semibold">
                            {user.player.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString("es-ES")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          href={`/admin/users/${user.id}/edit`}
                          className="text-blue-kings hover:text-blue-dark font-medium"
                        >
                          Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No hay usuarios registrados
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

