import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { ImageIcon, Link as LinkIcon, Trash2, Edit2 } from 'lucide-react-native';
import { pickAndProcessImage } from '@/utils/image';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';

export interface ImagePickerFieldProps {
  label?: string;
  value?: string;
  isUrl?: boolean;
  onChange: (value: string | null, isUrl: boolean) => void;
  maxFileSizeKb?: number;
}

export function ImagePickerField({ label, value, isUrl, onChange, maxFileSizeKb = 500 }: ImagePickerFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState(isUrl ? value || '' : '');

  const handlePickFile = async () => {
    const result = await pickAndProcessImage({ maxFileSizeKb });
    if (result && result.base64) {
      onChange(result.base64, false);
      setShowUrlInput(false);
    }
  };

  const handleUrlSubmit = () => {
    if (tempUrl.trim()) {
      onChange(tempUrl.trim(), true);
    }
    setShowUrlInput(false);
  };

  const handleRemove = () => {
    onChange(null, false);
    setTempUrl('');
    setShowUrlInput(false);
  };

  // Drag and Drop (Web only)
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Define drag events only if needed on the specific element, not window
  }, []);

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: any) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        // Simple base64 reader
        const reader = new FileReader();
        reader.onloadend = () => {
          onChange(reader.result as string, false);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Escolha um arquivo de imagem.');
      }
    }
  };

  const dragProps = Platform.OS === 'web' ? {
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
  } : {};

  return (
    <View className="mb-8">
      {label && (
        <Text className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-2">
          {label}
        </Text>
      )}

      {/* @ts-ignore */}
      <View 
        className={`border-2 border-dashed rounded-xl overflow-hidden transition-colors ${
          isDragging ? 'border-primary bg-primary/10' : 'border-border bg-input-background'
        }`}
        {...dragProps}
      >
        {value ? (
          <View className="p-4">
            <View className="w-full max-w-[200px] aspect-square rounded-lg overflow-hidden self-center mb-4 bg-surface">
              <Image source={{ uri: value }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            </View>
            <View className="flex-row justify-center gap-4">
              <Button variant="outline" size="sm" onPress={handlePickFile} className="flex-1">
                <Edit2 color="var(--text)" size={16} className="mr-2" />
                <Text className="text-text font-bold text-xs">Alterar imagem</Text>
              </Button>
              <Button variant="outline" size="sm" onPress={handleRemove} className="flex-1 border-red-500/50">
                <Trash2 color="#ef4444" size={16} className="mr-2" />
                <Text className="text-red-500 font-bold text-xs">Remover</Text>
              </Button>
            </View>
          </View>
        ) : showUrlInput ? (
          <View className="p-6">
            <FormField
              placeholder="https://..."
              value={tempUrl}
              onChangeText={setTempUrl}
              leadingIcon={<LinkIcon color="var(--text-secondary)" size={16} />}
              autoFocus
            />
            <View className="flex-row gap-4 mt-2">
              <Button variant="ghost" className="flex-1" onPress={() => setShowUrlInput(false)}>
                <Text className="text-text font-bold">Cancelar</Text>
              </Button>
              <Button variant="default" className="flex-1" onPress={handleUrlSubmit}>
                <Text className="text-primary-foreground font-bold">Usar imagem</Text>
              </Button>
            </View>
          </View>
        ) : (
          <View className="p-8 items-center justify-center">
            {Platform.OS === 'web' && (
              <View className="items-center mb-6 pointer-events-none">
                <ImageIcon color="var(--text-muted, #444)" size={32} className="mb-2" />
                <Text className="text-text-secondary font-bold mb-1">Arraste uma imagem para cá</Text>
                <Text className="text-text-secondary text-xs">ou escolha uma opção abaixo</Text>
              </View>
            )}

            <View className="flex-row flex-wrap justify-center gap-4 w-full">
              <Button variant="outline" onPress={handlePickFile} className="flex-1 min-w-[140px]">
                <ImageIcon color="var(--text)" size={16} className="mr-2" />
                <Text className="text-text font-bold text-sm">Escolher imagem</Text>
              </Button>
              <Button variant="outline" onPress={() => setShowUrlInput(true)} className="flex-1 min-w-[140px]">
                <LinkIcon color="var(--text)" size={16} className="mr-2" />
                <Text className="text-text font-bold text-sm">Usar uma URL</Text>
              </Button>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
