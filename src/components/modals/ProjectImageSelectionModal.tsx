import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Check, CheckCircle2 } from 'lucide-react-native';
import { ImagePickerField } from '@/components/ui/image-picker-field';
import { ImageCandidate } from '@/services/github/github-readme';
import { PortfolioImage } from '@/domain/portfolio/types';

interface ProjectImageSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  projectName: string;
  candidates: ImageCandidate[];
  onConfirm: (image: PortfolioImage | null) => void;
}

export function ProjectImageSelectionModal({
  visible,
  onClose,
  projectName,
  candidates,
  onConfirm
}: ProjectImageSelectionModalProps) {
  // -1 means manual image, 0+ means candidate index
  const [selectedIndex, setSelectedIndex] = useState<number>(candidates.length > 0 ? 0 : -1);
  const [manualImage, setManualImage] = useState<PortfolioImage | null>(null);

  const handleConfirm = () => {
    if (selectedIndex === -1 && manualImage) {
      onConfirm(manualImage);
    } else if (selectedIndex >= 0 && selectedIndex < candidates.length) {
      const candidate = candidates[selectedIndex];
      onConfirm({
        type: 'url',
        value: candidate.url,
        source: 'github-readme',
        width: candidate.width,
        height: candidate.height,
      });
    } else {
      onConfirm(null); // No image
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Escolher imagem do projeto"
      size="md"
      footer={
        <>
          <Button variant="ghost" className="flex-1 mr-2" onPress={onClose}>
            <Text className="text-text font-bold">Cancelar</Text>
          </Button>
          <Button variant="default" className="flex-1 ml-2" onPress={handleConfirm}>
            <Text className="text-primary-foreground font-bold">Confirmar</Text>
          </Button>
        </>
      }
    >
      <View className="py-2">
        <Text className="text-text-secondary text-sm mb-4">
          Projeto: <Text className="text-text font-bold">{projectName}</Text>
        </Text>

        {candidates.length > 0 && (
          <>
            <Text className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-3">
              Imagens do README ({candidates.length})
            </Text>
            
            <View className="flex-row flex-wrap justify-between gap-y-4 mb-6">
              {candidates.map((candidate, idx) => (
                <TouchableOpacity
                  key={candidate.url}
                  onPress={() => setSelectedIndex(idx)}
                  className={`w-[48%] bg-surface border rounded-xl overflow-hidden p-2 ${
                    selectedIndex === idx ? 'border-primary' : 'border-border'
                  }`}
                >
                  <View className="w-full aspect-video bg-input-background rounded overflow-hidden mb-2 relative">
                    <Image 
                      source={{ uri: candidate.url }} 
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="contain" 
                    />
                    {selectedIndex === idx && (
                      <View className="absolute top-2 right-2 bg-surface rounded-full">
                        <CheckCircle2 color="#10b981" size={20} />
                      </View>
                    )}
                  </View>
                  <View className="flex-row justify-between items-center px-1">
                    <Text className="text-text-secondary text-xs" numberOfLines={1}>
                      Candidato {idx + 1}
                    </Text>
                    {candidate.width && candidate.height && (
                      <Text className="text-text-muted text-[10px]">
                        {candidate.width}×{candidate.height}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <Text className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-3">
          Imagem Manual
        </Text>
        
        <View className={`border rounded-xl p-4 mb-2 ${selectedIndex === -1 ? 'border-primary' : 'border-border'}`}>
          <ImagePickerField
            value={manualImage?.value}
            isUrl={manualImage?.type === 'url'}
            onChange={(val, isUrl) => {
              if (val) {
                setManualImage({
                  type: isUrl ? 'url' : 'embedded',
                  value: val,
                  source: 'manual'
                });
                setSelectedIndex(-1);
              } else {
                setManualImage(null);
                setSelectedIndex(candidates.length > 0 ? 0 : -1);
              }
            }}
          />
        </View>
        
      </View>
    </Modal>
  );
}
