import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { Trophy, Award, Star } from "lucide-react";

async function getUserAchievements(userId: string) {
  return await prisma.userAchievement.findMany({
    where: { userId },
    include: {
      achievement: true,
    },
    orderBy: {
      unlockedAt: "desc",
    },
  });
}

async function getAllAchievements() {
  return await prisma.achievement.findMany({
    orderBy: {
      category: "asc",
    },
  });
}

export default async function AchievementsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const [userAchievements, allAchievements] = await Promise.all([
    getUserAchievements(session.user.id),
    getAllAchievements(),
  ]);

  const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white-kings via-white-off to-gray-100 dark:from-black-dark dark:via-gray-900 dark:to-black-kings py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-8">
            <Trophy className="h-8 w-8 text-gold-kings" />
            <h1 className="text-4xl font-bold">Logros y Badges</h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center animate-scale-in">
              <div className="text-4xl font-bold text-gold-kings mb-2">
                {userAchievements.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Logros Desbloqueados
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center animate-scale-in">
              <div className="text-4xl font-bold text-blue-kings mb-2">
                {allAchievements.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Logros Totales
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center animate-scale-in">
              <div className="text-4xl font-bold text-green-500 mb-2">
                {Math.round((userAchievements.length / allAchievements.length) * 100) || 0}%
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Progreso
              </div>
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allAchievements.map((achievement) => {
              const isUnlocked = unlockedIds.has(achievement.id);
              const userAchievement = userAchievements.find(
                (ua) => ua.achievementId === achievement.id
              );

              return (
                <div
                  key={achievement.id}
                  className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-2 transition-all duration-200 animate-fade-in ${
                    isUnlocked
                      ? "border-gold-kings bg-gradient-to-br from-gold-kings/10 to-gold-kings/5"
                      : "border-gray-200 dark:border-gray-700 opacity-60"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`text-4xl ${
                        isUnlocked ? "" : "grayscale opacity-50"
                      }`}
                    >
                      {achievement.icon || "🏆"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-bold text-lg">{achievement.name}</h3>
                        {isUnlocked && (
                          <Award className="h-5 w-5 text-gold-kings" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {achievement.description}
                      </p>
                      <div className="text-xs text-gray-500">
                        Categoría: {achievement.category}
                      </div>
                      {isUnlocked && userAchievement && (
                        <div className="text-xs text-gold-kings mt-2">
                          Desbloqueado:{" "}
                          {new Date(userAchievement.unlockedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {allAchievements.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No hay logros disponibles aún
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

