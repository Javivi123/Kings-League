import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Calendar, MapPin, Users, Trophy } from "lucide-react";
import { format } from "date-fns";

async function getAgenda(userId: string) {
  const team = await prisma.team.findFirst({
    where: { ownerId: userId },
  });

  if (!team) return { matches: [], events: [] };

  const [matches, events] = await Promise.all([
    prisma.match.findMany({
      where: {
        OR: [{ homeTeamId: team.id }, { awayTeamId: team.id }],
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: {
        matchDate: "asc",
      },
    }),
    prisma.event.findMany({
      where: {
        OR: [
          { type: "meeting" },
          { type: "auction" },
          {
            participants: {
              contains: team.id,
            },
          },
        ],
      },
      orderBy: {
        date: "asc",
      },
    }),
  ]);

  return { matches, events };
}

export default async function AgendaPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "presidente") {
    redirect("/");
  }

  const { matches, events } = await getAgenda(session.user.id);

  const allItems = [
    ...matches.map((m) => ({
      ...m,
      type: "match" as const,
      date: m.matchDate,
    })),
    ...events.map((e) => ({
      ...e,
      type: e.type as "meeting" | "auction",
      date: e.date,
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-black-dark via-gray-900 to-black-kings py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-8">
            <Calendar className="h-8 w-8 text-blue-kings" />
            <h1 className="text-4xl font-bold">Agenda</h1>
          </div>

          <div className="space-y-4">
            {allItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800 rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {item.type === "match" ? (
                      <Trophy className="h-8 w-8 text-blue-kings" />
                    ) : item.type === "meeting" ? (
                      <Users className="h-8 w-8 text-purple-500" />
                    ) : (
                      <Trophy className="h-8 w-8 text-gold-kings" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">
                      {item.type === "match"
                        ? `${item.homeTeam.name} vs ${item.awayTeam.name}`
                        : item.title}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(item.date), "d MMMM yyyy, HH:mm")}
                        </span>
                      </div>
                      {item.type !== "match" && item.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>
                    {item.type === "match" && (
                      <div className="mt-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            item.status === "finished"
                              ? "bg-green-500/20 text-green-600"
                              : item.status === "live"
                              ? "bg-red-kings/20 text-red-kings"
                              : "bg-gray-500/20 text-gray-600"
                          }`}
                        >
                          {item.status === "finished"
                            ? "Finalizado"
                            : item.status === "live"
                            ? "En Vivo"
                            : "Programado"}
                        </span>
                        {item.status === "finished" && (
                          <span className="ml-2 text-lg font-bold">
                            {item.homeScore} - {item.awayScore}
                          </span>
                        )}
                      </div>
                    )}
                    {item.description && (
                      <p className="mt-2 text-gray-300">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {allItems.length === 0 && (
              <div className="text-center py-12 bg-gray-800 rounded-2xl shadow-lg">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  No hay eventos programados
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

