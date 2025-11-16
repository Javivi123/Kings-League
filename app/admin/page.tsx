import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Shield, Users, Trophy, ShoppingCart, FileText, Settings, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getAdminStats() {
  const [users, teams, players, matches, requests, transactions] = await Promise.all([
    prisma.user.count(),
    prisma.team.count(),
    prisma.player.count(),
    prisma.match.count(),
    prisma.request.count({ where: { status: "pending" } }),
    prisma.transaction.count({ where: { status: "pending" } }),
  ]);

  return {
    users,
    teams,
    players,
    matches,
    pendingRequests: requests,
    pendingTransactions: transactions,
  };
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const stats = await getAdminStats();

  const adminSections = [
    {
      title: "Usuarios",
      icon: Users,
      href: "/admin/users",
      count: stats.users,
      color: "blue-kings",
    },
    {
      title: "Equipos",
      icon: Trophy,
      href: "/admin/teams",
      count: stats.teams,
      color: "gold-kings",
    },
    {
      title: "Jugadores",
      icon: Users,
      href: "/admin/players",
      count: stats.players,
      color: "green-500",
    },
    {
      title: "Partidos",
      icon: Trophy,
      href: "/admin/matches",
      count: stats.matches,
      color: "red-kings",
    },
    {
      title: "Solicitudes",
      icon: FileText,
      href: "/admin/requests",
      count: stats.pendingRequests,
      color: "purple-500",
      badge: stats.pendingRequests > 0,
    },
    {
      title: "Transacciones",
      icon: ShoppingCart,
      href: "/admin/transactions",
      count: stats.pendingTransactions,
      color: "orange-500",
      badge: stats.pendingTransactions > 0,
    },
    {
      title: "Suspensiones",
      icon: Shield,
      href: "/admin/suspensions",
      count: 0,
      color: "red-kings",
    },
    {
      title: "Exportar/Importar",
      icon: Settings,
      href: "/admin/export",
      count: 0,
      color: "blue-kings",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white-kings via-white-off to-gray-100 dark:from-black-dark dark:via-gray-900 dark:to-black-kings py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-8">
            <Shield className="h-8 w-8 text-red-kings" />
            <h1 className="text-4xl font-bold">Panel de Administración</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminSections.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow relative"
                >
                  {section.badge && (
                    <span className="absolute top-4 right-4 w-3 h-3 bg-red-kings rounded-full"></span>
                  )}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`p-3 rounded-lg bg-${section.color}/20`}>
                      <Icon className={`h-6 w-6 text-${section.color}`} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold">{section.title}</h2>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {section.count}
                      </div>
                    </div>
                  </div>
                  {section.badge && (
                    <div className="text-sm text-red-kings font-semibold">
                      {section.count} pendiente{section.count !== 1 ? "s" : ""}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
              <Settings className="h-6 w-6 text-blue-kings" />
              <span>Acciones Rápidas</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/admin/create-player"
                className="px-6 py-3 bg-blue-kings text-white rounded-lg hover:bg-blue-dark transition-colors text-center"
              >
                Crear Nuevo Jugador
              </Link>
              <Link
                href="/admin/create-team"
                className="px-6 py-3 bg-gold-kings text-white rounded-lg hover:bg-gold-dark transition-colors text-center"
              >
                Crear Nuevo Equipo
              </Link>
              <Link
                href="/admin/create-match"
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-center"
              >
                Crear Nuevo Partido
              </Link>
              <Link
                href="/admin/auction"
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-center"
              >
                Gestionar Subasta Inicial
              </Link>
              <Link
                href="/admin/awards"
                className="px-6 py-3 bg-gold-kings text-white rounded-lg hover:bg-gold-dark transition-colors text-center"
              >
                Premios de Temporada
              </Link>
              <Link
                href="/admin/analytics"
                className="px-6 py-3 bg-blue-kings text-white rounded-lg hover:bg-blue-dark transition-colors text-center"
              >
                Analytics
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

