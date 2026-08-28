/* eslint-disable import/namespace */
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

export async function downloadFile(filename: string, content: string, mimeType: string) {
  if (Platform.OS === 'web') {
    // Web download logic
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } else {
    // Native download logic (save and share)
    const fileUri = (FileSystem.documentDirectory || '') + filename;
    
    try {
      await FileSystem.writeAsStringAsync(fileUri, content, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType,
          dialogTitle: `Export ${filename}`,
        });
      } else {
        console.warn('Sharing is not available on this platform');
      }
    } catch (e) {
      console.error('Failed to export file', e);
    }
  }
}

export async function exportHtml(htmlContent: string) {
  await downloadFile('portfolio.html', htmlContent, 'text/html');
}

export async function exportSessionJson(sessionJson: string) {
  await downloadFile('portfolio-session.json', sessionJson, 'application/json');
}

