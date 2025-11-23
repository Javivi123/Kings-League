import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShoppingCart } from "lucide-react";
import { OfferButton } from "@/components/transfers/OfferButton";

async function getMarketPlayers() {
  return await prisma.player.findMany({
    where: { isOnMarket: true },
    include: {
      team: true,
      stats: true,
    },
    orderBy: {
      marketValue: "desc",
    },
  });
}

async function getUserTeam(userId: string) {
  return await prisma.team.findFirst({
    where: { ownerId: userId },
  });
}

export default async function TransfersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "presidente") {
    redirect("/");
  }

  const [marketPlayers, userTeam] = await Promise.all([
    getMarketPlayers(),
    getUserTeam(session.user.id),
  ]);

  if (!userTeam) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p>No tienes un equipo registrado</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-black-dark via-gray-900 to-black-kings py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="h-8 w-8 text-blue-kings" />
              <h1 className="text-4xl font-bold">Mercado de Transferencias</h1>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">
                Euros Kings Disponibles
              </div>
              <div className="text-2xl font-bold text-gold-kings">
                {userTeam.eurosKings.toFixed(0)} €K
              </div>
            </div>
          </div>

          {marketPlayers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketPlayers.map((player) => (
                <div
                  key={player.id}
                  className="bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="text-center mb-4">
                    {player.photo ? (
                      <img
                        src={player.photo}
                        alt={player.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover mb-3"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-blue-kings mx-auto mb-3 flex items-center justify-center text-white text-3xl font-bold">
                        {player.name.charAt(0)}
                      </div>
                    )}
                    <h2 className="text-xl font-bold">{player.name}</h2>
                    <div className="text-sm text-gray-400">
                      {player.position} • {player.team?.name || "Sin equipo"}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {player.stats && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">
                          Goles:
                        </span>
                        <span className="font-semibold">{player.stats.goals}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Valor:
                      </span>
                      <span className="font-bold text-gold-kings">
                        {player.marketValue.toFixed(0)} €K
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Precio:
                      </span>
                      <span className="font-bold text-blue-kings">
                        {player.price.toFixed(0)} €K
                      </span>
                    </div>
                  </div>

                  <OfferButton
                    playerId={player.id}
                    playerPrice={player.price}
                    userBalance={userTeam.eurosKings}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800 rounded-2xl shadow-lg">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                No hay jugadores en el mercado actualmente
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Los jugadores aparecerán aquí cuando estén disponibles para transferencia
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

