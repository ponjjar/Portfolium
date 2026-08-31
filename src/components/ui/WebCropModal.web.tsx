import { Button } from '@/components/ui/button';
import { getCroppedImg } from '@/utils/cropImage';
import { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { Modal, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeContext';

export interface WebCropModalProps {
  imageSrc: string;
  onComplete: (croppedBase64: string) => void;
  onCancel: () => void;
  cropShape?: 'rect' | 'round';
  showGuide?: boolean;
}

export function WebCropModal({ imageSrc, onComplete, onCancel, cropShape = 'round', showGuide = false }: WebCropModalProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
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

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  return (
    <Modal visible transparent animationType="fade">
      <View className={`flex-1 bg-black/80 justify-center items-center p-4 theme-${theme}`}>
        <View className="w-full max-w-[500px] h-[500px] bg-surface rounded-2xl overflow-hidden relative shadow-lg">
          <View
            className="flex-1 relative justify-center items-center"
            onLayout={(e) => {
              setContainerSize({
                width: e.nativeEvent.layout.width,
                height: e.nativeEvent.layout.height,
              });
            }}
          >
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape={cropShape}
              showGrid={
                cropShape == 'rect' ? true : false
              }

              maxZoom={1.5}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
            {/* {showGuide && containerSize.width > 0 && (
              <View
                className="absolute border-y-2 border-dashed border-white/60 pointer-events-none"
                style={{
                  width: Math.min(containerSize.width, containerSize.height),
                  height: Math.min(containerSize.width, containerSize.height) * 1,
                  zIndex: 10,
                }}
              />
            )} */}
          </View>
          <View className="p-4 flex-row justify-end gap-3 bg-surface border-t border-border z-10">
            <Button variant="ghost" onPress={onCancel}>
              <Text className="font-bold text-text">{t('common.cancel')}</Text>
            </Button>
            <Button variant="default" onPress={handleSave}>
              <Text className="font-bold text-primary-foreground">{t('common.confirm')}</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
