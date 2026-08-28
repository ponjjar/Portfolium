import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Modal } from '@/components/ui/modal';
import { FormField } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react-native';

interface AddSkillModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, category: string) => void;
  existingSkills: string[];
}

const CATEGORIES = [
  'Frontend',
  'Backend',
  'Mobile',
  'Database',
  'Cloud & Delivery',
  'Testing',
  'AI',
  'Tools',
  'Other'
];

export function AddSkillModal({ visible, onClose, onAdd, existingSkills }: AddSkillModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Informe o nome da tecnologia.');
      return;
    }
    
    // Check for duplicates case-insensitive
    const isDuplicate = existingSkills.some(s => s.toLowerCase() === trimmedName.toLowerCase());
    if (isDuplicate) {
      setError('Esta tecnologia já existe na lista.');
      return;
    }

    onAdd(trimmedName, category);
    setName('');
    setCategory(CATEGORIES[0]);
    setError(null);
    onClose();
  };

  const handleClose = () => {
    setName('');
    setCategory(CATEGORIES[0]);
    setError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      title="Adicionar tecnologia"
      size="sm"
      footer={
        <>
          <Button variant="ghost" className="flex-1 mr-2" onPress={handleClose}>
            <Text className="text-text font-bold">Cancelar</Text>
          </Button>
          <Button variant="default" className="flex-1 ml-2" onPress={handleAdd}>
            <Text className="text-primary-foreground font-bold">Adicionar</Text>
          </Button>
        </>
      }
    >
      <View className="py-2">
        <FormField
          label="Nome da Tecnologia"
          placeholder="ex: React, Python, Docker..."
          value={name}
          onChangeText={(text) => {
            setName(text);
            setError(null);
          }}
          onSubmitEditing={handleAdd}
          error={error || undefined}
        />
        

        <Text className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-2 mt-2">
          Categoria
        </Text>
        
        <View className="flex-row flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full border ${
                category === cat 
                  ? 'bg-primary border-primary' 
                  : 'bg-transparent border-border'
              }`}
            >
              <Text className={`${category === cat ? 'text-primary-foreground font-bold' : 'text-text-secondary'} text-xs mr-1`}>
                {cat}
              </Text>
              {category === cat && <Check color="var(--primary-foreground)" size={12} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}
