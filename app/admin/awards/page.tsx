import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { Trophy, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

async function getSeasonAwards() {
  return await prisma.seasonAward.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default async function AwardsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const awards = await getSeasonAwards();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-black-dark via-gray-900 to-black-kings py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8 text-gold-kings" />
              <h1 className="text-4xl font-bold">Premios de Temporada</h1>
            </div>
            <Link
              href="/admin/awards/create"
              className="px-6 py-3 bg-gold-kings text-white rounded-lg hover:bg-gold-dark transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Crear Premio</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award) => (
              <div
                key={award.id}
                className="bg-gradient-to-br from-gold-kings/20 to-gold-kings/10 rounded-2xl shadow-lg p-6 border-2 border-gold-kings/30 animate-fade-in"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Trophy className="h-8 w-8 text-gold-kings" />
                  <div>
                    <h3 className="font-bold text-lg">{award.category}</h3>
                    <p className="text-sm text-gray-400">
                      Temporada {award.season}
                    </p>
                  </div>
                </div>
                {award.description && (
                  <p className="text-gray-300 mb-4">
                    {award.description}
                  </p>
                )}
                {award.winnerId && (
                  <div className="text-sm">
                    <span className="text-gray-400">
                      Ganador:
                    </span>{" "}
                    <span className="font-semibold">{award.winnerId}</span>
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-4">
                  {format(new Date(award.createdAt), "d MMM yyyy")}
                </div>
              </div>
            ))}
          </div>

          {awards.length === 0 && (
            <div className="text-center py-12 bg-gray-800 rounded-2xl shadow-lg">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                No hay premios registrados
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

