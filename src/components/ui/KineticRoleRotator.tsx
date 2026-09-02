import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export function KineticRoleRotator() {
  const { t } = useTranslation();
  const roles = [
    t('landing.role_fullstack'),
    t('landing.role_frontend'),
    t('landing.role_architect'),
    t('landing.role_opensource'),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return;

    const interval = setInterval(() => {
      setFadeState('out');
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % roles.length);
        setFadeState('in');
      }, 300);
    }, 3200);

    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <View className="h-14 sm:h-20 justify-center items-center overflow-hidden">
      <Text
        className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-center transition-all duration-300 transform ${
          fadeState === 'in'
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-4 scale-95'
        }`}
        style={{
          backgroundImage: 'linear-gradient(135deg, var(--primary) 0%, #38bdf8 50%, #c084fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        } as any}
      >
        {roles[currentIndex]}
      </Text>
    </View>
  );
}
