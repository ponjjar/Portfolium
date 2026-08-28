import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Pressable } from 'react-native';
import { Palette, Check, Sun, Moon, Flame, MonitorSmartphone } from 'lucide-react-native';
import { useTheme, ThemeId } from '@/theme/ThemeContext';
import { useTranslation } from 'react-i18next';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<View>(null);
  const [menuLayout, setMenuLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleOpen = () => {
    buttonRef.current?.measure((_fx, _fy, width, height, px, py) => {
      setMenuLayout({ x: px, y: py, width, height });
      setIsOpen(true);
    });
  };

  const handleSelect = (id: ThemeId) => {
    setIsOpen(false);
    // Request animation originating from the button's center
    const originX = menuLayout.x + menuLayout.width / 2;
    const originY = menuLayout.y + menuLayout.height / 2;
    setTheme(id, originX, originY);
  };

  const themes: { id: ThemeId; labelKey: string; icon: React.ReactNode }[] = [
    { id: 'light', labelKey: 'theme.light', icon: <Sun size={16} color="var(--text-secondary)" /> },
    { id: 'lava', labelKey: 'theme.lava', icon: <Flame size={16} color="var(--text-secondary)" /> },
    { id: 'dark', labelKey: 'theme.dark', icon: <Moon size={16} color="var(--text-secondary)" /> },
    { id: 'amoled', labelKey: 'theme.amoled', icon: <MonitorSmartphone size={16} color="var(--text-secondary)" /> },
  ];

  return (
    <>
      <TouchableOpacity
        ref={buttonRef}
        onPress={handleOpen}
        className="w-10 h-10 items-center justify-center rounded-full bg-surface border border-border"
        accessibilityLabel={t('theme.change_theme')}
      >
        <Palette size={18} color="var(--text)" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable onPress={() => setIsOpen(false)} style={StyleSheet.absoluteFill}>
          <View
            className="absolute bg-surface-elevated border border-border rounded-xl shadow-lg p-2 min-w-[150px]"
            style={{
              top: menuLayout.y + menuLayout.height + 8,
              left: menuLayout.x - 110,
            }}
          >
            {themes.map((th) => {
              const isSelected = theme === th.id;
              return (
                <TouchableOpacity
                  key={th.id}
                  onPress={() => handleSelect(th.id)}
                  className={`flex-row items-center p-3 rounded-lg ${isSelected ? 'bg-surface' : 'bg-transparent'}`}
                >
                  <View className="mr-3">{th.icon}</View>
                  <Text className={`flex-1 ${isSelected ? 'text-text font-bold' : 'text-text-secondary'}`}>
                    {t(th.labelKey)}
                  </Text>
                  {isSelected && <Check size={16} color="var(--text)" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
