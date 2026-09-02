import React from 'react';
import { View, Text } from 'react-native';
import { Star, Quote, CheckCircle2 } from 'lucide-react-native';

interface ReviewItem {
  id: string;
  name: string;
  role: string;
  avatarText: string;
  avatarBg: string;
  rating: number;
  text: string;
  tags: string[];
}

const REVIEWS: ReviewItem[] = [
  {
    id: '1',
    name: 'Lucas Pinheiro',
    role: 'Staff Frontend Engineer @ FinTech',
    avatarText: 'LP',
    avatarBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    rating: 5,
    text: 'Eu passava meses adiando atualizar meu portfólio. Com o Portfolium, conectei meu GitHub e em 2 minutos exportei um site estático limpo no GitHub Pages. Já recebi 3 convites de entrevistas elogiando a estética.',
    tags: ['React 19', 'TypeScript', 'GitHub Pages'],
  },
  {
    id: '2',
    name: 'Marina Watanabe',
    role: 'Full Stack & Open Source Creator',
    avatarText: 'MW',
    avatarBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    rating: 5,
    text: 'O gerador de GitHub README com detecção automática de manifests (package.json, Cargo.toml) transformou meu perfil. É surreal de rápido e 100% no navegador sem pedir minha senha.',
    tags: ['Rust', 'Go', 'Local-First'],
  },
  {
    id: '3',
    name: 'Gabriel Alencar',
    role: 'Tech Lead & Hiring Manager',
    avatarText: 'GA',
    avatarBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    rating: 5,
    text: 'Como contratante, a maioria dos portfólios que recebo é lenta e quebra no mobile. O HTML puro gerado pelo Portfolium tem nota 100 de performance e o formato ATS passa direto nos nossos robôs de triagem.',
    tags: ['ATS Resume', 'WebPerf', 'Zero Tracker'],
  },
  {
    id: '4',
    name: 'Sofia Duarte',
    role: 'Creative Developer & UI Designer',
    avatarText: 'SD',
    avatarBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    rating: 5,
    text: 'Os presets visuais (especialmente o AMOLED e o layout Orbital) são do nível de agências internacionais de ponta. Nada de templates genéricos ou amadores.',
    tags: ['Amoled Black', 'Orbit Layout', 'GSAP'],
  },
];

export function DeveloperReviews() {
  return (
    <View className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
      {REVIEWS.map((review) => (
        <View
          key={review.id}
          className="p-7 rounded-3xl bg-background border border-border/80 shadow-md hover:border-primary/40 transition-all flex-col justify-between"
        >
          {/* Top Reviewer Info */}
          <View className="mb-5">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-3.5">
                <View
                  className={`w-12 h-12 rounded-2xl border items-center justify-center ${review.avatarBg}`}
                >
                  <Text className="font-black text-sm">{review.avatarText}</Text>
                </View>
                <View>
                  <View className="flex-row items-center gap-1.5">
                    <Text className="text-text font-bold text-base">{review.name}</Text>
                    <CheckCircle2 size={14} color="var(--primary)" />
                  </View>
                  <Text className="text-text-muted text-xs font-medium">{review.role}</Text>
                </View>
              </View>

              {/* Star Rating */}
              <View className="flex-row items-center gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </View>
            </View>

            {/* Review Quote Text */}
            <View className="relative">
              <Quote size={20} color="var(--text-muted)" className="opacity-30 mb-2" />
              <Text className="text-text-secondary text-sm md:text-base leading-relaxed">
                "{review.text}"
              </Text>
            </View>
          </View>

          {/* Tags */}
          <View className="flex-row flex-wrap gap-2 pt-4 border-t border-border/60">
            {review.tags.map((tag) => (
              <View
                key={tag}
                className="px-2.5 py-1 rounded-full bg-surface border border-border/60"
              >
                <Text className="text-text-muted text-[11px] font-mono font-medium">#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
