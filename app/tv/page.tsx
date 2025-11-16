"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Trophy, Calendar, Star, TrendingUp, Medal } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Función para limpiar HTML y obtener solo texto
const stripHtml = (html: string): string => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

interface Team {
  id: string;
  name: string;
  logo: string | null;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  owner: { name: string };
}

interface Match {
  id: string;
  homeTeam: { name: string; logo: string | null };
  awayTeam: { name: string; logo: string | null };
  matchDate: string;
}

interface Player {
  id: string;
  name: string;
  position: string;
  photo: string | null;
  team: { name: string } | null;
  stats: {
    goals: number;
    assists: number;
    points: number;
    mvpCount: number;
    matches: number;
  } | null;
}

interface News {
  id: string;
  title: string;
  content: string;
  image: string | null;
  createdAt: string;
}

export default function TVModePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [teams, setTeams] = useState<Team[]>([]);
  const [nextMatch, setNextMatch] = useState<Match | null>(null);
  const [topPlayer, setTopPlayer] = useState<Player | null>(null);
  const [mvpPlayer, setMvpPlayer] = useState<Player | null>(null);
  const [latestNews, setLatestNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  const slides = ['standings', 'nextMatch', 'news', 'topPlayer', 'mvp'];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Cambiar de slide cada 10 segundos
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const fetchData = async () => {
    try {
      // Fetch standings
      const teamsRes = await fetch('/api/teams');
      const teamsData = await teamsRes.json();
      setTeams(teamsData.sort((a: Team, b: Team) => b.points - a.points).slice(0, 5));

      // Fetch next match
      const matchesRes = await fetch('/api/matches?status=scheduled&limit=1');
      const matchesData = await matchesRes.json();
      if (matchesData.length > 0) {
        setNextMatch(matchesData[0]);
      }

      // Fetch top player by points
      const playersRes = await fetch('/api/players?sort=points&limit=1');
      const playersData = await playersRes.json();
      if (playersData.length > 0) {
        setTopPlayer(playersData[0]);
      }

      // Fetch MVP (most MVPs)
      const mvpRes = await fetch('/api/players?sort=mvp&limit=1');
      const mvpData = await mvpRes.json();
      if (mvpData.length > 0) {
        setMvpPlayer(mvpData[0]);
      }

      // Fetch latest news
      const newsRes = await fetch('/api/news?limit=1');
      const newsData = await newsRes.json();
      if (newsData.length > 0) {
        setLatestNews(newsData[0]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching TV mode data:', error);
      setLoading(false);
    }
  };

  const exitTVMode = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black-kings via-gray-900 to-black-kings flex items-center justify-center">
        <div className="text-white text-4xl">Cargando Modo TV...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black-kings via-gray-900 to-black-kings text-white relative overflow-hidden">
      {/* Botón de salir - pequeño y discreto */}
      <button
        onClick={exitTVMode}
        className="fixed top-6 right-6 p-3 bg-red-kings/80 hover:bg-red-kings rounded-full transition-all z-50 backdrop-blur-sm"
        title="Salir del Modo TV"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Logo en la esquina */}
      <div className="fixed top-6 left-6 flex items-center space-x-3 z-40">
        <Trophy className="h-12 w-12 text-gold-kings" />
        <div>
          <div className="text-3xl font-bold text-white">Kings League</div>
          <div className="text-sm text-gray-400">Modo TV</div>
        </div>
      </div>

      {/* Indicador de slides */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-40">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'w-12 bg-gold-kings'
                : 'w-2 bg-gray-600'
            }`}
          />
        ))}
      </div>

      {/* Carrusel de contenido */}
      <div className="h-screen flex items-center justify-center p-12">
        <div className="w-full max-w-7xl animate-fade-in">
          {/* Slide 1: Clasificación */}
          {currentSlide === 0 && (
            <div className="space-y-6">
              <div className="text-center mb-12">
                <Trophy className="h-20 w-20 text-gold-kings mx-auto mb-4 animate-pulse" />
                <h1 className="text-7xl font-bold mb-4 text-gold-kings">Clasificación</h1>
                <p className="text-3xl text-gray-400">Posiciones Actuales</p>
              </div>

              <div className="space-y-4">
                {teams.map((team, index) => (
                  <div
                    key={team.id}
                    className={`flex items-center justify-between p-8 rounded-3xl transition-all ${
                      index === 0
                        ? 'bg-gradient-to-r from-gold-kings to-gold-dark scale-105'
                        : index === 1
                        ? 'bg-gradient-to-r from-gray-400 to-gray-500'
                        : index === 2
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                        : 'bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center space-x-8">
                      <div className="text-6xl font-bold w-20 text-center">
                        {index < 3 && <Medal className="h-16 w-16 inline" />}
                        {index + 1}
                      </div>
                      {team.logo && (
                        <img
                          src={team.logo}
                          alt={team.name}
                          className="h-24 w-24 rounded-full object-cover border-4 border-white"
                        />
                      )}
                      <div>
                        <div className="text-5xl font-bold">{team.name}</div>
                        <div className="text-2xl text-white/80 mt-2">{team.owner.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-7xl font-bold">{team.points}</div>
                      <div className="text-2xl text-white/80">puntos</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Slide 2: Próximo Partido */}
          {currentSlide === 1 && (
            nextMatch ? (
            <div className="text-center space-y-12">
              <div>
                <Calendar className="h-20 w-20 text-blue-kings mx-auto mb-6 animate-pulse" />
                <h1 className="text-7xl font-bold mb-6 text-blue-kings">Próximo Partido</h1>
                <p className="text-4xl text-gray-300">
                  {format(new Date(nextMatch.matchDate), "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es })}
                </p>
              </div>

              <div className="flex items-center justify-center space-x-20 mt-20">
                <div className="text-center">
                  {nextMatch.homeTeam.logo && (
                    <img
                      src={nextMatch.homeTeam.logo}
                      alt={nextMatch.homeTeam.name}
                      className="h-48 w-48 mx-auto mb-8 rounded-full object-cover border-8 border-blue-kings shadow-2xl"
                    />
                  )}
                  <div className="text-6xl font-bold">{nextMatch.homeTeam.name}</div>
                </div>

                <div className="text-8xl font-bold text-gold-kings animate-pulse">VS</div>

                <div className="text-center">
                  {nextMatch.awayTeam.logo && (
                    <img
                      src={nextMatch.awayTeam.logo}
                      alt={nextMatch.awayTeam.name}
                      className="h-48 w-48 mx-auto mb-8 rounded-full object-cover border-8 border-red-kings shadow-2xl"
                    />
                  )}
                  <div className="text-6xl font-bold">{nextMatch.awayTeam.name}</div>
                </div>
              </div>
            </div>
            ) : (
              <div className="text-center">
                <Calendar className="h-20 w-20 text-blue-kings mx-auto mb-6" />
                <h1 className="text-7xl font-bold mb-8 text-blue-kings">Próximo Partido</h1>
                <div className="text-4xl text-gray-500 py-20">
                  📅 No hay partidos programados
                </div>
              </div>
            )
          )}

          {/* Slide 3: Noticia */}
          {currentSlide === 2 && (
            <div className="text-center space-y-8">
              <div>
                <Star className="h-20 w-20 text-gold-kings mx-auto mb-6 animate-bounce" />
                <h1 className="text-7xl font-bold mb-8 text-gold-kings">Últimas Noticias</h1>
              </div>

              {latestNews ? (
                <>
                  {latestNews.image && (
                    <img
                      src={latestNews.image}
                      alt={latestNews.title}
                      className="w-full max-w-4xl mx-auto rounded-3xl shadow-2xl mb-8"
                    />
                  )}

                  <h2 className="text-6xl font-bold mb-6">{latestNews.title}</h2>
                  <p className="text-3xl text-gray-300 leading-relaxed max-w-5xl mx-auto">
                    {stripHtml(latestNews.content).substring(0, 300)}...
                  </p>
                </>
              ) : (
                <div className="text-4xl text-gray-500 py-20">
                  📰 No hay noticias disponibles
                </div>
              )}
            </div>
          )}

          {/* Slide 4: Mejor Jugador */}
          {currentSlide === 3 && (
            topPlayer ? (
            <div className="text-center space-y-8">
              <div>
                <TrendingUp className="h-20 w-20 text-blue-kings mx-auto mb-6 animate-pulse" />
                <h1 className="text-7xl font-bold mb-8 text-blue-kings">Mejor Jugador</h1>
                <p className="text-3xl text-gray-400">Por Puntos Fantasy</p>
              </div>

              <div className="mt-12">
                {topPlayer.photo ? (
                  <img
                    src={topPlayer.photo}
                    alt={topPlayer.name}
                    className="h-64 w-64 mx-auto rounded-full object-cover border-8 border-blue-kings shadow-2xl mb-8"
                  />
                ) : (
                  <div className="h-64 w-64 mx-auto rounded-full bg-blue-kings flex items-center justify-center text-9xl font-bold border-8 border-white shadow-2xl mb-8">
                    {topPlayer.name.charAt(0)}
                  </div>
                )}

                <h2 className="text-7xl font-bold mb-4">{topPlayer.name}</h2>
                <p className="text-4xl text-gray-300 mb-8">
                  {topPlayer.position} - {topPlayer.team?.name || 'Sin equipo'}
                </p>

                <div className="grid grid-cols-4 gap-8 max-w-4xl mx-auto mt-12">
                  <div className="bg-gray-800 rounded-2xl p-8">
                    <div className="text-6xl font-bold text-gold-kings">{topPlayer.stats?.points || 0}</div>
                    <div className="text-2xl text-gray-400 mt-2">Puntos</div>
                  </div>
                  <div className="bg-gray-800 rounded-2xl p-8">
                    <div className="text-6xl font-bold text-green-500">{topPlayer.stats?.goals || 0}</div>
                    <div className="text-2xl text-gray-400 mt-2">Goles</div>
                  </div>
                  <div className="bg-gray-800 rounded-2xl p-8">
                    <div className="text-6xl font-bold text-blue-500">{topPlayer.stats?.assists || 0}</div>
                    <div className="text-2xl text-gray-400 mt-2">Asistencias</div>
                  </div>
                  <div className="bg-gray-800 rounded-2xl p-8">
                    <div className="text-6xl font-bold text-purple-500">{topPlayer.stats?.matches || 0}</div>
                    <div className="text-2xl text-gray-400 mt-2">Partidos</div>
                  </div>
                </div>
              </div>
            </div>
            ) : (
              <div className="text-center">
                <TrendingUp className="h-20 w-20 text-blue-kings mx-auto mb-6" />
                <h1 className="text-7xl font-bold mb-8 text-blue-kings">Mejor Jugador</h1>
                <div className="text-4xl text-gray-500 py-20">
                  📊 No hay datos de jugadores disponibles
                </div>
              </div>
            )
          )}

          {/* Slide 5: MVP */}
          {currentSlide === 4 && (
            mvpPlayer ? (
            <div className="text-center space-y-8">
              <div>
                <Star className="h-20 w-20 text-gold-kings mx-auto mb-6 animate-bounce" />
                <h1 className="text-7xl font-bold mb-8 text-gold-kings">Jugador MVP</h1>
                <p className="text-3xl text-gray-400">Más Veces MVP del Partido</p>
              </div>

              <div className="mt-12">
                {mvpPlayer.photo ? (
                  <img
                    src={mvpPlayer.photo}
                    alt={mvpPlayer.name}
                    className="h-64 w-64 mx-auto rounded-full object-cover border-8 border-gold-kings shadow-2xl mb-8"
                  />
                ) : (
                  <div className="h-64 w-64 mx-auto rounded-full bg-gold-kings flex items-center justify-center text-9xl font-bold border-8 border-white shadow-2xl mb-8">
                    {mvpPlayer.name.charAt(0)}
                  </div>
                )}

                <h2 className="text-7xl font-bold mb-4">{mvpPlayer.name}</h2>
                <p className="text-4xl text-gray-300 mb-8">
                  {mvpPlayer.position} - {mvpPlayer.team?.name || 'Sin equipo'}
                </p>

                <div className="bg-gradient-to-r from-gold-kings to-gold-dark rounded-3xl p-12 max-w-2xl mx-auto mt-12">
                  <div className="text-9xl font-bold mb-4">{mvpPlayer.stats?.mvpCount || 0}</div>
                  <div className="text-4xl">Veces MVP del Partido</div>
                </div>

                <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
                  <div className="bg-gray-800 rounded-2xl p-8">
                    <div className="text-6xl font-bold text-green-500">{mvpPlayer.stats?.goals || 0}</div>
                    <div className="text-2xl text-gray-400 mt-2">Goles</div>
                  </div>
                  <div className="bg-gray-800 rounded-2xl p-8">
                    <div className="text-6xl font-bold text-blue-500">{mvpPlayer.stats?.assists || 0}</div>
                    <div className="text-2xl text-gray-400 mt-2">Asistencias</div>
                  </div>
                  <div className="bg-gray-800 rounded-2xl p-8">
                    <div className="text-6xl font-bold text-gold-kings">{mvpPlayer.stats?.points || 0}</div>
                    <div className="text-2xl text-gray-400 mt-2">Puntos</div>
                  </div>
                </div>
              </div>
            </div>
            ) : (
              <div className="text-center">
                <Star className="h-20 w-20 text-gold-kings mx-auto mb-6" />
                <h1 className="text-7xl font-bold mb-8 text-gold-kings">Jugador MVP</h1>
                <div className="text-4xl text-gray-500 py-20">
                  🏆 No hay datos de MVP disponibles
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

