import React, { useState, useCallback } from 'react';
import { View, Text, Modal } from 'react-native';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { getCroppedImg } from '@/utils/cropImage';

export interface WebCropModalProps {
  imageSrc: string;
  onComplete: (croppedBase64: string) => void;
  onCancel: () => void;
}

export function WebCropModal({ imageSrc, onComplete, onCancel }: WebCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      if (!croppedAreaPixels) return;
      // getCroppedImg returns a data url: data:image/jpeg;base64,...
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onComplete(croppedImage);
    } catch (e) {
      console.error(e);
      onCancel();
    }
  };

  return (
    <Modal visible transparent animationType="fade">
      <View className="flex-1 bg-black/80 justify-center items-center p-4">
        <View className="w-full max-w-[500px] h-[500px] bg-surface rounded-2xl overflow-hidden relative shadow-lg">
          <View className="flex-1 relative">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </View>
          <View className="p-4 flex-row justify-end gap-3 bg-surface border-t border-border z-10">
            <Button variant="ghost" onPress={onCancel}>
              <Text className="font-bold text-text">Cancelar</Text>
            </Button>
            <Button variant="default" onPress={handleSave}>
              <Text className="font-bold text-primary-foreground">Confirmar Recorte</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
