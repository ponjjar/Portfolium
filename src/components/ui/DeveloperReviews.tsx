import React from 'react';
import { View, Text } from 'react-native';
import { Star, Quote, CheckCircle2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/theme/ThemeContext';

export function DeveloperReviews() {
  const { t } = useTranslation();
  const colors = useThemeColors();

  const reviews = [
    {
      id: '1',
      name: 'Lucas Pinheiro',
      role: t('landing.reviews_rev1_role'),
      avatarText: 'LP',
      rating: 5,
      text: t('landing.reviews_rev1_text'),
      tags: ['React 19', 'TypeScript', 'GitHub Pages'],
    },
    {
      id: '2',
      name: 'Marina Watanabe',
      role: t('landing.reviews_rev2_role'),
      avatarText: 'MW',
      rating: 5,
      text: t('landing.reviews_rev2_text'),
      tags: ['Rust', 'Go', 'Local-First'],
    },
    {
      id: '3',
      name: 'Gabriel Alencar',
      role: t('landing.reviews_rev3_role'),
      avatarText: 'GA',
      rating: 5,
      text: t('landing.reviews_rev3_text'),
      tags: ['ATS Resume', 'WebPerf', 'Zero Tracker'],
    },
    {
      id: '4',
      name: 'Sofia Duarte',
      role: t('landing.reviews_rev4_role'),
      avatarText: 'SD',
      rating: 5,
      text: t('landing.reviews_rev4_text'),
      tags: ['Amoled Black', 'Orbit Layout', 'GSAP'],
    },
  ];

  return (
    <View className="w-full flex-col md:flex-row flex-wrap gap-6">
      {reviews.map((review) => (
        <View
          key={review.id}
          className="w-full md:flex-1 md:min-w-[420px] p-6 sm:p-7 rounded-3xl bg-background border border-border shadow-md hover:border-primary/40 transition-all flex-col justify-between"
        >
          {/* Top Reviewer Info */}
          <View className="mb-5">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-3.5">
                <View className="w-11 h-11 rounded-xl bg-surface-elevated border border-border items-center justify-center">
                  <Text className="text-primary font-black text-xs font-mono">
                    {review.avatarText}
                  </Text>
                </View>
                <View>
                  <View className="flex-row items-center gap-1.5">
                    <Text className="text-text font-bold text-base">{review.name}</Text>
                    <CheckCircle2 size={13} color={colors.primary} />
                  </View>
                  <Text className="text-text-muted text-xs font-medium">{review.role}</Text>
                </View>
              </View>

              {/* Star Rating */}
              <View className="flex-row items-center gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={13} fill={colors.primary} color={colors.primary} />
                ))}
              </View>
            </View>

            {/* Review Quote Text */}
            <View className="relative">
              <Quote size={18} color={colors.textMuted} className="opacity-30 mb-2" />
              <Text className="text-text-secondary text-sm md:text-base leading-relaxed">
                "{review.text}"
              </Text>
            </View>
          </View>

          {/* Tags */}
          <View className="flex-row flex-wrap gap-2 pt-4 border-t border-border">
            {review.tags.map((tag) => (
              <View
                key={tag}
                className="px-2.5 py-1 rounded-full bg-surface border border-border"
              >
                <Text className="text-text-muted text-xs font-mono font-medium">#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
