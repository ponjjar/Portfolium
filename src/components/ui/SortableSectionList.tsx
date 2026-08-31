import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { User, Briefcase, Code, ArrowUp, ArrowDown, Edit2 } from 'lucide-react-native';
import { PortfolioSection } from '@/domain/portfolio/types';

interface SortableSectionListProps {
  sections: PortfolioSection[];
  onReorder: (sections: PortfolioSection[]) => void;
  onEdit: (sectionId: string) => void;
}

const SECTION_META: Record<string, { label: string; icon: any }> = {
  hero: { label: 'Perfil', icon: User },
  projects: { label: 'Projetos', icon: Briefcase },
  skills: { label: 'Tecnologias', icon: Code },
  experience: { label: 'Experiência', icon: Briefcase },
  education: { label: 'Educação', icon: Briefcase },
  contact: { label: 'Contato', icon: User },
};

export function SortableSectionList({ sections, onReorder, onEdit }: SortableSectionListProps) {
  const items = [...sections].sort((a, b) => a.order - b.order);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;

    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Update orders
    const reordered = newItems.map((item, idx) => ({
      ...item,
      order: idx,
    }));
    
    onReorder(reordered);
  };

  return (
    <View className="w-full">
      {items.map((section, index) => {
        const meta = SECTION_META[section.id] || { label: section.id, icon: User };
        const Icon = meta.icon;

        return (
          <View
            key={section.id}
            className="flex-row items-center bg-surface p-3 rounded mb-2 border border-border shadow-sm"
          >
            <View className="flex-col mr-2">
              <TouchableOpacity
                onPress={() => moveItem(index, 'up')}
                disabled={index === 0}
                className="p-1 opacity-70 hover:opacity-100 disabled:opacity-30"
              >
                <ArrowUp color="var(--text-muted)" size={14} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => moveItem(index, 'down')}
                disabled={index === items.length - 1}
                className="p-1 opacity-70 hover:opacity-100 disabled:opacity-30"
              >
                <ArrowDown color="var(--text-muted)" size={14} />
              </TouchableOpacity>
            </View>
            <Icon color="var(--text)" size={16} className="mr-3" />
            <Text className="text-text flex-1">{meta.label}</Text>
            <TouchableOpacity onPress={() => onEdit(section.id)} className="p-2 bg-input-background hover:bg-surface-elevated rounded">
              <Edit2 color="var(--text-secondary)" size={14} />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}
