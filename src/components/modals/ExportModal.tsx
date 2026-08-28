import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Modal } from '@/components/ui/modal';
import { Download, FileJson, FileCode, Globe, FolderArchive } from 'lucide-react-native';

interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
  onExportHtml: () => void;
  onExportJson: () => void;
  onExportZip: () => void;
  onExportGitHubPages: () => void;
}

export function ExportModal({ 
  visible, 
  onClose, 
  onExportHtml, 
  onExportJson,
  onExportZip,
  onExportGitHubPages
}: ExportModalProps) {

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Pronto para exportar"
      size="md"
    >
      <View className="py-2">
        <Text className="text-text-secondary text-sm mb-6">
          Escolha como deseja levar seu portfólio.
        </Text>

        <View className="gap-4">
          
          {/* HTML Export */}
          <View className="border border-border rounded-lg p-4 bg-input-background">
            <View className="flex-row items-center mb-2">
              <FileCode color="var(--text)" size={20} className="mr-2" />
              <Text className="text-text font-bold text-base">HTML</Text>
            </View>
            <Text className="text-text-secondary text-xs mb-4">
              Baixe um único arquivo pronto para abrir ou publicar.
            </Text>
            <TouchableOpacity 
              onPress={onExportHtml}
              className="bg-primary py-3 rounded items-center flex-row justify-center"
            >
              <Download color="var(--primary-foreground)" size={16} className="mr-2" />
              <Text className="text-primary-foreground font-bold text-sm">Baixar HTML</Text>
            </TouchableOpacity>
          </View>

          {/* ZIP Export */}
          <View className="border border-border rounded-lg p-4 bg-input-background">
            <View className="flex-row items-center mb-2">
              <FolderArchive color="var(--text)" size={20} className="mr-2" />
              <Text className="text-text font-bold text-base">Projeto</Text>
            </View>
            <Text className="text-text-secondary text-xs mb-4">
              Baixe os arquivos do seu portfólio para continuar desenvolvendo.
            </Text>
            <TouchableOpacity 
              onPress={onExportZip}
              className="bg-transparent border border-border py-3 rounded items-center flex-row justify-center"
            >
              <Download color="var(--text)" size={16} className="mr-2" />
              <Text className="text-text font-bold text-sm">Baixar ZIP</Text>
            </TouchableOpacity>
          </View>

          {/* GitHub Pages */}
          <View className="border border-border rounded-lg p-4 bg-input-background">
            <View className="flex-row items-center mb-2">
              <Globe color="var(--text)" size={20} className="mr-2" />
              <Text className="text-text font-bold text-base">GitHub Pages</Text>
            </View>
            <Text className="text-text-secondary text-xs mb-4">
              Prepare seu portfólio para publicar gratuitamente no GitHub Pages.
            </Text>
            <TouchableOpacity 
              onPress={onExportGitHubPages}
              className="bg-transparent border border-border py-3 rounded items-center flex-row justify-center"
            >
              <Globe color="var(--text)" size={16} className="mr-2" />
              <Text className="text-text font-bold text-sm">Preparar para GitHub Pages</Text>
            </TouchableOpacity>
          </View>

          {/* Session JSON */}
          <View className="border border-border rounded-lg p-4 bg-input-background">
            <View className="flex-row items-center mb-2">
              <FileJson color="var(--text)" size={20} className="mr-2" />
              <Text className="text-text font-bold text-base">Sessão</Text>
            </View>
            <Text className="text-text-secondary text-xs mb-4">
              Salve seus dados para continuar editando depois.
            </Text>
            <TouchableOpacity 
              onPress={onExportJson}
              className="bg-transparent border border-border py-3 rounded items-center flex-row justify-center"
            >
              <Download color="var(--text)" size={16} className="mr-2" />
              <Text className="text-text font-bold text-sm">Baixar session.json</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}
