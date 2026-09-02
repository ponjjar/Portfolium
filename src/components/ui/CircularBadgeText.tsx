import React, { useEffect, useId } from 'react';
import { View } from 'react-native';
import { ArrowUpRight, Sparkles } from 'lucide-react-native';

interface CircularBadgeTextProps {
  text?: string;
  size?: number;
  icon?: 'arrow' | 'sparkles';
}

export function CircularBadgeText({
  text = 'PORTFOLIUM BUILDER • 100% LOCAL-FIRST • ',
  size = 110,
  icon = 'arrow',
}: CircularBadgeTextProps) {
  const uniqueId = useId();
  const pathId = `circlePath_${size}_${uniqueId.replace(/[^a-zA-Z0-9]/g, '_')}`;

  useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('circular-badge-spin-style')) {
      const style = document.createElement('style');
      style.id = 'circular-badge-spin-style';
      style.innerHTML = `
        @keyframes circular-badge-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: circular-badge-spin 14s linear infinite;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  const radius = (size - 24) / 2;
  const center = size / 2;

  return (
    <View
      className="relative items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Rotating Circular Text SVG */}
      <svg
        className="animate-spin-slow absolute inset-0 w-full h-full"
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          <path
            id={pathId}
            d={`M ${center},${center} m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
          />
        </defs>
        <text
          fill="var(--text-secondary)"
          fontSize={size < 100 ? '9' : '10'}
          fontWeight="700"
          letterSpacing="1.8"
          style={{ textTransform: 'uppercase', fontFamily: 'monospace' }}
        >
          <textPath href={`#${pathId}`} startOffset="0%">
            {text}
          </textPath>
        </text>
      </svg>

      {/* Center Icon Badge */}
      <View
        className="rounded-full bg-surface border border-border items-center justify-center shadow-lg"
        style={{ width: size * 0.42, height: size * 0.42 }}
      >
        {icon === 'arrow' ? (
          <ArrowUpRight size={size * 0.2} color="var(--primary)" />
        ) : (
          <Sparkles size={size * 0.2} color="var(--primary)" />
        )}
      </View>
    </View>
  );
}
