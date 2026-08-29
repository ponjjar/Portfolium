import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react-native';

export type OrbitItem = 'name' | 'links' | 'headline';

interface ProfileCenterOrbitModalProps {
  visible: boolean;
  onClose: () => void;
  order: OrbitItem[];
  onUpdateOrder: (newOrder: OrbitItem[]) => void;
}

const ITEM_LABELS: Record<OrbitItem, string> = {
  name: 'Nome',
  links: 'Links Sociais',
  headline: 'Título Profissional'
};

export function ProfileCenterOrbitModal({ visible, onClose, order, onUpdateOrder }: ProfileCenterOrbitModalProps) {
  const currentOrder = order?.length === 3 ? order : ['name', 'links', 'headline'];

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === currentOrder.length - 1) return;

    const newOrder = [...currentOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    
    onUpdateOrder(newOrder);
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Organizar Layout Orbital"
      size="sm"
      footer={
        <Button variant="default" className="w-full" onPress={onClose}>
          <Text className="text-primary-foreground font-bold">Concluir</Text>
        </Button>
      }
    >
      <View className="py-2">
        <Text className="text-text-secondary text-sm mb-4">
          Defina a ordem dos elementos que flutuam ao redor da sua foto. 
          Eles serão distribuídos visualmente nos cantos do layout.
        </Text>
        
        <View className="border border-border rounded-lg bg-input-background overflow-hidden">
          {currentOrder.map((item, index) => (
            <View 
              key={item}
              className={`flex-row items-center p-3 bg-surface ${
                index < currentOrder.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <View className="flex-col mr-3">
                <TouchableOpacity
                  onPress={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className={`p-1 ${index === 0 ? 'opacity-30' : 'opacity-70 hover:opacity-100'}`}
                >
                  <ArrowUp color="var(--text)" size={16} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => moveItem(index, 'down')}
                  disabled={index === currentOrder.length - 1}
                  className={`p-1 ${index === currentOrder.length - 1 ? 'opacity-30' : 'opacity-70 hover:opacity-100'}`}
                >
                  <ArrowDown color="var(--text)" size={16} />
                </TouchableOpacity>
              </View>
              <View className="flex-1">
                <Text className="text-text font-bold">{ITEM_LABELS[item as OrbitItem] || item}</Text>
                <Text className="text-text-muted text-xs">
                  {index === 0 ? 'Posição: Topo' : index === 1 ? 'Posição: Meio' : 'Posição: Fundo'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
}
