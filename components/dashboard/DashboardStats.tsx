"use client";

import { TrendingUp, TrendingDown, Trophy, Users, Euro, Target } from "lucide-react";

interface DashboardStatsProps {
  data: {
    type: "team" | "player";
    data: any;
  };
}

export function DashboardStats({ data }: DashboardStatsProps) {
  if (data.type === "team") {
    const teamData = data.data;
    return (
      <div className="space-y-6">
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-kings to-blue-dark rounded-2xl shadow-lg p-6 text-white animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="h-8 w-8 opacity-80" />
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="text-3xl font-bold mb-1">{teamData.points}</div>
            <div className="text-sm opacity-90">Puntos Totales</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <Target className="h-8 w-8 opacity-80" />
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="text-3xl font-bold mb-1">{teamData.wins}</div>
            <div className="text-sm opacity-90">Victorias</div>
          </div>

          <div className="bg-gradient-to-br from-gold-kings to-gold-dark rounded-2xl shadow-lg p-6 text-white animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <Target className="h-8 w-8 opacity-80" />
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="text-3xl font-bold mb-1">{teamData.goals}</div>
            <div className="text-sm opacity-90">Goles Totales</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{teamData.players}</div>
            <div className="text-sm opacity-90">Jugadores</div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 animate-fade-in">
            <div className="flex items-center space-x-3 mb-4">
              <Euro className="h-6 w-6 text-gold-kings" />
              <h3 className="font-bold text-lg">Euros Kings</h3>
            </div>
            <div className="text-3xl font-bold text-gold-kings">
              {teamData.eurosKings.toFixed(0)} €K
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 animate-fade-in">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="h-6 w-6 text-green-500" />
              <h3 className="font-bold text-lg">Asistencias</h3>
            </div>
            <div className="text-3xl font-bold text-green-500">
              {teamData.assists}
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 animate-fade-in">
            <div className="flex items-center space-x-3 mb-4">
              <Trophy className="h-6 w-6 text-blue-kings" />
              <h3 className="font-bold text-lg">Partidos</h3>
            </div>
            <div className="text-3xl font-bold text-blue-kings">
              {teamData.matches}
            </div>
            <div className="text-sm text-gray-400 mt-2">
              {teamData.wins}W - {teamData.draws}E - {teamData.losses}L
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Player stats
  const playerData = data.data;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-kings to-blue-dark rounded-2xl shadow-lg p-6 text-white animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <Target className="h-8 w-8 opacity-80" />
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="text-3xl font-bold mb-1">{playerData.goals}</div>
          <div className="text-sm opacity-90">Goles</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 opacity-80" />
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="text-3xl font-bold mb-1">{playerData.assists}</div>
          <div className="text-sm opacity-90">Asistencias</div>
        </div>

        <div className="bg-gradient-to-br from-gold-kings to-gold-dark rounded-2xl shadow-lg p-6 text-white animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="h-8 w-8 opacity-80" />
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="text-3xl font-bold mb-1">{playerData.points}</div>
          <div className="text-sm opacity-90">Puntos Fantasy</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <Target className="h-8 w-8 opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-1">{playerData.matches}</div>
          <div className="text-sm opacity-90">Partidos</div>
        </div>

        <div className="bg-gradient-to-br from-red-kings to-red-dark rounded-2xl shadow-lg p-6 text-white animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="h-8 w-8 opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-1">{playerData.mvpCount}</div>
          <div className="text-sm opacity-90">MVPs</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <Euro className="h-8 w-8 opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {playerData.marketValue.toFixed(0)} €K
          </div>
          <div className="text-sm opacity-90">Valor de Mercado</div>
        </div>
      </div>
    </div>
  );
}

