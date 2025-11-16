'use client';

import { Trophy, Star, Crown, Target, Zap } from 'lucide-react';

interface FloatingIconsProps {
  type?: 'trophies' | 'stars' | 'crowns' | 'mixed';
  count?: number;
}

export function FloatingIcons({ type = 'mixed', count = 6 }: FloatingIconsProps) {
  const icons = {
    trophies: Trophy,
    stars: Star,
    crowns: Crown,
    mixed: [Trophy, Star, Crown, Target, Zap],
  };

  const getIcon = (index: number) => {
    if (type === 'mixed') {
      const IconArray = icons.mixed as any[];
      const Icon = IconArray[index % IconArray.length];
      return Icon;
    }
    return icons[type as keyof typeof icons] as any;
  };

  const getColor = (index: number) => {
    const colors = [
      'text-gold-kings',
      'text-blue-kings',
      'text-red-kings',
      'text-purple-500',
      'text-green-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const Icon = getIcon(i);
        const delay = Math.random() * 3;
        const duration = 3 + Math.random() * 2;
        const left = Math.random() * 100;
        const size = 32 + Math.random() * 32;
        
        return (
          <div
            key={i}
            className={`absolute opacity-10 ${getColor(i)}`}
            style={{
              left: `${left}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          >
            <Icon
              className="animate-float"
              style={{ width: size, height: size }}
            />
          </div>
        );
      })}
    </div>
  );
}

