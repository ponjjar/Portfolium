import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

export type ProcessedImage = {
  uri: string; // The original or temporary URI
  base64?: string; // Base64 data (if requested)
  type: 'image/jpeg' | 'image/png' | 'image/webp';
  size?: number;
};

interface ImageProcessOptions {
  quality?: number; // 0 to 1
  maxFileSizeKb?: number;
}

export async function pickAndProcessImage(options: ImageProcessOptions = {}): Promise<ProcessedImage | null> {
  const { 
    quality = 0.5, 
    maxFileSizeKb = 500
  } = options;

  // Request permissions if needed
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return null;
    }
  }

  // Use ImagePicker which already has compression capabilities
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',
    allowsEditing: true,
    quality: quality, // Compress quality to reduce size
    base64: true, // We need base64 to store in the JSON session
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    return null;
  }

  const asset = result.assets[0];
  
  if (asset.base64) {
    // Check size limit roughly based on base64 length (approx 4/3 of binary size)
    // using maxWidth and maxHeight parameters purely for reference since ImagePicker uses quality for compression mainly.
    const sizeInKb = (asset.base64.length * 0.75) / 1024;
    
    if (sizeInKb > maxFileSizeKb) {
      alert(`The selected image is too large (${Math.round(sizeInKb)}KB). Please choose a smaller image or use a URL instead to avoid exceeding storage limits.`);
      // Return null or let it pass? We should probably let it pass but warn, or strictly block if too large
      // For MVP, we warn but allow, or we block to be safe. Let's block if it's over 2MB just to be safe.
      if (sizeInKb > 2000) {
        return null;
      }
    }
  }

  // Determine mime type from extension or default to jpeg
  let type: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg';
  if (asset.uri.endsWith('.png')) type = 'image/png';
  if (asset.uri.endsWith('.webp')) type = 'image/webp';

  return {
    uri: asset.uri,
    base64: asset.base64 ? `data:${type};base64,${asset.base64}` : undefined,
    type,
    size: asset.fileSize,
  };
}
