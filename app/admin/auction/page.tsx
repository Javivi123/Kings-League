import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Gavel, Plus, Clock, Trophy } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

async function getAuctions() {
  return await prisma.auction.findMany({
    include: {
      player: {
        include: {
          team: true,
        },
      },
      team: true,
    },
    orderBy: {
      endDate: "asc",
    },
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-500";
    case "closed":
      return "bg-gray-500";
    case "sold":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "active":
      return "Activa";
    case "closed":
      return "Cerrada";
    case "sold":
      return "Vendida";
    default:
      return status;
  }
}

export default async function AuctionPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const auctions = await getAuctions();
  const activeAuctions = auctions.filter((a) => a.status === "active");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-black-dark via-gray-900 to-black-kings py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Gavel className="h-8 w-8 text-blue-kings" />
              <h1 className="text-4xl font-bold">Gestión de Subastas</h1>
              {activeAuctions.length > 0 && (
                <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">
                  {activeAuctions.length} activas
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <div
                key={auction.id}
                className="bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${getStatusColor(
                      auction.status
                    )}`}
                  >
                    {getStatusText(auction.status)}
                  </span>
                  <div className="flex items-center space-x-1 text-gray-400 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(new Date(auction.endDate), "d MMM yyyy", {
                        locale: es,
                      })}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <Link
                    href={`/players/${auction.playerId}`}
                    className="text-xl font-bold hover:text-blue-kings transition-colors"
                  >
                    {auction.player.name}
                  </Link>
                  <p className="text-sm text-gray-400">
                    {auction.player.position} - {auction.player.team?.name || "Sin equipo"}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      Precio Inicial:
                    </span>
                    <span className="font-bold text-gold-kings">
                      {auction.startingPrice.toFixed(0)} €K
                    </span>
                  </div>
                  {auction.currentBid && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Puja Actual:
                      </span>
                      <span className="font-bold text-green-500">
                        {auction.currentBid.toFixed(0)} €K
                      </span>
                    </div>
                  )}
                  {auction.team && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Ofertado por:
                      </span>
                      <span className="font-semibold text-blue-kings">
                        {auction.team.name}
                      </span>
                    </div>
                  )}
                </div>

                {auction.status === "active" && (
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400">
                      {new Date(auction.endDate) > new Date()
                        ? `Termina: ${format(new Date(auction.endDate), "d MMM yyyy 'a las' HH:mm", {
                            locale: es,
                          })}`
                        : "Subasta finalizada"}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {auctions.length === 0 && (
            <div className="text-center py-12 bg-gray-800 rounded-2xl shadow-lg">
              <Gavel className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                No hay subastas registradas
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

