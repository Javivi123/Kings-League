'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { X, ChevronRight, ChevronLeft, SkipForward } from 'lucide-react';

interface TutorialStep {
  title: string;
  description: string;
  target?: string; // ID del elemento a destacar
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const tutorialSteps: TutorialStep[] = [
  {
    title: '👋 ¡Bienvenido a Kings League!',
    description: 'Te voy a guiar por las principales funciones de la aplicación. Puedes avanzar con las flechas o saltar el tutorial en cualquier momento.',
    position: 'bottom'
  },
  {
    title: '📊 Navegación Principal',
    description: 'Aquí arriba encontrarás el menú principal con todas las secciones: Equipos, Jugadores, Clasificación, y más.',
    position: 'bottom'
  },
  {
    title: '🔔 Notificaciones',
    description: 'En la campana puedes ver tus notificaciones importantes sobre transferencias, partidos y más.',
    position: 'bottom'
  },
  {
    title: '👤 Tu Perfil',
    description: 'Accede a tu perfil, configuración y opciones de cuenta desde el menú de usuario.',
    position: 'bottom'
  },
  {
    title: '⚽ Partidos y Clasificación',
    description: 'Consulta los últimos resultados, próximos partidos y la clasificación de la liga en tiempo real.',
    position: 'top'
  },
  {
    title: '🏆 Sistema de Puntos',
    description: 'Cada acción en los partidos otorga puntos fantasy. Goles, asistencias, tarjetas... ¡todo cuenta!',
    position: 'top'
  },
  {
    title: '💰 Euros Kings',
    description: 'La moneda virtual del juego. Úsala para transferencias, cartas comodín e inversiones en jugadores.',
    position: 'top'
  },
  {
    title: '✅ ¡Listo para Empezar!',
    description: 'Ya conoces lo básico. Explora la aplicación y diviértete gestionando tu equipo. ¡Buena suerte!',
    position: 'bottom'
  }
];

export function Tutorial() {
  const { data: session, status } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Solo mostrar el tutorial si el usuario está autenticado y no lo ha visto
    if (status === 'authenticated' && session?.user?.hasSeenTutorial === false) {
      setIsLoading(false);
      // Mostrar el tutorial después de un pequeño delay
      setTimeout(() => setIsVisible(true), 1000);
    } else if (status === 'authenticated' || status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [status, session]);

  // Crear confetti
  const createConfetti = () => {
    const colors = ['#DC2626', '#2563EB', '#F59E0B', '#10B981', '#8B5CF6'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
      }, i * 30);
    }
  };

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mostrar celebración antes de completar
      setShowCelebration(true);
      createConfetti();
      setTimeout(() => {
        completeTutorial();
      }, 2000);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    completeTutorial();
  };

  const completeTutorial = async () => {
    setShowCelebration(false);
    setIsVisible(false);
    
    // Marcar el tutorial como completado en la base de datos
    try {
      await fetch('/api/tutorial/complete', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error al marcar tutorial como completado:', error);
    }
  };

  if (isLoading || !isVisible) {
    return null;
  }

  const step = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <>
      {/* Overlay oscuro */}
      <div 
        className="fixed inset-0 bg-black/80 z-50 animate-fade-in"
        onClick={handleSkip}
      />

      {/* Modal del tutorial */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-gradient-to-br from-gray-900 to-black-dark rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-scale-in pointer-events-auto border border-gold-kings/30"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">
                {step.title}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Paso {currentStep + 1} de {tutorialSteps.length}</span>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Cerrar tutorial"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
            <div
              className="bg-gradient-to-r from-blue-kings via-gold-kings to-red-kings h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Contenido */}
          <p className="text-base text-white mb-8 leading-relaxed">
            {step.description}
          </p>

          {/* Navegación */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              <SkipForward className="h-4 w-4" />
              <span className="text-sm">Omitir</span>
            </button>

            <div className="flex items-center space-x-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Anterior</span>
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={showCelebration}
                className={`flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-kings via-gold-kings to-red-kings text-white rounded-lg hover:shadow-lg transition-all hover-lift font-semibold ${showCelebration ? 'animate-pulse' : ''}`}
              >
                <span>{showCelebration ? '🎉 ¡Genial!' : currentStep === tutorialSteps.length - 1 ? '¡Empezar!' : 'Siguiente'}</span>
                {!showCelebration && <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

