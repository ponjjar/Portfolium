import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { ImageIcon, Link as LinkIcon, Trash2, Edit2 } from 'lucide-react-native';
import { pickAndProcessImage } from '@/utils/image';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { WebCropModal } from '@/components/ui/WebCropModal';

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
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const handlePickFile = async () => {
    const result = await pickAndProcessImage({ maxFileSizeKb });
    if (result && result.base64) {
      if (Platform.OS === 'web') {
        setImageToCrop(result.base64);
      } else {
        onChange(result.base64, false);
      }
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
  }, []);

  const handleDragEnter = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (Platform.OS === 'web') {
            setImageToCrop(reader.result as string);
          } else {
            onChange(reader.result as string, false);
          }
        };
        reader.readAsDataURL(file);
      } else {
        alert('Escolha um arquivo de imagem.');
      }
    }
  };

  const dragProps = Platform.OS === 'web' ? {
    onDragEnter: handleDragEnter,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
  } : {};

  // RENDER: FILLED AVATAR STATE
  if (value && !showUrlInput) {
    return (
      <View className="mb-8 items-center">
        {imageToCrop && (
          <WebCropModal 
            imageSrc={imageToCrop} 
            onComplete={(cropped: string) => {
              setImageToCrop(null);
              onChange(cropped, false);
            }} 
            onCancel={() => setImageToCrop(null)} 
          />
        )}
        <View className="w-[180px] md:w-[220px] aspect-square rounded-full overflow-hidden mb-5 bg-surface border border-border shadow-sm">
          <Image source={{ uri: value }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        </View>
        <View className="flex-row justify-center gap-3 w-full">
          <Button variant="default" size="sm" onPress={handlePickFile} className="flex-1 max-w-[140px]">
            <Edit2 color="var(--primary-foreground)" size={14} />
            <Text className="text-primary-foreground font-bold text-xs shrink">Alterar</Text>
          </Button>
          <Button variant="outline" size="sm" onPress={handleRemove} className="flex-1 max-w-[140px] border-border">
            <Trash2 color="var(--text-secondary)" size={14} />
            <Text className="text-text-secondary font-bold text-xs shrink">Remover</Text>
          </Button>
        </View>
      </View>
    );
  }

  // RENDER: URL INPUT STATE
  if (showUrlInput) {
    return (
      <View className="mb-8">
        {label && (
          <Text className="text-[11px] font-bold text-text-secondary uppercase mb-2 tracking-wide">
            {label}
          </Text>
        )}
        <View className="border border-border bg-surface p-4 rounded-xl shadow-sm">
          <FormField
            placeholder="https://..."
            value={tempUrl}
            onChangeText={setTempUrl}
            leadingIcon={<LinkIcon color="var(--text-secondary)" size={16} />}
            autoFocus
          />
          <View className="flex-row gap-3 mt-2">
            <Button variant="ghost" size="sm" className="flex-1" onPress={() => setShowUrlInput(false)}>
              <Text className="text-text font-bold text-sm">Cancelar</Text>
            </Button>
            <Button variant="default" size="sm" className="flex-1" onPress={handleUrlSubmit}>
              <Text className="text-primary-foreground font-bold text-sm">Salvar URL</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }

  // RENDER: EMPTY DROP ZONE STATE
  
  const innerContent = (
    <View className="p-8 items-center justify-center min-h-[220px]">
      {Platform.OS === 'web' && (
        <View className="items-center mb-6 pointer-events-none">
          <ImageIcon color="var(--text-muted, #444)" size={32} className="mb-3" />
          <Text className="text-text-secondary font-bold mb-1 text-sm">Arraste uma imagem para cá</Text>
          <Text className="text-text-muted text-xs">ou escolha uma opção abaixo</Text>
        </View>
      )}

      <View className="flex-col md:flex-row flex-wrap justify-center gap-3 w-full max-w-[280px]">
        <Button variant="outline" onPress={handlePickFile} className="flex-1 w-full bg-surface">
          <ImageIcon color="var(--text)" size={14} />
          <Text className="text-text font-bold text-xs shrink">Escolher arquivo</Text>
        </Button>
        <Button variant="outline" onPress={() => setShowUrlInput(true)} className="flex-1 w-full bg-surface">
          <LinkIcon color="var(--text)" size={14} />
          <Text className="text-text font-bold text-xs shrink">Usar URL</Text>
        </Button>
      </View>
    </View>
  );

  return (
    <View className="mb-8">
      {imageToCrop && (
        <WebCropModal 
          imageSrc={imageToCrop} 
          onComplete={(cropped: string) => {
            setImageToCrop(null);
            onChange(cropped, false);
          }} 
          onCancel={() => setImageToCrop(null)} 
        />
      )}
      {label && (
        <Text className="text-[11px] font-bold text-text-secondary uppercase mb-2 tracking-wide">
          {label}
        </Text>
      )}

      {Platform.OS === 'web' ? (
        <div 
          className={`border-2 border-dashed rounded-xl overflow-hidden transition-colors ${
            isDragging ? 'border-primary bg-primary/10' : 'border-border bg-input-background'
          }`}
          style={{ display: 'flex', flexDirection: 'column' }}
          {...(dragProps as any)}
        >
          {innerContent}
        </div>
      ) : (
        <View 
          className={`border-2 border-dashed rounded-xl overflow-hidden transition-colors ${
            isDragging ? 'border-primary bg-primary/10' : 'border-border bg-input-background'
          }`}
        >
          {innerContent}
        </View>
      )}
    </View>
  );
}
