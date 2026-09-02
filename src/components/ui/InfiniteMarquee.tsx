import React, { useEffect } from 'react';
import { View } from 'react-native';

interface InfiniteMarqueeProps {
  items?: string[];
  reverse?: boolean;
}

const DEFAULT_ITEMS = [
  'LOCAL-FIRST SOVEREIGNTY',
  'GITHUB MANIFEST SCANNER',
  '9 VISUAL PRESETS & ORBIT LAYOUTS',
  'ATS-READY RESUME ENGINE',
  'HTML5 + CSS AUTOCONTIDO',
  'ZERO TRACKERS & ZERO LEAKS',
  'REACT 19 + EXPO SDK 57',
  'OPEN SOURCE MIT LICENSED',
];

export function InfiniteMarquee({ items = DEFAULT_ITEMS, reverse = false }: InfiniteMarqueeProps) {
  useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('infinite-marquee-style')) {
      const style = document.createElement('style');
      style.id = 'infinite-marquee-style';
      style.innerHTML = `
        @keyframes marquee-scroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-scroll-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee-scroll 28s linear infinite;
        }
        .animate-marquee-reverse {
          display: flex;
          width: max-content;
          animation: marquee-scroll-reverse 28s linear infinite;
        }
        .animate-marquee:hover, .animate-marquee-reverse:hover {
          animation-play-state: paused;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const content = [...items, ...items, ...items, ...items];

  return (
    <View className="w-full overflow-hidden border-y border-border/80 bg-surface/50 py-4 select-none">
      <div className={reverse ? 'animate-marquee-reverse' : 'animate-marquee'}>
        {content.map((item, index) => (
          <div key={index} className="flex items-center gap-6 px-6">
            <span className="text-text font-black text-sm md:text-base tracking-[0.2em] uppercase font-mono">
              {item}
            </span>
            <span className="text-primary text-base font-black">✦</span>
          </div>
        ))}
      </div>
    </View>
  );
}
